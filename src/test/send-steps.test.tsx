import type { ComponentType, ReactNode } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => ({ options, useSearch: () => ({}) }),
  useNavigate: () => vi.fn(),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: () => ({ insert: vi.fn(() => Promise.resolve({ error: null })) }) },
}));
vi.mock("@/components/brew-class", () => ({
  BrewClass: ({
    onChange,
    onReady,
  }: {
    onChange: (ids: string[]) => void;
    onReady: (ready: boolean) => void;
  }) => (
    <button
      onClick={() => {
        onChange(["ember-1"]);
        onReady(true);
      }}
    >
      Finish brewing
    </button>
  ),
}));
vi.mock("@/components/kit", () => ({
  Shell: ({ children }: { children: ReactNode }) => <main>{children}</main>,
  Label: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  GoldButton: (p: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...p} />,
  Option: ({
    children,
    onClick,
    active,
  }: {
    children: ReactNode;
    onClick: () => void;
    active: boolean;
  }) => (
    <button onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  ),
  Chip: ({
    children,
    onClick,
    active,
  }: {
    children: ReactNode;
    onClick: () => void;
    active: boolean;
  }) => (
    <button onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  ),
}));
import { Route } from "@/routes/send";
import { guest } from "@/lib/guest";
const Send = Route.options.component as ComponentType;
afterEach(cleanup);
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
describe("Send step arrangement", () => {
  it("keeps all writing together, preserves it through editing, and includes it in the gift", async () => {
    render(<Send />);
    const next = () => fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    next();
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Finish brewing" }));
    next();
    next();
    expect(screen.getByText("Step 4 of 8")).toBeInTheDocument();
    expect(screen.queryByLabelText("Your confession")).toBeNull();
    next();
    expect(screen.getByText("Step 5 of 8")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Your confession"), {
      target: { value: "A confession for you" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Vintage Valentine/ }));
    fireEvent.change(screen.getByLabelText("Words for your card (optional)"), {
      target: { value: "A card to keep" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Handwritten Love Note/ }));
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Your handwritten letter"), {
      target: { value: "A letter from me" },
    });
    next();
    expect(screen.getByText("Step 6 of 8")).toBeInTheDocument();
    next();
    expect(screen.getByText("Step 7 of 8")).toBeInTheDocument();
    expect(screen.queryByLabelText("Your confession")).toBeNull();
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("To my beloved"), { target: { value: "Beloved" } });
    fireEvent.change(screen.getByLabelText("From your admirer"), { target: { value: "Admirer" } });
    next();
    expect(screen.getByText("Step 8 of 8")).toBeInTheDocument();
    expect(screen.getByText("A card to keep")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Edit Note & Card" }));
    expect(screen.getByLabelText("Your handwritten letter")).toHaveValue("A letter from me");
    expect(screen.getByLabelText("Words for your card (optional)")).toHaveValue("A card to keep");
    next();
    next();
    next();
    fireEvent.click(screen.getByRole("button", { name: "Seal My Fate" }));
    await waitFor(() => expect(guest.orders()).toHaveLength(1));
    expect(guest.orders()[0]?.gift).toMatchObject({
      note: "A confession for you",
      handwritten: "A letter from me",
      card: "vintage",
      cardMessage: "A card to keep",
    });
  });
});
