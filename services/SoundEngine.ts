
/**
 * SoundEngine v1.0
 * Synthetisiert Feuerwerk-Effekte in Echtzeit ohne externe Audio-Assets.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;

  constructor() {
    // Initialisierung erfolgt erst nach User-Interaktion (Browser-Policy)
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Erzeugt einen tiefen Bass-Boom für die Explosion
   */
  public playExplosion(variation: number = 1.0) {
    const ctx = this.initContext();
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const pitch = 0.8 + Math.random() * 0.4 * variation;

    // 1. Der tiefe "Wumms" (Low-End)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(40 * pitch, now + 0.15);
    
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.5);

    // 2. Das Knistern (High-End Sparkle)
    this.playCrackle(ctx, now, pitch);
  }

  /**
   * Synthetisiert weißes Rauschen für das Knister-Geräusch
   */
  private playCrackle(ctx: AudioContext, time: number, pitch: number) {
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000 * pitch;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    source.start(time);
  }

  /**
   * Ein kurzes "Plopp" beim Abschuss einer Rakete
   */
  public playLaunch() {
    const ctx = this.initContext();
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }
}

export const soundEngine = new SoundEngine();
