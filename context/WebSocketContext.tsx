import React, { createContext, useContext, useRef, useState } from "react";

type WSContextType = {
  status: string;
  error: string | null;
  connect: (ip: string) => void;
  disconnect: () => void;
  send: (message: object | string) => boolean;
};

const WebSocketContext = createContext<WSContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState("Desconectado");
  const [error, setError] = useState<string | null>(null);

  const connect = (ip: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return; // Já conectado

    try {
      setStatus("Conectando");
      setError(null);
      const ws = new WebSocket(`ws://${ip}:3000/ws`);

      ws.onopen = () => {
        console.log("Conectado ao servidor WebSocket.");
        setStatus("Conectado");
        setError(null);
      };

      ws.onerror = (event) => {
        console.error("Erro WebSocket:", event);
        setStatus("Erro na conexão");
        setError("Não foi possível conectar ao servidor");
      };

      ws.onclose = () => {
        console.log("Conexão WebSocket fechada.");
        wsRef.current = null;
        setStatus("Desconectado");
      };

      wsRef.current = ws; // Armazena a referência do WebSocket
    } catch (err) {
      console.error("Erro ao conectar:", err);
      setStatus("Erro na conexão");
      setError("Erro ao conectar");
    }
  };

  const disconnect = () => {
    try {
      wsRef.current?.close();
      wsRef.current = null;
      setStatus("Desconectado");
      setError(null);
    } catch (err) {
      console.error("Erro ao desconectar:", err);
      setError("Erro ao desconectar");
    }
  };

  const send = (message: object | string): boolean => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const payload =
          typeof message === "object" ? JSON.stringify(message) : message;
        wsRef.current.send(payload);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      setError("Erro ao enviar comando");
      return false;
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ status, error, connect, disconnect, send }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error(
      "useWebSocket precisa ser usado dentro do WebSocketProvider",
    );
  return context;
}
