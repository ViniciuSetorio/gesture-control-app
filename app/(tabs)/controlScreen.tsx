import { useWebSocket } from "@/context/WebSocketContext";
import { useGestures } from "@/hooks/useGestures";
import { useTouchPointer } from "@/hooks/useTouchPointer";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ControlScreen() {
  const { status, send } = useWebSocket();
  const { panResponder } = useTouchPointer();
  const [lastGesture, setLastGesture] = useState<string | null>(null);

  useGestures((gesture) => {
    if (status !== "Conectado") return;
    if (!gesture) return;

    const success = send(JSON.stringify({ type: "COMMAND", command: gesture }));

    if (success) {
      setLastGesture(gesture);
      // Limpar feedback após 500ms
      setTimeout(() => setLastGesture(null), 500);
    }
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Controle de Slides</Text>

        <View style={styles.container}>
          <Ionicons name="arrow-forward" size={24} color={"black"} />
          <Text style={styles.instruction}>
            {" "}
            Inclinar para direita - Slide seguinte
          </Text>

          <Ionicons name="arrow-back" size={24} color={"black"} />
          <Text style={styles.instruction}>
            {" "}
            Inclinar para esquerda - Slide anterior
          </Text>

          <View {...panResponder.panHandlers} style={styles.touchArea}>
            <Text style={styles.touchAreaText}>Use a tela como touchpad</Text>
          </View>

          {lastGesture && (
            <View
              style={[
                styles.feedbackContainer,
                lastGesture === "RIGHT"
                  ? styles.feedbackRight
                  : styles.feedbackLeft,
              ]}
            >
              <Ionicons
                name={lastGesture === "RIGHT" ? "arrow-forward" : "arrow-back"}
                size={28}
                color="#fff"
              />
              <Text style={styles.feedbackText}>
                {lastGesture === "RIGHT" ? "Próximo" : "Anterior"}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instruction: {
    fontSize: 14,
    marginBottom: 40,
  },
  touchArea: {
    width: "90%",
    height: "50%",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    marginBottom: 40,
  },
  touchAreaText: {
    color: "lightgray",
    textAlign: "center",
  },
  feedbackContainer: {
    position: "absolute",
    bottom: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  feedbackRight: {
    backgroundColor: "#4CAF50",
    right: 20,
  },
  feedbackLeft: {
    backgroundColor: "#2196F3",
    left: 20,
  },
  feedbackText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
