import { lui } from "../../../dist/react";

export function MenubarSample() {
	return (
		<lui.card>
			<h2>menubar</h2>
			<div className="card-content">
				<lui.menubar>
					<lui.menu.root>
						<lui.menu.trigger>File</lui.menu.trigger>
						<lui.menu.portal>
							<lui.menu.positioner sideOffset={3} alignOffset={53}>
								<lui.menu.popup>
									<lui.menu.item>New</lui.menu.item>
									<lui.menu.item>Open File...</lui.menu.item>

									<lui.menu.separator className="separetor" />
									<lui.menu.item>Preferences</lui.menu.item>
								</lui.menu.popup>
							</lui.menu.positioner>
						</lui.menu.portal>
					</lui.menu.root>

					<lui.menu.root>
						<lui.menu.trigger>Edit</lui.menu.trigger>
						<lui.menu.portal>
							<lui.menu.positioner sideOffset={3} alignOffset={30}>
								<lui.menu.popup>
									<lui.menu.item>Copy</lui.menu.item>
									<lui.menu.item>Paste</lui.menu.item>
								</lui.menu.popup>
							</lui.menu.positioner>
						</lui.menu.portal>
					</lui.menu.root>

					<lui.menu.root disabled>
						<lui.menu.trigger>Help</lui.menu.trigger>
					</lui.menu.root>
				</lui.menubar>
			</div>
		</lui.card>
	);
}
