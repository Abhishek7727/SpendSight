import { create } from "zustand";

interface UserStore {
  currency: string;
  setCurrency: (value: string) => void;
  needsOnboarding: boolean | null; // null = not yet determined
  setNeedsOnboarding: (value: boolean | null) => void;
  biometricEnabled: boolean;
  setBiometricEnabled: (value: boolean) => void;
  isAppLocked: boolean;
  setIsAppLocked: (value: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currency: "INR",
  setCurrency: (value) => set({ currency: value }),
  needsOnboarding: null,
  setNeedsOnboarding: (value) => set({ needsOnboarding: value }),
  biometricEnabled: false,
  setBiometricEnabled: (value) => set({ biometricEnabled: value }),
  isAppLocked: false,
  setIsAppLocked: (value) => set({ isAppLocked: value }),
}));
