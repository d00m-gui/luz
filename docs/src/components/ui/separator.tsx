// Adapted from shadcn's Base UI registry (`separator`). `data-horizontal:`/
// `data-vertical:` map directly onto luz's own `[data-orientation]`-free
// variant set — those two aren't in the closed variant registry (only
// state-ish attributes like `open`/`checked`/`disabled` are), so orientation
// styling is expressed with plain conditional classes on the React side
// instead of a `data-*:` utility variant.
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "w-full h-1" : "h-full w-1",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
