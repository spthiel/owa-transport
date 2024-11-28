const elementId = "owaTransportDialogRoot";

export default function (target: HTMLDivElement) {
	const exists = document.getElementById(elementId);

	if (exists) {
		return exists;
	}

	const root = document.createElement("div");
	root.setAttribute("id", elementId);
	root.classList.add("_opc_b");
	target.appendChild(root);
	return root;
}
