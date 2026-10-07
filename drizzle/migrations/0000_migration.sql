ALTER TABLE public.profiles ADD COLUMN username text;
CREATE UNIQUE INDEX profiles_username_lower_idx ON public.profiles (lower(username));
ALTER TABLE public.profiles ADD CONSTRAINT username_len CHECK (username IS NULL OR char_length(username) BETWEEN 2 AND 30);
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can view cities" ON public.visited_cities FOR SELECT USING (true);
GRANT SELECT ON public.profiles, public.visited_cities TO anon;