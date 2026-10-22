export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary);
}

export function base64ToPcm16(value: string): Int16Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Int16Array(bytes.buffer);
}

export class PcmPlayer {
  private cursor = 0;
  private sources = new Set<AudioBufferSourceNode>();

  constructor(
    private readonly context: AudioContext,
    private readonly sampleRate = 24000,
  ) {}

  enqueue(base64Audio: string) {
    const pcm = base64ToPcm16(base64Audio);
    const audioBuffer = this.context.createBuffer(1, pcm.length, this.sampleRate);
    const channel = audioBuffer.getChannelData(0);
    for (let index = 0; index < pcm.length; index += 1) {
      channel[index] = pcm[index] / 0x8000;
    }

    const source = this.context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.context.destination);
    source.addEventListener("ended", () => this.sources.delete(source));

    const now = this.context.currentTime;
    if (this.cursor < now) this.cursor = now + 0.025;
    source.start(this.cursor);
    this.cursor += audioBuffer.duration;
    this.sources.add(source);
  }

  clear() {
    for (const source of this.sources) {
      try {
        source.stop();
      } catch {
        // Already stopped.
      }
    }
    this.sources.clear();
    this.cursor = this.context.currentTime;
  }
}
