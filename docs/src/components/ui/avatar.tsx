// Adapted from shadcn's Base UI registry (`avatar`). Tailwind-only pieces
// dropped: `after:`/`dark:after:` mix-blend ring pseudo-element, the
// `group/avatar` + `group-data-[size=…]/avatar:` combinator styling that
// let `AvatarFallback`/`AvatarBadge`/`AvatarGroupCount` react to their
// ancestor's `size`/`data-[slot=avatar]` state (no group-variant support in
// luz's utility engine — each piece now just reads `size` as a plain prop
// instead), and `AvatarBadge`'s absolute corner overlay (no `right-`/
// `bottom-`/coordinate utilities exist, only `inset-0`) — it renders inline
// instead of overlaid. `rounded-full` has no equivalent either (only the
// single `rounded`/`rounded-none` radius scale) so avatars use the shared
// `--border-radius` token rather than a true circle.
import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";

import { cn } from "@/lib/utils";

const AVATAR_SIZE = {
  sm: "w-15 h-15",
  default: "w-17 h-17",
  lg: "w-19 h-19",
} as const;

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg";
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "relative flex shrink-0 rounded select-none",
        AVATAR_SIZE[size],
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("w-full h-full rounded", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex w-full h-full items-center justify-center rounded bg-muted text-9 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "inline-flex w-6 h-6 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground select-none",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex w-17 h-17 shrink-0 items-center justify-center rounded bg-muted text-9 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
};
