import type { ComponentType, ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => ({ options }),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));
vi.mock("@/components/kit", () => ({
  Shell: ({ children }: { children: ReactNode }) => <main>{children}</main>,
  GoldButton: (p: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...p} />,
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));
import { Route } from "@/routes/wall";
const Wall = Route.options.component as ComponentType;
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});
describe("Completed Wall", () => {
  it("uses fictional samples and ignores saved customer data without making network requests", () => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem(
      "ap-wall-cache-v1",
      JSON.stringify([{ id: "customer-one", note: "Private customer confession", potions: [] }]),
    );
    const network = vi.spyOn(globalThis, "fetch");
    const { container } = render(<Wall />);
    expect(container.querySelectorAll("article")).toHaveLength(5);
    expect(screen.getByText("Showing 5 of 13 confessions")).toBeInTheDocument();
    expect(screen.queryByText(/Private customer confession/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show More" }));
    expect(container.querySelectorAll("article")).toHaveLength(10);
    fireEvent.click(screen.getByRole("button", { name: "Photo Album" }));
    expect(screen.getByText("Showing 6 of 16 photos")).toBeInTheDocument();
    expect(container.querySelector('input[type="file"]')).toBeNull();
    expect(network).not.toHaveBeenCalled();
    network.mockRestore();
  });
  it("pretends to post for this browser session only", () => {
    sessionStorage.clear();
    render(<Wall />);
    fireEvent.click(screen.getAllByRole("button", { name: "Confess Your Own" })[0]!);
    fireEvent.change(screen.getByLabelText("Your secret confession"), {
      target: { value: "I rehearsed hello again." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Post My Confession" }));
    expect(screen.getByText(/I rehearsed hello again/)).toBeInTheDocument();
    expect(sessionStorage.getItem("ap-pretend-wall-v1")).toContain("I rehearsed hello again.");
    expect(localStorage.getItem("ap-pretend-wall-v1")).toBeNull();
  });
  it("opens the album without undefined paging state and reveals six more photos", () => {
    const { container } = render(<Wall />);
    fireEvent.click(screen.getByRole("button", { name: "Photo Album" }));
    expect(container.querySelectorAll("figure")).toHaveLength(6);
    fireEvent.click(screen.getByRole("button", { name: "Show More" }));
    expect(container.querySelectorAll("figure")).toHaveLength(12);
    expect(
      screen.queryByText("AI-generated sample memories — not real customer submissions."),
    ).not.toBeInTheDocument();
  });
  it("remembers the collapsed rankings choice", () => {
    localStorage.clear();
    render(<Wall />);
    const button = screen.getByRole("button", { name: /Most craved blends/i });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(localStorage.getItem("ap-rankings-open")).toBe("false");
  });
});
