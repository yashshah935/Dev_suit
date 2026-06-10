"use client";

import Link from "next/link";

export default function MarkdownSyntaxGuide() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Markdown Syntax Cheat-Sheet and Rendering Guide",
    "description": "A comprehensive developer guide detailing headings, lists, tables, code blocks, and formatting syntaxes for Markdown.",
    "url": "https://dev-suit.vercel.app/guides/markdown-syntax",
    "author": {
      "@type": "Organization",
      "name": "DevSuite"
    }
  };

  return (
    <div className="workspace">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="workspace-header">
        <div className="workspace-title-area">
          <h1 className="workspace-title">
            <span>📚</span> Markdown Syntax Guide
          </h1>
          <p className="workspace-desc">
            A comprehensive reference guide and cheat-sheet detailing headings, tables, links, images, and formatting syntax.
          </p>
        </div>
        <Link href="/" className="btn-back">
          &larr; Dashboard
        </Link>
      </div>

      <div className="guide-content-wrapper" style={{ marginTop: "1rem" }}>
        <h2>Standard Formatting Cheat-Sheet</h2>
        <p>
          Below is a reference guide mapping standard Markdown shorthand symbols to their visual outcomes and compiled HTML elements.
        </p>

        <div className="comparison-table-wrapper" style={{ margin: "2rem 0" }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Element</th>
                <th>Markdown Syntax</th>
                <th>HTML Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Header 1</strong></td>
                <td><code># Heading 1</code></td>
                <td><code>&lt;h1&gt;Heading 1&lt;/h1&gt;</code></td>
              </tr>
              <tr>
                <td><strong>Header 2</strong></td>
                <td><code>## Heading 2</code></td>
                <td><code>&lt;h2&gt;Heading 2&lt;/h2&gt;</code></td>
              </tr>
              <tr>
                <td><strong>Bold Text</strong></td>
                <td><code>**Heavy Text**</code></td>
                <td><code>&lt;strong&gt;Heavy Text&lt;/strong&gt;</code></td>
              </tr>
              <tr>
                <td><strong>Italic Text</strong></td>
                <td><code>*Slanted Text*</code></td>
                <td><code>&lt;em&gt;Slanted Text&lt;/em&gt;</code></td>
              </tr>
              <tr>
                <td><strong>Blockquote</strong></td>
                <td><code>&gt; Quote content</code></td>
                <td><code>&lt;blockquote&gt;Quote content&lt;/blockquote&gt;</code></td>
              </tr>
              <tr>
                <td><strong>Unordered List</strong></td>
                <td><code>- List Item</code></td>
                <td><code>&lt;ul&gt;&lt;li&gt;List Item&lt;/li&gt;&lt;/ul&gt;</code></td>
              </tr>
              <tr>
                <td><strong>Ordered List</strong></td>
                <td><code>1. List Item</code></td>
                <td><code>&lt;ol&gt;&lt;li&gt;List Item&lt;/li&gt;&lt;/ol&gt;</code></td>
              </tr>
              <tr>
                <td><strong>Inline Code</strong></td>
                <td><code>\`const x = 5;\`</code></td>
                <td><code>&lt;code&gt;const x = 5;&lt;/code&gt;</code></td>
              </tr>
              <tr>
                <td><strong>Link</strong></td>
                <td><code>[DevSuite](https://...)</code></td>
                <td><code>&lt;a href="..."&gt;DevSuite&lt;/a&gt;</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Best Practices for Writing Markdown</h2>
        <p>
          1. **Preserve Spacing**: Always place an empty line before and after list items, tables, code blocks, and blockquotes to ensure different markdown parser engines group paragraphs correctly.
          2. **Heading Spaces**: Make sure to insert a literal space between the `#` character symbols and the header text (e.g. use `# Header`, not `#Header`).
          3. **Escape Special Characters**: If you want to render literal asterisks or hashes without formatting them, prefix them with a backslash character (e.g., `\\*`).
        </p>

        <section className="seo-section" style={{ marginTop: "3rem" }}>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
              Live Tools & Comparisons
            </h3>
            <div className="related-links-grid">
              <Link href="/tools/markdown-parser" className="related-link-card">
                <span>Markdown Parser & Viewer</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/compare/markdown-vs-html" className="related-link-card">
                <span>Markdown vs HTML</span>
                <span>&rarr;</span>
              </Link>
              <Link href="/errors/markdown-rendering-issues" className="related-link-card">
                <span>Troubleshoot Markdown Errors</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
