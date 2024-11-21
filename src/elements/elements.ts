import createElement from "./createElement";
import DialogTemplate from "../template/Dialog.template";
import CheckboxTemplate from "../template/Checkbox.template";
import ref from "../data/Ref";
import FileUploadTemplate from "../template/FileUpload.template";
import CheckboxRowTemplate from "../template/CheckboxRow.template";

function checkbox(checked: boolean = true) {
	const checkbox = CheckboxTemplate();
	const checkedState = ref<boolean>(true);

	checkbox.root.addEventListener("click", (ev) => {
		checkedState.value = !checked;
	});

	checkedState.effect((isChecked) => {
		const list = checkbox.icon.classList;
		checked = isChecked;
		if (checked) {
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

function fileUpload(buttonText: string, info: string) {
	const upload = FileUploadTemplate();

	upload.info.innerText = info;
	upload.buttonText.innerText = buttonText;

	const file = ref<File | undefined>(undefined);
	const error = ref<string | undefined>(undefined);

	upload.button.addEventListener("click", (event) => {
		upload.fileUpload.click();
	});

	upload.fileUpload.addEventListener("change", (event) => {
		file.value = upload.fileUpload.files?.[0];
	});

	error.effect((error) => {
		if (!error) {
			upload.error.setAttribute("hidden", "");
			upload.errorText.innerText = "";
			return;
		}
		upload.error.removeAttribute("hidden");
		upload.errorText.innerText = error;
	});

	file.effect((selectedFile) => {
		upload.fileName.value = selectedFile?.name || "";
	});

	return {
		root: upload.root,
		fileUpload: upload.fileUpload,
		file: file,
		error: error,
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

function checkboxRow(name: string, checked: boolean = true) {
	const row = CheckboxRowTemplate();
	const cb = checkbox(checked);

	row.col1.append(cb.root);
	row.name.innerText = name;

	return {
		root: row.root,
		checked: cb.checked,
	};
}

export default {
	css,
	dialog,
	checkbox,
	fileUpload,
	checkboxRow,
};
