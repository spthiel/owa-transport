import CONST from "../data/CONST";
import ExportTemplate from "../template/Export.template";
import ExportDialogTemplate from "../template/ExportDialog.template";
import ExportDialogRowTemplate from "../template/ExportDialogRow.template";
import elements from "../elements/elements";
import REST, { InboxRule } from "../ms/REST";

async function buildDialog(dialogBody: HTMLDivElement) {
	const exportDialog = ExportDialogTemplate();

	dialogBody.append(exportDialog.root);
	const grid = exportDialog.grid;

	const inboxRules = await REST.getInboxRules();

	for (const rule of inboxRules) {
		const row = ExportDialogRowTemplate();
		row.name.innerText = rule.Name;
		grid.append(row.root);
	}
}

const propsToClean = [
	"Description", // meta-data
	"DescriptionTimeFormat", // meta-data
	"DescriptionTimeZone", // meta-data
	"Enabled", // meta-data
	"ErrorType", // meta-data
	"Identity", // meta-data
	"InError", // meta-data
	"SupportedByTask", // meta-data
	"WarningMessages", // meta-data
	"CopyToFolder", // TODO: Find way to export
	"MoveToFolder", // TODO: Find way to export
	"ApplySystemCategory", // unused
	"DeleteSystemCategory", // unused
	"ExceptIfFlaggedForAction", // unused
	"ExceptIfFromSubscription", // unused
	"ExceptIfHasClassification", // Broken
	"FlaggedForAction", // Duplicate
	"FromSubscription", // unused
	"HasClassification", // Broken
	"SendTextMessageNotificationTo", // Not supported
];

const identityProps = [
	"ExceptIfFrom",
	"ExceptIfSentTo",
	"ForwardAsAttachmentTo",
	"ForwardTo",
	"From",
	"RedirectTo",
	"SentTo",
];

interface ExportIdentity {
	Address: string;
	AddressOrigin: number;
	DisplayName: string;
	RoutingType: string;
	SmtpAddress: string;
}

function formatPeopleIdentity(identity: ExportIdentity) {
	return {
		DisplayName: identity.DisplayName,
		RoutingType: "SMTP",
		SmtpAddress: identity.Address,
	};
}

function cleanRule(rule: InboxRule): Omit<InboxRule, "Identity"> {
	for (const prop of propsToClean) {
		delete rule[prop];
	}

	for (const prop of identityProps) {
		if (!Array.isArray(rule[prop])) {
			continue;
		}
		rule[prop][0] = formatPeopleIdentity(rule[prop][0] as ExportIdentity);
	}

	return rule;
}

function download(filename: string, text: string) {
	const element = document.createElement("a");
	element.setAttribute(
		"href",
		"data:application/json;charset=utf-8," + encodeURIComponent(text),
	);
	element.setAttribute("download", filename);

	element.style.display = "none";
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

function getDateTime(): string {
	const date = new Date();

	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}

function getElement() {
	const div = document.createElement("div");

	div.classList.add(CONST.ELEMENT_CLASS);

	const button = ExportTemplate().root;

	button.addEventListener("click", async (event) => {
		const rules = await REST.getInboxRules();
		const dialog = elements.exportDialog(rules);

		document.body.appendChild(dialog.root);
		dialog.root.showModal();

		dialog.button.addEventListener("click", () => {
			const rulesToExport = rules
				.filter(
					(rule) => dialog.states[rule.Identity.RawIdentity].value,
				)
				.map((rule) => cleanRule(rule));

			const json = JSON.stringify(rulesToExport, null, 4);

			download(`inbox-rules-${getDateTime()}.json`, json);
		});
	});

	div.appendChild(button);
	return div;
}

export default {
	getElement,
};
