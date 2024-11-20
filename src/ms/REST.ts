import { fetchService } from "./microsoft";

export interface InboxRule {
	Name: string;
	ApplyCategory: string[];
	Identity: {
		DisplayName: string;
		RawIdentity: string;
	};

	[key: string]: unknown;
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

export default {
	getInboxRules,
};
