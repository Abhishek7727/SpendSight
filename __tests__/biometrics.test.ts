import { describe, it } from "node:test";
import assert from "node:assert";

// Biometric lock configuration key used in SecureStore
const BIOMETRIC_LOCK_KEY = "spendsight_biometric_lock_enabled";

describe("Biometric authentication constants & contracts", () => {
  it("defines consistent SecureStore key for biometric lock", () => {
    assert.strictEqual(BIOMETRIC_LOCK_KEY, "spendsight_biometric_lock_enabled");
    assert.ok(BIOMETRIC_LOCK_KEY.length > 0);
  });

  it("handles simulated biometric enrollment check correctly", () => {
    // Contract verification: if hardware is missing, enrollment must be false
    const simulateSupport = (hasHardware: boolean, enrolled: boolean) => {
      const isEnrolled = hasHardware ? enrolled : false;
      return { hasHardware, isEnrolled };
    };

    assert.deepStrictEqual(simulateSupport(false, true), {
      hasHardware: false,
      isEnrolled: false,
    });
    assert.deepStrictEqual(simulateSupport(true, true), {
      hasHardware: true,
      isEnrolled: true,
    });
    assert.deepStrictEqual(simulateSupport(true, false), {
      hasHardware: true,
      isEnrolled: false,
    });
  });

  it("evaluates simulated authentication response states", () => {
    const handleAuthResult = (result: { success: boolean; error?: string }) => {
      if (result.success) {
        return { unlocked: true, error: null };
      }
      return {
        unlocked: false,
        error: result.error || "Authentication failed or cancelled.",
      };
    };

    assert.deepStrictEqual(handleAuthResult({ success: true }), {
      unlocked: true,
      error: null,
    });

    assert.deepStrictEqual(
      handleAuthResult({ success: false, error: "User canceled" }),
      {
        unlocked: false,
        error: "User canceled",
      }
    );
  });
});
