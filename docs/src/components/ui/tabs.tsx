// Adapted from shadcn's Base UI registry (`tabs`). Tailwind-only pieces
// dropped: the `group/tabs`/`group-data-horizontal/tabs:` combinator
// variants that let the list/trigger react to the root's orientation and
// the `line` vs `default` list variant (no group-scoped variant support in
// luz's utility engine — orientation is now handled with a plain
// conditional class on the React side, and the `line` visual variant, which
// depended entirely on those group selectors, is dropped in favor of the
// single default look), the `after:` active-tab underline pseudo-element,
// and `[&_svg]:*` icon sizing. `data-active:` maps directly onto the
// `active:` variant (`[data-active]`), same attribute Base UI's own `Tabs`
// sets.
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "flex gap-5",
        orientation === "horizontal" ? "flex-col" : "flex-row",
        className,
      )}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-17 w-fit items-center justify-center gap-1 rounded bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-3 rounded px-5 py-3 text-9 font-medium whitespace-nowrap text-foreground disabled:pointer-events-none focus:border-ring active:bg-background active:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-9", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
