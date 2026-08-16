import { forwardRef, useCallback, useEffect, useRef } from "react";
import { useTheme } from "../react/context";
import type { SoundEvent } from "../tools/sound";

// Reuses the same variant keywords `setup.ts` styles buttons/inputs with
// (danger, success, ghost, …) so a click already "sounds" like its color
// without introducing a second vocabulary. First match wins.
const classPitch: [string, number][] = [
  ["danger", 0.7],
  ["warning", 0.85],
  ["success", 1.25],
  ["apply", 1.25],
  ["contrast", 1.1],
  ["secondary", 1.1],
  ["ghost", 0.9],
  ["reset", 0.8],
  ["cancel", 0.8],
];

/** Derives a pitch multiplier from a `className` string, e.g. `"btn danger"` → 0.7. */
function pitchFromClassName(className?: string): number {
  if (!className) return 1;
  for (const [key, mult] of classPitch) {
    if (className.includes(key)) return mult;
  }
  return 1;
}

/** Extra prop every `withSound`-wrapped component accepts, on top of its own props. */
export interface SoundOverride {
  /**
   * Per-instance override of the component's default sound event.
   * Pass `false` to silence just this instance (e.g. when you're already
   * calling `sound.play()` yourself in the handler and don't want the
   * automatic one to also fire).
   */
  sound?: SoundEvent | false;
}

/** A component wrapped by `withSound`/`withLifecycleSound`: original props + `sound` override. */
export type Soundable<T> =
  T extends React.ComponentType<infer P>
    ? React.ForwardRefExoticComponent<
        Omit<P, "ref"> & SoundOverride & React.RefAttributes<unknown>
      >
    : never;

/**
 * Wraps a component so its trigger prop (default `onClick`) plays a luz
 * sound event first, then calls the original handler. No-op unless
 * `config.sound.enabled` is `true` — safe to apply unconditionally.
 * Pitch varies with the element's `className` (see `classPitch` above)
 * plus a small random jitter, so the same event doesn't always sound
 * identical or identical-per-variant. The instance can override which
 * event plays — or silence itself entirely — via the `sound` prop.
 */
export function withSound<P extends object, R = unknown>(
  event: SoundEvent,
  Component: React.ComponentType<P>,
  triggerProp: string = "onClick",
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P & SoundOverride> & React.RefAttributes<R>
> {
  const Sounded = forwardRef<R, P & SoundOverride>(
    function SoundedComponent(props, ref) {
      const { sound: soundOverride, ...rest } = props;
      const { sound } = useTheme();
      const original = (rest as Record<string, unknown>)[triggerProp] as
        | ((...args: unknown[]) => void)
        | undefined;
      const pitch = pitchFromClassName(
        (rest as Record<string, unknown>).className as string | undefined,
      );
      const resolvedEvent =
        soundOverride === false ? null : (soundOverride ?? event);

      const handler = useCallback(
        (...args: unknown[]) => {
          if (resolvedEvent) sound.play(resolvedEvent, pitch);
          original?.(...args);
        },
        [sound, original, pitch, resolvedEvent],
      );

      return (
        <Component
          {...(rest as P)}
          ref={ref as never}
          {...{ [triggerProp]: handler }}
        />
      );
    },
  );
  Sounded.displayName = `LuzSound(${event})`;
  return Sounded;
}

/**
 * Wraps a component so mounting plays `openEvent` and unmounting plays
 * `closeEvent` — for things shown/hidden imperatively rather than clicked
 * (e.g. a toast that appears via `toastManager.add()` and disappears via
 * timeout, swipe, or its close button). Reads `sound` through a ref so the
 * close sound always reflects the latest enabled/volume, not what was
 * current when the component mounted. Pass `sound={false}` on an instance
 * to silence both the open and close sound for it.
 */
export function withLifecycleSound<P extends object, R = unknown>(
  openEvent: SoundEvent,
  closeEvent: SoundEvent,
  Component: React.ComponentType<P>,
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P & SoundOverride> & React.RefAttributes<R>
> {
  const Sounded = forwardRef<R, P & SoundOverride>(
    function LifecycleSoundedComponent(props, ref) {
      const { sound: soundOverride, ...rest } = props;
      const theme = useTheme();
      const soundRef = useRef(theme.sound);
      soundRef.current = theme.sound;

      useEffect(() => {
        if (soundOverride === false) return;
        soundRef.current.play(openEvent);
        return () => soundRef.current.play(closeEvent);
        // Fire once per mount/unmount, not on every theme change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return <Component {...(rest as P)} ref={ref as never} />;
    },
  );
  Sounded.displayName = `LuzSound(${openEvent}/${closeEvent})`;
  return Sounded;
}

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

/**
 * Wraps `Field.Root` so it plays `error` the moment validation marks it
 * invalid, and `success` when it recovers from invalid back to valid.
 * Watches the `data-invalid` attribute Base UI already sets on the DOM node
 * (via `MutationObserver`) instead of a callback prop — that one attribute
 * reflects every validation path (`validate`, async, `validationMode`,
 * externally-controlled `invalid`), so this stays correct regardless of how
 * the field is validated. Doesn't fire on initial mount, only on change.
 */
export function withValiditySound<P extends object>(
  Component: React.ComponentType<P>,
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<HTMLElement>
> {
  const Sounded = forwardRef<HTMLElement, P>(
    function ValiditySoundedComponent(props, ref) {
      const theme = useTheme();
      const soundRef = useRef(theme.sound);
      soundRef.current = theme.sound;
      const nodeRef = useRef<HTMLElement | null>(null);
      const wasInvalidRef = useRef(false);

      useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const observer = new MutationObserver(() => {
          const invalid = node.hasAttribute("data-invalid");
          if (invalid === wasInvalidRef.current) return;
          soundRef.current.play(invalid ? "error" : "success");
          wasInvalidRef.current = invalid;
        });
        observer.observe(node, {
          attributes: true,
          attributeFilter: ["data-invalid"],
        });
        return () => observer.disconnect();
      }, []);

      return (
        <Component {...(props as P)} ref={mergeRefs(ref, nodeRef) as never} />
      );
    },
  );
  Sounded.displayName = "LuzSound(validity)";
  return Sounded;
}
