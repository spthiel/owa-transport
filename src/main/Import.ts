import CONST from "../data/CONST";
import createElement from "../elements/createElement";
import elements from "../elements/elements";

function button() {
	const button = elements.iconButton('Import', 'documentReply')
	
	button.addEventListener('click', (event) => {
		const dialog = elements.dialog('Import');
		
		console.log(dialog);
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