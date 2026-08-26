// Adapted from shadcn's Base UI registry (`dropdown-menu`). Tailwind-only
// pieces dropped throughout: `data-open:animate-in`/`fade-in-*`/`zoom-in-*`/
// `slide-in-from-*` (no animation utilities exist — menus show/hide
// instantly), `[&_svg]:*` descendant icon sizing (icons are sized directly
// at the call site instead), `not-data-[variant=destructive]:focus:**:*`
// and `group-focus/*:*` combinator selectors (no group-scoped variant
// support), and the `w-(--anchor-width)`/`max-h-(--available-height)`
// Base-UI-supplied CSS-variable sizing (Tailwind arbitrary-property syntax
// — replaced with the closed-vocabulary `w-fit`, content just sizes
// naturally instead of matching the trigger's width exactly). Upstream's
// `lucide-react` icon imports are replaced with plain inline SVGs
// (`../icons`) — see that file's doc comment.
"use client";

import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";

import { cn } from "@/lib/utils";
import { ChevronRightIcon, CheckIcon } from "@/components/icons";

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="z-50"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 w-fit overflow-auto rounded border bg-popover p-3 text-popover-foreground",
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  // `Menu.GroupLabel` requires a `Menu.Group`/`Menu.RadioGroup` ancestor for
  // its context (Base UI throws `MenuGroupContext is missing` otherwise) —
  // but a label is just as often used standalone, ungrouped, at the top of
  // a menu (see `AdminExample.tsx`'s user menu: label, separator, then flat
  // items, no `<DropdownMenuGroup>` around any of it). Providing the group
  // here means callers never need to know about that Base UI requirement —
  // wrapping an already-grouped label in a second `Menu.Group` is harmless.
  return (
    <MenuPrimitive.Group>
      <MenuPrimitive.GroupLabel
        data-slot="dropdown-menu-label"
        data-inset={inset}
        className={cn(
          "px-4 py-3 text-8 font-medium text-muted-foreground",
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Group>
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex items-center gap-4 rounded px-4 py-3 text-9 select-none focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none",
        variant === "destructive" &&
          "text-destructive focus:bg-destructive/10 focus:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex items-center gap-4 rounded px-4 py-3 text-9 select-none focus:bg-accent focus:text-accent-foreground open:bg-accent open:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="w-9 h-9" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn("w-fit min-w-0 rounded border bg-popover p-3 text-popover-foreground", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex items-center gap-4 rounded py-3 pr-9 pl-4 text-9 select-none focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none absolute flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="w-9 h-9" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex items-center gap-4 rounded py-3 pr-9 pl-4 text-9 select-none focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none",
        className,
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon className="w-9 h-9" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("my-3 h-1 bg-border", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("text-8 text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
