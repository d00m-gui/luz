declare function luz(config?: any): any;
import { Avatar } from "@base-ui/react/avatar";
import { Menu } from "@base-ui/react/menu";
import { Tabs } from "@base-ui/react/tabs";
declare function Card(props: React.ComponentProps<"article">): React.ReactNode;
import { Menubar } from "@base-ui/react/menubar";
import { Field, Form, Meter, Switch, Toast, Toggle, ToggleGroup, Button, Dialog } from "@base-ui/react";
import { Toast as ToastCore } from "@base-ui/react/toast";
/**
* Unified component namespace for Base UI components.
*/
interface LuiComponents {
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
interface AvatarTypes {
	root: typeof Avatar.Root;
	image: typeof Avatar.Image;
	fallback: typeof Avatar.Fallback;
}
interface DialogType {
	root: typeof Dialog.Root;
	trigger: typeof Dialog.Trigger;
	portal: typeof Dialog.Portal;
	backdrop: typeof Dialog.Backdrop;
	popup: typeof Dialog.Popup;
	title: typeof Dialog.Title;
	description: typeof Dialog.Description;
	close: typeof Dialog.Close;
}
type ButtonType = typeof Button;
interface MenuItemTypes {
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
type MenubarType = typeof Menubar;
type FormRoot = typeof Form;
interface TabsComponentTypes {
	root: typeof Tabs.Root;
	tab: typeof Tabs.Tab;
	panel: typeof Tabs.Panel;
	list: typeof Tabs.List;
	indicator: typeof Tabs.Indicator;
}
interface MeterComponentTypes {
	root: typeof Meter.Root;
	label: typeof Meter.Label;
	value: typeof Meter.Value;
	track: typeof Meter.Track;
	indicator: typeof Meter.Indicator;
}
interface FieldTypes {
	root: typeof Field.Root;
	label: typeof Field.Label;
	control: typeof Field.Control;
	description: typeof Field.Description;
	error: typeof Field.Error;
}
type ToggleRoot = typeof Toggle;
type ToggleGroupRoot = typeof ToggleGroup;
interface ToastComponentTypes {
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
interface SwitchComponentTypes {
	root: typeof Switch.Root;
	thumb: typeof Switch.Thumb;
}
type CardType = typeof Card;
declare const lui: LuiComponents;
export { luz, lui };
