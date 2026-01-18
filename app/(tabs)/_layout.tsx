import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icon: keyof typeof Ionicons.glyphMap = "wifi";

          if (route.name === "connectionScreen") icon = "wifi";
          if (route.name === "controlScreen") icon = "hand-left";

          return <Ionicons name={icon} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="connectionScreen" options={{ title: "Conexão" }} />
      <Tabs.Screen name="controlScreen" options={{ title: "Controle" }} />
    </Tabs>
  );
}
