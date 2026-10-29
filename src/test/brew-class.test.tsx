import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrewClass } from "@/components/brew-class";

describe("cauldron class", () => {
  it("bottles a chosen blend after three stirs and marks it ready to send", () => {
    const onReady = vi.fn();
    render(<BrewClass value={["ember-1", "thorn-1"]} onChange={vi.fn()} onReady={onReady} />);
    fireEvent.click(screen.getByRole("button", { name: "Into the Cauldron · +$7.98" }));
    const bottle = screen.getByRole("button", { name: "Bottle My Love Potion" });
    expect(bottle).toBeDisabled();
    for (let n = 0; n < 2; n++) fireEvent.click(screen.getByRole("button", { name: "Stir the cauldron" }));
    expect(bottle).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Stir the cauldron" }));
    fireEvent.click(bottle);
    expect(onReady).toHaveBeenLastCalledWith(true);
    fireEvent.click(screen.getByRole("button", { name: "Change Ingredients" }));
    expect(onReady).toHaveBeenLastCalledWith(false);
  });

  it("brews from raw ingredients, not bottled potions", () => {
    const onChange = vi.fn();
    render(<BrewClass value={[]} onChange={onChange} onReady={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /Dragon's Blush/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Crushed Dragon Pepper/ }));
    expect(onChange).toHaveBeenLastCalledWith(["raw-ember-1"]);
  });
});