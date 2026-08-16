import { useState } from "react";
import logoUrl from "../luz-logo.svg";

/**
 * The single floating entry point for everything that doesn't have a
 * natural inline home in the magazine layout: mode, presets, and the
 * technical/rare config fields. One fixed logo button, one panel — instead
 * of scattering a masthead bar, a gear icon, etc. Plain `position: fixed`
 * toggle rather than a modal `Dialog`: the page behind stays scrollable and
 * clickable while it's open, so opening it never interrupts browsing.
 */
export function FloatingPanel({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="floating-panel-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((current) => !current)}
      >
        <span
          className="logo-mark"
          style={{ maskImage: `url(${logoUrl})`, WebkitMaskImage: `url(${logoUrl})` }}
        />
      </button>
      {open && (
        <div className="floating-panel">
          <div className="floating-panel-header">
            <h2>luz builder</h2>
            <button type="button" className="ghost" aria-label="Close" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
          <div className="floating-panel-body">{children}</div>
        </div>
      )}
    </>
  );
}
