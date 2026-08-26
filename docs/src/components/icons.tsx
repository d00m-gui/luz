import type { ReactNode, SVGProps } from "react";

function IconBase({
  children,
  ...props
}: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Close / dismiss. Used by `dialog.tsx`, `toast.tsx`. */
export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </IconBase>
  );
}

/** Plain checkmark. Used by `menubar.tsx`, `dropdown-menu.tsx` (checked-item indicators). */
export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M20 6 9 17l-5-5" />
    </IconBase>
  );
}

/** Checkmark in a circle — toast success. Used by `toast.tsx`. */
export function CircleCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </IconBase>
  );
}

/** "i" in a circle — toast info. Used by `toast.tsx`. */
export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </IconBase>
  );
}

/** Exclamation triangle — toast warning. Used by `toast.tsx`. */
export function TriangleAlertIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </IconBase>
  );
}

/** X in an octagon — toast error. Used by `toast.tsx`. */
export function OctagonXIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86z" />
      <path d="m9 9 6 6" />
      <path d="m15 9-6 6" />
    </IconBase>
  );
}

/**
 * Spinner glyph (a ~3/4 ring, not a full circle) — toast loading. Used by
 * `toast.tsx`. Static like upstream's usage here: there's no `animate-spin`
 * in the closed-vocabulary utility engine, so this doesn't rotate either.
 */
export function Loader2Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </IconBase>
  );
}

/** Submenu disclosure chevron. Used by `dropdown-menu.tsx`. */
export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="m9 18 6-6-6-6" />
    </IconBase>
  );
}
