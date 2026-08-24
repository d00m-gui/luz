import * as React from "react";
import { useState } from "react";
import { LuzReact, useTheme } from "../../../src/react";
import { docsRuntimeConfig } from "../lib/docs-runtime-config";

const MODES = ["light", "dark"] as const;

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 6h2.5L8 3v10L4.5 10H2z"
        fill="currentColor"
      />
      {muted ? (
        <path
          d="M10.5 6.5l4 4m0-4l-4 4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M10.5 5.5c1.2 1 1.2 4 0 5m1.8-6.8c2 1.8 2 5.8 0 7.6"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="2.3" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8 1.5v1.6M8 12.9v1.6M14.5 8h-1.6M3.1 8H1.5M12.4 3.6l-1.1 1.1M4.7 11.3l-1.1 1.1M12.4 12.4l-1.1-1.1M4.7 4.7 3.6 3.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ToolbarInner() {
  const theme = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setModeState] = useState<(typeof MODES)[number]>(
    (docsRuntimeConfig.mode as (typeof MODES)[number]) ?? "dark",
  );

  return (
    <div className="toolbar">
      <button
        type="button"
        className="toolbar-btn"
        aria-pressed={theme.sound.enabled}
        aria-label={theme.sound.enabled ? "Silenciar sonidos de luz" : "Activar sonidos de luz"}
        onClick={() => theme.sound.toggle()}
      >
        <SoundIcon muted={!theme.sound.enabled} />
        {theme.sound.enabled ? "Sound on" : "Sound off"}
      </button>

      <div className="toolbar-spacer" />

      <div className="toolbar-settings">
        <button
          type="button"
          className="toolbar-btn"
          aria-pressed={settingsOpen}
          aria-label="Configurar luz live"
          onClick={() => setSettingsOpen((open) => !open)}
        >
          <GearIcon />
          Settings
        </button>

        {settingsOpen && (
          <div className="toolbar-settings-panel">
            <label className="toolbar-field">
              Primary
              <input
                type="color"
                defaultValue={theme.tokens.colors.primary}
                onChange={(event) => theme.setPrimary(event.target.value)}
              />
            </label>
            <label className="toolbar-field">
              Mode
              <select
                value={mode}
                onChange={(event) => {
                  const next = event.target.value as (typeof MODES)[number];
                  setModeState(next);
                  theme.setMode(next);
                }}
              >
                {MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

/** Bottom statusbar for the docs site — sound toggle + live luz settings.
 *  Runs its own `<LuzReact>` so it works standalone anywhere on the page;
 *  `setPrimary`/`setMode` write `:root` CSS vars, which cascade to the
 *  whole document regardless of which island's context called them. */
export function Toolbar() {
  return (
    <LuzReact config={docsRuntimeConfig}>
      <ToolbarInner />
    </LuzReact>
  );
}
