import { copyFile, mkdir, readFile, unlink, writeFile } from "node:fs/promises";

const output = new URL("../demo-dist/", import.meta.url);
const source = new URL("../demo/", import.meta.url);
const htmlURL = new URL("build.html", output);
const html = await readFile(htmlURL, "utf8");
const staticHTML = html.replace(
  /<script type="module" crossorigin src="\.\/assets\/demo\.js"><\/script>/,
  '<script defer src="./assets/demo.js"></script>',
);
await writeFile(new URL("index.html", output), staticHTML);
await unlink(htmlURL);

await mkdir(new URL("assets/", source), { recursive: true });
await copyFile(new URL("assets/demo.js", output), new URL("assets/demo.js", source));
await copyFile(
  new URL("assets/demo.js.map", output),
  new URL("assets/demo.js.map", source),
);
