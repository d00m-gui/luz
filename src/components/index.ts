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

export const lui: LuiComponents = {
  avatar: {
    root: withComponentStyle("avatar", Avatar.Root) as typeof Avatar.Root,
    image: Avatar.Image,
    fallback: Avatar.Fallback,
  },
  button: Button,
  menu: {
    root: withComponentStyle("menu", Menu.Root) as typeof Menu.Root,
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
  menubar: withComponentStyle("menubar", Menubar) as typeof Menubar,
  tabs: {
    root: withComponentStyle("tabs", Tabs.Root) as typeof Tabs.Root,
    tab: Tabs.Tab,
    panel: Tabs.Panel,
    list: Tabs.List,
    indicator: Tabs.Indicator,
  },
  meter: {
    root: withComponentStyle("meter", Meter.Root) as typeof Meter.Root,
    label: Meter.Label,
    value: Meter.Value,
    track: Meter.Track,
    indicator: Meter.Indicator,
  },
  form: withComponentStyle("form", Form) as typeof Form,
  field: {
    root: withComponentStyle("field", Field.Root) as typeof Field.Root,
    label: Field.Label,
    control: Field.Control,
    description: Field.Description,
    error: Field.Error,
  },
  toggle: Toggle,
  togglegroup: withComponentStyle(
    "togglegroup",
    ToggleGroup,
  ) as typeof ToggleGroup,
  toast: {
    core: ToastCore,
    provider: withComponentStyle(
      "toast",
      Toast.Provider,
    ) as typeof Toast.Provider,
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
  card: withComponentStyle("card", Card) as typeof Card,
  dialog: {
    root: withComponentStyle("dialog", Dialog.Root) as typeof Dialog.Root,
    trigger: Dialog.Trigger,
    portal: Dialog.Portal,
    backdrop: Dialog.Backdrop,
    popup: Dialog.Popup,
    title: Dialog.Title,
    description: Dialog.Description,
    close: Dialog.Close,
  },
};
