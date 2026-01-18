import { Accelerometer } from "expo-sensors";
import { useCallback, useEffect, useRef } from "react";

type Gesture = "RIGHT" | "LEFT" | null;

export function useGestures(onGesture: (gesture: Gesture) => void) {
  const lastX = useRef(0);
  const locked = useRef(false);

  const TRIGGER_THRESHOLD = 0.9; // força do gesto
  const RELEASE_THRESHOLD = 0.3; // volta ao neutro
  const COOLDOWN = 600; // ms

  const lastTrigger = useRef(0);

  // Usar useCallback para evitar recriação da função
  const handleGesture = useCallback(onGesture, [onGesture]);

  useEffect(() => {
    Accelerometer.setUpdateInterval(150);

    const subscription = Accelerometer.addListener(({ x }) => {
      const now = Date.now();
      const delta = x - lastX.current;

      // Evita múltiplos gatilhos em curto período
      if (now - lastTrigger.current < COOLDOWN) return;

      if (locked.current && Math.abs(delta) < RELEASE_THRESHOLD) {
        locked.current = false;
      }

      if (!locked.current) {
        // Movimento para a direita
        if (delta > TRIGGER_THRESHOLD) {
          locked.current = true;
          lastTrigger.current = now;
          handleGesture("RIGHT");
        }
        // Movimento brusco para a esquerda
        else if (delta < -TRIGGER_THRESHOLD) {
          locked.current = true;
          lastTrigger.current = now;
          handleGesture("LEFT");
        }
      }

      lastX.current = x;
    });

    return () => subscription.remove();
  }, [handleGesture]);
}
