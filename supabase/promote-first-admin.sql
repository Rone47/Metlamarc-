-- One-time fix for an account created before schema.sql existed, and to
-- bypass email confirmation for your own admin account. Edit the email
-- below if needed, then run this once in the Supabase SQL Editor.

update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email = 'ryanbyrone47@gmail.com';

insert into public.profiles (id, email, full_name, role, client_id)
select id, email, 'Metlamarc Admin', 'admin', null
from auth.users
where email = 'ryanbyrone47@gmail.com'
on conflict (id) do update set role = 'admin';
