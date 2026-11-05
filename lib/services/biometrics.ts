import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

export const BIOMETRIC_LOCK_KEY = "spendsight_biometric_lock_enabled";

export type BiometricStatus = {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
};

export async function checkBiometricSupport(): Promise<BiometricStatus> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = hasHardware
      ? await LocalAuthentication.isEnrolledAsync()
      : false;
    const supportedTypes = hasHardware
      ? await LocalAuthentication.supportedAuthenticationTypesAsync()
      : [];

    return {
      hasHardware,
      isEnrolled,
      supportedTypes,
    };
  } catch (err) {
    console.error("Error checking biometric support:", err);
    return {
      hasHardware: false,
      isEnrolled: false,
      supportedTypes: [],
    };
  }
}

export async function authenticateUser(
  promptMessage: string = "Unlock SpendSight"
): Promise<{ success: boolean; error?: string }> {
  try {
    const { hasHardware, isEnrolled } = await checkBiometricSupport();
    if (!hasHardware || !isEnrolled) {
      return {
        success: false,
        error: "Biometric authentication is not supported or set up on this device.",
      };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: "Cancel",
      fallbackLabel: "Use Passcode",
      disableDeviceFallback: false,
    });

    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      error: result.error || "Authentication failed or cancelled.",
    };
  } catch (err: any) {
    console.error("Biometric authentication error:", err);
    return {
      success: false,
      error: err?.message || "An unexpected error occurred during authentication.",
    };
  }
}

export async function getBiometricLockEnabled(): Promise<boolean> {
  try {
    const value = await SecureStore.getItemAsync(BIOMETRIC_LOCK_KEY);
    return value === "true";
  } catch (err) {
    console.error("Failed to read biometric lock setting:", err);
    return false;
  }
}

export async function setBiometricLockEnabled(enabled: boolean): Promise<void> {
  try {
    if (enabled) {
      await SecureStore.setItemAsync(BIOMETRIC_LOCK_KEY, "true");
    } else {
      await SecureStore.deleteItemAsync(BIOMETRIC_LOCK_KEY);
    }
  } catch (err) {
    console.error("Failed to update biometric lock setting:", err);
    throw err;
  }
}
