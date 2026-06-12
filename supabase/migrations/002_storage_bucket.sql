-- Public bucket for encounter screenshot uploads
insert into storage.buckets (id, name, public)
values ('captures', 'captures', true)
on conflict (id) do nothing;
