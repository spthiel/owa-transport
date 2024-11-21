import elements from "./elements";
import ImportDialogTemplate from "../template/ImportDialog.template";
import ref, { Ref } from "../data/Ref";
import { UnidentifiedInboxRule } from "../ms/REST";

function importDialog() {
	const importDialog = ImportDialogTemplate();
	const dialog = elements.dialog("Import Inbox Rules");
	const fileUpload = elements.fileUpload(
		"Browse",
		"Choose the location of the inbox-rules export file that you want to import.",
	);
	const selectAllCheckbox = elements.checkbox();

	fileUpload.fileUpload.setAttribute("accept", ".owa-export");

	dialog.body.appendChild(importDialog.root);
	importDialog.upload.append(fileUpload.root);
	importDialog.selectAll.append(selectAllCheckbox.root);

	const checked = ref<Record<string, Ref<boolean>>>({});
	const rules = ref<UnidentifiedInboxRule[]>([]);
	const progress = ref<number>(0);

	rules.effect((newRules) => {
		if (newRules.length === 0) {
			importDialog.table.setAttribute("hidden", "");
			return;
		}
		importDialog.table.removeAttribute("hidden");

		let first = true;

		for (const child of importDialog.grid.children) {
			if (first) {
				first = false;
				continue;
			}
			child.remove();
		}

		checked.value = {};
		selectAllCheckbox.checked.value = false;

		for (const rule of newRules) {
			const row = elements.checkboxRow(rule.Name, false);
			importDialog.grid.append(row.root);

			checked.value[rule.Name] = row.checked;
		}
	});

	selectAllCheckbox.checked.effect((isChecked) => {
		Object.values(checked.value).forEach(
			(signal) => (signal.value = isChecked),
		);
	});

	progress.effect((nextProgress) => {
		importDialog.progress.innerText = " " + nextProgress + " ";
		importDialog.max.innerText =
			" " +
			Object.values(checked.value).filter((value) => value.value).length +
			" ";
		importDialog.progressTracker.removeAttribute("hidden");
	});

	return {
		root: dialog.root,
		file: fileUpload.file,
		rows: rules,
		error: fileUpload.error,
		checked: checked,
		button: importDialog.button,
		progress: progress,
	};
}

export default {
	importDialog,
};
