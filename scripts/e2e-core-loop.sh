#!/usr/bin/env bash
# Core loop integration test: Start Monitoring → Capture → Extract → End → Keep → Search
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PORT="${PORT:-3099}"
BASE_URL="http://localhost:${PORT}"
LOG_FILE="${TMPDIR:-/tmp}/relationship-memory-e2e.log"
SERVER_PID=""

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

pass() {
  echo "PASS: $*"
}

json_get() {
  local path="$1"
  local json="$2"
  node -e "
    const d = JSON.parse(process.argv[1]);
    const parts = process.argv[2].split('.');
    let v = d;
    for (const p of parts) v = v?.[p];
    if (v === undefined || v === null) process.exit(1);
    if (typeof v === 'object') console.log(JSON.stringify(v));
    else console.log(v);
  " "$json" "$path"
}

curl_json() {
  local method="$1"
  local url="$2"
  local body="${3:-}"
  local tmp
  tmp=$(mktemp)
  local status
  if [[ -n "$body" ]]; then
    status=$(curl -s -o "$tmp" -w "%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" -d "$body")
  else
    status=$(curl -s -o "$tmp" -w "%{http_code}" -X "$method" "$url")
  fi
  if [[ "$status" -lt 200 || "$status" -ge 300 ]]; then
    echo "HTTP ${status} ${method} ${url}" >&2
    cat "$tmp" >&2
    rm -f "$tmp"
    return 1
  fi
  cat "$tmp"
  rm -f "$tmp"
}

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "Starting Next.js dev server on port ${PORT} (AI_PROVIDER=stub, USE_IN_MEMORY=1)..."
AI_PROVIDER=stub USE_IN_MEMORY=1 npx next dev -p "$PORT" >"$LOG_FILE" 2>&1 &
SERVER_PID=$!

echo "Waiting for server at ${BASE_URL}..."
ready=0
for _ in $(seq 1 45); do
  if curl -sf "${BASE_URL}/" >/dev/null 2>&1; then
    ready=1
    break
  fi
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "--- server log ---" >&2
    tail -n 40 "$LOG_FILE" >&2 || true
    fail "dev server exited before becoming ready"
  fi
  sleep 1
done
[[ "$ready" -eq 1 ]] || fail "server did not become ready within 45s (see ${LOG_FILE})"
pass "server ready"

echo ""
echo "=== Core loop API integration ==="

# 1. Start monitoring session
SESSION_RESP=$(curl_json POST "${BASE_URL}/api/sessions" '{"event_name":"E2E Integration Event"}')
SESSION_ID=$(json_get session.id "$SESSION_RESP") || fail "POST /api/sessions missing session.id"
EVENT_NAME=$(json_get session.event_name "$SESSION_RESP")
[[ "$EVENT_NAME" == "E2E Integration Event" ]] || fail "unexpected event_name: ${EVENT_NAME}"
pass "POST /api/sessions → session ${SESSION_ID}"

# 2. Extract capture (screenshot → encounter)
EXTRACT_RESP=$(curl_json POST "${BASE_URL}/api/extract" "{
  \"session_id\": \"${SESSION_ID}\",
  \"image_base64\": \"aGVsbG8=\",
  \"mime_type\": \"image/png\"
}")
ENCOUNTER_ID=$(json_get encounter.id "$EXTRACT_RESP") || fail "POST /api/extract missing encounter.id"
ENCOUNTER_STATUS=$(json_get encounter.status "$EXTRACT_RESP")
ENCOUNTER_NAME=$(json_get encounter.name "$EXTRACT_RESP")
[[ "$ENCOUNTER_STATUS" == "pending" ]] || fail "expected pending encounter, got ${ENCOUNTER_STATUS}"
[[ -n "$ENCOUNTER_NAME" ]] || fail "expected extracted name from stub AI"
pass "POST /api/extract → encounter ${ENCOUNTER_ID} (${ENCOUNTER_NAME})"

# 3. End session → triage queue
END_RESP=$(curl_json POST "${BASE_URL}/api/sessions/${SESSION_ID}/end")
QUEUE_LEN=$(node -e "const d=JSON.parse(process.argv[1]); console.log((d.queue||[]).length)" "$END_RESP")
[[ "$QUEUE_LEN" -ge 1 ]] || fail "POST /api/sessions/:id/end returned empty queue"
pass "POST /api/sessions/:id/end → queue length ${QUEUE_LEN}"

# 4. Keep encounter (with optional context)
TRIAGE_RESP=$(curl_json POST "${BASE_URL}/api/encounters/${ENCOUNTER_ID}/triage" '{
  "action": "keep",
  "context": "Met during e2e integration test"
}')
TRIAGED_STATUS=$(json_get encounter.status "$TRIAGE_RESP")
[[ "$TRIAGED_STATUS" == "kept" ]] || fail "expected kept status, got ${TRIAGED_STATUS}"
pass "POST /api/encounters/:id/triage → kept"

# 5. List kept encounters
LIST_RESP=$(curl -sf "${BASE_URL}/api/encounters?status=kept")
KEPT_COUNT=$(node -e "
  const d = JSON.parse(process.argv[1]);
  const ids = (d.encounters || []).map(e => e.id);
  process.exit(ids.includes(process.argv[2]) ? 0 : 1);
" "$LIST_RESP" "$ENCOUNTER_ID") || fail "GET /api/encounters?status=kept missing kept encounter"
pass "GET /api/encounters?status=kept → includes encounter"

# 6. Natural language search
SEARCH_RESP=$(curl_json POST "${BASE_URL}/api/search" '{"query":"e2e integration","limit":5}')
MATCH_COUNT=$(node -e "const d=JSON.parse(process.argv[1]); console.log((d.matches||[]).length)" "$SEARCH_RESP")
[[ "$MATCH_COUNT" -ge 1 ]] || fail "POST /api/search returned no matches for kept encounter context"
pass "POST /api/search → ${MATCH_COUNT} match(es)"

echo ""
echo "All core loop API checks passed."
