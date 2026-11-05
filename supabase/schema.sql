-- Metlamarc client/admin portal schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: uses "if not exists" / "or replace" where possible.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  site_url text,
  status text not null default 'active' check (status in ('active', 'suspended')),
  suspension_override text check (suspension_override in ('force_active', 'force_suspended')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  service_type text,
  description text,
  status text not null default 'planning' check (status in ('planning', 'in_development', 'integrations', 'live', 'on_hold')),
  start_date date,
  delivered_date date,
  live_url text,
  subdomain_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  invoice_number text,
  description text,
  amount numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  billing_type text not null default 'one_time' check (billing_type in ('one_time', 'recurring')),
  issue_date date not null default current_date,
  due_date date not null,
  status text not null default 'unpaid' check (status in ('unpaid', 'paid', 'void')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  category text not null,
  label text,
  amount numeric(12, 2) not null default 0,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  prospect_name text,
  prospect_company text,
  prospect_email text,
  prospect_phone text,
  quote_number text,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined', 'expired')),
  discount_type text check (discount_type in ('percent', 'fixed')),
  discount_value numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  issue_date date not null default current_date,
  valid_until date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  category text not null,
  label text,
  amount numeric(12, 2) not null default 0,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'client' check (role in ('admin', 'client')),
  client_id uuid references public.clients(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists projects_client_id_idx on public.projects(client_id);
create index if not exists invoices_client_id_idx on public.invoices(client_id);
create index if not exists invoice_items_invoice_id_idx on public.invoice_items(invoice_id);
create index if not exists quotes_client_id_idx on public.quotes(client_id);
create index if not exists quote_items_quote_id_idx on public.quote_items(quote_id);
create index if not exists profiles_client_id_idx on public.profiles(client_id);

-- ---------------------------------------------------------------------------
-- New-signup handling: auto-create a profile row for every auth user, and
-- auto-link them to a client by matching email against clients.contact_email.
-- To promote the first admin account, run this once by hand after they sign up:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_client_id uuid;
begin
  select id into matched_client_id
  from public.clients
  where lower(contact_email) = lower(new.email)
  limit 1;

  insert into public.profiles (id, email, full_name, role, client_id)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    'client',
    matched_client_id
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "clients_select" on public.clients;
create policy "clients_select" on public.clients for select
  using (public.is_admin() or id = (select client_id from public.profiles where id = auth.uid()));

drop policy if exists "clients_write" on public.clients;
create policy "clients_write" on public.clients for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects_select" on public.projects;
create policy "projects_select" on public.projects for select
  using (public.is_admin() or client_id = (select client_id from public.profiles where id = auth.uid()));

drop policy if exists "projects_write" on public.projects;
create policy "projects_write" on public.projects for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "invoices_select" on public.invoices;
create policy "invoices_select" on public.invoices for select
  using (public.is_admin() or client_id = (select client_id from public.profiles where id = auth.uid()));

drop policy if exists "invoices_write" on public.invoices;
create policy "invoices_write" on public.invoices for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "invoice_items_select" on public.invoice_items;
create policy "invoice_items_select" on public.invoice_items for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.invoices i
      where i.id = invoice_items.invoice_id
        and i.client_id = (select client_id from public.profiles where id = auth.uid())
    )
  );

drop policy if exists "invoice_items_write" on public.invoice_items;
create policy "invoice_items_write" on public.invoice_items for all
  using (public.is_admin()) with check (public.is_admin());

-- Clients only ever see quotes once they've actually been sent (never drafts).
drop policy if exists "quotes_select" on public.quotes;
create policy "quotes_select" on public.quotes for select
  using (
    public.is_admin()
    or (
      status <> 'draft'
      and client_id = (select client_id from public.profiles where id = auth.uid())
    )
  );

drop policy if exists "quotes_write" on public.quotes;
create policy "quotes_write" on public.quotes for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "quote_items_select" on public.quote_items;
create policy "quote_items_select" on public.quote_items for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.quotes q
      where q.id = quote_items.quote_id
        and q.status <> 'draft'
        and q.client_id = (select client_id from public.profiles where id = auth.uid())
    )
  );

drop policy if exists "quote_items_write" on public.quote_items;
create policy "quote_items_write" on public.quote_items for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select
  using (public.is_admin() or id = auth.uid());

-- Only admins can change roles / client links (no self-service escalation).
drop policy if exists "profiles_write" on public.profiles;
create policy "profiles_write" on public.profiles for update
  using (public.is_admin()) with check (public.is_admin());
