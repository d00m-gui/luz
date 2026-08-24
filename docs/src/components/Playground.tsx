import * as React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { lui } from "../../../src/components";

/** Renders inside the page's shared `<LuzReact>` (see `DocsIsland`) — must
 *  NOT bring its own, or `lui.*`'s sound would read a different context
 *  than the Toolbar's toggle writes to. */
export function Playground({ code }: { code?: string }) {
  if (!code) {
    return (
      <div className="playground-placeholder">
        No hay playground de ejemplo para este componente todavía.
      </div>
    );
  }

  return (
    <LiveProvider code={code} scope={{ React, lui, useState: React.useState }}>
      <div className="playground">
        <div className="playground-editor">
          <LiveEditor />
          <LiveError className="playground-error" />
        </div>
        <div className="playground-preview">
          <LivePreview />
        </div>
      </div>
    </LiveProvider>
  );
}
