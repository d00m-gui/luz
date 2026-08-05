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

/** Wires a component to its lazy `<style>` injection, preserving its original type. */
function styled<T extends React.ComponentType<never>>(
  name: Parameters<typeof withComponentStyle>[0],
  Component: T,
): T {
  return withComponentStyle(name, Component as never) as unknown as T;
}

export const lui: LuiComponents = {
  avatar: {
    root: styled("avatar", Avatar.Root),
    image: Avatar.Image,
    fallback: Avatar.Fallback,
  },
  button: Button,
  menu: {
    root: styled("menu", Menu.Root),
    trigger: Menu.Trigger,
    portal: Menu.Portal,
    arrow: Menu.Arrow,
    item: Menu.Item,
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
  menubar: styled("menubar", Menubar),
  tabs: {
    root: styled("tabs", Tabs.Root),
    tab: Tabs.Tab,
    panel: Tabs.Panel,
    list: Tabs.List,
    indicator: Tabs.Indicator,
  },
  meter: {
    root: styled("meter", Meter.Root),
    label: Meter.Label,
    value: Meter.Value,
    track: Meter.Track,
    indicator: Meter.Indicator,
  },
  form: styled("form", Form),
  field: {
    root: styled("field", Field.Root),
    label: Field.Label,
    control: Field.Control,
    description: Field.Description,
    error: Field.Error,
  },
  toggle: Toggle,
  togglegroup: styled("togglegroup", ToggleGroup),
  toast: {
    core: ToastCore,
    provider: styled("toast", Toast.Provider),
    portal: Toast.Portal,
    viewport: Toast.Viewport,
    root: Toast.Root,
    content: Toast.Content,
    title: Toast.Title,
    description: Toast.Description,
    action: Toast.Action,
    close: Toast.Close,
  },
  switch: {
    root: Switch.Root,
    thumb: Switch.Thumb,
  },
  card: styled("card", Card),
  dialog: {
    root: styled("dialog", Dialog.Root),
    trigger: Dialog.Trigger,
    portal: Dialog.Portal,
    backdrop: Dialog.Backdrop,
    popup: Dialog.Popup,
    title: Dialog.Title,
    description: Dialog.Description,
    close: Dialog.Close,
  },
};
