import CONST from "../data/CONST";
import ExportTemplate from "../template/Export.template";
import REST, {
	ExportIdentity,
	InboxRule,
	UnidentifiedInboxRule,
} from "../ms/REST";
import exportElements from "../elements/exportElements";

function formatPeopleIdentity(identity: ExportIdentity) {
	return {
		DisplayName: identity.DisplayName,
		RoutingType: "SMTP",
		SmtpAddress: identity.Address,
	};
}

function cleanRule(rule: InboxRule): UnidentifiedInboxRule {
	for (const prop of REST.propsToClean) {
		delete rule[prop];
	}

	for (const prop of REST.identityProps) {
		if (!Array.isArray(rule[prop])) {
			continue;
		}
		rule[prop][0] = formatPeopleIdentity(rule[prop][0] as ExportIdentity);
	}

	for (const prop in rule) {
		if (rule[prop] === null) {
			delete rule[prop];
			continue;
		}
		if (rule[prop] === false) {
			delete rule[prop];
			continue;
		}
		if (typeof rule[prop] === "string" && rule[prop].startsWith("Null")) {
			delete rule[prop];
		}
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

function padZero(value: number) {
	if (value < 10) {
		return "0" + value;
	}

	return value.toString();
}

function getDateTime(): string {
	const date = new Date();

	return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}_${padZero(date.getHours())}-${padZero(date.getMinutes())}-${padZero(date.getSeconds())}`;
}

function getElement() {
	const div = document.createElement("div");

	div.classList.add(CONST.ELEMENT_CLASS);

	const button = ExportTemplate().root;

	button.addEventListener("click", async (event) => {
		const rules = await REST.getInboxRules();
		const dialog = exportElements.exportDialog(rules);

		document.body.appendChild(dialog.root);
		dialog.root.showModal();

		dialog.button.addEventListener("click", () => {
			const rulesToExport = rules
				.filter(
					(rule) => dialog.states[rule.Identity.RawIdentity].value,
				)
				.map((rule) => cleanRule(rule));

			const json = JSON.stringify(rulesToExport, null, 4);

			download(
				`inbox-rules-${getDateTime()}.${CONST.FILE_EXTENSION}`,
				json,
			);
		});
	});

	div.appendChild(button);
	return div;
}

export default {
	getElement,
};
