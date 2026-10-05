-- ============================================================================
-- CLASSIE: EMERGENCY undo for lock-down.sql
-- Opens every table to the public key again (the old, unsafe setup).
-- Use only if the site or admin stops working after lock-down.sql, then fix
-- the Vercel keys and run lock-down.sql again.
-- ============================================================================
do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('drop policy if exists "temporary open access" on public.%I', t.tablename);
    execute format('create policy "temporary open access" on public.%I for all to anon, authenticated using (true) with check (true)', t.tablename);
  end loop;
end $$;
