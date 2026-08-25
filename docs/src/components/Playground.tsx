import * as React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { Card } from "../../../src/components/card";
import { withComponentStyle } from "../../../src/react";

/** Renders inside the page's shared `<LuzReact>` (see `DocsIsland`) — must
 *  NOT bring its own, so a live-previewed component reads the same theme
 *  context the Toolbar's sound toggle writes to. `lui` is gone (retired
 *  along with its whole catalog) — the scope now offers the pieces of the
 *  new system a component sample would actually reach for: the utility
 *  classNames the build-time scanner resolves (`p-4`, `bg-primary-600`,
 *  `rounded`, ...), the shadcn token bridge (`bg-card`,
 *  `text-card-foreground`, `border-input`, ...), and luz's own
 *  `Card`/`withComponentStyle` primitives for anything that needs actual
 *  component-scoped CSS rather than a className. */
export function Playground({ code }: { code?: string }) {
  if (!code) {
    return (
      <div className="playground-placeholder">
        <p>No hay playground de ejemplo para este componente todavía.</p>
        <p>Vista previa del sistema de utilities + shadcn bridge:</p>
        <div className="p-4 bg-primary-600 rounded">
          <code>p-4 bg-primary-600 rounded</code>
        </div>
        <div className="bg-card text-card-foreground border-input p-4 rounded">
          <code>bg-card text-card-foreground border-input</code>
        </div>
        <Card className="p-4">
          <code>Card (withComponentStyle demo)</code>
        </Card>
      </div>
    );
  }

  return (
    <LiveProvider
      code={code}
      scope={{ React, useState: React.useState, Card, withComponentStyle }}
    >
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
