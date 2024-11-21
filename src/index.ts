import { observe } from "./main/inject";
import elements from "./elements/elements";

declare global {
	const STYLESHEET: string;
	const BASE_URL: string;
}

observe();

if (!document.querySelector("style[owa-transport='injected']")) {
	const css = elements.css();
	document.head.append(css);
} else {
	console.warn("Style already injected. Skipping.");
}
