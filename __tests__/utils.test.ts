import { describe, it } from "node:test";
import assert from "node:assert";
import { formatPrice } from "../lib/utils.ts";

describe("formatPrice utility", () => {
  it("formats positive amount in INR by default", () => {
    const formatted = formatPrice(5000);
    // en-IN currency format includes symbol (₹ or INR) and 5,000
    assert.ok(formatted.includes("5,000") || formatted.includes("5000"));
  });

  it("formats amount with USD", () => {
    const formatted = formatPrice(120, "USD");
    assert.ok(formatted.includes("$") || formatted.includes("120"));
  });

  it("formats amount with EUR", () => {
    const formatted = formatPrice(85, "EUR");
    assert.ok(formatted.includes("€") || formatted.includes("85"));
  });

  it("handles 0 amount correctly", () => {
    const formatted = formatPrice(0, "INR");
    assert.ok(formatted.includes("0"));
  });

  it("handles negative amounts correctly", () => {
    const formatted = formatPrice(-250, "USD");
    assert.ok(formatted.includes("250"));
  });

  it("gracefully falls back on invalid currency code without throwing", () => {
    assert.doesNotThrow(() => {
      const formatted = formatPrice(999, "INVALID_CODE_XYZ");
      assert.ok(formatted.includes("999"));
      assert.ok(formatted.includes("INVALID_CODE_XYZ"));
    });
  });

  it("gracefully handles empty string as currency", () => {
    assert.doesNotThrow(() => {
      const formatted = formatPrice(500, "");
      assert.ok(formatted.includes("500"));
    });
  });
});
