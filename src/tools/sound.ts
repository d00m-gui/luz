/**
 * luz sound — synthesized UI feedback via Web Audio API.
 * No external files/samples: everything is oscillators + noise buffers
 * generated at runtime, same spirit as usefoley.dev.
 * Opt-in: nothing plays unless `enabled` is explicitly true.
 */

export type SoundEvent =
  | "click"
  | "hover"
  | "success"
  | "error"
  | "toggle"
  | "pop"
  | "whoosh"
  | "thunder"
  | "type"
  | "slide"
  | "snap"
  | "check"
  | "radio";

/** One synthesized sound: given a live AudioContext + volume + pitch multiplier, schedule it. */
export type SoundDef = (
  ctx: AudioContext,
  volume: number,
  pitch: number,
) => void;

export interface LuzSoundConfig {
  /** Master switch. Default `false` — opt-in. */
  enabled?: boolean;
  /** 0–1 master volume. Default `0.25`. */
  volume?: number;
  /** Override or add presets per event. */
  events?: Partial<Record<SoundEvent, SoundDef>>;
}

//  Audio context — created lazily on first play, reused after.
// Browsers require a user gesture before audio can start; `playSound` is
// only ever called from event handlers (click/hover/etc.), so that's satisfied.
let sharedCtx: AudioContext | null = null;

function getContext(): AudioContext {
  sharedCtx ??= new AudioContext();
  if (sharedCtx.state === "suspended") void sharedCtx.resume();
  return sharedCtx;
}

function noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const buffer = ctx.createBuffer(
    1,
    Math.max(1, Math.floor(ctx.sampleRate * seconds)),
    ctx.sampleRate,
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** Small random multiplier so repeated plays of the same event don't sound identical. */
function jitter(amount = 0.05): number {
  return 1 + (Math.random() * 2 - 1) * amount;
}

/** Short oscillator blip with an exponential decay envelope. `pitch` scales frequency. */
function tone(
  ctx: AudioContext,
  volume: number,
  pitch: number,
  opts: {
    freq?: number;
    slideTo?: number;
    duration?: number;
    wave?: OscillatorType;
  } = {},
): void {
  const { freq = 440, slideTo, duration = 0.12, wave = "sine" } = opts;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq * pitch, now);
  if (slideTo)
    osc.frequency.exponentialRampToValueAtTime(slideTo * pitch, now + duration);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

//  Built-in presets — one synthesized sound per UI event. `pitch` folds in
// both the caller's variant (e.g. a button's className) and jitter.
const presets: Record<SoundEvent, SoundDef> = {
  click: (ctx, volume, pitch) =>
    tone(ctx, volume, pitch, { freq: 700, duration: 0.05, wave: "square" }),
  hover: (ctx, volume, pitch) =>
    tone(ctx, volume * 0.5, pitch, { freq: 900, duration: 0.03, wave: "sine" }),
  success: (ctx, volume, pitch) =>
    tone(ctx, volume, pitch, {
      freq: 520,
      slideTo: 900,
      duration: 0.18,
      wave: "sine",
    }),
  error: (ctx, volume, pitch) =>
    tone(ctx, volume, pitch, {
      freq: 220,
      slideTo: 110,
      duration: 0.22,
      wave: "sawtooth",
    }),
  toggle: (ctx, volume, pitch) =>
    tone(ctx, volume, pitch, { freq: 600, duration: 0.06, wave: "triangle" }),

  // Pop — subtle notification-appear blip. Quick, soft, slight downward slide.
  pop: (ctx, volume, pitch) =>
    tone(ctx, volume * 0.6, pitch, {
      freq: 900,
      slideTo: 600,
      duration: 0.07,
      wave: "sine",
    }),

  // Whoosh — notification-dismiss swoosh. Bandpassed noise sweeping down.
  whoosh: (ctx, volume, pitch) => {
    const now = ctx.currentTime;
    const duration = 0.3;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, duration);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(2200 * pitch, now);
    filter.frequency.exponentialRampToValueAtTime(300 * pitch, now + duration);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(now);
  },

  // Type — mechanical-keyboard keystroke. Cherry MX Red character: linear
  // switch, no click bump, so it's a deep low "thock" (body tone) plus a
  // brief low-passed noise transient (texture) — no bright/clicky top end.
  type: (ctx, volume, pitch) => {
    const now = ctx.currentTime;
    const duration = 0.05;

    const body = ctx.createOscillator();
    body.type = "sine";
    body.frequency.setValueAtTime(160 * pitch, now);
    body.frequency.exponentialRampToValueAtTime(90 * pitch, now + duration);
    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(volume * 0.7, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    body.connect(bodyGain).connect(ctx.destination);
    body.start(now);
    body.stop(now + duration);

    const textureDuration = 0.02;
    const texture = ctx.createBufferSource();
    texture.buffer = noiseBuffer(ctx, textureDuration);
    const textureFilter = ctx.createBiquadFilter();
    textureFilter.type = "lowpass";
    textureFilter.frequency.setValueAtTime(1200 * pitch, now);
    const textureGain = ctx.createGain();
    textureGain.gain.setValueAtTime(volume * 0.3, now);
    textureGain.gain.exponentialRampToValueAtTime(0.001, now + textureDuration);
    texture
      .connect(textureFilter)
      .connect(textureGain)
      .connect(ctx.destination);
    texture.start(now);
  },

  // Check — checkbox tick. Quick rising slide when checked; pass a lower
  // `pitch` (see the global checkbox listener) to shift the whole contour
  // down for unchecking, so check/uncheck read as opposites.
  check: (ctx, volume, pitch) =>
    tone(ctx, volume, pitch, {
      freq: 500,
      slideTo: 750,
      duration: 0.05,
      wave: "triangle",
    }),

  // Radio — single flat blip, no slide, distinct from the checkbox's rise.
  radio: (ctx, volume, pitch) =>
    tone(ctx, volume, pitch, { freq: 650, duration: 0.045, wave: "sine" }),

  // Slide — range-input step. Quiet, quick pure tone; `pitch` carries the
  // actual note (see `pitchFromNoteIndex` in with-sound.tsx), jitter just
  // adds a touch of acoustic variation on top of it.
  slide: (ctx, volume, pitch) =>
    tone(ctx, volume * 0.5, pitch, {
      freq: 440,
      duration: 0.06,
      wave: "triangle",
    }),

  // Snap — tab-switch detent. Crisp, very short, highpassed noise — a
  // mechanical "click into place" distinct from the softer `click` blip.
  snap: (ctx, volume, pitch) => {
    const now = ctx.currentTime;
    const duration = 0.035;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, duration);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(3000 * pitch, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(now);
  },

  // Thunder: a bright noise "crack" (the strike) followed by a long
  // low-passed noise "rumble" whose filter closes over time (the roll).
  thunder: (ctx, volume, pitch) => {
    const now = ctx.currentTime;

    // Crack — short, bright, fast decay.
    const crackDuration = 0.15;
    const crack = ctx.createBufferSource();
    crack.buffer = noiseBuffer(ctx, crackDuration);
    const crackFilter = ctx.createBiquadFilter();
    crackFilter.type = "highpass";
    crackFilter.frequency.setValueAtTime(4000 * pitch, now);
    crackFilter.frequency.exponentialRampToValueAtTime(
      700 * pitch,
      now + crackDuration,
    );
    const crackGain = ctx.createGain();
    crackGain.gain.setValueAtTime(volume, now);
    crackGain.gain.exponentialRampToValueAtTime(0.001, now + crackDuration);
    crack.connect(crackFilter).connect(crackGain).connect(ctx.destination);
    crack.start(now);

    // Rumble — long, low, slow swell then decay, filter darkens over time.
    const rumbleDuration = 2.8;
    const rumbleStart = now + 0.07;
    const rumble = ctx.createBufferSource();
    rumble.buffer = noiseBuffer(ctx, rumbleDuration);
    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = "lowpass";
    rumbleFilter.Q.value = 0.8;
    rumbleFilter.frequency.setValueAtTime(1000 * pitch, rumbleStart);
    rumbleFilter.frequency.linearRampToValueAtTime(
      90 * pitch,
      rumbleStart + rumbleDuration,
    );
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0, rumbleStart);
    rumbleGain.gain.linearRampToValueAtTime(volume * 0.8, rumbleStart + 0.25);
    rumbleGain.gain.exponentialRampToValueAtTime(
      0.001,
      rumbleStart + rumbleDuration,
    );
    rumble.connect(rumbleFilter).connect(rumbleGain).connect(ctx.destination);
    rumble.start(rumbleStart);
  },
};

/**
 * Play a synthesized UI sound. No-op unless `config.enabled` is `true`
 * (opt-in) — safe to call unconditionally from event handlers.
 *
 * `pitch` is a frequency multiplier (1 = unchanged) — pass a variant's
 * pitch (e.g. derived from a button's className) to make the same event
 * sound different across contexts. A small random jitter is always folded
 * in on top so repeated plays never sound perfectly identical.
 */
export function playSound(
  event: SoundEvent,
  config?: LuzSoundConfig,
  pitch = 1,
): void {
  if (!config?.enabled) return;
  const def = config.events?.[event] ?? presets[event];
  if (!def) return;
  def(getContext(), config.volume ?? 0.25, pitch * jitter());
}
