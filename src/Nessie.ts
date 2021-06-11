import { WasmNes, Button } from "./nes-rust";

const keymap: Record<string, Button> = {
  Space: Button.Start,
  ArrowLeft: Button.Joypad1Left,
  ArrowRight: Button.Joypad1Right,
  ArrowUp: Button.Joypad1Up,
  ArrowDown: Button.Joypad1Down,
  KeyA: Button.Joypad1A,
  KeyB: Button.Joypad1B,
  KeyR: Button.Reset,
  KeyS: Button.Select,
};

export default class Nessie {
  private readonly canvas: HTMLCanvasElement;
  private readonly nes: WasmNes;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly imageData: ImageData;
  private readonly pixels: Uint8Array;
  private readonly audioContext: AudioContext;
  private lastUpdateTime: number = 0;
  private UPDATE_RATE: number = 1000 / 60;

  constructor(canvas: HTMLCanvasElement, rom: ArrayBuffer) {
    this.canvas = canvas;
    this.audioContext = this.setupAudio();
    this.nes = WasmNes.new();
    this.nes.set_rom(new Uint8Array(rom));

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
      const data = e.outputBuffer.getChannelData(0);
      this.nes.update_sample_buffer(data);
      for (let i = 0; i < data.length; i++) {
        data[i] *= 0.6;
      }
    };
    scriptProcessor.connect(context.destination);
    return context;
  }

  public boot() {
    this.nes.bootup();
  }

  public stop() {
    this.nes.free();
    void this.audioContext.close();
  }

  public handleKeyEvent = (event: Event) => {
    const button = keymap[(event as KeyboardEvent).code];
    if (!button) {
      return false;
    }
    if (event.type === "keydown") {
      this.nes.press_button(button);
    } else {
      this.nes.release_button(button);
    }
    return true;
  };

  stepFrame = (timestamp: number) => {
    if (timestamp - this.lastUpdateTime < this.UPDATE_RATE) return;
    this.lastUpdateTime = timestamp;
    this.nes.step_frame();
    this.nes.update_pixels(this.pixels);
    this.ctx.putImageData(this.imageData, 0, 0);
    // requestAnimationFrame(stepFrame);
  };
}
