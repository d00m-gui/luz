import { lui } from "../../../dist/react";
export function ToastSample() {
	return (
		<lui.toast.provider>
			<lui.card>
				<h2>
					notifications <small>(toast)</small>
				</h2>
				<div className="card-content">
					<Form />
				</div>
			</lui.card>
			<lui.toast.portal>
				<lui.toast.viewport>
					<ToastList />
				</lui.toast.viewport>
			</lui.toast.portal>
		</lui.toast.provider>
	);
}

function Form() {
	const toastManager = lui.toast.core.useToastManager();
	function action() {
		const id = toastManager.add({
			title: "Action performed",
			description: "You can undo this action.",
			type: "success",
			actionProps: {
				children: "Undo",
				onClick() {
					toastManager.close(id);
					toastManager.add({ title: "Action undone" });
				},
			},
		});
	}
	return (
		<button type="button" onClick={action} className="danger">
			Friendly Delete Test
		</button>
	);
}

function ToastList() {
	const { toasts } = lui.toast.core.useToastManager();
	return toasts.map((toast) => (
		<lui.toast.root key={toast.id} toast={toast} className="toast">
			<lui.toast.content className="content">
				<lui.toast.title className="title" />
				<lui.toast.description className="description" />
				<lui.toast.action className="undo" />
				<lui.toast.close className="close" aria-label="Close">
					<i className="nf nf-md-close_thick" />
				</lui.toast.close>
			</lui.toast.content>
		</lui.toast.root>
	));
}
