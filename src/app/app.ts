import App from "./App.vue";
import { createApp } from "vue";

export default function (rootElement: HTMLElement) {
	const app = createApp(App);
	app.mount(rootElement);
}
