import TurndownService from "turndown";

const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  strongDelimiter: "*",
});

turndownService.addRule("underline", {
  filter: ["u"],
  replacement: (content) => content,
});

turndownService.addRule("link", {
  filter: "a",
  replacement: (content, node) => {
    const href = node.getAttribute("href");
    return `<${href}|${content}>`;
  },
});

export default function convertToSlack(html) {
  const cleaned = html.replace(/<p>(\s|&nbsp;)*<\/p>/g, "");
  return turndownService.turndown(cleaned);
}
