import type { ComponentType, ReactNode } from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => ({ options, useSearch: () => ({}) }),
  useNavigate: () => vi.fn(),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: vi.fn(() => ({ insert: vi.fn(() => Promise.resolve({ error: null })) })) },
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
import { supabase } from "@/integrations/supabase/client";
const Send = Route.options.component as ComponentType;
afterEach(cleanup);
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
describe("Send step arrangement", () => {
  it("selects all bundle items and replaces the previous bundle without duplicate selections", () => {
    render(<Send />);
    const next = () => fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    next();
    fireEvent.click(screen.getByRole("button", { name: "Finish brewing" }));
    next();
    next();
    const option = (name: string) =>
      screen.getByRole("button", { name: (label) => label.startsWith(name) });
    expect(screen.queryByRole("button", { name: /Crimson Velvet Heart/ })).toBeNull();
    fireEvent.click(option("The Bottled Confession"));
    expect(option("The Bottled Confession")).toHaveAttribute("aria-pressed", "true");
    expect(option("The Little Charm")).toHaveAttribute("aria-pressed", "false");
    expect(option("Monogram Wax Seal")).toHaveAttribute("aria-pressed", "true");
    expect(option("Keepsake Potion Vial")).toHaveTextContent("Included");
    fireEvent.click(option("The Full Love Spell"));
    expect(option("The Full Love Spell")).toHaveAttribute("aria-pressed", "true");
    expect(option("The Bottled Confession")).toHaveAttribute("aria-pressed", "false");
    expect(option("Monogram Wax Seal")).toHaveAttribute("aria-pressed", "false");
    expect(option("Keepsake Potion Vial")).toHaveAttribute("aria-pressed", "true");
    expect(option("Messenger Owl Plush")).toHaveAttribute("aria-pressed", "true");
    expect(option("Messenger Owl Plush")).toHaveTextContent("Included");
    next();
    expect(option("Singing Envelope")).toHaveAttribute("aria-pressed", "true");
    expect(option("Vintage Valentine")).toHaveAttribute("aria-pressed", "false");
    expect(option("Handwritten Love Note")).toHaveAttribute("aria-pressed", "true");
    expect(option("Handwritten Love Note")).toHaveTextContent("Included");
    next();
    expect(option("Crimson Velvet Heart")).toHaveAttribute("aria-pressed", "true");
  }, 15000);
  it("continues and sends a pretend gift with every message blank, including paid note and card", async () => {
    render(<Send />);
    const next = () => fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    next();
    fireEvent.click(screen.getByRole("button", { name: "Finish brewing" }));
    next();
    next();
    next();
    expect(screen.getByText("Step 5 of 8")).toBeInTheDocument();
    expect(
      screen.getByText("Printed on a message slip and tucked inside your chocolate box."),
    ).toBeInTheDocument();
    expect(screen.queryByText(/All messages can be left blank/)).toBeNull();
    expect(screen.getByRole("button", { name: /^No handwritten note/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /^No card/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: /Wax-Sealed Confession/ }));
    fireEvent.click(screen.getByRole("button", { name: /Handwritten Love Note/ }));
    fireEvent.click(screen.getByRole("button", { name: /^No handwritten note/ }));
    expect(screen.queryByLabelText("Your handwritten letter")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Handwritten Love Note/ }));
    for (const label of ["Your confession", "Your card message", "Your handwritten letter"]) {
      expect(screen.getByLabelText(label)).not.toHaveValue("");
      fireEvent.change(screen.getByLabelText(label), { target: { value: "" } });
      expect(screen.getByLabelText(label)).not.toBeRequired();
    }
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
    next();
    next();
    expect(screen.getByLabelText("To my beloved")).toHaveValue("Henry");
    expect(screen.getByLabelText("From your admirer")).toHaveValue("Ramona");
    fireEvent.change(screen.getByLabelText("To my beloved"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("From your admirer"), { target: { value: "" } });
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
    next();
    expect(screen.getByText("No message added")).toBeInTheDocument();
    expect(screen.queryByText("Shop .99 adjustment")).toBeNull();
    const receipt = screen.getByText("Price breakdown").parentElement!;
    const cents = (label: string) => {
      const value = within(receipt).getByText(label, { exact: true }).parentElement!
        .lastElementChild!.textContent!;
      return Math.round(Number(value.replace("−", "-").replace("$", "")) * 100);
    };
    const sum = [
      "Box, potency & duration",
      "Recipe",
      "Note & card",
      "Wrapping, delivery & extras",
      "Savings",
    ].reduce((sum, label) => sum + cents(label), 0);
    expect(cents("Total")).toBe(sum);
    expect(screen.getByRole("button", { name: "Seal My Fate" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Seal My Fate" }));
    await waitFor(() => expect(guest.orders()).toHaveLength(1));
    expect(guest.orders()[0]?.gift).toMatchObject({
      to: "Henry",
      from: "Ramona",
      note: "",
      handwritten: "",
      card: "sealed-card",
      wrapping: "kraft",
    });
    expect(guest.orders()[0]?.gift?.cardMessage).toBeUndefined();
  });

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
    fireEvent.change(screen.getByLabelText("Your card message"), {
      target: { value: "A card to keep" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Handwritten Love Note/ }));
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
    fireEvent.change(screen.getByLabelText("Your handwritten letter"), {
      target: { value: "A letter from me" },
    });
    next();
    expect(screen.getByText("Step 6 of 8")).toBeInTheDocument();
    next();
    expect(screen.getByText("Step 7 of 8")).toBeInTheDocument();
    expect(screen.queryByLabelText("Your confession")).toBeNull();
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
    fireEvent.change(screen.getByLabelText("To my beloved"), { target: { value: "Beloved" } });
    fireEvent.change(screen.getByLabelText("From your admirer"), { target: { value: "Admirer" } });
    next();
    expect(screen.getByText("Step 8 of 8")).toBeInTheDocument();
    expect(screen.getByText("A card to keep")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Edit Note & Card" }));
    expect(screen.getByLabelText("Your handwritten letter")).toHaveValue("A letter from me");
    expect(screen.getByLabelText("Your card message")).toHaveValue("A card to keep");
    next();
    next();
    next();
    fireEvent.click(screen.getByRole("button", { name: /Share anonymously on the Wall/ }));
    fireEvent.click(screen.getByRole("button", { name: "Seal My Fate" }));
    await waitFor(() => expect(guest.orders()).toHaveLength(1));
    expect(sessionStorage.getItem("ap-pretend-wall-v1")).toContain("A confession for you");
    expect(localStorage.getItem("ap-pretend-wall-v1")).toBeNull();
    expect(supabase.from).not.toHaveBeenCalledWith("confessions");
    expect(guest.orders()[0]?.gift).toMatchObject({
      note: "A confession for you",
      handwritten: "A letter from me",
      card: "vintage",
      cardMessage: "A card to keep",
    });
  }, 15000);
});
