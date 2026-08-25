// Adapted from shadcn's Base UI registry (`toggle`). Tailwind-only pieces
// dropped: `[&_svg]:*` descendant icon sizing, `aria-invalid:`/`dark:`
// combinator variants, `min-w-N` (no min-width scale exists, only
// `min-w-0`), `disabled:opacity-50` (no generic `opacity-N` utility), and
// the `focus-visible:ring-[3px] ring-ring/50` box-shadow ring (replaced
// with `focus:border-ring`). `data-[state=on]:bg-muted` maps onto the
// `pressed:` variant (`[data-pressed]`), which is what Base UI's own
// `Toggle` primitive actually sets.
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-3 rounded text-9 font-medium whitespace-nowrap hover:bg-muted hover:text-foreground focus:border-ring disabled:pointer-events-none pressed:bg-muted",
  {
    variants: {
      variant: {
        default: "bg-transparent border border-transparent",
        outline: "border border-input bg-transparent hover:bg-muted",
      },
      size: {
        default: "h-17 px-6",
        sm: "h-16 px-6 text-8",
        lg: "h-18 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
