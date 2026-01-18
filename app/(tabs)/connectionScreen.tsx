import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useWebSocket } from "../../context/WebSocketContext";

export default function ConnectionScreen() {
  const [ip, setIp] = useState("");
  const { connect, disconnect, status } = useWebSocket();

  const IndicadorStatus = ({ status }: { status: string }) => {
    let color = "red";
    if (status === "Conectado") color = "green";
    if (status === "Conectando") color = "yellow";
    if (status === "Desconectado") color = "red";

    return (
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: color }]} />
        <Text style={styles.statusText}>{status || "Desconectado"}</Text>
      </View>
    );
  };

  const handleConnect = () => {
    if (!ip.trim()) {
      Alert.alert("Erro", "Por favor, insira um endereço IP");
      return;
    }

    // Validar formato IP básico (xxx.xxx.xxx.xxx)
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      Alert.alert("Erro", "Formato de IP inválido. Use: 192.168.0.1");
      return;
    }

    connect(ip);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Controle de Gestos para Slides</Text>

        <View style={styles.container}>
          <Text style={styles.text}>Conecte o dispositivo via WI-FI</Text>
          <Text style={styles.subtext}>Utilize a mesma rede Wi-Fi</Text>

          <TextInput
            style={styles.input}
            placeholder="192.168.0.10"
            value={ip}
            onChangeText={setIp}
            autoCapitalize="none"
            autoCorrect={false}
            editable={status !== "Conectando"}
          />

          <Pressable style={styles.button} onPress={handleConnect}>
            <Text style={styles.buttonText}>Conectar</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => disconnect()}>
            <Text style={styles.buttonText}>Desconectar</Text>
          </Pressable>

          <IndicadorStatus status={status} />
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
  text: {
    fontSize: 18,
  },
  subtext: {
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "80%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "50%",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  statusDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
  },
});
