CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)), NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL DEFAULT auth.uid(),
  tier text NOT NULL,
  strength text NOT NULL,
  aroma text NOT NULL,
  duration text NOT NULL,
  sender_name text NOT NULL,
  recipient_name text NOT NULL,
  recipient_email text NOT NULL,
  note text,
  total numeric(10,2) NOT NULL,
  share_on_wall boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sender reads" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = sender_id);
CREATE POLICY "recipient reads" ON public.orders FOR SELECT TO authenticated USING (lower(recipient_email) = lower(auth.jwt()->>'email'));
CREATE POLICY "sender inserts" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

CREATE TABLE public.confessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid UNIQUE,
  tier text NOT NULL,
  strength text NOT NULL,
  aroma text NOT NULL,
  note text,
  swoon_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.confessions TO anon, authenticated;
GRANT ALL ON public.confessions TO service_role;
ALTER TABLE public.confessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wall is public" ON public.confessions FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.order_to_confession() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.share_on_wall THEN
    INSERT INTO public.confessions (order_id, tier, strength, aroma, note)
    VALUES (NEW.id, NEW.tier, NEW.strength, NEW.aroma, left(NEW.note, 200));
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_order_created AFTER INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.order_to_confession();

CREATE TABLE public.swoons (
  confession_id uuid NOT NULL REFERENCES public.confessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (confession_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.swoons TO authenticated;
GRANT ALL ON public.swoons TO service_role;
ALTER TABLE public.swoons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own swoons read" ON public.swoons FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own swoons insert" ON public.swoons FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own swoons delete" ON public.swoons FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.swoon_counter() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.confessions SET swoon_count = swoon_count + 1 WHERE id = NEW.confession_id;
    RETURN NEW;
  ELSE
    UPDATE public.confessions SET swoon_count = greatest(swoon_count - 1, 0) WHERE id = OLD.confession_id;
    RETURN OLD;
  END IF;
END $$;
CREATE TRIGGER on_swoon AFTER INSERT OR DELETE ON public.swoons FOR EACH ROW EXECUTE FUNCTION public.swoon_counter();

INSERT INTO public.confessions (tier, strength, aroma, note, swoon_count, created_at) VALUES
('eternal','besotted','rose','Three years of passing you in the library. Tonight, you finally look back.', 142, now() - interval '2 hours'),
('true','swoon','treacle','You laugh at everyone''s jokes but mine. Let''s change that.', 98, now() - interval '5 hours'),
('sweet','flutter','parchment','Just notice me. That''s all I ask.', 77, now() - interval '1 day'),
('true','besotted','amber','I rehearsed this confession 400 times. The chocolates will say it better.', 63, now() - interval '1 day'),
('eternal','swoon','pepper','To the barista who spells my name wrong every morning — I love you anyway.', 51, now() - interval '2 days'),
('sweet','swoon','rose','Ex who said I''d never find someone better: watch.', 39, now() - interval '3 days');

INSERT INTO storage.objects (bucket_id, name) SELECT 'x','x' WHERE false;