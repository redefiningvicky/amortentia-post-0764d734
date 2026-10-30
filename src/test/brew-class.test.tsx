import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { BrewClass } from "@/components/brew-class";

describe("cauldron class", () => {
  it("prompts at the fifth raw ingredient and proceeds with the chosen blend", () => {
    function Brewing() {
      const [ids, setIds] = useState<string[]>([]);
      return <BrewClass value={ids} onChange={setIds} />;
    }
    render(<Brewing />);
    for (const name of ["Crushed Dragon Pepper", "Phoenix Ash", "Chili-Chocolate Nibs", "Heartfire Ember"]) {
      fireEvent.click(screen.getByRole("button", { name: new RegExp(name) }));
      expect(screen.queryByRole("dialog")).toBeNull();
    }
    fireEvent.click(screen.getByRole("button", { name: /Smoked Cinnamon Bark/ }));
    const prompt = screen.getByRole("dialog");
    fireEvent.click(within(prompt).getByRole("button", { name: "Keep Choosing" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Remove Smoked Cinnamon Bark" }));
    fireEvent.click(screen.getByRole("button", { name: /Smoked Cinnamon Bark/ }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Into the Cauldron · +$9.99" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Stir the cauldron" })).toBeEnabled();
  }, 30000);
  it("bottles a chosen blend after three stirs and marks it ready to send", () => {
    const onReady = vi.fn();
    render(<BrewClass value={["ember-1", "thorn-1"]} onChange={vi.fn()} onReady={onReady} />);
    fireEvent.click(screen.getByRole("button", { name: "Into the Cauldron · +$7.99" }));
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