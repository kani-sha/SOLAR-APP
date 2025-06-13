import { Stack } from "expo-router";
import { UserAnswersProvider } from "./context/UserAnswersContext";

export default function RootLayout() {
  return (
    <UserAnswersProvider>
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="survey1"
        options={{ headerShown: false }} // no header on survey screen
      />

      <Stack.Screen
        name="survey2"
        options={{ headerShown: false }} // no header on survey screen
      />

      <Stack.Screen
        name="survey3"
        options={{ headerShown: false }} // no header on survey screen
      />

      <Stack.Screen
        name="survey4"
        options={{ headerShown: false }} // no header on survey screen
      />

      <Stack.Screen
        name="survey5"
        options={{ headerShown: false }} // no header on survey screen
      />


    </Stack>
    </UserAnswersProvider>
  );
}
