import { JSDOM } from "jsdom";

const typeNames = {
	a: "HTMLAnchorElement",
	area: "HTMLAreaElement",
	audio: "HTMLAudioElement",
	base: "HTMLBaseElement",
	blockquote: "HTMLQuoteElement",
	body: "HTMLBodyElement",
	br: "HTMLBRElement",
	button: "HTMLButtonElement",
	canvas: "HTMLCanvasElement",
	caption: "HTMLTableCaptionElement",
	col: "HTMLTableColElement",
	colgroup: "HTMLTableColElement",
	data: "HTMLDataElement",
	datalist: "HTMLDataListElement",
	del: "HTMLModElement",
	details: "HTMLDetailsElement",
	dialog: "HTMLDialogElement",
	div: "HTMLDivElement",
	dl: "HTMLDListElement",
	embed: "HTMLEmbedElement",
	fieldset: "HTMLFieldSetElement",
	form: "HTMLFormElement",
	h1: "HTMLHeadingElement",
	h2: "HTMLHeadingElement",
	h3: "HTMLHeadingElement",
	h4: "HTMLHeadingElement",
	h5: "HTMLHeadingElement",
	h6: "HTMLHeadingElement",
	head: "HTMLHeadElement",
	hr: "HTMLHRElement",
	iframe: "HTMLIFrameElement",
	img: "HTMLImageElement",
	input: "HTMLInputElement",
	ins: "HTMLModElement",
	label: "HTMLLabelElement",
	legend: "HTMLLegendElement",
	li: "HTMLLIElement",
	link: "HTMLLinkElement",
	map: "HTMLMapElement",
	menu: "HTMLMenuElement",
	meta: "HTMLMetaElement",
	meter: "HTMLMeterElement",
	object: "HTMLObjectElement",
	ol: "HTMLOListElement",
	optgroup: "HTMLOptGroupElement",
	option: "HTMLOptionElement",
	output: "HTMLOutputElement",
	p: "HTMLParagraphElement",
	picture: "HTMLPictureElement",
	pre: "HTMLPreElement",
	progress: "HTMLProgressElement",
	q: "HTMLQuoteElement",
	script: "HTMLScriptElement",
	select: "HTMLSelectElement",
	slot: "HTMLSlotElement",
	source: "HTMLSourceElement",
	span: "HTMLSpanElement",
	style: "HTMLStyleElement",
	table: "HTMLTableElement",
	tbody: "HTMLTableSectionElement",
	td: "HTMLTableCellElement",
	template: "HTMLTemplateElement",
	textarea: "HTMLTextAreaElement",
	tfoot: "HTMLTableSectionElement",
	th: "HTMLTableCellElement",
	thead: "HTMLTableSectionElement",
	time: "HTMLTimeElement",
	title: "HTMLTitleElement",
	tr: "HTMLTableRowElement",
	track: "HTMLTrackElement",
	ul: "HTMLUListElement",
	video: "HTMLVideoElement",
};

export default class HtmlParser {
	constructor(html, templateName) {
		this.fragment = JSDOM.fragment(html);
		this.exports = {};
		this.uniqueId = 0;
		this.templateName = templateName;
		if (this.fragment.childElementCount > 1) {
			throw new Error(
				`Template ${templateName} has too many root elements (${this.fragment.childElementCount})`,
			);
		}
	}

	_nextUniqueId(tag) {
		return `_${tag}_generated${this.uniqueId++}`;
	}

	parse() {
		this.jsBody = "";

		const rootName = this._step(this.fragment.firstElementChild);

		return `
export default function(): {${Object.entries(this.exports)
			.map(([name, type]) => `${name}: ${type}`)
			.join(", ")}} {
    
${this.jsBody
	.split("\n")
	.map((line) => "    " + line.trim())
	.join("\n")}
    return {${Object.keys(this.exports).join(", ")}}
}`;
	}

	/**
	 *
	 * @param {Element} node
	 * @private
	 */
	_step(node) {
		let varName;

		if (this.uniqueId === 0) {
			this.uniqueId++;
			node.setAttribute("ref", "root");
		}

		if (node.hasAttribute("ref")) {
			varName = node.getAttribute("ref");
			if (varName in this.exports) {
				throw new Error(
					`Template ${this.templateName} has multiple elements with the ref ${varName}`,
				);
			}
			node.removeAttribute("ref");
			this.exports[varName] =
				typeNames[node.tagName.toLowerCase()] || "HTMLElement";
		} else {
			varName = this._nextUniqueId(node.tagName);
		}

		this.jsBody += `const ${varName} = document.createElement("${node.tagName.toLowerCase()}");\n`;

		for (const attribute of node.attributes) {
			this.jsBody += `${varName}.setAttribute("${attribute.name}", "${attribute.value}")\n`;
		}

		let children = [];

		for (const child of node.childNodes) {
			const childVarName =
				child.nodeType === 1
					? this._step(child)
					: this._stepTextNode(child);
			if (childVarName) {
				children.push(childVarName);
			}
		}

		if (children.length > 0) {
			this.jsBody += `${varName}.append(${children.join(", ")});\n`;
		}

		return varName;
	}

	/**
	 * @param {Node} node
	 * @private
	 */
	_stepTextNode(node) {
		const varName = this._nextUniqueId("text");
		const content = node.textContent.trim();

		if (content === "") {
			return;
		}

		this.jsBody += `const ${varName} = document.createTextNode("${content.replaceAll(/\n/g, "\\n")}");\n`;

		return varName;
	}
}
