import { InboxRule } from "../ms/REST";
import ExportDialogTemplate from "../template/ExportDialog.template";
import { Ref } from "../data/Ref";
import elements from "./elements";

function exportDialog(inboxRules: InboxRule[]) {
	const exportDialog = ExportDialogTemplate();
	const dialog = elements.dialog("Export Inbox Rules");

	dialog.body.appendChild(exportDialog.root);

	const checked: Record<string, Ref<boolean>> = {};

	for (const rule of inboxRules) {
		const row = elements.checkboxRow(rule.Name);
		exportDialog.grid.append(row.root);

		checked[rule.Identity.RawIdentity] = row.checked;
	}

	const selectAllCheckbox = elements.checkbox();

	exportDialog.selectAll.append(selectAllCheckbox.root);
	selectAllCheckbox.checked.effect((isChecked) => {
		Object.values(checked).forEach((signal) => (signal.value = isChecked));
	});

	return {
		root: dialog.root,
		states: checked,
		button: exportDialog.button,
	};
}

export default {
	exportDialog,
};
