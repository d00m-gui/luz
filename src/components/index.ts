// React adapter - simplified export of @base-ui/react components
// Provides `lui` namespace for Base UI components
import { Menu } from "@base-ui/react/menu";
import { Tabs } from "@base-ui/react/tabs";
import {
  Avatar,
  Field,
  Form,
  Meter,
  Switch,
  Toast,
  Toggle,
  ToggleGroup,
  Button,
  Menubar,
  Dialog,
} from "@base-ui/react";
import { Toast as ToastCore } from "@base-ui/react/toast";
import { Card } from "./card";
import type { LuiComponents } from "./types";
import { withComponentStyle } from "./with-style";
import {
  withSound,
  withLifecycleSound,
  withValiditySound,
  type Soundable,
} from "./with-sound";
import type { SoundEvent } from "../tools/sound";

/** Wires a component to its lazy `<style>` injection, preserving its original type. */
function styled<T extends React.ComponentType<never>>(
  name: Parameters<typeof withComponentStyle>[0],
  Component: T,
): T {
  return withComponentStyle(name, Component as never) as unknown as T;
}

/**
 * Wires a component's trigger prop to play a luz sound event, preserving
 * its original type. No-op unless `config.sound.enabled` is `true`.
 */
function sounded<T extends React.ComponentType<never>>(
  event: SoundEvent,
  Component: T,
  triggerProp?: string,
): Soundable<T> {
  return withSound(
    event,
    Component as never,
    triggerProp,
  ) as unknown as Soundable<T>;
}

/** Like `sounded`, but for components shown/hidden imperatively (mount/unmount), not clicked. */
function lifecycleSounded<T extends React.ComponentType<never>>(
  openEvent: SoundEvent,
  closeEvent: SoundEvent,
  Component: T,
): Soundable<T> {
  return withLifecycleSound(
    openEvent,
    closeEvent,
    Component as never,
  ) as unknown as Soundable<T>;
}

/** Plays `error`/`success` when a `Field.Root`'s validity flips, driven by its `data-invalid` attribute. */
function validitySounded<T extends React.ComponentType<never>>(
  Component: T,
): T {
  return withValiditySound(Component as never) as unknown as T;
}

/**
 * Component namespace re-exporting `@base-ui/react` with luz's injected
 * `<style>` (via `styled`) and synthesized UI sound effects (via `sounded`).
 */
export const lui: LuiComponents = {
  /** Avatar with fallback initials/image. `root` accepts an `"avatar"` className. */
  avatar: {
    root: styled("avatar", Avatar.Root),
    image: Avatar.Image,
    fallback: Avatar.Fallback,
  },
  /**
   * Button. Plays a "click" sound. Variant className modifiers: `success`,
   * `contrast`, `over`, `danger`, `reset`, `pressed`, `warning`, `ghost`.
   */
  button: sounded("click", Button),
  /** Compound menu (trigger/popup/items/radio group). Item clicks play "click". */
  menu: {
    root: styled("menu", Menu.Root),
    trigger: Menu.Trigger,
    portal: Menu.Portal,
    arrow: Menu.Arrow,
    item: sounded("click", Menu.Item),
    link: Menu.LinkItem,
    separator: Menu.Separator,
    popup: Menu.Popup,
    positioner: Menu.Positioner,
    radiogroup: Menu.RadioGroup,
    radioitem: Menu.RadioItem,
    radioitemindicator: Menu.RadioItemIndicator,
    submenu: Menu.SubmenuRoot,
    submenutrigger: Menu.SubmenuTrigger,
  },
  /** Horizontal bar of top-level `lui.menu.root`s (File/Edit/Help style). */
  menubar: styled("menubar", Menubar),
  /** Compound tabs (list/tab/panel). Switching tabs plays "snap". */
  tabs: {
    root: styled("tabs", Tabs.Root),
    tab: sounded("snap", Tabs.Tab),
    panel: Tabs.Panel,
    list: Tabs.List,
    indicator: Tabs.Indicator,
  },
  /** Compound meter (label/value/track/indicator) for a bounded numeric value. */
  meter: {
    root: styled("meter", Meter.Root),
    label: Meter.Label,
    value: Meter.Value,
    track: Meter.Track,
    indicator: Meter.Indicator,
  },
  /** Form wrapper; plays "success" on submit. */
  form: sounded("success", styled("form", Form), "onFormSubmit"),
  /** Compound form field (label/control/description/error). */
  field: {
    /** Plays "error"/"success" when validity flips (via `data-invalid`). */
    root: validitySounded(styled("field", Field.Root)),
    label: Field.Label,
    /** Native input/textarea wrapper; plays "hover" on focus. */
    control: sounded("hover", Field.Control, "onFocus"),
    description: Field.Description,
    error: Field.Error,
  },
  /** Single toggle button, typically inside `lui.togglegroup`. Plays "toggle". */
  toggle: sounded("toggle", Toggle),
  /** Group of `lui.toggle`s with shared exclusive/multi selection state. */
  togglegroup: styled("togglegroup", ToggleGroup),
  /** Compound toast (provider/portal/viewport/root). Root plays "pop" on open, "whoosh" on close. */
  toast: {
    core: ToastCore,
    provider: styled("toast", Toast.Provider),
    portal: Toast.Portal,
    viewport: Toast.Viewport,
    root: lifecycleSounded("pop", "whoosh", Toast.Root),
    content: Toast.Content,
    title: Toast.Title,
    description: Toast.Description,
    action: Toast.Action,
    close: Toast.Close,
  },
  /** Compound switch (root/thumb). Root plays "toggle" on `onCheckedChange`. */
  switch: {
    root: sounded("toggle", Switch.Root, "onCheckedChange"),
    thumb: Switch.Thumb,
  },
  /** Styled `<article>` container, used as the outer wrapper for most samples. */
  card: styled("card", Card),
  /** Compound dialog (trigger/portal/backdrop/popup). Trigger plays "click". */
  dialog: {
    root: styled("dialog", Dialog.Root),
    trigger: sounded("click", Dialog.Trigger),
    portal: Dialog.Portal,
    backdrop: Dialog.Backdrop,
    popup: Dialog.Popup,
    title: Dialog.Title,
    description: Dialog.Description,
    close: Dialog.Close,
  },
};
