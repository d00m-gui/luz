// Adapted from shadcn's Base UI registry (`dialog`). Tailwind-only pieces
// dropped: `data-open:animate-in`/`data-closed:animate-out`/`fade-in-*`/
// `zoom-in-*` (no animation utilities exist — the dialog now shows/hides
// instantly), `supports-backdrop-filter:backdrop-blur-xs`, and the
// `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` centering trick (no
// percentage-position/transform utilities exist). Centering is done instead
// with a plain closed-vocabulary flex wrapper (`fixed inset-0 flex
// items-center justify-center`) around the popup rather than transform
// math — a real substitution, not a drop. `bg-black/10` becomes
// `bg-foreground/10` (a real palette token used at low opacity) since there
// is no literal-color utility. `ring-1 ring-foreground/10` (box-shadow ring)
// has no equivalent and is dropped in favor of the existing `border`. The
// close button also has no `top-2 right-2` corner-offset utility to reach
// for, so it's simply `absolute` (top-left of the popup) instead of pinned
// to the corner. Its accessible label now uses the engine's real `sr-only`
// utility (added after this file was first adapted) — visually hidden but
// still in the accessibility tree, matching upstream's behavior exactly.
// Upstream's `lucide-react` icon import is replaced with a plain inline SVG
// (`../icons`) — see that file's doc comment.
import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "@/components/icons";

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-50 bg-foreground/10", className)}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={cn(
            "relative grid w-fit max-w-full gap-5 rounded border bg-popover p-6 text-9 text-popover-foreground",
            className,
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              render={<Button variant="ghost" className="absolute" size="icon-sm" />}
            >
              <XIcon className="w-9 h-9" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Popup>
      </div>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-10 font-medium", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-9 text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
