import { useEffect, useMemo, useState } from "react";
import { luz, type LuzConfig } from "../luz";
import { LuzThemeContext, type LuzTheme } from "./context";
import { useLuzSound } from "./useSound";

const TEXT_INPUT_TYPES = new Set([
  "text",
  "search",
  "email",
  "password",
  "url",
  "tel",
  "number",
]);

/** Non-printing keys that should still trigger a keystroke sound. */
const TYPE_SOUND_KEYS = new Set(["Backspace", "Delete", "Enter", "Tab"]);

/** Global keystroke sound for any native text `<input>`/`<textarea>` on the page. */
function useTypingSound(sound: LuzTheme["sound"]): void {
  useEffect(() => {
    if (!sound.enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length > 1 && !TYPE_SOUND_KEYS.has(event.key)) return;

      const target = event.target;
      const isTextInput =
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLInputElement &&
          TEXT_INPUT_TYPES.has(target.type));
      if (!isTextInput) return;

      sound.play("type");
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [sound]);
}

// Major pentatonic — no wrong notes, so a fast drag never sounds discordant.
const PENTATONIC_SEMITONES = [0, 2, 4, 7, 9];
const RANGE_SCALE_STEPS = 10; // 2 octaves

function pitchFromNoteIndex(index: number): number {
  const semitone =
    PENTATONIC_SEMITONES[index % PENTATONIC_SEMITONES.length]! +
    12 * Math.floor(index / PENTATONIC_SEMITONES.length);
  return 2 ** (semitone / 12);
}

/**
 * Global scale sound for any native `<input type="range">` on the page —
 * quantized to a pentatonic scale so dragging plays a run of notes rather
 * than a continuous siren. Only plays when the note actually changes, so a
 * slow drag doesn't spam the same note.
 */
function useRangeSound(sound: LuzTheme["sound"]): void {
  useEffect(() => {
    if (!sound.enabled) return;

    const lastNote = new WeakMap<Element, number>();

    function onInput(event: Event) {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.type !== "range")
        return;

      const min = target.min === "" ? 0 : Number(target.min);
      const max = target.max === "" ? 100 : Number(target.max);
      const fraction =
        max > min ? (Number(target.value) - min) / (max - min) : 0;
      const note = Math.round(fraction * (RANGE_SCALE_STEPS - 1));

      if (lastNote.get(target) === note) return;
      lastNote.set(target, note);
      sound.play("slide", pitchFromNoteIndex(note));
    }

    document.addEventListener("input", onInput);
    return () => document.removeEventListener("input", onInput);
  }, [sound]);
}

/**
 * Global sound for any native `<input type="checkbox">`/`<input
 * type="radio">` on the page. Checkboxes get `check` (pitch shifts down on
 * uncheck), radios get `radio`. `role="switch"` checkboxes — the CSS-only
 * switch styled by `setup.ts` — get `toggle` instead, so they match
 * `lui.switch` regardless of which one a page uses. Skips
 * `aria-hidden` inputs: that's the hidden native checkbox `lui.switch`
 * renders internally, already sounded by its own `onCheckedChange` wrapper
 * — without this it'd double up, same bug as the sound demo buttons.
 */
function useCheckboxRadioSound(sound: LuzTheme["sound"]): void {
  useEffect(() => {
    if (!sound.enabled) return;

    function onChange(event: Event) {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.getAttribute("aria-hidden") === "true") return;

      if (target.type === "checkbox") {
        if (target.getAttribute("role") === "switch") {
          sound.play("toggle");
        } else {
          sound.play("check", target.checked ? 1 : 0.7);
        }
      } else if (target.type === "radio") {
        sound.play("radio");
      }
    }

    document.addEventListener("change", onChange);
    return () => document.removeEventListener("change", onChange);
  }, [sound]);
}

export function LuzReact({
  config,
  children,
}: {
  config: LuzConfig;
  children?: React.ReactNode;
}): React.ReactNode {
  const [override, setOverride] = useState<Partial<LuzConfig>>({});
  const merged = useMemo(
    () => ({ ...config, ...override }),
    [config, override],
  );
  const { tokens, style } = useMemo(() => luz(merged), [merged]);

  const sound = useLuzSound({
    initial: config.sound?.enabled ?? false,
    volume: config.sound?.volume,
    events: config.sound?.events,
  });

  useTypingSound(sound);
  useRangeSound(sound);
  useCheckboxRadioSound(sound);

  const theme: LuzTheme = useMemo(
    () => ({
      tokens,
      sound,
      setPrimary: (primary: string) =>
        setOverride((current) => ({ ...current, primary })),
      setMode: (mode: NonNullable<LuzConfig["mode"]>) =>
        setOverride((current) => ({ ...current, mode })),
    }),
    [tokens, sound],
  );

  return (
    <LuzThemeContext.Provider value={theme}>
      {/* No `href`/`precedence`: either one opts this into React 19's
          hoistable-style Resource treatment, which never patches an
          already-inserted stylesheet's content on re-render — fatal for a
          stylesheet meant to update live as `config` changes. A plain
          `<style>` re-renders its text content normally, like any element. */}
      <style>{style}</style>
      {children}
    </LuzThemeContext.Provider>
  );
}

export { useTheme, type LuzTheme, type LuzThemeSound } from "./context";
export { useLuzSound } from "./useSound";
export type { LuzSoundConfig, SoundEvent } from "../tools/sound";
