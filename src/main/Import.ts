import CONST from "../data/CONST";
import ImportTemplate from "../template/Import.template";
import importElements from "../elements/importElements";
import { Ref } from "../data/Ref";
import REST, { ImportInboxRule, UnidentifiedInboxRule } from "../ms/REST";

function convertExportedRuleToImportableRule(
	rule: UnidentifiedInboxRule | ImportInboxRule,
): ImportInboxRule {
	// __type: PeopleIdentity:#Exchange
	// RoutingType -> SMTP
	// Ignore Address, AddressOrigin
	// to: ExceptIfFrom, ExceptIfSentTo, ForwardAsAttachmentTo, ForwardTo, From, RedirectTo, SentTo
	//
	// Priority used for sorting
	// ---------------
	// TODO: Check CopyToFolder, MoveToFolder

	delete rule["Priority"];

	for (const prop of REST.propsToClean) {
		delete rule[prop];
	}

	for (const prop of REST.identityProps) {
		if (!Array.isArray(rule[prop])) {
			continue;
		}
		rule[prop][0].__type = "PeopleIdentity:#Exchange";
	}

	for (const prop in rule) {
		if (typeof rule[prop] !== "string") {
			continue;
		}
		if (rule[prop].startsWith("Null")) {
			delete rule[prop];
		}
	}

	rule.Name += " (Imported)";
	rule.IsEnabled = false;

	return rule;
}

function processExportedRules(
	rules: UnidentifiedInboxRule[],
): ImportInboxRule[] {
	// Lower priority higher -> added last
	rules.sort((ruleA, ruleB) => ruleB.Priority - ruleA.Priority);

	return rules.map(convertExportedRuleToImportableRule);
}

function isValidFile(file: File | undefined): boolean {
	if (!file) {
		return true;
	}

	const fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1);

	return fileExtension === CONST.FILE_EXTENSION;
}

async function readRuleFromFile(
	file: File | undefined,
): Promise<ImportInboxRule[]> {
	if (!file) {
		return [];
	}

	if (!isValidFile(file)) {
		return [];
	}

	return new Promise((resolve) => {
		const fileReader = new FileReader();

		fileReader.onload = () => {
			const result = fileReader.result as string | null;
			if (!result) {
				resolve([]);
				return;
			}
			resolve(JSON.parse(result));
		};

		fileReader.readAsText(file);
	});
}

function onFileChange(
	error: Ref<string | undefined>,
	rows: Ref<UnidentifiedInboxRule[]>,
) {
	console.log("New instance");
	return (file: File | undefined) => {
		console.log("File Changed!");
		if (!file) {
			error.value = undefined;
			rows.value = [];
			return;
		}

		if (
			file.name.substring(file.name.lastIndexOf(".") + 1) !==
			CONST.FILE_EXTENSION
		) {
			error.value = `Selected file is not of type '${CONST.FILE_EXTENSION}'`;
			rows.value = [];
			return;
		}
		error.value = undefined;
		rows.value = [];
		const fileReader = new FileReader();

		fileReader.onload = () => {
			const result = fileReader.result as string | null;
			if (!result) {
				error.value = "Could not read file.";
				return;
			}
			rows.value = JSON.parse(result);
		};

		fileReader.readAsText(file);
	};
}

function newImportObject() {
	return {
		__type: "NewInboxRuleRequest:#Exchange",
		Header: {
			__type: "JsonRequestHeaders:#Exchange",
			RequestServerVersion: "Exchange2013",
			TimeZoneContext: {
				__type: "TimeZoneContext:#Exchange",
				TimeZoneDefinition: {
					__type: "TimeZoneDefinitionType:#Exchange",
					Id: "W. Europe Standard Time",
				},
			},
		},
		AlwaysDeleteOutlookRulesBlob: false,
		Force: false,
		InboxRule: {} as Record<string, any>,
	};
}

async function importRows(
	rules: UnidentifiedInboxRule[],
	progress: Ref<number>,
) {
	const importRules = processExportedRules(rules);
	const importObject = newImportObject();
	for (const row of importRules) {
		importObject.InboxRule = row;
		importObject.InboxRule.__type = "InboxRule:#Exchange";
		await REST.saveInboxRule(importObject);
		progress.value++;
	}
}

function getElement() {
	const div = document.createElement("div");

	div.classList.add(CONST.ELEMENT_CLASS);

	const button = ImportTemplate().root;

	button.addEventListener("click", (event) => {
		const dialog = importElements.importDialog();

		document.body.appendChild(dialog.root);
		dialog.root.showModal();

		dialog.file.effect(onFileChange(dialog.error, dialog.rows));

		dialog.button.addEventListener("click", async (event) => {
			dialog.button.setAttribute("disabled", "disabled");
			await importRows(
				dialog.rows.value.filter(
					(rule) => dialog.checked.value[rule.Name].value,
				),
				dialog.progress,
			);
			location.reload();
		});
	});

	div.appendChild(button);
	return div;
}

export default {
	getElement,
	readRulesFromFile: readRuleFromFile,
	isValidFile,
};
