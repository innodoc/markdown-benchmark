import * as commonmark from "commonmark";
import { marked } from "marked";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import Markdoc from "@markdoc/markdoc";
import MarkdownIt from "markdown-it";
import * as MarkdownWasm from "markdown-wasm";
import { unified } from "unified";
import remarkParsePlugin from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { micromark } from "micromark";
import showdown from "showdown";

async function parsers() {
  // commonmark
  const reader = new commonmark.Parser();
  const writer = new commonmark.HtmlRenderer();
  const commonmarkParse = (markdown) => writer.render(reader.parse(markdown));

  // markdoc
  const markdocParse = (markdown) =>
    Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(markdown)));

  // markdown-it
  const markdownIt = new MarkdownIt();
  const markdownItParse = (markdown) => markdownIt.render(markdown);

  // markdown-wasm
  await MarkdownWasm.ready;

  // marked
  marked.setOptions({
    renderer: new marked.Renderer(),
    pedantic: false,
    gfm: true,
  });

  // micromark
  const micromarkParse = (markdown) =>
    micromark(markdown, {
      extensions: [gfm()],
      htmlExtensions: [gfmHtml()],
    });

  // remark
  const remark = unified()
    .use(remarkParsePlugin)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .freeze();
  const remarkParse = (markdown) => remark.processSync(markdown).toString();

  // showdown
  showdown.setFlavor("github");
  const showdownParser = new showdown.Converter();
  const showdownParse = (markdown) => showdownParser.makeHtml(markdown);

  return {
    commonmark: commonmarkParse,
    markdoc: markdocParse,
    markdownIt: markdownItParse,
    markdownWasm: MarkdownWasm.parse,
    marked,
    micromark: micromarkParse,
    remark: remarkParse,
    showdown: showdownParse,
  };
}

export default parsers;
