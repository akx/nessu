import React from "react";
import Nessie from "./Nessie";
import { useEvent } from "react-use";

export default function useNessie(
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const nessieRef = React.useRef<Nessie | null>(null);
  const handleKeyEvent = React.useCallback((event: Event) => {
    if (nessieRef.current?.handleKeyEvent(event)) {
      event.preventDefault();
    }
  }, []);
  useEvent("keydown", handleKeyEvent, window);
  useEvent("keyup", handleKeyEvent, window);

  const stepFrame = React.useCallback((t: DOMHighResTimeStamp) => {
    if (nessieRef.current) {
      nessieRef.current?.stepFrame(t);
      requestAnimationFrame(stepFrame);
    }
  }, []);

  const bootArrayBuffer = React.useCallback((romArrayBuffer: ArrayBuffer) => {
    if (nessieRef.current) {
      nessieRef.current?.stop();
      nessieRef.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      nessieRef.current = new Nessie(canvas, romArrayBuffer);
      nessieRef.current.boot();
      stepFrame(0);
    }
  }, []);

  return { bootArrayBuffer };
}
