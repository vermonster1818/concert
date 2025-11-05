alter table public.shows enable row level security;
create policy "shows_select_own" on public.shows for select using (auth.uid() = user_id);
create policy "shows_insert_own" on public.shows for insert with check (auth.uid() = user_id);
create policy "shows_update_own" on public.shows for update using (auth.uid() = user_id);
create policy "shows_delete_own" on public.shows for delete using (auth.uid() = user_id);

alter table public.venues enable row level security;
create policy "venues_read_all" on public.venues for select using (true);
create policy "venues_write_all" on public.venues for all using (true) with check (true);

alter table public.ics_tokens enable row level security;
create policy "ics_tokens_self" on public.ics_tokens for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.google_credentials enable row level security;
create policy "google_creds_self" on public.google_credentials for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.show_google_events enable row level security;
create policy "sge_self" on public.show_google_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
