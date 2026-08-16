import { useCallback, useState } from "react";
import {
  playSound,
  type LuzSoundConfig,
  type SoundEvent,
} from "../tools/sound";

/**
 * Opt-in sound effects hook. Disabled by default — pass `initial: true` or
 * flip it at runtime with the returned `setEnabled`/`toggle`.
 *
 *   const { play, enabled, toggle } = useLuzSound({ volume: 0.3 });
 *   <button onClick={() => { play("thunder"); doStuff(); }}>Strike</button>
 *   <button onClick={toggle}>{enabled ? "Mute" : "Unmute"} sound</button>
 */
export function useLuzSound(
  config?: Omit<LuzSoundConfig, "enabled"> & { initial?: boolean },
): {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
  play: (event: SoundEvent, pitch?: number) => void;
} {
  const { initial = false, ...rest } = config ?? {};
  const [enabled, setEnabled] = useState(initial);

  const play = useCallback(
    (event: SoundEvent, pitch?: number) =>
      playSound(event, { ...rest, enabled }, pitch),
    [enabled, rest.volume, rest.events],
  );

  const toggle = useCallback(() => setEnabled((current) => !current), []);

  return { enabled, setEnabled, toggle, play };
}

export { playSound, type LuzSoundConfig, type SoundEvent };
