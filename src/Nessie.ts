import { WasmNes, Button } from "./nes-rust";

const keymap: Record<string, Button> = {
  Space: Button.Start,
  ArrowLeft: Button.Joypad1Left,
  ArrowRight: Button.Joypad1Right,
  ArrowUp: Button.Joypad1Up,
  ArrowDown: Button.Joypad1Down,
  KeyA: Button.Joypad1A,
  KeyB: Button.Joypad1B,
  // KeyR: Button.Reset,
  KeyS: Button.Select,
};

interface CrashInfo {
  phase: string;
  error: any;
}

export default class Nessie {
  private readonly canvas: HTMLCanvasElement;
  private readonly nes: WasmNes;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly imageData: ImageData;
  private readonly pixels: Uint8Array;
  private readonly audioContext: AudioContext;
  private lastUpdateTime: number = 0;
  private UPDATE_RATE: number = 1000 / 60;
  private crash: CrashInfo | null = null;

  constructor(canvas: HTMLCanvasElement, rom: ArrayBuffer) {
    this.canvas = canvas;
    this.audioContext = this.setupAudio();
    this.nes = WasmNes.new();
    try {
      this.nes.set_rom(new Uint8Array(rom));
    } catch (error) {
      this.crash = { phase: "load", error };
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("oh no");
    this.ctx = ctx;
    this.imageData = ctx.createImageData(256, 240);
    this.pixels = new Uint8Array(this.imageData.data.buffer);
  }

  private setupAudio() {
    const context = new AudioContext({ sampleRate: 44100 });
    const bufferLength = 4096;
    const scriptProcessor = context.createScriptProcessor(bufferLength, 0, 1);
    scriptProcessor.onaudioprocess = (e) => {
      if (this.crash) return;
      const data = e.outputBuffer.getChannelData(0);
      try {
        this.nes.update_sample_buffer(data);
      } catch (error) {
        this.crash = { phase: "audio", error };
      }
      for (let i = 0; i < data.length; i++) {
        data[i] *= 0.6;
      }
    };
    scriptProcessor.connect(context.destination);
    return context;
  }

  public boot() {
    for (let i = 0; i < this.pixels.length; i++) {
      this.pixels[i] = i % 4 == 3 ? 255 : i % 256;
    }
    this.ctx.putImageData(this.imageData, 0, 0);
    try {
      this.nes.bootup();
    } catch (error) {
      this.crash = { phase: "boot", error };
    }
  }

  public stop() {
    void this.audioContext.close();
    if (!this.crash) {
      try {
        this.nes.free();
      } catch (error) {
        this.crash = { phase: "stop", error };
      }
    }
  }

  public handleKeyEvent = (event: Event) => {
    const button = keymap[(event as KeyboardEvent).code];
    if (!button || this.crash) {
      return false;
    }
    if (event.type === "keydown") {
      this.nes.press_button(button);
    } else {
      this.nes.release_button(button);
    }
    this.audioContext.resume();
    return true;
  };

  stepFrame = (timestamp: number) => {
    if (timestamp - this.lastUpdateTime < this.UPDATE_RATE) return;
    this.lastUpdateTime = timestamp;
    if (!this.crash) {
      try {
        this.nes.step_frame();
        this.nes.update_pixels(this.pixels);
      } catch (error) {
        this.crash = { phase: "exec", error };
      }
    } else {
      for (let i = 0; i < 256; i++) {
        const off = Math.floor(Math.random() * (this.pixels.length - 1));
        const a = this.pixels[off];
        this.pixels[off] = this.pixels[off] + 1;
        this.pixels[off] = a + 1;
      }
    }
    this.ctx.putImageData(this.imageData, 0, 0);
  };
}
