import { useState } from "react";

/**
 * A pinned, non-modal floating panel for settings that don't have a natural
 * inline home in the magazine layout (technical/rare fields). Plain
 * `position: fixed` toggle rather than a modal `Dialog` — deliberately: the
 * page behind stays scrollable and clickable while it's open, so opening it
 * never interrupts browsing the generated design system.
 */
export function FloatingPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="floating-panel-toggle"
        aria-label={open ? `Close ${title}` : `Open ${title}`}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "×" : "⚙"}
      </button>
      {open && (
        <div className="floating-panel">
          <div className="floating-panel-header">
            <h2>{title}</h2>
            <button
              type="button"
              className="ghost"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="floating-panel-body">{children}</div>
        </div>
      )}
    </>
  );
}
