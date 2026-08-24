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
import type { Soundable } from "./with-sound";

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

/** Prop types for `lui.avatar`. */
export interface AvatarTypes {
  root: typeof Avatar.Root;
  image: typeof Avatar.Image;
  fallback: typeof Avatar.Fallback;
}

/** Prop types for `lui.dialog`. */
export interface DialogType {
  root: typeof Dialog.Root;
  trigger: Soundable<typeof Dialog.Trigger>;
  portal: typeof Dialog.Portal;
  backdrop: typeof Dialog.Backdrop;
  popup: typeof Dialog.Popup;
  title: typeof Dialog.Title;
  description: typeof Dialog.Description;
  close: typeof Dialog.Close;
}

/** Prop types for `lui.button`. */
export type ButtonType = Soundable<typeof Button>;

/** Prop types for `lui.menu`. */
export interface MenuItemTypes {
  root: typeof Menu.Root;
  trigger: typeof Menu.Trigger;
  portal: typeof Menu.Portal;
  arrow: typeof Menu.Arrow;
  item: Soundable<typeof Menu.Item>;
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

/** Prop types for `lui.menubar`. */
export type MenubarType = typeof Menubar;

/** Prop types for `lui.form`. */
export type FormRoot = Soundable<typeof Form>;

/** Prop types for `lui.tabs`. */
export interface TabsComponentTypes {
  root: typeof Tabs.Root;
  tab: Soundable<typeof Tabs.Tab>;
  panel: typeof Tabs.Panel;
  list: typeof Tabs.List;
  indicator: typeof Tabs.Indicator;
}

/** Prop types for `lui.meter`. */
export interface MeterComponentTypes {
  root: typeof Meter.Root;
  label: typeof Meter.Label;
  value: typeof Meter.Value;
  track: typeof Meter.Track;
  indicator: typeof Meter.Indicator;
}

/** Prop types for `lui.field`. */
export interface FieldTypes {
  root: typeof Field.Root;
  label: typeof Field.Label;
  control: Soundable<typeof Field.Control>;
  description: typeof Field.Description;
  error: typeof Field.Error;
}

/** Prop types for `lui.toggle`. */
export type ToggleRoot = Soundable<typeof Toggle>;

/** Prop types for `lui.togglegroup`. */
export type ToggleGroupRoot = typeof ToggleGroup;

/** Prop types for `lui.toast`. */
export interface ToastComponentTypes {
  core: typeof ToastCore;
  provider: typeof Toast.Provider;
  portal: typeof Toast.Portal;
  viewport: typeof Toast.Viewport;
  root: Soundable<typeof Toast.Root>;
  content: typeof Toast.Content;
  title: typeof Toast.Title;
  description: typeof Toast.Description;
  action: typeof Toast.Action;
  close: typeof Toast.Close;
}

/** Prop types for `lui.switch`. */
export interface SwitchComponentTypes {
  root: Soundable<typeof Switch.Root>;
  thumb: typeof Switch.Thumb;
}

/** Prop types for `lui.card`. */
export type CardType = typeof Card;

