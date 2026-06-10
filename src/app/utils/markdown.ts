export function parseMarkdown(md: string): string {
  if (!md) return "";

  // 1. Escape basic HTML characters to prevent XSS and raw tag rendering
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Extract and preserve Code Blocks: ```lang ... ```
  const codeBlocks: string[] = [];
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(`<pre><code>${code.trim()}</code></pre>`);
    return placeholder;
  });

  // 3. Extract and preserve Inline Code: `code`
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
    inlineCodes.push(`<code>${code}</code>`);
    return placeholder;
  });

  // 4. Blockquotes: > quote
  html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  // 5. Headings: # Header to ###### Header
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // 6. Tables: Row matching
  const linesForTable = html.split("\n");
  let inTable = false;
  let tableHtml = "";
  const processedTableLines: string[] = [];

  for (let i = 0; i < linesForTable.length; i++) {
    const line = linesForTable[i].trim();
    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line.split("|").slice(1, -1).map(c => c.trim());
      const isSeparator = cells.every(c => /^:?-+:?$/.test(c));
      
      if (isSeparator) {
        continue;
      }
      
      if (!inTable) {
        inTable = true;
        tableHtml = `<table><thead><tr>${cells.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>`;
      } else {
        tableHtml += `<tr>${cells.map(c => `<td>${c}</td>`).join("")}</tr>`;
      }
    } else {
      if (inTable) {
        tableHtml += "</tbody></table>";
        processedTableLines.push(tableHtml);
        inTable = false;
        tableHtml = "";
      }
      processedTableLines.push(linesForTable[i]);
    }
  }
  if (inTable) {
    tableHtml += "</tbody></table>";
    processedTableLines.push(tableHtml);
  }
  html = processedTableLines.join("\n");

  // 7. Lists compiling (consecutive items grouped in ul or ol)
  const linesForList = html.split("\n");
  let inUl = false;
  let inOl = false;
  const compiledListLines: string[] = [];

  for (let i = 0; i < linesForList.length; i++) {
    const line = linesForList[i];
    const trimLine = line.trim();

    const ulMatch = line.match(/^(\s*)([\-\*])\s+(.+)$/);
    const olMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);

    if (ulMatch) {
      if (inOl) {
        compiledListLines.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        compiledListLines.push("<ul>");
        inUl = true;
      }
      compiledListLines.push(`<li>${ulMatch[3]}</li>`);
    } else if (olMatch) {
      if (inUl) {
        compiledListLines.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        compiledListLines.push("<ol>");
        inOl = true;
      }
      compiledListLines.push(`<li>${olMatch[3]}</li>`);
    } else {
      if (inUl) {
        compiledListLines.push("</ul>");
        inUl = false;
      }
      if (inOl) {
        compiledListLines.push("</ol>");
        inOl = false;
      }
      compiledListLines.push(line);
    }
  }
  if (inUl) compiledListLines.push("</ul>");
  if (inOl) compiledListLines.push("</ol>");
  html = compiledListLines.join("\n");

  // 8. Basic Text Styling formatting: bold, italic, strike
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");
  html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  // 9. Images & Links
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 6px; margin: 1rem 0;" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // 10. Wrap plain text blocks in paragraphs <p>
  const finalLines = html.split("\n");
  const parsedParagraphLines = finalLines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return "";
    if (/^<\/?(h[1-6]|pre|ul|ol|li|table|thead|tbody|tr|th|td|blockquote|div|p|img|a)/i.test(trimmed)) {
      return line;
    }
    return `<p>${line}</p>`;
  });
  html = parsedParagraphLines.join("\n");

  // 11. Restore Code placeholders
  inlineCodes.forEach((codeHtml, idx) => {
    html = html.replace(`__INLINE_CODE_${idx}__`, codeHtml);
  });
  codeBlocks.forEach((blockHtml, idx) => {
    html = html.replace(`__CODE_BLOCK_${idx}__`, blockHtml);
  });

  return html;
}
