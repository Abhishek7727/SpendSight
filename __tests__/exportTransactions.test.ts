import { describe, it } from "node:test";
import assert from "node:assert";

// Function matching lib/utils/exportTransactions.ts
function toCsvCell(value: string | number | null) {
  if (value === null) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function buildCsvRow(fields: (string | number | null)[]) {
  return fields.map(toCsvCell).join(",");
}

describe("CSV Export Logic", () => {
  it("leaves simple alphanumeric values unquoted", () => {
    assert.strictEqual(toCsvCell("Groceries"), "Groceries");
    assert.strictEqual(toCsvCell(450), "450");
  });

  it("returns empty string for null values", () => {
    assert.strictEqual(toCsvCell(null), "");
  });

  it("escapes cells containing commas with double quotes", () => {
    assert.strictEqual(toCsvCell("Fruits, Veggies"), '"Fruits, Veggies"');
  });

  it("escapes cells containing double quotes by doubling them", () => {
    assert.strictEqual(toCsvCell('Book: "The Hobbit"'), '"Book: ""The Hobbit"""');
  });

  it("escapes cells containing newline characters", () => {
    assert.strictEqual(toCsvCell("Line1\nLine2"), '"Line1\nLine2"');
  });

  it("properly constructs a full CSV row", () => {
    const row = buildCsvRow([
      "2026-10-31",
      "EXPENSE",
      "food",
      "Dinner with friends, pizza",
      250,
      "MANUAL",
    ]);
    assert.strictEqual(
      row,
      '2026-10-31,EXPENSE,food,"Dinner with friends, pizza",250,MANUAL'
    );
  });
});
