import { queryClient } from "@/lib/query/client";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

if (!publishableKey) {
  console.warn(
    "[SpendSight] Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env file."
  );
}

export default function RootLayout() {
  if (!publishableKey) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B0E14",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          SpendSight Setup Required
        </Text>
        <Text
          style={{
            color: "#8A8D96",
            fontSize: 14,
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          Missing Clerk Publishable Key. Please add
          EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file to continue.
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <Slot />
        </ClerkProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
