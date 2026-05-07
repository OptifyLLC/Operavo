-- Allow tenant members to update leads (e.g. score changes from the dashboard)
-- and appointments (status changes). Without these, RLS silently blocks the
-- UPDATE, so the UI appears to change but the row never persists.

create policy "tenant update leads" on leads
  for update using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

create policy "tenant update appointments" on appointments
  for update using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());
