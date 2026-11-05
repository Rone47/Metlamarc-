-- Migration v3: price quotes for prospects/clients, with itemized pricing
-- and discounts. Safe to re-run. Run this in the Supabase SQL Editor after
-- migration-v2.sql.

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

create index if not exists quotes_client_id_idx on public.quotes(client_id);
create index if not exists quote_items_quote_id_idx on public.quote_items(quote_id);

alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;

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
