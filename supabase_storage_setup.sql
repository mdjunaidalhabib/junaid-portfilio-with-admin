-- ============================================================
--  Supabase SQL Editor-এ এই স্ক্রিপ্টটি রান করুন (একবার)
--  এটা profile ছবি ও CV PDF রাখার জন্য storage bucket তৈরি করে
-- ============================================================

-- ১) bucket তৈরি (public bucket, যাতে ওয়েবসাইটে ছবি/PDF সরাসরি দেখা যায়)
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

-- ২) সবাই (public) ফাইল পড়তে/দেখতে পারবে
create policy "public can view portfolio assets"
  on storage.objects
  for select
  using (bucket_id = 'portfolio-assets');

-- ৩) শুধু লগইন করা এডমিন নতুন ফাইল আপলোড করতে পারবে
create policy "authenticated can upload portfolio assets"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'portfolio-assets');

-- ৪) শুধু লগইন করা এডমিন পুরনো ফাইল আপডেট (replace) করতে পারবে
create policy "authenticated can update portfolio assets"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'portfolio-assets');

-- ৫) শুধু লগইন করা এডমিন ফাইল ডিলিট করতে পারবে
create policy "authenticated can delete portfolio assets"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'portfolio-assets');

-- ============================================================
--  এই স্ক্রিপ্ট রান করার পর অ্যাডমিন প্যানেল থেকে:
--  - "ব্যক্তিগত তথ্য" সেকশনে গিয়ে প্রোফাইল ছবি আপলোড করা যাবে
--    (এই একই ছবি হিরো সেকশন ও ন্যাভবার লোগো — দুই জায়গায় দেখাবে)
--  - CV/জীবনবৃত্তান্ত PDF আপলোড করা যাবে
-- ============================================================
