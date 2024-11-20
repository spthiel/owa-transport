import CONST from "../data/CONST";
import ImportTemplate from "../template/Import.template";
import ImportDialogTemplate from "../template/ImportDialog.template";

function convertExportedRuleToImportableRule() {
	// __type: PeopleIdentity:#Exchange
	// RoutingType -> SMTP
	// Ignore Address, AddressOrigin
	// to: ExceptIfFrom, ExceptIfSentTo, ForwardAsAttachmentTo, ForwardTo, From, RedirectTo, SentTo
	//
	// Priority used for sorting
	// ---------------
	// TODO: Check CopyToFolder, MoveToFolder
}

function getElement() {
	const div = document.createElement("div");

	div.classList.add(CONST.ELEMENT_CLASS);

	const button = ImportTemplate().root;

	button.addEventListener("click", (event) => {
		const dialog = ImportDialogTemplate();

		// dialog.root.addEventListener("close", (event) => {
		// 	dialog.root.remove();
		// })
		//
		// document.body.appendChild(dialog.root);
		// dialog.root.showModal();
	});

	div.appendChild(button);
	return div;
}

export default {
	getElement,
};

/*
cookieStore.get("X-OWA-CANARY")
  .then(value => value.value)
  .then((cookie) => {
    fetch(
    	url
      {
        "headers": {
          "action": "NewInboxRule",
          "x-owa-canary": cookie,
          "x-owa-urlpostdata": "%7B%22__type%22%3A%22NewInboxRuleRequest%3A%23Exchange%22%2C%22Header%22%3A%7B%22__type%22%3A%22JsonRequestHeaders%3A%23Exchange%22%2C%22RequestServerVersion%22%3A%22Exchange2013%22%2C%22TimeZoneContext%22%3A%7B%22__type%22%3A%22TimeZoneContext%3A%23Exchange%22%2C%22TimeZoneDefinition%22%3A%7B%22__type%22%3A%22TimeZoneDefinitionType%3A%23Exchange%22%2C%22Id%22%3A%22W.%20Europe%20Standard%20Time%22%7D%7D%7D%2C%22InboxRule%22%3A%7B%22__type%22%3A%22InboxRule%3A%23Exchange%22%2C%22Name%22%3A%22Test%22%2C%22StopProcessingRules%22%3Atrue%2C%22SubjectContainsWords%22%3A%5B%22test%22%5D%2C%22WithinSizeRangeMinimum%22%3A0%2C%22WithinSizeRangeMaximum%22%3A0%2C%22ApplyCategory%22%3A%5B%22Assigned%22%5D%7D%2C%22AlwaysDeleteOutlookRulesBlob%22%3Afalse%2C%22Force%22%3Afalse%7D",
        },
        "method": "POST",
      }
    );
})
 */