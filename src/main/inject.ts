import CONST from "../data/CONST";
import Import from "./Import";
import Export from "./Export";
import { createApp } from "vue";
import RootElement from "../app/RootElement";
import app from "../app/app";

const FIND_CLASS = CONST.ELEMENT_CLASS;

function isHTMLElement(node: Node): node is HTMLElement {
	return node.nodeType === Node.ELEMENT_NODE;
}

function inject(target: HTMLDivElement) {
	// target.appendChild(Export.getElement());
	// target.appendChild(Import.getElement());
	const rootElement = RootElement(target);

	app(rootElement);
}

function callback(records: MutationRecord[]) {
	if (location.hash !== CONST.HASH) {
		return;
	}

	for (const record of records) {
		for (const node of record.addedNodes) {
			if (!isHTMLElement(node)) {
				continue;
			}

			const element = node.getElementsByClassName(FIND_CLASS);

			if (element.length === 0) {
				continue;
			}

			const target = element[0].parentNode;

			if (
				target === null ||
				!("tagName" in target) ||
				target.tagName !== "DIV"
			) {
				console.error(
					"Found target but parent was not a div element. Not injecting. Target: ",
					element[0],
					"Parent: ",
					target,
				);
				continue;
			}

			inject(target as HTMLDivElement);
			console.log("Inject");

			return;
		}
	}
}

function observe() {
	const observer = new MutationObserver(callback);

	console.log('Observing')

	observer.observe(document.body, {
		subtree: true,
		childList: true,
	});
}

export { observe };
