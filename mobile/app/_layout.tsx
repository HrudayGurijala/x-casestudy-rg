import {ClerkProvider,useAuth} from "@clerk/clerk-expo"
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Stack } from "expo-router";
import "../global.css"
import { QueryClient,QueryClientProvider} from "@tanstack/react-query"
import {  View } from "react-native";
import { Feather } from "@expo/vector-icons";

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <Feather name="twitter" size={100} color="#1DA1F2" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{headerShown: false}}>
      {!isSignedIn ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client ={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
