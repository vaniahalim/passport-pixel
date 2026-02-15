ALTER TABLE public.visited_cities ADD COLUMN liked boolean NOT NULL DEFAULT false;
ALTER TABLE public.visited_cities ADD COLUMN description text;