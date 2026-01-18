import { Stack } from "expo-router";
import { WebSocketProvider } from "../context/WebSocketContext";

export default function RootLayout() {
  return (
    <WebSocketProvider>
      <Stack screenOptions={{ headerShown: false}} />
    </WebSocketProvider>
  );
}
