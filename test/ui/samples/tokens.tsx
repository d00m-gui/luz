"use client";

import { lui } from "../../../src/components";
import { luz } from "../../../src/luz";
import { config } from "../../../luz.config";

export function TokensSample() {
  const {
    tokens: { colors },
  } = luz(config);
  return (
    <lui.card>
      <h2>variables / tokens</h2>
      <details>
        <summary>colors</summary>
        <h3>colors</h3>
      </details>
      <details>
        <summary>sizes</summary>
        <h3>sizes</h3>
      </details>
      <details>
        <summary>settings</summary>
        <h3>settings</h3>
      </details>
    </lui.card>
  );
}
