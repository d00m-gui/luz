// Adapted from shadcn's Base UI registry (`toast`). Tailwind-only pieces
// dropped: the entire stack-of-cards animation system (`[--gap:...]`,
// `[--height:...]`, `[transform:...]`, `[transition:...]`,
// `data-starting-style:`/`data-ending-style:`/`data-[swipe-direction=*]:`
// transform math, `data-expanded:`/`data-behind:` opacity crossfade) — no
// animation, arbitrary-property, or transform utilities exist, so toasts
// simply appear/disappear stacked instead of sliding and shrinking; only
// the base surface styling (border, background, radius, spacing) survives.
// `inset-x-4 bottom-4 ... sm:right-4` viewport corner-offset positioning has
// no coordinate-utility equivalent either — replaced with a closed
// -vocabulary flex trick (`fixed inset-0 flex ... items-end justify-end`)
// that pins the stack to the bottom-right using alignment instead of
// offsets, a real substitution rather than a drop. Matches upstream's
// click-through behavior exactly: the full-screen `inset-0` viewport is
// `pointer-events-none`, and each `Toast` re-enables `pointer-events-auto`
// on itself — so the empty viewport area never blocks interaction with the
// rest of the page, mounted or not. Upstream's `lucide-react` icon imports
// are replaced with plain inline SVGs (`../icons`) — see that file's doc
// comment.
"use client";

import * as React from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  XIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "@/components/icons";

const toast = ToastPrimitive.createToastManager();

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />;
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({
  className,
  ...props
}: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-end justify-end gap-3 p-6 pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "w-fit max-w-full rounded border bg-popover text-popover-foreground select-none pointer-events-auto focus:border-ring",
        className,
      )}
      {...props}
    />
  );
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn("flex items-center gap-8 overflow-hidden p-6", className)}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-9 font-medium", className)}
      {...props}
    />
  );
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-9 text-muted-foreground", className)}
      {...props}
    />
  );
}

function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn("shrink-0 text-muted-foreground hover:text-foreground", className)}
      {...props}
    >
      {children ?? <XIcon className="w-9 h-9" aria-hidden="true" />}
    </ToastPrimitive.Close>
  );
}

function ToastIcon({ type }: { type: string | undefined }) {
  let icon: React.ReactNode = null;

  if (type === "success") {
    icon = <CircleCheckIcon className="w-10 h-10" aria-hidden="true" />;
  }

  if (type === "info") {
    icon = <InfoIcon className="w-10 h-10" aria-hidden="true" />;
  }

  if (type === "warning") {
    icon = <TriangleAlertIcon className="w-10 h-10" aria-hidden="true" />;
  }

  if (type === "error") {
    icon = (
      <OctagonXIcon className="w-10 h-10 text-destructive" aria-hidden="true" />
    );
  }

  if (type === "loading") {
    icon = <Loader2Icon className="w-10 h-10" aria-hidden="true" />;
  }

  if (!icon) {
    return null;
  }

  return (
    <span data-slot="toast-icon" className="shrink-0">
      {icon}
    </span>
  );
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ));
}

function Toaster({
  children,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

const createToastManager = ToastPrimitive.createToastManager;
const useToastManager = ToastPrimitive.useToastManager;

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
};
