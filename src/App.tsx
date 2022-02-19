import React from "react";
import * as b64ab from "base64-arraybuffer";
import useNessie from "./useNessie";
import Rand, { PRNG } from "rand-seed";

import "./App.css";

type CorruptionInfo = Record<any, any>;

function corruptArrayBuffer(
  corruption: number,
  seed: string,
  arrayBuffer: ArrayBuffer
): [ArrayBuffer, CorruptionInfo] {
  const rand = new Rand(seed, PRNG.xoshiro128ss);
  const info = { corruption, seed, xor: 0, add: 0 };
  const newArrayBuffer = arrayBuffer.slice(0);
  const uint8Array = new Uint8Array(newArrayBuffer);
  for (let i = 0; i < uint8Array.length; i++) {
    if (rand.next() < corruption) {
      if (rand.next() < 0.2) {
        uint8Array[i] ^= rand.next() * 256;
        info.xor++;
      } else {
        uint8Array[i]++;
        info.add++;
      }
    }
  }
  return [newArrayBuffer, info];
}

function generateSeed() {
  return String(Math.floor(+new Date()));
}

function App() {
  const nesCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const arrayBufferRef = React.useRef<ArrayBuffer | null>(null);
  const [rawCorruption, setRawCorruption] = React.useState(0.1);
  const corruption = Math.pow(rawCorruption, 3) * 0.1;
  const [corruptionInfo, setCorruptionInfo] = React.useState<CorruptionInfo>(
    {}
  );
  const [seed, setSeed] = React.useState(generateSeed);
  const { bootArrayBuffer } = useNessie(nesCanvasRef);

  const restartNessie = React.useCallback(
    (corruption: number, seed: string) => {
      const arrayBuffer = arrayBufferRef.current;
      if (!arrayBuffer) return;
      const [newArrayBuffer, info] = corruptArrayBuffer(
        corruption,
        seed,
        arrayBuffer
      );
      setCorruptionInfo(info);
      bootArrayBuffer(newArrayBuffer);
    },
    []
  );

  const restartNessieWithCurrentSettings = React.useCallback(() => {
    restartNessie(corruption, seed);
  }, [corruption, seed]);

  const reseedAndRestartNessie = React.useCallback(() => {
    const newSeed = generateSeed();
    setSeed(newSeed);
    restartNessie(corruption, newSeed);
  }, [corruption]);

  const handleLoad = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const romArrayBuffer = await file.arrayBuffer();
      localStorage.setItem("nessu-last-rom", b64ab.encode(romArrayBuffer));
      arrayBufferRef.current = romArrayBuffer;
      restartNessieWithCurrentSettings();
    },
    []
  );

  React.useEffect(() => {
    const lastData = localStorage.getItem("nessu-last-rom");
    if (lastData) {
      arrayBufferRef.current = b64ab.decode(lastData);
      restartNessieWithCurrentSettings();
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
          Seed:
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
        </div>
        <div>
          Corruption factor: {(corruption * 100).toPrecision(2)}%
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={rawCorruption}
            onChange={(e) => setRawCorruption(e.target.valueAsNumber)}
          />
        </div>
        <div className="buttons">
          <button onClick={reseedAndRestartNessie}>Reseed & restart</button>
          <button onClick={restartNessieWithCurrentSettings}>Restart</button>
        </div>
      </div>
      <div className="corruption-info">
        {JSON.stringify(corruptionInfo, null, 2)}
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
