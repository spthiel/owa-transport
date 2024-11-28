import fs from "fs/promises";
import path from "path";
import HtmlParser from "./htmlToTS/htmlParser.mjs";

async function build() {
	const fileNames = await fs.readdir("./template");

	for (const fileName of fileNames) {
		try {
			console.log(`Compiling ${fileName}`);
			const filepath = path.join("./template", fileName);
			const content = await fs.readFile(filepath, "utf8");

			const parser = new HtmlParser(content, fileName);

			const typeScript = parser.parse();
			const jspath = path.join(
				"./src",
				"template",
				path.basename(fileName, path.extname(fileName)) +
					".template.ts",
			);
			await fs.mkdir(path.dirname(jspath), { recursive: true });
			await fs.writeFile(jspath, typeScript);
		} catch (e) {
			console.error(e);
		}
	}
}

build();
