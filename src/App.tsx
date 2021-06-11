import React from "react";
import b64ab from "base64-arraybuffer";
import useNessie from "./useNessie";

function App() {
  const nesCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const { bootArrayBuffer } = useNessie(nesCanvasRef);

  const handleLoad = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const romArrayBuffer = await file.arrayBuffer();
      localStorage.setItem("nessu-last-rom", b64ab.encode(romArrayBuffer));
      bootArrayBuffer(romArrayBuffer);
    },
    []
  );

  React.useEffect(() => {
    const lastData = localStorage.getItem("nessu-last-rom");
    if (lastData) {
      const romArrayBuffer = b64ab.decode(lastData);
      bootArrayBuffer(romArrayBuffer);
    }
  }, []);

  return (
    <div className="App">
      <input type="file" onChange={handleLoad} />
      <hr />
      <canvas
        ref={nesCanvasRef}
        width="256"
        height="240"
        style={{
          width: "768px",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}

export default App;
