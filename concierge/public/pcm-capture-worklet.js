class ConciergePcmCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.pending = [];
    this.outputRate = 24000;
    this.chunkSamples = 480;
    this.readPosition = 0;
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel?.length) return true;

    const ratio = sampleRate / this.outputRate;
    while (this.readPosition < channel.length) {
      const index = Math.floor(this.readPosition);
      const next = Math.min(index + 1, channel.length - 1);
      const mix = this.readPosition - index;
      const sample = channel[index] + (channel[next] - channel[index]) * mix;
      this.pending.push(Math.max(-1, Math.min(1, sample)));
      this.readPosition += ratio;
    }
    this.readPosition -= channel.length;

    while (this.pending.length >= this.chunkSamples) {
      const buffer = new ArrayBuffer(this.chunkSamples * 2);
      const view = new DataView(buffer);
      for (let index = 0; index < this.chunkSamples; index += 1) {
        const sample = this.pending[index];
        view.setInt16(index * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      }
      this.pending.splice(0, this.chunkSamples);
      this.port.postMessage(buffer, [buffer]);
    }

    return true;
  }
}

registerProcessor("concierge-pcm-capture", ConciergePcmCapture);
