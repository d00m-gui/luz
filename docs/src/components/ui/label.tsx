// Adapted from shadcn's Base UI registry (`label`). Tailwind-specific
// styling — the `peer-disabled:`/`group-data-[disabled=true]:` combinator
// variants (no group/peer variant support in luz's utility engine) — has
// been dropped; everything else maps onto luz's closed-vocabulary utility
// classes (`gap-N`, `text-N`, `select-none`).
import * as React from "react";

import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn("flex items-center gap-5 text-9 select-none", className)}
      {...props}
    />
  );
}

export { Label };
