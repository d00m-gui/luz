// design-sync bridge entry — luz's public API is a single `lui` namespace
// object (lui.button, lui.card, ...), not per-component PascalCase named
// exports. The design-sync converter's discovery needs the latter, so this
// file flattens the namespace into individual exports. Pure re-exports of
// the real built dist — no reimplementation. Regenerate this file's import
// paths only if dist/'s layout changes; never hand-edit component behavior
// here.
export { LuzReact, useTheme } from "../dist/react/index.js";
import { lui } from "../dist/index.js";

// Direct components
export const Button = lui.button;
export const Card = lui.card;
export const Toggle = lui.toggle;

// Compound (Base UI-style) namespaces — Name.Root/.Trigger/... sub-parts
export const Avatar = lui.avatar;
export const Menu = lui.menu;
export const Menubar = lui.menubar;
export const Tabs = lui.tabs;
export const Meter = lui.meter;
export const Form = lui.form;
export const Field = lui.field;
export const ToggleGroup = lui.togglegroup;
export const Toast = lui.toast;
export const Switch = lui.switch;
export const Dialog = lui.dialog;
