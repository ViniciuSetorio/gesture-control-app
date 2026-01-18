import { useRef } from "react";
import { PanResponder } from "react-native";
import { useWebSocket } from "@/context/WebSocketContext";

export function useTouchPointer() {
  const { status, send } = useWebSocket();

  const lastPos = useRef({ x: 0, y: 0 });

  const SENSITIVITY = 1.5;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      lastPos.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
    },

    onPanResponderMove: (evt) => {
      if (status !== "Conectado") return;

      const x = evt.nativeEvent.pageX;
      const y = evt.nativeEvent.pageY;

      let dx = (x - lastPos.current.x) * SENSITIVITY;
      let dy = (y - lastPos.current.y) * SENSITIVITY;

      lastPos.current = { x, y };

      send(JSON.stringify({ type: "POINTER_MOVE", dx, dy }));
    },

    onPanResponderRelease: () => {
      lastPos.current = { x: 0, y: 0 };
    },
  });
  return { panResponder };
}
