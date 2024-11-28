import { fetchService } from "./microsoft";

export interface InboxRule extends UnidentifiedInboxRule {
	Identity: {
		DisplayName: string;
		RawIdentity: string;
	};
}

export interface UnidentifiedInboxRule extends ImportInboxRule {
	Priority: number;
}

export interface ImportInboxRule {
	Name: string;
	ApplyCategory: [string];

	[key: string]: unknown;
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

export interface ExportIdentity {
	Address: string;
	AddressOrigin: number;
	DisplayName: string;
	RoutingType: string;
	SmtpAddress: string;
}

async function getInboxRules(): Promise<InboxRule[]> {
	return await fetchService("GetInboxRule", {
		__type: "GetInboxRuleRequest:#Exchange",
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
	})
		.then((res) => res.json())
		.then((res) => res.InboxRuleCollection.InboxRules);
}

async function saveInboxRule(rule: Record<string, unknown>) {
	return await fetchService("NewInboxRule", rule);
}

export default {
	getInboxRules,
	saveInboxRule,
	identityProps,
	propsToClean,
};
