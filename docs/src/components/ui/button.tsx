// Adapted from shadcn's Base UI registry (`button`). Tailwind-only pieces
// dropped: `[&_svg]:*`/`[&_svg:not([class*='size-'])]:*` descendant
// selectors (icon sizing now lives on the icon element itself, per call
// site), `aria-invalid:`/`aria-expanded:`/`dark:` combinator variants (not
// in the closed variant registry), the `active:not-aria-[haspopup]:` press
// translate, `disabled:opacity-50` (no generic `opacity-N` utility exists),
// per-size arbitrary radius overrides (`rounded-[min(var(--radius),10px)]`),
// and the `focus-visible:ring-3 ring-ring/50` box-shadow ring (no `ring`/
// box-shadow utility exists) — replaced with a `focus:border-ring` color
// change on the existing border instead.
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-4 rounded border border-transparent text-9 font-medium whitespace-nowrap select-none focus:border-ring disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus:border-destructive",
        link: "text-primary hover:underline",
      },
      size: {
        default: "h-17 gap-4 px-6",
        xs: "h-15 gap-3 px-5",
        sm: "h-16 gap-3 px-6",
        lg: "h-18 gap-4 px-6",
        icon: "w-17 h-17",
        "icon-xs": "w-15 h-15",
        "icon-sm": "w-16 h-16",
        "icon-lg": "w-18 h-18",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
