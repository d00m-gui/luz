import * as React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { LuzReact } from "../../../src/react";
import { lui } from "../../../src/components";
import { docsRuntimeConfig } from "../lib/docs-runtime-config";

export function Playground({ code }: { code?: string }) {
  if (!code) {
    return (
      <div className="playground-placeholder">
        No hay playground de ejemplo para este componente todavía.
      </div>
    );
  }

  return (
    <LuzReact config={docsRuntimeConfig}>
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
    </LuzReact>
  );
}
