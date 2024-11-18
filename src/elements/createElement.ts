export default function createElement(
	tagName: string,
	classList: string[] = [],
	attributes: Record<string, string> = {},
	...children: (string | Node)[]
) {
	const element = document.createElement(tagName);
	element.classList.add(...classList);
	Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
	element.append(...children)
	return element;
}