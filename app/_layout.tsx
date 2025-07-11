import { Stack } from "expo-router";
import { UserAnswersProvider } from "./context/UserAnswersContext";

// The root layout for the app, which sets up the navigation stack
export default function RootLayout() {
  return (
    <UserAnswersProvider> // Wrap the stack in the UserAnswersProvider to provide context to all screens
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="survey1"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="survey2"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="survey3"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="survey4"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="survey5"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="userplan"
        options={{ headerShown: false }}
      />

    </Stack>
    </UserAnswersProvider>
  );
}
