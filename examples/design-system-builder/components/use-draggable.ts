import { useRef } from "react";

/**
 * Lets an element be dragged by a handle via a CSS transform. Fallback for
 * popovers that can't always land where you'd expect (viewport-edge
 * flipping, anchoring quirks) — drag it wherever instead of fighting the
 * positioner. Resets to the anchored position every time the popover
 * re-opens (the ref is null while closed, so drag state doesn't persist).
 */
export function useDraggable() {
  const targetRef = useRef<HTMLElement>(null);
  const origin = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const offset = useRef({ x: 0, y: 0 });

  function onPointerDown(event: React.PointerEvent) {
    const target = targetRef.current;
    if (!target) return;
    event.preventDefault();
    origin.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.current.x,
      offsetY: offset.current.y,
    };
    (event.target as Element).setPointerCapture(event.pointerId);

    function onPointerMove(moveEvent: PointerEvent) {
      if (!target) return;
      offset.current = {
        x: origin.current.offsetX + (moveEvent.clientX - origin.current.x),
        y: origin.current.offsetY + (moveEvent.clientY - origin.current.y),
      };
      target.style.transform = `translate(${offset.current.x}px, ${offset.current.y}px)`;
    }
    function onPointerUp() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  return { targetRef, onPointerDown };
}
