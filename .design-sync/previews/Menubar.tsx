// Ported from examples/ui/samples/menubar.tsx — real File/Edit/Help menu
// composition (closed state; Menu popups are portal-rendered on open, so a
// static card shows the menubar trigger row, which is the plausible default
// preview for this component).
import { Menu, Menubar } from "@d00m-gui/luz";

export function AppMenu() {
  return (
    <Menubar>
      <Menu.root>
        <Menu.trigger>File</Menu.trigger>
        <Menu.portal>
          <Menu.positioner sideOffset={3} alignOffset={53}>
            <Menu.popup>
              <Menu.item>New</Menu.item>
              <Menu.item>Open File...</Menu.item>
              <Menu.separator />
              <Menu.item>Preferences</Menu.item>
            </Menu.popup>
          </Menu.positioner>
        </Menu.portal>
      </Menu.root>
      <Menu.root>
        <Menu.trigger>Edit</Menu.trigger>
        <Menu.portal>
          <Menu.positioner sideOffset={3} alignOffset={30}>
            <Menu.popup>
              <Menu.item>Copy</Menu.item>
              <Menu.item>Paste</Menu.item>
            </Menu.popup>
          </Menu.positioner>
        </Menu.portal>
      </Menu.root>
      <Menu.root disabled>
        <Menu.trigger>Help</Menu.trigger>
      </Menu.root>
    </Menubar>
  );
}
