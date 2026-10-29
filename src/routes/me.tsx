import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TIERS } from "@/lib/catalog";
import { guest } from "@/lib/guest";
import { Shell } from "@/components/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/me")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Love Letters — Amortentia Post" },
      { name: "description", content: "Your profile, boxes sent, and boxes received." },
      { property: "og:title", content: "My Love Letters" },
      { property: "og:description", content: "Your enchanted chocolate history." },
    ],
  }),
  component: Me,
});

type Order = { id: string; tier: string; recipient_name: string; total: number; created_at: string; mine: boolean };

function Me() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"sent" | "received">("sent");
  const [name, setName] = useState<string | null>(null);
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const user = null as null | { id: string; email?: string };
      if (!user) {
        const p = guest.profile();
        return { user: null, displayName: p.display_name, email: "Guest — saved on this device", avatar: p.avatar,
          orders: guest.orders().map((o) => ({ ...o, mine: true })) as Order[] };
      }
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      let avatar = profile?.avatar_url ?? null;
      if (avatar && !avatar.startsWith("http"))
        avatar = (await supabase.storage.from("avatars").createSignedUrl(avatar, 3600)).data?.signedUrl ?? null;
      const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      return { user, displayName: profile?.display_name ?? "", email: user.email ?? "", avatar,
        orders: (orders ?? []).map((o) => ({ ...o, total: Number(o.total), mine: o.sender_id === user.id })) as Order[] };
    },
  });

  if (!data) return <Shell><p className="m-auto text-muted-foreground">Opening your letters…</p></Shell>;
  const sent = data.orders.filter((o) => o.mine);
  const received = data.orders.filter((o) => !o.mine);
  const list = tab === "sent" ? sent : received;

  async function upload(f: File) {
    if (!data!.user) {
      const r = new FileReader();
      r.onload = () => { guest.saveProfile({ ...guest.profile(), avatar: String(r.result) }); qc.invalidateQueries({ queryKey: ["me"] }); };
      r.readAsDataURL(f);
      return;
    }
    const path = `${data!.user.id}/avatar-${Date.now()}`;
    const { error } = await supabase.storage.from("avatars").upload(path, f, { upsert: true });
    if (error) { toast.error("Upload failed"); return; }
    await supabase.from("profiles").update({ avatar_url: path }).eq("id", data!.user.id);
    qc.invalidateQueries({ queryKey: ["me"] });
  }
  async function saveName() {
    if (name === null) return;
    if (data!.user) await supabase.from("profiles").update({ display_name: name }).eq("id", data!.user.id);
    else guest.saveProfile({ ...guest.profile(), display_name: name });
    setName(null);
    qc.invalidateQueries({ queryKey: ["me"] });
    toast.success("Name saved");
  }

  return (
    <Shell>
      <div className="flex items-center gap-4">
        <label className="relative grid h-20 w-20 cursor-pointer place-items-center overflow-hidden rounded-full border-2 border-gold bg-card text-3xl">
          {data.avatar ? <img src={data.avatar} alt="Your photo" className="h-full w-full object-cover" /> : "🪶"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
        <div className="flex-1">
          <input value={name ?? data.displayName} onChange={(e) => setName(e.target.value)} onBlur={saveName}
            aria-label="Display name" className="w-full bg-transparent font-display text-2xl text-gold outline-none" />
          <p className="text-sm text-muted-foreground">{data.email}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-2xl border bg-card p-3"><div className="font-display text-2xl text-gold">{sent.length}</div><div className="text-sm text-muted-foreground">Boxes sent</div></div>
        <div className="rounded-2xl border bg-card p-3"><div className="font-display text-2xl text-gold">{received.length}</div><div className="text-sm text-muted-foreground">Admirers</div></div>
      </div>

      <div className="mt-6 flex gap-2">
        {(["sent", "received"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("min-h-11 flex-1 rounded-full border", tab === t ? "bg-gold-gradient text-primary-foreground" : "bg-card")}>
            {t === "sent" ? "Sent" : "Received"}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {list.length === 0 && <p className="py-8 text-center text-muted-foreground">{tab === "sent" ? "No boxes sent yet. Who's on your mind?" : "No admirers yet… they're coming."}</p>}
        {list.map((o) => (
          <div key={o.id} className="rounded-2xl border bg-card p-4">
            <div className="flex justify-between">
              <span className="font-semibold">{tab === "sent" ? `To ${o.recipient_name}` : "From a Secret Admirer"}</span>
              <span className="text-gold">${o.total.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground">{TIERS.find((t) => t.id === o.tier)?.name} · {new Date(o.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}
