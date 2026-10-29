CREATE TABLE public.wall_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_path text NOT NULL,
  caption text,
  swoon_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.wall_photos TO anon;
GRANT SELECT, INSERT ON public.wall_photos TO authenticated;
GRANT ALL ON public.wall_photos TO service_role;

ALTER TABLE public.wall_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "album is public" ON public.wall_photos
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "guest photo post" ON public.wall_photos
  FOR INSERT TO anon, authenticated
  WITH CHECK (swoon_count = 0 AND char_length(coalesce(caption, '')) <= 140);

CREATE POLICY "anyone can post a wall photo file" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'wall-photos');

CREATE POLICY "anyone can view wall photo files" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'wall-photos');