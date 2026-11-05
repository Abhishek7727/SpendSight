import {
  authenticateUser,
  getBiometricLockEnabled,
} from "@/lib/services/biometrics";
import { useUserStore } from "@/store/userStore";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function BiometricLockGate({ children }: { children: React.ReactNode }) {
  const biometricEnabled = useUserStore((s) => s.biometricEnabled);
  const setBiometricEnabled = useUserStore((s) => s.setBiometricEnabled);
  const isAppLocked = useUserStore((s) => s.isAppLocked);
  const setIsAppLocked = useUserStore((s) => s.setIsAppLocked);

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");
  const appState = useRef(AppState.currentState);

  const triggerAuth = useCallback(async () => {
    setIsAuthenticating(true);
    setAuthError("");
    try {
      const result = await authenticateUser(
        "Unlock SpendSight to view your finances"
      );
      if (result.success) {
        setIsAppLocked(false);
        setAuthError("");
      } else {
        setAuthError(result.error || "Authentication was not completed.");
      }
    } catch {
      setAuthError("Failed to authenticate. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  }, [setIsAppLocked]);

  // Initialize biometric state on launch
  useEffect(() => {
    let mounted = true;

    async function initBiometrics() {
      const enabled = await getBiometricLockEnabled();
      if (!mounted) return;
      setBiometricEnabled(enabled);

      if (enabled) {
        setIsAppLocked(true);
        triggerAuth();
      }
    }

    initBiometrics();

    return () => {
      mounted = false;
    };
  }, [setBiometricEnabled, setIsAppLocked, triggerAuth]);

  // Listen to background -> foreground transitions
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          if (biometricEnabled) {
            setIsAppLocked(true);
            triggerAuth();
          }
        } else if (nextAppState.match(/inactive|background/)) {
          if (biometricEnabled) {
            setIsAppLocked(true);
          }
        }
        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [biometricEnabled, setIsAppLocked, triggerAuth]);

  if (!isAppLocked) {
    return <>{children}</>;
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-bg items-center justify-center px-6">
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full bg-brand-surface border border-brand-surface-border items-center justify-center mb-5">
          <Feather name="lock" size={36} color="#4A9EFF" />
        </View>

        <Text className="text-white text-2xl font-bold mb-2">
          SpendSight is Locked
        </Text>
        <Text className="text-brand-text-secondary text-sm text-center px-4">
          Biometric lock is active. Unlock to view your balances, transactions,
          and budgets.
        </Text>
      </View>

      {authError ? (
        <Text className="text-brand-coral text-xs text-center mb-6 px-4">
          {authError}
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={triggerAuth}
        disabled={isAuthenticating}
        className="w-full max-w-xs bg-brand-blue rounded-xl py-4 items-center flex-row justify-center gap-2 shadow-lg"
        activeOpacity={0.85}
      >
        {isAuthenticating ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Feather name="shield" size={18} color="#FFFFFF" />
            <Text className="text-white text-base font-semibold">
              Unlock with Biometrics
            </Text>
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
