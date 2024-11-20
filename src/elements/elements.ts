import createElement from "./createElement";
import DialogTemplate from "../template/Dialog.template";
import CheckboxTemplate from "../template/Checkbox.template";
import ref, { Signal } from "../data/Signal";
import ExportDialogTemplate from "../template/ExportDialog.template";
import ExportDialogRowTemplate from "../template/ExportDialogRow.template";
import { InboxRule } from "../ms/REST";

function checkbox(checked: boolean = true) {
	const checkbox = CheckboxTemplate();
	const checkedState = ref<boolean>(true);

	checkbox.root.addEventListener("click", (ev) => {
		checked = !checked;
		checkedState.value = checked;
	});

	checkedState.effect((isChecked) => {
		const list = checkbox.icon.classList;
		if (isChecked) {
			list.add("ms-Icon--checkboxCheck");
		} else {
			list.remove("ms-Icon--checkboxCheck");
		}
	});

	checkedState.value = checked;

	return {
		root: checkbox.root,
		checked: checkedState,
	};
}

function exportDialogRow(name: string) {
	const row = ExportDialogRowTemplate();
	const cb = checkbox();

	row.col1.append(cb.root);
	row.name.innerText = name;

	return {
		root: row.root,
		checked: cb.checked,
	};
}

function exportDialog(inboxRules: InboxRule[]) {
	const exportDialog = ExportDialogTemplate();
	const containerDialog = dialog("Export Inbox Rules");

	containerDialog.body.appendChild(exportDialog.root);

	const checked: Record<string, Signal<boolean>> = {};

	for (const rule of inboxRules) {
		const row = exportDialogRow(rule.Name);
		exportDialog.grid.append(row.root);

		checked[rule.Identity.RawIdentity] = row.checked;
	}

	const selectAllCheckbox = checkbox();

	exportDialog.selectAll.append(selectAllCheckbox.root);
	selectAllCheckbox.checked.effect((isChecked) => {
		Object.values(checked).forEach((signal) => (signal.value = isChecked));
	});

	return {
		root: containerDialog.root,
		states: checked,
		button: exportDialog.button,
	};
}

function dialog(title: string) {
	const dialog = DialogTemplate();

	dialog.root.addEventListener("close", (event) => {
		dialog.root.remove();
	});

	dialog.title.innerText = title;

	return {
		root: dialog.root,
		body: dialog.body,
	};
}

function css() {
	const style = createElement("style", [], {
		"owa-transport": "injected",
	});

	style.innerText = STYLESHEET;

	return style;
}

export default {
	css,
	dialog,
	checkbox,
	exportDialog,
	exportDialogRow,
};
