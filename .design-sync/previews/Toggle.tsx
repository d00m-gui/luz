// Ported from examples/ui/samples/toggle.tsx — Toggle needs a ToggleGroup
// parent for real usage (matches its actual composed context, per §4.2
// "compose context-required pieces inside their parent").
import { Toggle, ToggleGroup } from "@d00m-gui/luz";

export function TextFormatting() {
  return (
    <ToggleGroup defaultValue={["left"]}>
      <Toggle aria-label="Align left" value="left">
        B
      </Toggle>
      <Toggle aria-label="Align center" value="center">
        I
      </Toggle>
      <Toggle aria-label="Align right" value="right">
        U
      </Toggle>
    </ToggleGroup>
  );
}
