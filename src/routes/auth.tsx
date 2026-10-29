import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { GoldButton, Shell } from "@/components/kit";

const safe = (r: unknown) => (typeof r === "string" && r.startsWith("/") && !r.startsWith("//") ? r : "/send");

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: safe(s['redirect']) }),
  head: () => ({
    meta: [
      { title: "Sign in — Amortentia Post" },
      { name: "description", content: "Sign in to send enchanted chocolates and join the Secret Admirer Wall." },
      { property: "og:title", content: "Sign in — Amortentia Post" },
      { property: "og:description", content: "Your love story starts here." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && navigate({ to: redirect, replace: true }));
    const { data } = supabase.auth.onAuthStateChange((e) => {
      if (e === "SIGNED_IN") navigate({ to: redirect, replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [redirect, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res =
      mode === "up"
        ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + redirect, data: { display_name: name } } })
        : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    if (mode === "up" && !res.data.session) setCheckEmail(true);
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) toast.error("Google sign-in failed");
  }

  if (checkEmail)
    return (
      <Shell>
        <div className="my-auto text-center">
          <div className="text-6xl">📜</div>
          <h1 className="mt-4 font-display text-2xl text-gold">Check your owl post</h1>
          <p className="mt-2 text-muted-foreground">We sent a confirmation link to {email}.</p>
        </div>
      </Shell>
    );

  return (
    <Shell>
      <div className="my-auto">
        <h1 className="text-center font-display text-3xl text-gold-gradient">{mode === "up" ? "Begin Your Love Story" : "Welcome Back, Admirer"}</h1>
        <p className="mt-2 text-center text-muted-foreground">So you can track your boxes and see who's smitten.</p>
        <form onSubmit={submit} className="mt-8 space-y-3">
          {mode === "up" && <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="h-12 w-full rounded-xl border bg-card px-4 outline-none focus:border-gold" />}
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="h-12 w-full rounded-xl border bg-card px-4 outline-none focus:border-gold" />
          <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="h-12 w-full rounded-xl border bg-card px-4 outline-none focus:border-gold" />
          <GoldButton disabled={busy}>{mode === "up" ? "Create Account" : "Sign In"}</GoldButton>
        </form>
        <button onClick={google} className="mt-3 h-12 w-full rounded-full border bg-card">Continue with Google</button>
        <button onClick={() => setMode(mode === "up" ? "in" : "up")} className="mt-6 w-full text-center text-gold underline-offset-4 hover:underline">
          {mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </div>
    </Shell>
  );
}
