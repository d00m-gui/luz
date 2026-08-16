import { lui } from "../../../src/components";
import { useTheme } from "../../../src/react";
import type { SoundEvent } from "../../../src/tools/sound";

const events: SoundEvent[] = [
  "click",
  "hover",
  "success",
  "error",
  "toggle",
  "pop",
  "whoosh",
  "type",
  "slide",
  "snap",
  "check",
  "radio",
  "thunder",
];

export function SoundSample() {
  const { sound } = useTheme();

  return (
    <lui.card className="card sound">
      <h2>sound</h2>
      <div className="card-content">
        <div role="group">
          <lui.button
            className={sound.enabled ? "success" : "reset"}
            onClick={sound.toggle}
          >
            {sound.enabled ? "Sound on" : "Sound off"}
          </lui.button>
        </div>
        <div role="group">
          {events.map((event) =>
            // `lui.button` already auto-plays "click" on click — for most
            // events that IS the sound we want to demo, via the `sound`
            // prop override. "hover" only makes sense on mouseenter, so it
            // silences the click (`sound={false}`) and triggers manually.
            event === "hover" ? (
              <lui.button
                key={event}
                sound={false}
                onMouseEnter={() => sound.play("hover")}
              >
                hover
              </lui.button>
            ) : (
              <lui.button
                key={event}
                sound={event}
                className={event === "thunder" ? "contrast" : undefined}
              >
                {event}
              </lui.button>
            ),
          )}
        </div>
      </div>
    </lui.card>
  );
}
