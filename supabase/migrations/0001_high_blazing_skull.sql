-- Public avatars; 5mb upload limit
insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, '{"image/jpeg", "image/jpg", "image/png", "image/webp"}');

-- RLS Policies for avatars bucket

-- Anyone can view files in the avatars bucket
create policy "Anyone can view avatar files"
on storage.objects
for select
to authenticated, anon
using ( bucket_id = 'avatars' );

-- Only authenticated users can upload to avatars bucket
create policy "Authenticated users can upload avatar files"
on storage.objects
for insert
to authenticated
with check ( bucket_id = 'avatars' );

-- Users can update their own avatar files
create policy "Users can update their own avatar files"
on storage.objects
for update
to authenticated
using ( bucket_id = 'avatars' and (select auth.uid()) = owner_id::uuid )
with check ( bucket_id = 'avatars' and (select auth.uid()) = owner_id::uuid );

-- Users can delete their own avatar files
create policy "Users can delete their own avatar files"
on storage.objects
for delete
to authenticated
using ( bucket_id = 'avatars' and (select auth.uid()) = owner_id::uuid );
