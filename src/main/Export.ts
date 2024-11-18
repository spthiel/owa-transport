import {fetchService} from "../ms/microsoft";

async function getAll() {
	await fetchService('GetInboxRule', {"__type":"GetInboxRuleRequest:#Exchange","Header":{"__type":"JsonRequestHeaders:#Exchange","RequestServerVersion":"Exchange2013","TimeZoneContext":{"__type":"TimeZoneContext:#Exchange","TimeZoneDefinition":{"__type":"TimeZoneDefinitionType:#Exchange","Id":"W. Europe Standard Time"}}}})
}
import CONST from "../data/CONST";
import createElement from "../elements/createElement";
import elements from "../elements/elements";

function button() {
	
	const button = elements.iconButton('Export', 'documentForward');
	
	button.addEventListener('click', (event) => {
		console.log(event);
	})
	
	return button;
}

function getElement() {
	const div = document.createElement("div");
	
	div.classList.add(CONST.ELEMENT_CLASS)
	
	
	div.appendChild(button());
	return div;
}

export default {
	getElement
}