import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  try {
    const raw = readFileSync(resolve(root, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      const val = trimmed.slice(eq + 1);
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* no .env */
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or key in .env");
  process.exit(1);
}

const supabase = createClient(url, key);

const tables = ["monitoring_sessions", "captures", "encounters"];

for (const table of tables) {
  const { error } = await supabase.from(table).select("id").limit(1);
  if (error) {
    console.log(`❌ ${table}: ${error.message}`);
  } else {
    console.log(`✅ ${table}: reachable`);
  }
}

const { data, error } = await supabase
  .from("monitoring_sessions")
  .insert({ event_name: "__connectivity_test__" })
  .select("id")
  .single();

if (error) {
  console.log(`❌ insert test: ${error.message}`);
  console.log(
    "\nIf tables are missing, run supabase/migrations/001_initial_schema.sql in the Supabase SQL editor.",
  );
  console.log(
    "If permission denied, add SUPABASE_SERVICE_ROLE_KEY to .env (Dashboard → Settings → API → secret key).",
  );
  process.exit(1);
}

await supabase.from("monitoring_sessions").delete().eq("id", data.id);
console.log("✅ insert/delete test passed");
