import { describe, it } from "node:test";
import assert from "node:assert";
import { onboardingSchema } from "../lib/schemas/onboarding.ts";
import { transactionSchema } from "../lib/schemas/transaction.ts";
import { signInSchema, signUpSchema, codeSchema } from "../lib/schemas/auth.ts";

describe("onboardingSchema", () => {
  it("accepts valid positive starting balance", () => {
    const result = onboardingSchema.safeParse({ startingBalance: "5000" });
    assert.strictEqual(result.success, true);
  });

  it("accepts formatted starting balance with commas", () => {
    const result = onboardingSchema.safeParse({ startingBalance: "50,000" });
    assert.strictEqual(result.success, true);
  });

  it("accepts zero starting balance", () => {
    const result = onboardingSchema.safeParse({ startingBalance: "0" });
    assert.strictEqual(result.success, true);
  });

  it("rejects negative starting balance", () => {
    const result = onboardingSchema.safeParse({ startingBalance: "-100" });
    assert.strictEqual(result.success, false);
  });

  it("rejects non-numeric string", () => {
    const result = onboardingSchema.safeParse({ startingBalance: "abc" });
    assert.strictEqual(result.success, false);
  });

  it("rejects empty starting balance", () => {
    const result = onboardingSchema.safeParse({ startingBalance: "" });
    assert.strictEqual(result.success, false);
  });
});

describe("transactionSchema", () => {
  it("accepts valid expense transaction", () => {
    const result = transactionSchema.safeParse({
      type: "EXPENSE",
      amount: "450",
      category: "food",
      accountId: "acc-123",
      description: "Lunch at cafe",
      date: new Date(),
    });
    assert.strictEqual(result.success, true);
  });

  it("accepts valid income transaction with formatted amount", () => {
    const result = transactionSchema.safeParse({
      type: "INCOME",
      amount: "25,000",
      category: "salary",
      accountId: "acc-456",
      date: new Date(),
    });
    assert.strictEqual(result.success, true);
  });

  it("rejects zero or negative amount", () => {
    const resZero = transactionSchema.safeParse({
      type: "EXPENSE",
      amount: "0",
      category: "food",
      accountId: "acc-123",
      date: new Date(),
    });
    assert.strictEqual(resZero.success, false);

    const resNeg = transactionSchema.safeParse({
      type: "EXPENSE",
      amount: "-10",
      category: "food",
      accountId: "acc-123",
      date: new Date(),
    });
    assert.strictEqual(resNeg.success, false);
  });

  it("rejects empty accountId", () => {
    const result = transactionSchema.safeParse({
      type: "EXPENSE",
      amount: "100",
      category: "food",
      accountId: "",
      date: new Date(),
    });
    assert.strictEqual(result.success, false);
  });
});

describe("auth schemas", () => {
  it("validates correct sign-in credentials", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "secretpassword123",
    });
    assert.strictEqual(result.success, true);
  });

  it("rejects invalid email in sign-in", () => {
    const result = signInSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    assert.strictEqual(result.success, false);
  });

  it("validates correct sign-up details", () => {
    const result = signUpSchema.safeParse({
      firstName: "Abhishek",
      lastName: "Namdev",
      email: "abhishek@example.com",
      password: "securepassword",
    });
    assert.strictEqual(result.success, true);
  });

  it("rejects short password (< 8 chars) in sign-up", () => {
    const result = signUpSchema.safeParse({
      firstName: "Abhishek",
      lastName: "Namdev",
      email: "abhishek@example.com",
      password: "123",
    });
    assert.strictEqual(result.success, false);
  });

  it("validates 6-digit verification code", () => {
    const result = codeSchema.safeParse({ code: "123456" });
    assert.strictEqual(result.success, true);
  });
});
