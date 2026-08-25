// Adapted from shadcn's Base UI registry (`toggle-group`). Tailwind-only
// pieces dropped: the arbitrary `[--spacing(var(--gap))]` gap plumbing and
// every `group-data-[spacing=0]/toggle-group:*` rule that turned the group
// into a seamless "segmented control" (square joined corners, shared
// borders) at `spacing={0}` — luz's utility engine has no group-scoped
// variant support, so that spacing-dependent corner/border logic has no
// equivalent and is dropped; `ToggleGroup` now always renders with a
// regular gap and each item keeps its own rounded corners. `data-vertical:`
// maps onto plain conditional classes (orientation isn't a closed-vocabulary
// variant, only Base UI state attributes like `pressed`/`open` are).
import * as React from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    orientation?: "horizontal" | "vertical";
  }
>({
  size: "default",
  variant: "default",
  orientation: "horizontal",
});

function ToggleGroup({
  className,
  variant,
  size,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    orientation?: "horizontal" | "vertical";
  }) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-orientation={orientation}
      className={cn(
        "flex w-fit items-center gap-3 rounded",
        orientation === "vertical" ? "flex-col items-stretch" : "flex-row",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, orientation }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        "shrink-0 focus:z-10",
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}

export { ToggleGroup, ToggleGroupItem };
