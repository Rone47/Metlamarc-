-- Migration v2: itemized invoices (one-time/recurring), richer project
-- lifecycle statuses + subdomain field. Safe to run once on the existing
-- project (already has schema.sql applied). Run this in the Supabase SQL
-- Editor.

-- ---------------------------------------------------------------------------
-- Invoices: billing type + USD default
-- ---------------------------------------------------------------------------

alter table public.invoices
  add column if not exists billing_type text not null default 'one_time';

alter table public.invoices
  drop constraint if exists invoices_billing_type_check;
alter table public.invoices
  add constraint invoices_billing_type_check check (billing_type in ('one_time', 'recurring'));

alter table public.invoices
  alter column currency set default 'USD';

update public.invoices set currency = 'USD' where currency is null or currency = 'KES';

-- ---------------------------------------------------------------------------
-- Invoice line items (Database, Hosting, Third-Party Services, Domain, etc.)
-- ---------------------------------------------------------------------------

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  category text not null,
  label text,
  amount numeric(12, 2) not null default 0,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists invoice_items_invoice_id_idx on public.invoice_items(invoice_id);

alter table public.invoice_items enable row level security;

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

-- ---------------------------------------------------------------------------
-- Projects: subdomain/preview URL + development-lifecycle statuses
-- ---------------------------------------------------------------------------

alter table public.projects add column if not exists subdomain_url text;

-- Drop the old constraint FIRST — otherwise the status updates below get
-- rejected by the constraint they're migrating away from.
alter table public.projects drop constraint if exists projects_status_check;

update public.projects set status = 'in_development' where status = 'in_progress';
update public.projects set status = 'live' where status = 'completed';

alter table public.projects
  add constraint projects_status_check
  check (status in ('planning', 'in_development', 'integrations', 'live', 'on_hold'));
