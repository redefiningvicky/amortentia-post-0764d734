import type { ComponentType, ReactNode } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const backend = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => ({ options }),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: backend }));
vi.mock("@/components/kit", () => ({
  Shell: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));
import { Route } from "@/routes/me";
import { guest } from "@/lib/guest";
const Me = Route.options.component as ComponentType;
const clients: QueryClient[] = [];
function openMe() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  clients.push(client);
  return render(
    <QueryClientProvider client={client}>
      <Me />
    </QueryClientProvider>,
  );
}
beforeEach(() => {
  localStorage.clear();
  backend.rpc.mockClear();
  backend.from.mockClear();
});
afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
});
describe("Me Owl Post reaction", () => {
  it("shows one sample sent box and persists the bite, dismissal, and reopening without a popup", async () => {
    const first = openMe();
    await screen.findByText("Sample box");
    expect(screen.getByText("Boxes sent").previousElementSibling).toHaveTextContent("1");
    expect(guest.orders()).toHaveLength(0);
    expect(backend.rpc).not.toHaveBeenCalled();
    expect(backend.from).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "See What Happens After a Bite" }));
    expect(screen.getByRole("status")).toHaveTextContent("deeply unreasonable affection for you");
    expect(screen.getByText("THEY ATE IT.")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Read Their Reaction" }));
    expect(screen.getByText(/your name sounds like poetry/)).toBeInTheDocument();
    first.unmount();
    const second = openMe();
    await screen.findByText("THEY ATE IT.");
    expect(screen.getByText("Boxes sent").previousElementSibling).toHaveTextContent("1");
    fireEvent.click(screen.getByRole("button", { name: "Dismiss Update" }));
    expect(screen.queryByText("THEY ATE IT.")).toBeNull();
    second.unmount();
    openMe();
    await screen.findByText("Sample box");
    expect(screen.queryByText("THEY ATE IT.")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "View Their Reaction" }));
    expect(screen.getByText("THEY ATE IT.")).toBeInTheDocument();
    expect(guest.orders()).toHaveLength(0);
  });
  it("counts the sample alongside existing gifts without creating extra saved orders", async () => {
    guest.addOrder({
      id: "existing",
      tier: "true",
      recipient_name: "Someone",
      total: 44.99,
      created_at: "2026-01-01T00:00:00Z",
    });
    openMe();
    await screen.findByText("Sample box");
    expect(screen.getByText("Boxes sent").previousElementSibling).toHaveTextContent("2");
    expect(guest.orders()).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Received" }));
    await waitFor(() => expect(screen.queryByText("Sample box")).toBeNull());
  });
});
