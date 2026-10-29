// Guest mode: while sign-in is optional, guests keep orders, profile and swoons on this device.
export type GuestOrder = { id: string; tier: string; recipient_name: string; total: number; created_at: string; gift_id?: string; gift_url?: string };
export type GuestProfile = { display_name: string; avatar: string | null };

const read = <T,>(k: string, d: T): T => {
  try { return JSON.parse(localStorage.getItem(k) ?? "") as T; } catch { return d; }
};
const write = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v));

export const guest = {
  orders: () => read<GuestOrder[]>("ap-orders", []),
  addOrder: (o: GuestOrder) => write("ap-orders", [o, ...guest.orders()]),
  profile: () => read<GuestProfile>("ap-profile", { display_name: "Secret Admirer", avatar: null }),
  saveProfile: (p: GuestProfile) => write("ap-profile", p),
  swoons: () => read<string[]>("ap-swoons", []),
  saveSwoons: (s: string[]) => write("ap-swoons", s),
};
