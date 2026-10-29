ALTER TABLE public.orders ADD COLUMN potions text[] NOT NULL DEFAULT '{}', ADD COLUMN outcome text;
ALTER TABLE public.confessions ADD COLUMN potions text[] NOT NULL DEFAULT '{}', ADD COLUMN outcome text;
CREATE OR REPLACE FUNCTION public.order_to_confession() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.share_on_wall THEN
    INSERT INTO public.confessions (order_id, tier, strength, aroma, note, potions, outcome)
    VALUES (NEW.id, NEW.tier, NEW.strength, NEW.aroma, left(NEW.note, 200), NEW.potions, left(NEW.outcome, 80));
  END IF;
  RETURN NEW;
END $$;