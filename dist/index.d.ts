/**
* Full configuration for the `luz()` function.
*/
interface LuzConfig {
	font?: string;
	"line-height"?: string;
	"font-bold-weight"?: number;
	"font-weight"?: number;
	"font-monospace"?: string;
	"font-headings"?: string;
	"font-emphasis"?: string;
	base?: number;
	power?: number;
	primary: string;
	name?: string;
	secondary?: string;
	mode?: "light" | "dark";
	neutrals?: string;
	prefix?: string;
	transition?: string;
	"box-shadow"?: string;
	spacing?: string;
	path?: string;
}
/** Settings sub-object within tokens (metadata only). */
interface TokenSettings {
	name: string;
	prefix?: string;
	neutrals?: string;
}
/** Generated size variable map (`--size-1` → `0.1rem`, etc.). */
type TokenSizes = Record<string, string>;
/** Full token set used by all downstream consumers. */
interface LuzTokens {
	settings: TokenSettings;
	colors: Record<string, string>;
	sizes: TokenSizes;
	typography: Partial<LuzConfig>;
}
/** Return value of the `luz()` function. */
interface LuzResult {
	/** Raw tokens object (structured). */
	tokens: LuzTokens;
	/** CSS custom property declarations as a single string. */
	variables: string;
	/** CSS @property generated via tokens */
	propierties: string;
}
/**
* Generate theme tokens and CSS custom properties from configuration.
*
* @param config - Optional override of default settings (typography, colors, sizing).
* @returns Object containing structured `tokens` and a string of CSS variables.
*/
declare function luz(config?: LuzConfig): LuzResult;
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
