import { formatChange, formatPrice } from "./index";

describe("formatters", () => {
  it("formats prices with the requested precision and grouping", () => {
    expect(formatPrice(1234567.891, 2)).toBe("1,234,567.89");
    expect(formatPrice(0.5, 3)).toBe("0.500");
  });

  it("formats positive, zero and negative changes", () => {
    expect(formatChange(2.345)).toBe("+2.35%");
    expect(formatChange(0)).toBe("+0.00%");
    expect(formatChange(-1.236)).toBe("-1.24%");
  });
});
