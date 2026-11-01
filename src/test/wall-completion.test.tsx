import type { ComponentType, ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
const queryState = vi.hoisted(() => ({ error: null as Error | null, retry: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => ({ options }),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
  useQuery: ({ queryKey }: { queryKey: string[] }) =>
    queryKey[0] === "confessions"
      ? {
          data: queryState.error ? undefined : [],
          error: queryState.error,
          refetch: queryState.retry,
          isFetching: false,
        }
      : { data: [] },
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
  queryState.error = null;
  queryState.retry.mockClear();
});
describe("Completed Wall", () => {
  it("explains a database outage instead of silently hiding confessions", () => {
    localStorage.clear();
    queryState.error = new Error("Database unavailable");
    render(<Wall />);
    expect(screen.getByRole("alert")).toHaveTextContent("database is temporarily unavailable");
    fireEvent.click(screen.getByRole("button", { name: "Retry Confessions" }));
    expect(queryState.retry).toHaveBeenCalledOnce();
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
