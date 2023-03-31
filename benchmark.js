import fs from "fs";

import Benchmark from "benchmark";
import { marked } from "marked";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import MarkdownIt from "markdown-it";
import Markdoc from "@markdoc/markdoc";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const micromark = marked.setOptions({
  renderer: new marked.Renderer(),
  pedantic: false,
  gfm: true,
});

const remark = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify)
  .freeze();

const markdownIt = new MarkdownIt();

const markdownCode = fs.readFileSync("markdown.md").toString();

const suite = new Benchmark.Suite("Markdown parsers")

  .add("micromark", () =>
    micromark(markdownCode, {
      extensions: [gfm()],
      htmlExtensions: [gfmHtml()],
    })
  )

  .add("remark", () => remark.processSync(markdownCode).toString())

  .add("markdown-it", () => markdownIt.render(markdownCode))

  .add("marked", () => marked.parse(markdownCode))

  .add("markdoc", () =>
    Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(markdownCode)))
  )

  .on("error", (event) => {
    console.log(event.target.error.message);
  })

  .on("cycle", (event) => {
    console.log(String(event.target));
  })

  .on("complete", (event) => {
    const suite = event.currentTarget;
    const fastestOption = suite.filter("fastest").map("name");
    console.log(`The fastest option is ${fastestOption}`);
  });

suite.run();
