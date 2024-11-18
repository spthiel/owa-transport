import createElement from "./createElement";

function icon(icon: string) {
	return createElement(
		'span',
		["_fc_3", "owaimg", "_opc_g", `ms-Icon--${icon}`, "ms-icon-font-size-18", "ms-fcl-ns-b"],
	)
}

function iconButton(title: string, iconName: string) {
	return createElement(
		'button',
		['_opc_e', 'ms-font-xs', 'ms-font-color-neutralSecondary', 'o365button'],
		{
			'title': title
		},
		icon(iconName)
	)
}

function dialog(title: string, ...children: Node[]) {
	
	const closeElement = iconButton('close', '')
	
	const titleElement = createElement(
		'h2',
		['title'],
		{},
		title
	)
	
	const header = createElement(
		'div',
		['header'],
		{},
		titleElement
	)
	
	const body = createElement(
		'div',
		[],
		{},
		...children
	)
	
	const dialog = createElement(
		'dialog',
		['owa-transport'],
		{},
		header,
		body
	) as HTMLDialogElement
	
	document.body.appendChild(dialog);
	
	dialog.showModal();
	
	return dialog;
}

function css() {
	const style = createElement(
		'style',
		[],
		{
			'owa-transport': 'injected'
		}
	)
	
	style.innerText = STYLESHEET;
	
	return style;
}

export default {
	icon,
	iconButton,
	dialog,
	css
}