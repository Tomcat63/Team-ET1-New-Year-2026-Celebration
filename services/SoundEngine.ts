
/**
 * SoundEngine v1.1
 * Nutzt einen geteilten globalen Kontext für maximale Kompatibilität nach User-Interaktion.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx) {
      // Prüfen ob App.tsx bereits einen Kontext auf window._fireworkAudioCtx erstellt hat
      if ((window as any)._fireworkAudioCtx) {
        this.ctx = (window as any)._fireworkAudioCtx;
      } else {
        const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioCtx();
        (window as any)._fireworkAudioCtx = this.ctx;
      }
    }
    
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playExplosion(variation: number = 1.0) {
    const ctx = this.initContext();
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const pitch = 0.8 + Math.random() * 0.4 * variation;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(40 * pitch, now + 0.15);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.5);

    this.playCrackle(ctx, now, pitch);
  }

  private playCrackle(ctx: AudioContext, time: number, pitch: number) {
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000 * pitch;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    source.start(time);
  }

  public playLaunch() {
    const ctx = this.initContext();
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.08);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.08);
  }
}

export const soundEngine = new SoundEngine();
