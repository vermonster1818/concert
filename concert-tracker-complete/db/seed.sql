insert into public.venues (name, city, state) values
  ('Kings Theatre','Brooklyn','NY'),
  ('The Fillmore','Philadelphia','PA'),
  ('9:30 Club','Washington','DC')
on conflict do nothing;
