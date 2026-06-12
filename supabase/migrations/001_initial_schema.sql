-- Relationship Memory v0 schema
-- Storage paths: captures/sessions/{session_id}/{capture_id}.{ext}

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- monitoring_sessions
-- ---------------------------------------------------------------------------
create table monitoring_sessions (
  id            uuid primary key default gen_random_uuid(),
  event_name    text not null,
  started_at    timestamptz not null default now(),
  ended_at      timestamptz,
  triage_nudged_at timestamptz,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- captures — raw screenshots during a session
-- ---------------------------------------------------------------------------
create table captures (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references monitoring_sessions (id) on delete cascade,
  storage_path  text not null,
  public_url    text,
  mime_type     text not null default 'image/png',
  created_at    timestamptz not null default now()
);

create index captures_session_id_idx on captures (session_id);

-- ---------------------------------------------------------------------------
-- encounters — one person proposed per capture (or draft)
-- ---------------------------------------------------------------------------
create type encounter_status as enum ('pending', 'kept', 'forgotten');

create table encounters (
  id                      uuid primary key default gen_random_uuid(),
  session_id              uuid not null references monitoring_sessions (id) on delete cascade,
  capture_id              uuid references captures (id) on delete set null,
  event_name              text not null,

  -- core fields (CONTEXT.md)
  name                    text,
  number                  text,
  location                text,
  context                 text,

  -- linkedin extraction extras
  company                 text,
  role                    text,
  linkedin_url            text,

  status                  encounter_status not null default 'pending',
  is_draft                boolean not null default false,
  extraction_confidence   real,
  raw_extraction          jsonb,

  triaged_at              timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index encounters_session_status_idx on encounters (session_id, status);
create index encounters_kept_idx on encounters (status) where status = 'kept';

-- ---------------------------------------------------------------------------
-- storage bucket for screenshot uploads (optional — API stores public_url)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('captures', 'captures', true)
on conflict (id) do nothing;
