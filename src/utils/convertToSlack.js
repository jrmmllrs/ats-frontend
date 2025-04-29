import TurndownService from "turndown";

const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-", // standard markdown
  strongDelimiter: "*",
  emDelimiter: "_",
});

// Preserve underline tags (Slack doesn’t support underline, so we leave as plain)
turndownService.addRule("underline", {
  filter: ["u"],
  replacement: (content) => content,
});

// Slack-style links: <url|text>
turndownService.addRule("link", {
  filter: "a",
  replacement: (content, node) => {
    const href = node.getAttribute("href");
    return `<${href}|${content}>`;
  },
});

// Custom bullet list rule for Slack-compatible formatting
turndownService.addRule("slackList", {
  filter: (node) =>
    node.nodeName === "LI" &&
    node.parentNode &&
    node.parentNode.nodeName === "UL",
  replacement: (content) => {
    return `\n• ${content.trim()}`;
  },
});

export default function convertToSlack(html) {
  const cleaned = html.replace(/<p>(\s|&nbsp;)*<\/p>/g, "");
  return turndownService.turndown(cleaned);
}
