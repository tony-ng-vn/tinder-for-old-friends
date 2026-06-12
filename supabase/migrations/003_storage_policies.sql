-- Allow API (anon/publishable key) to upload and read capture screenshots
create policy "captures public read"
  on storage.objects for select
  using (bucket_id = 'captures');

create policy "captures public insert"
  on storage.objects for insert
  with check (bucket_id = 'captures');

create policy "captures public update"
  on storage.objects for update
  using (bucket_id = 'captures');
