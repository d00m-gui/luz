// Ported from examples/ui/samples/buttons.tsx — the repo's own canonical
// button usage (className-based semantic variants wired to theme tokens in
// src/tools/setup.ts).
import { Button } from "@d00m-gui/luz";

export function Variants() {
  return (
    <div role="group" style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
      <Button>Default</Button>
      <Button className="success">Success</Button>
      <Button className="danger">Danger</Button>
      <Button className="warning">Warning</Button>
      <Button className="ghost">Ghost</Button>
      <Button className="contrast">Contrast</Button>
    </div>
  );
}

export function Disabled() {
  return (
    <div role="group" style={{ display: "flex", gap: "0.8rem" }}>
      <Button disabled>Disabled</Button>
      <Button disabled focusableWhenDisabled>
        Focusable disabled
      </Button>
    </div>
  );
}
