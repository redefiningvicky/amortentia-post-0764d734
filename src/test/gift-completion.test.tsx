import type { ComponentType, ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({
  search: {
    id: "gift-one",
    to: "Recipient",
    from: "Admirer",
    tier: "sweet",
    blend: "Pure Desire",
    note: "A confession",
    details: "",
    preview: true,
  },
  rpc: vi.fn(() => Promise.resolve({ error: null })),
}));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => ({ options, useSearch: () => state.search }),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { rpc: state.rpc } }));
vi.mock("@/components/kit", () => ({
  Shell: ({ children }: { children: ReactNode }) => <main>{children}</main>,
  GoldButton: (p: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...p} />,
}));
import { Route } from "@/routes/gift";
import { guest } from "@/lib/guest";
import { demo } from "@/lib/demo";
const Gift = Route.options.component as ComponentType;
afterEach(cleanup);
beforeEach(() => {
  localStorage.clear();
  state.rpc.mockClear();
  state.search.preview = true;
  state.search.details = JSON.stringify({
    ...state.search,
    wrapping: "velvet",
    handwritten: "The paid handwritten letter",
    keepsakes: ["plush"],
    potions: ["ember-1"],
  });
});
describe("Recipient unboxing", () => {
  it("shows actual wrapping and separate letter while preview never records opening", () => {
    render(<Gift />);
    expect(screen.getByText("Crimson Velvet Heart")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Break the wax seal" }));
    expect(screen.getByText("The paid handwritten letter")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reveal My Chocolates" }));
    expect(screen.getByText("Messenger Owl Plush")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Take a Bite" }));
    expect(screen.getByText("The potion is working…")).toBeInTheDocument();
    expect(state.rpc).not.toHaveBeenCalled();
    expect(guest.received()).toHaveLength(0);
  });
  it("records opening and biting for recipients and saves the gift under Received", () => {
    state.search.preview = false;
    render(<Gift />);
    fireEvent.click(screen.getByRole("button", { name: "Skip Animation" }));
    expect(guest.received()).toHaveLength(1);
    expect(demo.giftStatus(["gift-one"])[0]?.opened_at).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Take a Bite" }));
    expect(demo.giftStatus(["gift-one"])[0]?.bitten_at).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Replay Unboxing" }));
    expect(guest.received()).toHaveLength(1);
  });
});
