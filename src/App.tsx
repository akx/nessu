import React from "react";
import b64ab from "base64-arraybuffer";
import useNessie from "./useNessie";
import "./App.css";

function App() {
  const nesCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const arrayBufferRef = React.useRef<ArrayBuffer | null>(null);
  const [corruption, setCorruption] = React.useState(0.0005);
  const [corruptionInfo, setCorruptionInfo] = React.useState<Record<any, any>>(
    {}
  );
  const { bootArrayBuffer } = useNessie(nesCanvasRef);

  const corruptArrayBuffer = React.useCallback(
    (arrayBuffer: ArrayBuffer): [ArrayBuffer, Record<any, any>] => {
      const info = { corruption, xor: 0, add: 0 };
      const newArrayBuffer = arrayBuffer.slice(0);
      const uint8Array = new Uint8Array(newArrayBuffer);
      for (let i = 0; i < uint8Array.length; i++) {
        if (Math.random() < corruption) {
          if (Math.random() < 0.2) {
            uint8Array[i] ^= Math.random() * 256;
            info.xor++;
          } else {
            uint8Array[i]++;
            info.add++;
          }
        }
      }
      return [newArrayBuffer, info];
    },
    [corruption]
  );

  const restartNessie = React.useCallback(() => {
    const arrayBuffer = arrayBufferRef.current;
    if (!arrayBuffer) return;
    const [newArrayBuffer, info] = corruptArrayBuffer(arrayBuffer);
    setCorruptionInfo(info);
    bootArrayBuffer(newArrayBuffer);
  }, [corruptArrayBuffer]);

  const handleLoad = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const romArrayBuffer = await file.arrayBuffer();
      localStorage.setItem("nessu-last-rom", b64ab.encode(romArrayBuffer));
      arrayBufferRef.current = romArrayBuffer;
      restartNessie();
    },
    []
  );

  React.useEffect(() => {
    const lastData = localStorage.getItem("nessu-last-rom");
    if (lastData) {
      arrayBufferRef.current = b64ab.decode(lastData);
      restartNessie();
    }
  }, []);

  return (
    <div className="App">
      <div className="controls">
        <div>
          Select a NES ROM file:&nbsp;
          <input type="file" onChange={handleLoad} />
        </div>
        <div>
          Corruption factor:
          <input
            type="range"
            min={0}
            max={0.1}
            step={0.000001}
            value={corruption}
            onChange={(e) => setCorruption(e.target.valueAsNumber)}
          />
          {(corruption * 100).toPrecision(2)}%
        </div>
        <div>{JSON.stringify(corruptionInfo)}</div>
        <button onClick={restartNessie}>Restart</button>
      </div>
      <div className="display">
        <canvas
          ref={nesCanvasRef}
          width="256"
          height="240"
          style={{
            width: "768px",
            imageRendering: "pixelated",
          }}
        />
        Controls: arrows / A / B / space (start)
      </div>
    </div>
  );
}

export default App;
