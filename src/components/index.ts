// React adapter - simplified export of @base-ui/react components
// Provides clean `lui` namespace for Base UI components
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
} from "@base-ui/react";
import { Toast as ToastCore } from "@base-ui/react/toast";
import { Card } from "./card";
import type { LuiComponents } from "./types";

export const lui: LuiComponents = {
  avatar: {
    root: Avatar.Root,
    image: Avatar.Image,
    fallback: Avatar.Fallback,
  },
  button: Button,
  menu: {
    root: Menu.Root,
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
  menubar: Menubar,
  tabs: {
    root: Tabs.Root,
    tab: Tabs.Tab,
    panel: Tabs.Panel,
    list: Tabs.List,
    indicator: Tabs.Indicator,
  },
  meter: {
    root: Meter.Root,
    label: Meter.Label,
    value: Meter.Value,
    track: Meter.Track,
    indicator: Meter.Indicator,
  },
  form: Form,
  field: {
    root: Field.Root,
    label: Field.Label,
    control: Field.Control,
    description: Field.Description,
    error: Field.Error,
  },
  toggle: Toggle,
  togglegroup: ToggleGroup,
  toast: {
    core: ToastCore,
    provider: Toast.Provider,
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
  card: Card,
};
