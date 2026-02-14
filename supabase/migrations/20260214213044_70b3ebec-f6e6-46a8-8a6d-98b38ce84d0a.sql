
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create visited_cities table
CREATE TABLE public.visited_cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  country TEXT NOT NULL,
  emoji TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  visited_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, city_name)
);

ALTER TABLE public.visited_cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own cities" ON public.visited_cities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cities" ON public.visited_cities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own cities" ON public.visited_cities FOR DELETE USING (auth.uid() = user_id);
