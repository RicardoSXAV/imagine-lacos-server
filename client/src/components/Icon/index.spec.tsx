import { render, screen } from "@testing-library/react";

import Icon from ".";

describe("Icon component", () => {
  it("should render an image", () => {
    render(<Icon />);

    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("should have pressable-icon class", () => {
    render(<Icon />);

    const image = screen.getByRole("img");

    expect(image).toHaveClass("pressable-icon");
  });
});
