-- ============================================================
--  Supabase SQL Editor-এ এই পুরো স্ক্রিপ্টটি রান করুন (একবার)
-- ============================================================

create table if not exists public.portfolio_content (
  section_key text primary key,
  content     jsonb not null,
  updated_at  timestamptz not null default now()
);

-- RLS চালু করা
alter table public.portfolio_content enable row level security;

-- সবাই (পাবলিক) ডেটা পড়তে পারবে — ওয়েবসাইট লোড করার জন্য জরুরি
create policy "public can read portfolio content"
  on public.portfolio_content
  for select
  using (true);

-- শুধু লগইন করা ইউজার (এডমিন) ডেটা ইনসার্ট/আপডেট করতে পারবে
create policy "authenticated users can upsert portfolio content"
  on public.portfolio_content
  for insert
  to authenticated
  with check (true);

create policy "authenticated users can update portfolio content"
  on public.portfolio_content
  for update
  to authenticated
  using (true);

-- updated_at অটো-আপডেট করার ট্রিগার
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_portfolio_content_updated_at on public.portfolio_content;
create trigger trg_portfolio_content_updated_at
  before update on public.portfolio_content
  for each row execute function public.set_updated_at();

-- ============================================================
--  এডমিন ইউজার বানানো
--  Supabase Dashboard → Authentication → Users → "Add user"
--  এখানে আপনার ইমেইল ও পাসওয়ার্ড দিয়ে একটা ইউজার তৈরি করুন।
--  এই ইমেইল/পাসওয়ার্ড দিয়েই /admin পেজে লগইন করবেন।
-- ============================================================
