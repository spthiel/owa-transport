import CleanCSS from "clean-css";
import * as esbuild from "esbuild";
import pluginVue from "esbuild-plugin-vue-next";
import fs from "fs/promises";
import * as sass from "sass";
import config from "../config.json" with { type: "json" };

let header = await fs.readFile("header.txt", "utf8");

header = header.replace("$BASEURL$", config.BASE_URL);

let css = sass.compile("./style/main.scss").css;
css = new CleanCSS({ returnPromise: false }).minify(css).styles;

await esbuild.build({
	entryPoints: ["./src/index.ts"],
	bundle: true,
	outdir: "dist",
	banner: {
		js: header,
	},
	loader: {
		".css": "text",
	},
	format: "iife",
	define: {
		BASE_URL: `"${config.BASE_URL}"`,
		STYLESHEET: `"${css}"`,
	},
	plugins: [pluginVue()],
	minify: true,
});
