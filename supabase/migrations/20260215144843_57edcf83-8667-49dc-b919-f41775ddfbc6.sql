CREATE POLICY "Users can update own cities"
ON public.visited_cities
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);