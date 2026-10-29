CREATE TABLE public.gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  opened_at timestamptz,
  bitten_at timestamptz
);
GRANT INSERT ON public.gifts TO anon, authenticated;
GRANT ALL ON public.gifts TO service_role;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can create a gift" ON public.gifts FOR INSERT TO anon, authenticated
  WITH CHECK (opened_at IS NULL AND bitten_at IS NULL);

CREATE OR REPLACE FUNCTION public.mark_gift(_id uuid, _event text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.gifts SET
    opened_at = COALESCE(opened_at, now()),
    bitten_at = CASE WHEN _event = 'bite' THEN COALESCE(bitten_at, now()) ELSE bitten_at END
  WHERE id = _id;
$$;
CREATE OR REPLACE FUNCTION public.gift_status(_ids uuid[])
RETURNS TABLE(id uuid, opened_at timestamptz, bitten_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT g.id, g.opened_at, g.bitten_at FROM public.gifts g WHERE g.id = ANY(_ids);
$$;
GRANT EXECUTE ON FUNCTION public.mark_gift(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gift_status(uuid[]) TO anon, authenticated;