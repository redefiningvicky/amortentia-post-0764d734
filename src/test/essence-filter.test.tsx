import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IngredientShelf } from "@/components/ingredient-shelf";
import { PotionCabinet } from "@/components/potion-cabinet";
import { INGREDIENTS, POTIONS } from "@/lib/catalog";

describe("compact essence filters", () => {
  it.each([
    { name: "Ingredient", Shelf: IngredientShelf, items: INGREDIENTS },
    { name: "Potion", Shelf: PotionCabinet, items: POTIONS },
  ])(
    "filters the $name list and restores all without changing selections",
    ({ name, Shelf, items }) => {
      const onChange = vi.fn();
      render(<Shelf value={[]} onChange={onChange} />);
      const filter = screen.getByRole("combobox", { name: `${name} essence` });
      expect(filter).toHaveValue("all");
      fireEvent.change(filter, { target: { value: "frost" } });
      expect(onChange).not.toHaveBeenCalled();
      const item = items.find((item) => item.essence === "frost")!;
      fireEvent.click(screen.getByRole("button", { name: (name) => name.includes(item.name) }));
      expect(onChange).toHaveBeenLastCalledWith([item.id]);
      expect(
        screen.getByText(
          new RegExp(`Showing 10 of 10 ${name === "Ingredient" ? "ingredients" : "potions"}`),
        ),
      ).toBeInTheDocument();
      fireEvent.change(filter, { target: { value: "all" } });
      expect(filter).toHaveValue("all");
      expect(screen.getByText(/Showing 10 of 110/)).toBeInTheDocument();
    },
  );
});
