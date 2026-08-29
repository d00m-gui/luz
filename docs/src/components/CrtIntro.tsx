import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { LUZ_WORDMARK } from "@/lib/luz-wordmark";

/* ── Easing (verbatim de animations-v3.jsx) ── */
const Easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },
  easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeInOutBack: (t: number) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

type EaseFn = (t: number) => number;

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
}

function interpolate(
  input: number[],
  output: number[],
  ease: EaseFn | EaseFn[] = Easing.linear,
): (t: number) => number {
  return (t: number) => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? ease[i] || Easing.linear : ease;
        const eased = easeFn(local);
        return output[i] + (output[i + 1] - output[i]) * eased;
      }
    }
    return output[output.length - 1];
  };
}

/* ── Escenas (OM_SCENES del bundle). nat === dur → warp identidad. ── */
const SCENES = [
  { name: "Encendido", dur: 1.8 },
  { name: "Estatica", dur: 2.6 },
  { name: "Tracking", dur: 2.4 },
  { name: "Enganche", dur: 2.2 },
  { name: "Reposo", dur: 2.6 },
];

const CUES: Record<string, number> = {};
{
  let acc = 0;
  for (const s of SCENES) {
    if (!(s.name in CUES)) CUES[s.name] = acc;
    acc += s.dur;
  }
}
const TOTAL = SCENES.reduce((n, s) => n + s.dur, 0); // 11.6

const OPT = { glitch: 1, osd: true, phosphor: "cian" } as const;
const PHOSPHOR: Record<string, [number, number, number]> = {
  cian: [0.62, 0.9, 1.0],
  ambar: [1.0, 0.78, 0.42],
  fosforo: [0.55, 1.0, 0.72],
};

/** Resuelve un valor CSS (`var(--x)`, `oklch(...)`) a RGB 0-1 vía el motor de color del navegador. */
function resolveRGB(cssValue: string): [number, number, number] {
  const el = document.createElement("div");
  el.style.color = cssValue;
  document.body.appendChild(el);
  // Chromium devuelve el computed color en el mismo color space que se
  // especificó (ej. "oklch(...)"), no siempre "rgb(...)" — se resuelve a
  // sRGB real pintando 1px en un canvas y leyendo el pixel de vuelta.
  const resolved = getComputedStyle(el).color;
  document.body.removeChild(el);
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [1, 1, 1];
  ctx.fillStyle = resolved;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

const rgbCache = new Map<string, [number, number, number]>();
function getRGB(cssVar: string): [number, number, number] {
  let v = rgbCache.get(cssVar);
  if (!v) {
    v = resolveRGB(`var(${cssVar})`);
    rgbCache.set(cssVar, v);
  }
  return v;
}

/** Gris neutro emergiendo hacia el color de la sección destino (`CATEGORY_HUES`) a medida que `t` avanza. */
function sampleSectionTint(hue: string, t: number): [number, number, number] {
  const from = getRGB("--neutral-500");
  const to = getRGB(`--${hue}-500`);
  const f = tp(t, [0, 0.3, 0.6], [0, 0.3, 1]);
  return [
    from[0] + (to[0] - from[0]) * f,
    from[1] + (to[1] - from[1]) * f,
    from[2] + (to[2] - from[2]) * f,
  ];
}

/* ── GLSL (verbatim) ── */
const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec3 uTint;
uniform float uT, uTrack, uNoise, uChroma, uOpenX, uOpenY, uRoll,
              uBandY, uBandH, uFlash, uBright, uGlow, uSnow, uCurve;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
float nse(vec2 p){ return hash(floor(p)); }

vec2 curve(vec2 uv){
  vec2 c = uv*2.0-1.0;
  vec2 off = abs(c.yx)/vec2(6.0,4.6);
  c += c*off*off;
  return c*0.5+0.5;
}

void main(){
  vec2 uv = mix(vUv, curve(vUv), uCurve);
  vec2 c = uv*2.0-1.0;

  float tick = floor(uT*24.0);
  float line = floor(uv.y*260.0);

  vec2 suv = uv;
  suv.y = fract(suv.y + uRoll);

  float pick = step(0.62, hash(vec2(line*0.13, tick*0.7)));
  suv.x += (nse(vec2(line, tick))-0.5)*0.075*uTrack*pick;

  float dband = abs(fract(suv.y - uBandY + 0.5) - 0.5);
  float b = 1.0 - smoothstep(0.0, max(uBandH, 0.0005), dband);
  float bn = (nse(vec2(line*0.71, tick*1.3))-0.5)*2.0;
  suv.x += b*(0.10*uTrack + 0.035)*bn;
  suv.y += b*0.006*sin(uT*37.0);

  float ca = uChroma + b*0.018;
  vec3 col;
  col.r = texture2D(uTex, clamp(suv + vec2(ca, 0.0), 0.001, 0.999)).r;
  col.g = texture2D(uTex, clamp(suv, 0.001, 0.999)).g;
  col.b = texture2D(uTex, clamp(suv - vec2(ca, 0.0), 0.001, 0.999)).b;

  float g = 0.0;
  for(int i=0;i<8;i++){
    float a = float(i)*0.7853981;
    vec2 o = vec2(cos(a), sin(a))*0.012;
    g += texture2D(uTex, clamp(suv+o, 0.001, 0.999)).g;
  }
  g /= 8.0;
  col += uTint*g*uGlow;

  col *= mix(vec3(1.0), uTint, 0.55);

  float snow = hash(floor(vUv*vec2(720.0,400.0)) + tick*3.7);
  col += (snow-0.5)*uSnow*(0.6 + b*0.9);
  col += (hash(vUv*vec2(1920.0,1080.0)+uT*13.0)-0.5)*uNoise*0.35;

  float hs = 1.0 - smoothstep(0.0, 0.045, uv.y - 0.005);
  col = mix(col, vec3(hash(vec2(floor(vUv.x*220.0), tick*5.0))*0.85), hs*clamp(uTrack*1.2+0.18,0.0,1.0));

  col *= 0.72 + 0.28*abs(sin(uv.y*760.0));
  col *= 0.93 + 0.07*sin(vUv.x*1900.0);

  col += uFlash;

  float ax = 1.0 - smoothstep(uOpenX-0.012, uOpenX+0.012, abs(c.x));
  float ay = 1.0 - smoothstep(uOpenY-0.006, uOpenY+0.006, abs(c.y));
  float vig = 1.0 - 0.55*dot(c*0.72, c*0.72);
  float edge = (1.0 - smoothstep(0.985, 1.0, abs(c.x))) * (1.0 - smoothstep(0.985, 1.0, abs(c.y)));

  col *= ax*ay*vig*edge*uBright;
  col = max(col, vec3(0.0));
  gl_FragColor = vec4(col, 1.0);
}`;

/* ── WebGL + señal ── */
interface GLState {
  gl: WebGLRenderingContext;
  u: Record<string, WebGLUniformLocation | null>;
  tex: WebGLTexture;
  sig: HTMLCanvasElement;
  sigCtx: CanvasRenderingContext2D;
  logo: HTMLImageElement | null;
  bg: string;
  fg: string;
}

function resolveColorVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function makeGL(canvas: HTMLCanvasElement): GLState | null {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) throw new Error("createShader");
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const p = gl.createProgram();
  if (!p) throw new Error("createProgram");
  gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(p);
  gl.useProgram(p);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  // Triángulo único que cubre el viewport (-1..3), sin quad de 2 triángulos.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(p, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  // Textura de la señal: se sube cada frame desde el canvas 2D `sig`.
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const u: Record<string, WebGLUniformLocation | null> = {};
  [
    "uTex", "uT", "uTrack", "uNoise", "uChroma", "uOpenX", "uOpenY", "uRoll",
    "uBandY", "uBandH", "uFlash", "uBright", "uGlow", "uSnow", "uTint", "uCurve",
  ].forEach((n) => (u[n] = gl.getUniformLocation(p, n)));
  gl.uniform1i(u.uTex, 0);
  const sig = document.createElement("canvas");
  sig.width = 1280;
  sig.height = 720;
  const sigCtx = sig.getContext("2d")!;
  const bg = resolveColorVar("--background", "#04060a");
  const fg = resolveColorVar("--foreground", "#eaf6ff");
  return { gl, u, tex, sig, sigCtx, logo: null, bg, fg };
}

interface Params {
  track: number;
  roll: number;
  noise: number;
  snow: number;
  chroma: number;
  openX: number;
  openY: number;
  flash: number;
  bright: number;
  glow: number;
  bandY: number;
  bandH: number;
  logoAlpha: number;
  logoScale: number;
  logoDx: number;
  logoDy: number;
  /** Fracción 0..1 del logo revelada de izquierda a derecha (1 = completo). */
  logoReveal: number;
  osdPlay: number;
  osdTrack: number;
  trackBar: number;
  stamp: string;
}

function drawSignal(
  g: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  p: Params,
  bg: string,
  fg: string,
  sectionName?: string,
) {
  g.fillStyle = bg;
  g.fillRect(0, 0, g.canvas.width, g.canvas.height);
  if (logo && logo.complete && logo.naturalWidth) {
    const h = 470 * p.logoScale;
    const w = h;
    g.save();
    g.globalAlpha = p.logoAlpha;
    g.translate(640 + p.logoDx, 348 + p.logoDy);
    if (p.logoReveal < 1) {
      g.beginPath();
      g.rect(-w / 2, -h / 2, w * clamp(p.logoReveal, 0, 1), h);
      g.clip();
    }
    g.drawImage(logo, -w / 2, -h / 2, w, h);
    g.restore();
  }
  g.font = "600 26px ui-monospace, 'SFMono-Regular', Menlo, monospace";
  g.textBaseline = "top";
  if (p.osdPlay > 0) {
    g.globalAlpha = p.osdPlay;
    g.fillStyle = fg;
    g.fillText("▶ PLAY", 62, 56);
    g.fillText("SP", 62, 92);
    g.textAlign = "right";
    g.fillText(p.stamp, 1218, 56);
    g.textAlign = "left";
  }
  if (p.osdTrack > 0) {
    g.globalAlpha = p.osdTrack;
    g.fillStyle = fg;
    g.fillText("TRACKING", 62, 600);
    const x0 = 62, y = 642, seg = 22, gap = 8, n = 12;
    for (let i = 0; i < n; i++) {
      const on = i < Math.round(p.trackBar * n);
      g.globalAlpha = p.osdTrack * (on ? 1 : 0.22);
      g.fillRect(x0 + i * (seg + gap), y, seg, 16);
    }
  }
  if (sectionName && p.logoAlpha > 0) {
    // Reusa logoAlpha — el nombre entra/sale junto con el logo.
    g.globalAlpha = p.logoAlpha;
    g.fillStyle = fg;
    g.font = "700 32px ui-monospace, 'SFMono-Regular', Menlo, monospace";
    g.textAlign = "left";
    g.fillText(`${sectionName}`, 62, 56);
  }
  g.globalAlpha = 1;
}

const ip = (T: number, xs: number[], ys: number[], e?: EaseFn) =>
  interpolate(xs, ys, e || Easing.easeInOutQuad)(T);

function params(T: number): Params {
  const C = CUES;
  const off = TOTAL - 0.55; // apagado, seam negro del loop
  const track = ip(T,
    [C.Estatica, C.Tracking, C.Tracking + 1.4, C.Enganche + 0.5, C.Reposo + 0.8, C.Reposo + 1.0, C.Reposo + 1.25, off],
    [1.0, 0.92, 0.45, 0.06, 0.03, 0.34, 0.02, 0.35]);
  const roll = interpolate(
    [0, C.Estatica, C.Estatica + 0.9, C.Tracking, C.Tracking + 0.8, C.Tracking + 1.6, C.Enganche, C.Enganche + 0.45, C.Enganche + 0.9, TOTAL],
    [0, 0.55, 1.45, 2.05, 2.60, 2.93, 3.06, 3.13, 3.0, 3.0],
    Easing.linear)(T);
  const lock = clamp((T - C.Enganche) / 1.1, 0, 1);
  const gx = OPT.glitch;
  return {
    track: track * gx,
    roll,
    noise: ip(T, [0, C.Estatica, C.Enganche, C.Reposo, off, off + 0.2], [0.4, 0.5, 0.12, 0.07, 0.07, 0.14]),
    snow: gx * ip(T, [C.Encendido + 0.4, C.Estatica, C.Tracking + 1.2, C.Enganche + 0.7, off - 0.15, off + 0.1], [0.75, 0.6, 0.24, 0.035, 0.035, 0.12]),
    chroma: ip(T, [C.Estatica, C.Enganche, C.Enganche + 1.0], [0.014, 0.010, 0.0018]) * (0.4 + 0.6 * gx),
    openX: ip(T, [0.06, 0.3], [0.0, 1.0], Easing.easeOutQuart) * (T < off ? 1 : ip(T, [off + 0.28, TOTAL - 0.02], [1, 0.0], Easing.easeInQuart)),
    openY: T < off
      ? ip(T, [0.12, 0.3, 0.62, 1.35], [0.0, 0.010, 0.010, 1.0], Easing.easeOutCubic)
      : ip(T, [off, off + 0.26], [1.0, 0.006], Easing.easeInQuart),
    flash: ip(T, [0.08, 0.2, 0.5], [0.0, 0.5, 0.0], Easing.easeOutQuad)
      + ip(T, [C.Enganche - 0.06, C.Enganche + 0.05, C.Enganche + 0.5], [0, 0.32, 0], Easing.easeOutQuad)
      + (T > off ? ip(T, [off + 0.1, off + 0.28, off + 0.45], [0, 0.85, 0.0], Easing.easeOutQuad) : 0),
    bright: ip(T, [0, 0.1, 0.6, C.Enganche, C.Enganche + 0.8], [0, 0.85, 1.0, 1.0, 1.12]),
    glow: ip(T, [C.Estatica, C.Enganche, C.Enganche + 0.9, TOTAL], [0.12, 0.25, 0.85, 0.7])
      + Math.sin(T * 1.7) * 0.03 * lock,
    bandY: (((0.82 - T * 0.33) % 1) + 1) % 1,
    bandH: ip(T, [C.Estatica, C.Tracking + 1.2, C.Enganche + 0.6], [0.17, 0.09, 0.004]),
    logoAlpha: ip(T, [C.Estatica - 0.3, C.Estatica + 0.4, C.Tracking + 0.9, C.Enganche + 0.6], [0, 0.45, 0.8, 1]),
    logoScale: 1 + 0.055 * (1 - lock) + 0.012 * Math.sin(T * 0.9),
    logoDx: (1 - lock) * 26 * Math.sin(T * 2.3),
    logoDy: 0,
    logoReveal: 1,
    osdPlay: (OPT.osd ? 1 : 0) * ip(T, [C.Estatica - 0.4, C.Estatica + 0.2], [0, 1]) * (Math.floor(T * 2) % 8 === 7 ? 0.35 : 1),
    osdTrack: (OPT.osd ? 1 : 0) * ip(T, [C.Tracking - 0.25, C.Tracking + 0.15, C.Enganche + 0.55, C.Enganche + 0.9], [0, 1, 1, 0]),
    trackBar: clamp((T - C.Tracking) / (C.Enganche - C.Tracking), 0, 1),
    stamp: "0:" + String(Math.floor(T + 12)).padStart(2, "0"),
  };
}

const tp = (t: number, xs: number[], ys: number[], e?: EaseFn) =>
  interpolate(xs, ys, e || Easing.easeInOutQuad)(t);

/** Posición/escala de reposo del logo dentro del canvas grande — esquina superior derecha, badge permanente. */
const DOCK_SCALE = 0.17;
const DOCK_X = 1170;
const DOCK_Y = 60;

/**
 * Timeline propia del modo "transition" — `t` 0..1 recorre toda la duración,
 * independiente de las escenas de `params()` (usadas solo por "intro").
 * Burst corto de estática/tracking (look "cambio de canal"), sin dibujar el
 * logo hasta que empieza a resolver — antes quedaba ilegible mezclado con
 * el caos. Logo queda centrado y grande todo el burst — el badge chico de
 * `dockedParams()` es un elemento aparte que aparece después.
 */
function transitionParams(t: number): Params {
  return {
    track: tp(t, [0, 0.28, 0.55, 1], [0.85, 0.5, 0.05, 0.02], Easing.easeOutQuad),
    roll: 0, // logo/texto quietos — sin barrido vertical
    noise: tp(t, [0, 0.3, 0.6, 1], [0.35, 0.22, 0.06, 0.02]),
    snow: tp(t, [0, 0.25, 0.55, 1], [0.45, 0.28, 0.04, 0.02]),
    chroma: tp(t, [0, 0.3, 0.6, 1], [0.02, 0.014, 0.003, 0.0015]),
    openX: 1,
    openY: 1,
    flash:
      tp(t, [0, 0.14, 0.28], [0, 0.16, 0], Easing.easeOutQuad) +
      tp(t, [0.3, 0.42, 0.58], [0, 0.2, 0], Easing.easeOutQuad),
    bright: tp(t, [0, 0.15, 0.4], [0.75, 0.92, 1.05]),
    glow: tp(t, [0, 0.3, 0.45, 0.65, 1], [0.15, 0.35, 0.6, 0.4, 0.55]),
    bandY: 0.75 - t * 0.9,
    bandH: tp(t, [0, 0.25, 0.55], [0.22, 0.12, 0.005]),
    logoAlpha: tp(t, [0, 0.22, 0.42, 0.6], [0, 0, 0.85, 1]),
    logoScale: 1,
    logoDx: 0,
    logoDy: 0,
    logoReveal: 1,
    osdPlay: 0,
    osdTrack: 0,
    trackBar: 0,
    stamp: "",
  };
}

/**
 * Estado de reposo del badge permanente — logo chico en la esquina del
 * canvas grande (mismo tamaño que el burst, para que la viñeta se vea en
 * toda `.content`). `reveal` anima el logo escribiéndose de izquierda a
 * derecha al aparecer.
 */
function dockedParams(reveal: number): Params {
  return {
    track: 0,
    roll: 0,
    noise: 0.02,
    snow: 0.02,
    chroma: 0.0015,
    openX: 1,
    openY: 1,
    flash: 0,
    bright: 0.7,
    glow: 0.22,
    bandY: 0,
    bandH: 0,
    logoAlpha: 1,
    logoScale: DOCK_SCALE,
    logoDx: DOCK_X - 640,
    logoDy: DOCK_Y - 348,
    logoReveal: reveal,
    osdPlay: 0,
    osdTrack: 0,
    trackBar: 0,
    stamp: "",
  };
}

function drawFrame(
  s: GLState,
  canvas: HTMLCanvasElement,
  P: Params,
  T: number,
  tint: readonly [number, number, number],
  timing: Pick<ModeTiming, "showLogo" | "showOsd">,
  curveAmount: number,
  sectionName?: string,
) {
  if (!timing.showLogo) P.logoAlpha = 0;
  if (!timing.showOsd) {
    P.osdPlay = 0;
    P.osdTrack = 0;
  }
  // Redibuja la señal en el canvas 2D y la sube como textura del frame actual.
  drawSignal(s.sigCtx, s.logo, P, s.bg, s.fg, timing.showLogo ? sectionName : undefined);
  const { gl, u } = s;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.bindTexture(gl.TEXTURE_2D, s.tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, s.sig);
  // NaN/Infinity haría que WebGL ignore el uniform entero — se sanea antes de subir.
  const f = (v: number) => (Number.isFinite(v) ? v : 0);
  gl.uniform1f(u.uT, f(T));
  gl.uniform1f(u.uTrack, f(P.track));
  gl.uniform1f(u.uNoise, f(P.noise));
  gl.uniform1f(u.uChroma, f(P.chroma));
  gl.uniform1f(u.uOpenX, f(P.openX));
  gl.uniform1f(u.uOpenY, f(P.openY));
  gl.uniform1f(u.uRoll, f(P.roll ?? 0));
  gl.uniform1f(u.uBandY, f(P.bandY));
  gl.uniform1f(u.uBandH, f(P.bandH));
  gl.uniform1f(u.uFlash, f(P.flash));
  gl.uniform1f(u.uBright, f(P.bright));
  gl.uniform1f(u.uGlow, f(P.glow));
  gl.uniform1f(u.uSnow, f(P.snow));
  gl.uniform1f(u.uCurve, f(curveAmount));
  gl.uniform3f(u.uTint, tint[0], tint[1], tint[2]);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

/** Renderiza el wordmark de luz a un data URL SVG y lo carga en `st.logo`. */
function loadLogo(st: GLState, onReady?: () => void) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LUZ_WORDMARK.viewBox}" width="1024" height="1024">` +
    `<g transform="${LUZ_WORDMARK.transform}"><path fill="${st.fg}" d="${LUZ_WORDMARK.d}"/></g></svg>`;
  const img = new Image();
  img.onload = () => {
    st.logo = img;
    onReady?.();
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ── Modos: cómo mapear tiempo real (rAF) a tiempo virtual T de la coreografía ── */
export type CrtIntroMode = "intro" | "transition";

interface ModeTiming {
  /** T virtual (seg, dentro de la línea de tiempo de SCENES) al que corresponde elapsed=0. */
  virtualOffset: number;
  /** Tope de T virtual — una vez alcanzado, el frame se mantiene congelado ahí. */
  maxVirtualT: number;
  /** Segundos reales transcurridos a partir de los cuales se dispara finish(). */
  triggerSeconds: number;
  /** Duración del fade de salida (debe matchear la transition CSS del overlay). */
  exitMs: number;
  /** Si se dibuja el logo (con la curva de logoAlpha ya calculada por params()). */
  showLogo: boolean;
  /** Si se dibuja el OSD clásico ("▶ PLAY" / "TRACKING" / stamp / trackbar). */
  showOsd: boolean;
}

const EXIT_MS = 900; // fade de salida del modo "intro" (original)
const END_TRIGGER = TOTAL + 0.4; // "intro": mantener negro antes de revelar, luego salir

const TRANSITION_DURATION_S = 1.0;
const TRANSITION_EXIT_MS = 220;

function getModeTiming(mode: CrtIntroMode): ModeTiming {
  if (mode === "intro") {
    return {
      virtualOffset: 0,
      maxVirtualT: TOTAL,
      triggerSeconds: END_TRIGGER,
      exitMs: EXIT_MS,
      showLogo: true,
      showOsd: true,
    };
  }
  return {
    virtualOffset: 0,
    maxVirtualT: TRANSITION_DURATION_S,
    triggerSeconds: TRANSITION_DURATION_S,
    exitMs: TRANSITION_EXIT_MS,
    showLogo: true,
    showOsd: false,
  };
}

export interface CrtIntroProps {
  /** "intro": secuencia completa (~12s). "transition": burst corto (~600ms). */
  mode: CrtIntroMode;
  /** Nombre de la sección/página destino — "CH {sectionName}", esquina superior izquierda en modo "transition". */
  sectionName?: string;
  /** Hue (`CATEGORY_HUES`) de la sección destino — tiñe el color-shift en modo "transition". */
  hue?: string;
  /** Se llama una vez terminado el fade de salida, justo antes de desmontarse (retorna null). */
  onDone?: () => void;
}

export function CrtIntro({ mode, sectionName, hue = "neutral", onDone }: CrtIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GLState | null>(null);
  const finishRef = useRef(false);
  const timing = getModeTiming(mode);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  // Init GL + cargar logo (orden importa: logo va al estado GL ya creado).
  // Ambos modos cargan el logo ahora — "transition" también lo dibuja.
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const st = makeGL(cv);
    if (!st) return;
    stateRef.current = st;
    if (timing.showLogo) loadLogo(st);
    return () => {
      stateRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const finish = () => {
    if (finishRef.current) return;
    finishRef.current = true;
    setExiting(true);
    window.setTimeout(() => {
      setGone(true);
      onDone?.();
    }, timing.exitMs);
  };

  const frameAt = (T: number, t01: number): [Params, readonly [number, number, number]] =>
    mode === "intro"
      ? [params(T), PHOSPHOR[OPT.phosphor] || PHOSPHOR.cian]
      : [transitionParams(t01), sampleSectionTint(hue, t01)];
  // "intro": curvatura completa (look CRT clásico, sin cambios). "transition":
  // atenuada — el overlay va escopeado a .content (no 16:9), la curva completa
  // satura/aplasta el eje vertical contra el borde a esa proporción.
  const curveAmount = mode === "intro" ? 1 : 0.35;

  const skip = () => {
    if (finishRef.current) return;
    // Dibujar frame de apagado (o el último frame del segmento), luego salir.
    const s = stateRef.current;
    const cv = canvasRef.current;
    if (s && cv) {
      const [P, tint] = frameAt(timing.maxVirtualT, 1);
      drawFrame(s, cv, P, timing.maxVirtualT, tint, timing, curveAmount, sectionName);
    }
    finish();
  };

  // Reloj rAF: dibuja cada frame, termina en triggerSeconds (real) del modo activo.
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const t0 = performance.now();
    let raf = 0;
    const loop = () => {
      if (finishRef.current) return;
      const s = stateRef.current;
      if (s && s.gl) {
        const el = (performance.now() - t0) / 1000;
        const T =
          mode === "intro" ? Math.min(timing.virtualOffset + el, timing.maxVirtualT) : el;
        const t01 = mode === "intro" ? 0 : clamp(el / TRANSITION_DURATION_S, 0, 1);
        const [P, tint] = frameAt(T, t01);
        drawFrame(s, cv, P, T, tint, timing, curveAmount, sectionName);
        // "transition": crossfade progresivo — la página real (ya swapeada
        // detrás del overlay) empieza a verse desde que el "lock" arranca,
        // no recién en el fade final. Mutación directa del DOM, no React
        // state — evita re-render por frame.
        if (mode === "transition" && overlayRef.current) {
          overlayRef.current.style.opacity = String(tp(t01, [0, 0.35, 1], [1, 1, 0]));
        }
        if (el >= timing.triggerSeconds) {
          finish();
          return;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  if (gone) return null;

  const overlayStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 2147483000,
    background: mode === "intro" ? "var(--background)" : "transparent",
    cursor: "pointer",
    opacity: exiting ? 0 : 1,
    transition: mode === "intro" ? `opacity ${timing.exitMs}ms ease` : "none",
    pointerEvents: exiting ? "none" : "auto",
  };

  return (
    <div ref={overlayRef} style={overlayStyle} onClick={skip} aria-label="Intro luz">
      {mode === "intro" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 90% at 50% 45%, rgba(30,90,140,0.10), rgba(0,0,0,0) 70%)",
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        width={1200}
        height={720}
        style={{
          position: "absolute",
          top: "5vw",
          right: "5vw",
          width: "1100px",
          pointerEvents: "none",
          mixBlendMode: mode === "transition" ? "overlay" : "normal",
        }}
      />
      {mode === "intro" && (
        <div
          style={{
            position: "absolute",
            right: 22,
            bottom: 18,
            font: "500 12px ui-monospace, 'SFMono-Regular', Menlo, monospace",
            letterSpacing: "0.08em",
            color: "oklch(from var(--foreground) l c h / 38%)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          clic para entrar
        </div>
      )}
    </div>
  );
}

const DOCK_REVEAL_MS = 900;
const DOCK_HUE_CYCLE_MS = 16000;

export interface CrtDockedOverlayProps {
  /** Nombre de la sección/página actual — se dibuja junto al logo y nunca desaparece. */
  sectionName?: string;
}

/**
 * Badge permanente — logo + nombre de sección en el mismo canvas grande del
 * burst (mismo tamaño, viñeta visible en todo `.content`), montado detrás
 * del contenido (no interactivo). El logo se escribe de izquierda a
 * derecha al aparecer, y su tinte va rotando de color de forma continua.
 */
export function CrtDockedOverlay({ sectionName }: CrtDockedOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GLState | null>(null);
  const sectionNameRef = useRef(sectionName);
  sectionNameRef.current = sectionName;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const st = makeGL(cv);
    if (!st) return;
    stateRef.current = st;
    const t0 = performance.now();
    let raf = 0;
    loadLogo(st, () => {
      const loop = () => {
        const el = performance.now() - t0;
        const reveal = clamp(el / DOCK_REVEAL_MS, 0, 1);
        const hue = (el / DOCK_HUE_CYCLE_MS) * 360;
        const tint = hslToRgb(hue, 0.55, 0.62);
        drawFrame(
          st,
          cv,
          dockedParams(Easing.easeOutCubic(reveal)),
          0,
          tint,
          { showLogo: true, showOsd: false },
          0.35,
          sectionNameRef.current,
        );
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      stateRef.current = null;
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        width={1200}
        height={720}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
