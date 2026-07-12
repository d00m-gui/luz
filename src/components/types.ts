import { Avatar } from "@base-ui/react/avatar";
import { Menu } from "@base-ui/react/menu";
import { Tabs } from "@base-ui/react/tabs";
import { Card } from "../components/card";
import { Menubar } from "@base-ui/react/menubar";
import {
  Field,
  Form,
  Meter,
  Switch,
  Toast,
  Toggle,
  ToggleGroup,
  Button,
  Dialog,
} from "@base-ui/react";
import { Toast as ToastCore } from "@base-ui/react/toast";

/**
 * Unified component namespace for Base UI components.
 */
export interface LuiComponents {
  avatar: AvatarTypes;
  button: ButtonType;
  menu: MenuItemTypes;
  menubar: MenubarType;
  tabs: TabsComponentTypes;
  meter: MeterComponentTypes;
  form: FormRoot;
  field: FieldTypes;
  toggle: ToggleRoot;
  togglegroup: ToggleGroupRoot;
  toast: ToastComponentTypes;
  switch: SwitchComponentTypes;
  card: CardType;
  dialog: DialogType;
}

export interface AvatarTypes {
  root: typeof Avatar.Root;
  image: typeof Avatar.Image;
  fallback: typeof Avatar.Fallback;
}

export interface DialogType {
  root: typeof Dialog.Root;
  trigger: typeof Dialog.Trigger;
  portal: typeof Dialog.Portal;
  backdrop: typeof Dialog.Backdrop;
  popup: typeof Dialog.Popup;
  title: typeof Dialog.Title;
  description: typeof Dialog.Description;
  close: typeof Dialog.Close;
}

export type ButtonType = typeof Button;

export interface MenuItemTypes {
  root: typeof Menu.Root;
  trigger: typeof Menu.Trigger;
  portal: typeof Menu.Portal;
  arrow: typeof Menu.Arrow;
  item: typeof Menu.Item;
  link: typeof Menu.LinkItem;
  separator: typeof Menu.Separator;
  popup: typeof Menu.Popup;
  positioner: typeof Menu.Positioner;
  radiogroup: typeof Menu.RadioGroup;
  radioitem: typeof Menu.RadioItem;
  radioitemindicator: typeof Menu.RadioItemIndicator;
  submenu: typeof Menu.SubmenuRoot;
  submenutrigger: typeof Menu.SubmenuTrigger;
}

export type MenubarType = typeof Menubar;

export type FormRoot = typeof Form;

export interface TabsComponentTypes {
  root: typeof Tabs.Root;
  tab: typeof Tabs.Tab;
  panel: typeof Tabs.Panel;
  list: typeof Tabs.List;
  indicator: typeof Tabs.Indicator;
}

export interface MeterComponentTypes {
  root: typeof Meter.Root;
  label: typeof Meter.Label;
  value: typeof Meter.Value;
  track: typeof Meter.Track;
  indicator: typeof Meter.Indicator;
}

export interface FieldTypes {
  root: typeof Field.Root;
  label: typeof Field.Label;
  control: typeof Field.Control;
  description: typeof Field.Description;
  error: typeof Field.Error;
}

export type ToggleRoot = typeof Toggle;

export type ToggleGroupRoot = typeof ToggleGroup;

export interface ToastComponentTypes {
  core: typeof ToastCore;
  provider: typeof Toast.Provider;
  portal: typeof Toast.Portal;
  viewport: typeof Toast.Viewport;
  root: typeof Toast.Root;
  content: typeof Toast.Content;
  title: typeof Toast.Title;
  description: typeof Toast.Description;
  action: typeof Toast.Action;
  close: typeof Toast.Close;
}

export interface SwitchComponentTypes {
  root: typeof Switch.Root;
  thumb: typeof Switch.Thumb;
}

export type CardType = typeof Card;

export type Lui = LuiComponents & {
  avatar: AvatarTypes;
  button: ButtonType;
  menu: MenuItemTypes;
  menubar: MenubarType;
  tabs: TabsComponentTypes;
  meter: MeterComponentTypes;
  form: FormRoot;
  field: FieldTypes;
  toggle: ToggleRoot;
  togglegroup: ToggleGroupRoot;
  toast: ToastComponentTypes;
  switch: SwitchComponentTypes;
  card: CardType;
};
