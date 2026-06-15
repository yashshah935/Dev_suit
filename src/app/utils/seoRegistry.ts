// Central SEO Data Registry for 20 New Developer Tools

export interface SEOInfo {
  title: string;
  description: string;
  icon: string;
  faqs: { q: string; a: string; }[];
  useCases?: { title: string; desc: string; }[];
  toolSlug: string;
  guideSlug: string;
  errorSlug: string;
  compareSlug: string;
}

export interface GuideInfo {
  title: string;
  description: string;
  icon: string;
  toolSlug: string;
  errorSlug: string;
  compareSlug: string;
  sections: {
    title: string;
    paragraphs: string[];
    listItems?: string[];
  }[];
  faqs: { q: string; a: string; }[];
}

export interface ErrorInfo {
  title: string;
  description: string;
  icon: string;
  toolSlug: string;
  guideSlug: string;
  compareSlug: string;
  codeExample: {
    bad: string;
    good: string;
    explanation: string;
  };
  causes: string[];
  solutions: string[];
  faqs: { q: string; a: string; }[];
}

export interface CompareInfo {
  title: string;
  description: string;
  icon: string;
  toolSlug: string;
  guideSlug: string;
  errorSlug: string;
  toolA: string;
  toolB: string;
  matrix: {
    feature: string;
    valA: string;
    valB: string;
  }[];
  prosA: string[];
  consA: string[];
  prosB: string[];
  consB: string[];
  faqs: { q: string; a: string; }[];
}

export const TOOLS_REGISTRY: Record<string, SEOInfo> = {
  "json-validator": {
    toolSlug: "json-validator",
    guideSlug: "json-validation-guide",
    errorSlug: "json-validation-syntax-error",
    compareSlug: "json-formatter-vs-validator",
    title: "JSON Validator & Schema Analyzer",
    description: "Validate and parse JSON data syntax instantly with line-by-line lint error highlighting.",
    icon: "🔍",
    useCases: [
      { title: "Linting API Payloads", desc: "Scan complex network request JSON bodies for misplaced tokens, invalid syntax, or trailing commas." },
      { title: "Schema Verification", desc: "Ensure your configurations adhere to structural rules before loading them in production backend environments." }
    ],
    faqs: [
      { q: "What is JSON validation?", a: "JSON validation is the process of checking a JSON text against the official RFC 8259 syntax specifications to ensure that it can be parsed correctly by any standard JSON engine." },
      { q: "Does this validator store my data?", a: "No, all validation is computed purely client-side inside your web browser. No data is sent to external servers." }
    ]
  },
  "json-minifier": {
    toolSlug: "json-minifier",
    guideSlug: "json-minification-guide",
    errorSlug: "json-minification-syntax-error",
    compareSlug: "json-minifier-vs-beautifier",
    title: "JSON Minifier & Compressor",
    description: "Compress and minify JSON files instantly to save byte bandwidth in API request payloads.",
    icon: "🗜️",
    useCases: [
      { title: "API Payload Size Reduction", desc: "Minify JSON configs and database seeds to decrease network transmission latency." },
      { title: "Static Assets Compression", desc: "Strip whitespace from JSON localization locales or settings files before deployment." }
    ],
    faqs: [
      { q: "How much space does JSON minification save?", a: "Typically, minifying JSON saves between 10% to 25% of file size by stripping unnecessary spaces, newlines, and tabs." }
    ]
  },
  "json-beautifier": {
    toolSlug: "json-beautifier",
    guideSlug: "json-beautification-guide",
    errorSlug: "json-beautifier-parse-error",
    compareSlug: "json-beautifier-vs-minifier",
    title: "JSON Beautifier & Prettifier",
    description: "Format, beautify, and sort JSON keys alphabetically with custom tab and spacing indentation.",
    icon: "💅",
    useCases: [
      { title: "Code Reviews", desc: "Format messy JSON data payloads so changes are clean and easily readable during code commits." },
      { title: "Key Sorting", desc: "Sort JSON keys alphabetically to quickly compare structural values side-by-side." }
    ],
    faqs: [
      { q: "What spacing should I use for JSON?", a: "Standard formatting uses 2 spaces for nested objects, but some teams prefer 4 spaces or tab characters for wider terminal screens." }
    ]
  },
  "yaml-validator": {
    toolSlug: "yaml-validator",
    guideSlug: "yaml-validation-guide",
    errorSlug: "yaml-syntax-error",
    compareSlug: "yaml-validator-vs-formatter",
    title: "YAML Validator & Linter",
    description: "Scan YAML configuration files for tab characters, indentation syntax issues, and schema errors.",
    icon: "📋",
    useCases: [
      { title: "Kubernetes Deployments", desc: "Validate manifest files before running kubectl commands to avoid server syntax errors." },
      { title: "CI/CD Pipelines", desc: "Pre-check GitHub Actions or GitLab YAML files to prevent pipeline initialization failures." }
    ],
    faqs: [
      { q: "Why does YAML fail so often?", a: "YAML is highly sensitive to whitespace and tabs. Mixing spaces and tabs or using incorrect indentation levels causes immediate parsing errors." }
    ]
  },
  "yaml-to-json": {
    toolSlug: "yaml-to-json",
    guideSlug: "yaml-to-json-conversion",
    errorSlug: "yaml-to-json-parsing-failure",
    compareSlug: "yaml-vs-json",
    title: "YAML to JSON Converter",
    description: "Convert YAML config files into cleanly formatted, parsable JSON data objects.",
    icon: "🔄",
    useCases: [
      { title: "Front-end Integration", desc: "Convert YAML config files into JSON schemas for ingestion in React, Next.js, or Vue applications." },
      { title: "API Compatibility", desc: "Translate YAML payloads to JSON objects for standard API POST requests." }
    ],
    faqs: [
      { q: "Are all YAML files compatible with JSON?", a: "Yes, YAML is a superset of JSON, meaning any valid YAML structure can be converted to JSON, though comments will be lost." }
    ]
  },
  "json-to-csv": {
    toolSlug: "json-to-csv",
    guideSlug: "json-to-csv-conversion",
    errorSlug: "json-to-csv-structure-error",
    compareSlug: "json-to-csv-vs-xml",
    title: "JSON to CSV Converter",
    description: "Convert JSON arrays of objects into structured CSV sheets for Excel or Google Sheets.",
    icon: "📊",
    useCases: [
      { title: "Data Exporting", desc: "Transform API JSON payloads into tabular formats ready for business reporting or client sharing." },
      { title: "Database Seed Translating", desc: "Export MongoDB document outputs into relational CSV data tables." }
    ],
    faqs: [
      { q: "How are nested objects handled?", a: "Nested JSON objects are typically flattened using dot notation (e.g. user.address.zip) to represent tabular spreadsheet headers." }
    ]
  },
  "csv-to-json": {
    toolSlug: "csv-to-json",
    guideSlug: "csv-to-json-conversion",
    errorSlug: "csv-to-json-parsing-error",
    compareSlug: "csv-vs-json",
    title: "CSV to JSON Converter",
    description: "Parse tabular CSV spreadsheets and rows into structured JSON array objects.",
    icon: "📊",
    useCases: [
      { title: "Migration to NoSQL", desc: "Parse traditional CSV relational database tables into schema-less JSON documents for MongoDB." },
      { title: "Data Seeding", desc: "Convert Excel spreadsheet tables into JSON seeds for mock databases." }
    ],
    faqs: [
      { q: "How are CSV headers processed?", a: "The first row of the CSV is automatically treated as header names, becoming keys in each generated JSON object." }
    ]
  },
  "xml-formatter": {
    toolSlug: "xml-formatter",
    guideSlug: "xml-formatting-guide",
    errorSlug: "xml-formatter-unclosed-tag",
    compareSlug: "xml-formatter-vs-beautifier",
    title: "XML Formatter & Prettifier",
    description: "Beautify and format messy XML elements with clean hierarchy structures and tab spacing.",
    icon: "🎨",
    useCases: [
      { title: "Sitemap Inspection", desc: "Format raw XML sitemaps to verify URL inclusion lists and indexing priority rates." },
      { title: "SOAP Payload Debugging", desc: "Format messy SOAP XML responses to verify attributes and namespaces during backend integration." }
    ],
    faqs: [
      { q: "Can XML formatting parse namespaces?", a: "Yes, our formatter respects XML namespaces and attributes, formatting nested tags in correct hierarchical levels." }
    ]
  },
  "xml-validator": {
    toolSlug: "xml-validator",
    guideSlug: "xml-validation-guide",
    errorSlug: "xml-validation-failed",
    compareSlug: "xml-validator-vs-formatter",
    title: "XML Validator & Parser",
    description: "Check XML documents for unclosed tags, attributes, namespaces, and syntax errors.",
    icon: "🔬",
    useCases: [
      { title: "RSS Feeds Validation", desc: "Check dynamic RSS xml scripts to make sure aggregators and readers parse content properly." },
      { title: "App Config Check", desc: "Scan Java or Android layout XML settings files for missing parent declarations." }
    ],
    faqs: [
      { q: "What makes XML document 'well-formed'?", a: "An XML document is well-formed if it has a single root element, all tags are closed properly, attributes are quoted, and tags are correctly nested." }
    ]
  },
  "xml-beautifier": {
    toolSlug: "xml-beautifier",
    guideSlug: "xml-beautification",
    errorSlug: "xml-beautifier-error",
    compareSlug: "xml-beautifier-vs-minifier",
    title: "XML Beautifier & Prettifier",
    description: "Prettify complex XML trees, schemas, and configurations with customizable tag spacing.",
    icon: "💅",
    useCases: [
      { title: "Configuration Layouts", desc: "Prettify nested configuration XML schemas for easier manual editing." }
    ],
    faqs: [
      { q: "Does the beautifier work client-side?", a: "Yes, it formats the XML client-side in the browser instantly without any external server trips." }
    ]
  },
  "jwt-decoder": {
    toolSlug: "jwt-decoder",
    guideSlug: "jwt-decoding-guide",
    errorSlug: "jwt-invalid-signature-or-token",
    compareSlug: "jwt-vs-session-cookie",
    title: "JWT Decoder & Token Analyzer",
    description: "Decode JSON Web Token (JWT) headers, payloads, and claims with security expiration analysis.",
    icon: "🔑",
    useCases: [
      { title: "Auth Claim Verification", desc: "Decode API tokens to inspect roles, permissions, scopes, and expiration details." },
      { title: "Session Troubleshooting", desc: "Inspect user session tokens to debug token validation issues in auth systems." }
    ],
    faqs: [
      { q: "Can this tool modify token signatures?", a: "No, decoding only parses the payload and header segments. To verify or create tokens, the signing secret key is required." }
    ]
  },
  "regex-tester": {
    toolSlug: "regex-tester",
    guideSlug: "regular-expression-matching",
    errorSlug: "regex-invalid-pattern-syntax",
    compareSlug: "regex-tester-vs-validator",
    title: "Regex Tester & Matcher",
    description: "Test regular expressions with flag modifiers and see matching text capture segments highlighted.",
    icon: "🧩",
    useCases: [
      { title: "Form Validation Regex", desc: "Test complex email, phone, or password criteria before writing JS/TS validation patterns." },
      { title: "Log File Extraction", desc: "Design regex patterns to grab timestamp fields and logging severity labels from application dumps." }
    ],
    faqs: [
      { q: "What regex engine is used here?", a: "This tester utilizes the browser's native V8 JavaScript RegExp engine, supporting standard global, case-insensitive, and multiline flags." }
    ]
  },
  "timestamp-converter": {
    toolSlug: "timestamp-converter",
    guideSlug: "epoch-timestamp-handling",
    errorSlug: "timestamp-invalid-epoch-date",
    compareSlug: "unix-timestamp-vs-iso8601",
    title: "UNIX Timestamp Converter",
    description: "Convert UNIX epoch timestamps (seconds/milliseconds) to ISO-8601 formats and UTC/Local times.",
    icon: "⏰",
    useCases: [
      { title: "Log File Analysis", desc: "Translate epoch millisecond logs (e.g. 1780896754281) to readable time stamps during debugging." },
      { title: "Database Query Design", desc: "Convert date-time selector parameters into integer epoch timestamps for database lookups." }
    ],
    faqs: [
      { q: "What is epoch time?", a: "Epoch time (or UNIX time) is the number of seconds or milliseconds that have elapsed since midnight on January 1, 1970 (UTC), excluding leap seconds." }
    ]
  },
  "hash-generator": {
    toolSlug: "hash-generator",
    guideSlug: "cryptographic-hashing",
    errorSlug: "hash-generation-unsupported-algorithm",
    compareSlug: "md5-vs-sha256",
    title: "Cryptographic Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from input strings client-side.",
    icon: "🧮",
    useCases: [
      { title: "Data Integrity Validation", desc: "Generate SHA-256 file hashes to let users verify download authenticity." },
      { title: "Password Hashing Checks", desc: "Check text signatures to verify hashed authentication keys in database records." }
    ],
    faqs: [
      { q: "Which hash algorithm is most secure?", a: "SHA-256 and SHA-512 are highly secure cryptographic hashing functions. MD5 and SHA-1 are deprecated for security purposes due to collision risks." }
    ]
  },
  "uuid-generator": {
    toolSlug: "uuid-generator",
    guideSlug: "uuid-version-4-generation",
    errorSlug: "uuid-generator-entropy-exhausted",
    compareSlug: "uuid-vs-guid",
    title: "UUID v4 Generator",
    description: "Generate random, unique Version 4 UUIDs in bulk with custom spacing and case settings.",
    icon: "🆔",
    useCases: [
      { title: "Database Row Key Assignment", desc: "Create high-entropy unique identifier keys for new relational rows or NoSQL documents." },
      { title: "Session ID Provisioning", desc: "Generate unique, non-guessable identifiers for active client sessions." }
    ],
    faqs: [
      { q: "What is a UUID version 4?", a: "A UUID v4 is a 128-bit randomly generated identifier conforming to RFC 4122. It uses 122 bits of high-entropy randomness, making collisions practically impossible." }
    ]
  },
  "qr-generator": {
    toolSlug: "qr-generator",
    guideSlug: "qr-code-encoding",
    errorSlug: "qr-code-payload-too-large",
    compareSlug: "qr-code-vs-barcode",
    title: "Aesthetic QR Code Generator",
    description: "Create customizable QR codes from text links with margin, scale, and color configurations.",
    icon: "🏁",
    useCases: [
      { title: "Mobile Link Sharing", desc: "Generate vector-correct QR codes for websites, WiFi configs, or business cards." },
      { title: "Event Ticketing Systems", desc: "Build scan keys for mobile check-in passes or verification cards." }
    ],
    faqs: [
      { q: "Do QR codes expire?", a: "No, standard static QR codes encode data directly. The QR code remains active indefinitely, as long as the destination URL or text is valid." }
    ]
  },
  "html-encoder": {
    toolSlug: "html-encoder",
    guideSlug: "html-entity-encoding",
    errorSlug: "html-encoder-invalid-escaping",
    compareSlug: "html-encoding-vs-url-encoding",
    title: "HTML Entity Encoder",
    description: "Escape HTML characters into safe numeric entities to prevent XSS script executions.",
    icon: "🔣",
    useCases: [
      { title: "Documentation Snippets", desc: "Escape code blocks so tags render visually on your blog rather than rendering as actual HTML markup." },
      { title: "Security Sanitization", desc: "Pre-encode custom data variables before inserting them in database layouts to avoid Cross-Site Scripting (XSS)." }
    ],
    faqs: [
      { q: "What characters are escaped in HTML?", a: "Key characters escaped include: '<' to '&lt;', '>' to '&gt;', '&' to '&amp;', '\"' to '&quot;', and \"'\" to '&#x27;'." }
    ]
  },
  "html-decoder": {
    toolSlug: "html-decoder",
    guideSlug: "html-entity-decoding",
    errorSlug: "html-decoder-malformed-entity",
    compareSlug: "html-decoding-vs-un-escaping",
    title: "HTML Entity Decoder",
    description: "Convert HTML numeric entities back to standard human-readable symbols.",
    icon: "🔣",
    useCases: [
      { title: "Text Extraction", desc: "Clean up escaped database rows to inspect actual HTML contents visually." },
      { title: "CMS Content Parsers", desc: "Convert rich text string outputs back into layout-ready text blocks." }
    ],
    faqs: [
      { q: "How are decimal entities decoded?", a: "Our decoder processes standard entity names, decimal equivalents (e.g. '&#60;'), and hexadecimal equivalents (e.g. '&#x3c;')." }
    ]
  },
  "color-converter": {
    toolSlug: "color-converter",
    guideSlug: "color-spaces-hex-rgb-hsl",
    errorSlug: "color-converter-invalid-hex-code",
    compareSlug: "hex-vs-rgb-vs-hsl",
    title: "Color Space Converter",
    description: "Convert between Hex, RGB, HSL, and CMYK color spaces with real-time visual previews.",
    icon: "🎨",
    useCases: [
      { title: "Web Styling Adjustments", desc: "Convert Hex palettes from design specs (Figma/Adobe) to CSS-ready HSL values for animations." },
      { title: "Print Layouts Preparation", desc: "Convert standard RGB design colors to CMYK ratios for offset print templates." }
    ],
    faqs: [
      { q: "What color format is best for CSS?", a: "HSL is highly recommended for modern CSS as it is intuitive to manipulate programmatically (changing brightness or saturation directly)." }
    ]
  },
  "diff-checker": {
    toolSlug: "diff-checker",
    guideSlug: "text-difference-checking",
    errorSlug: "diff-checker-memory-limit",
    compareSlug: "inline-vs-side-by-side-diff",
    title: "Text Diff Checker",
    description: "Compare two text versions side-by-side and highlight additions and deletions in lines.",
    icon: "👥",
    useCases: [
      { title: "Code Version Inspection", desc: "Compare local file changes against git repo versions to quickly spot debugging additions." },
      { title: "Draft Copy Audits", desc: "Compare updated blog paragraphs against drafts to review wording modifications." }
    ],
    faqs: [
      { q: "How are line differences analyzed?", a: "Our tool executes a Myers Longest Common Subsequence (LCS) algorithm to find the optimal sequence of insertions and deletions, highlighting differences in red and green." }
    ]
  },
  "cron-expression": {
    toolSlug: "cron-expression",
    guideSlug: "cron-expression-guide",
    errorSlug: "cron-expression-invalid-syntax",
    compareSlug: "cron-vs-systemd-timer",
    title: "Cron Expression Generator & Parser",
    description: "Generate, parse, translate and inspect CRON expressions into clear human-readable sentences.",
    icon: "⏱️",
    useCases: [
      { title: "Task Scheduling Configuration", desc: "Build precise CRON trigger expressions for Linux backups, server cleanups, and script schedules." },
      { title: "Trigger Time Audits", desc: "Inspect cron syntax to ensure jobs execute at exact intended UTC or server intervals." }
    ],
    faqs: [
      { q: "What is a CRON expression?", a: "A CRON expression is a string of 5 or 6 fields separated by spaces that represents a task execution schedule on Linux servers." },
      { q: "How do the CRON fields map?", a: "The 5 fields map respectively to: Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), and Day of Week (0-6)." }
    ]
  }
};

// Generation functions to create rich SEO articles programmatically
export const GUIDES_REGISTRY: Record<string, GuideInfo> = Object.keys(TOOLS_REGISTRY).reduce((acc, slug) => {
  const tool = TOOLS_REGISTRY[slug];
  acc[tool.guideSlug] = {
    title: `Ultimate Guide to ${tool.title}`,
    description: `Learn the fundamentals of ${tool.title.toLowerCase()}. Master best practices, understand standard rules, and troubleshoot syntax.`,
    icon: "📖",
    toolSlug: tool.toolSlug,
    errorSlug: tool.errorSlug,
    compareSlug: tool.compareSlug,
    sections: [
      {
        title: `What is a ${tool.title}?`,
        paragraphs: [
          `A ${tool.title} is an indispensable utility used by software developers, network engineers, and system admins to inspect, process, and optimize data patterns. By running analysis directly in the client browser, it provides immediate feedback without sending sensitive configurations over the web.`,
          `Understanding the core specifications of this tool helps prevent formatting bugs, security vulnerabilities (like token leaks or XSS execution), and network communication bottlenecking.`
        ]
      },
      {
        title: "Official Industry Best Practices",
        paragraphs: [
          "When utilizing developer tools, following established formatting and validation practices is essential for system stability and maintenance:",
          "- **Keep payloads clean**: Strip comments or debug logs before deploying files to production setups.",
          "- **Perform client-side validation**: Catch format syntax warnings locally in the editor before pushing revisions to database backends.",
          "- **Mind standard RFC regulations**: Adhere strictly to encoding specs (e.g. RFC 8259 for JSON, RFC 4122 for UUID, RFC 4648 for Base64) to ensure absolute multi-platform interoperability."
        ]
      }
    ],
    faqs: [
      { q: `Why is ${tool.title} validation important?`, a: `Validating your data inputs ensures compliance with strict data transfer standards, catching syntax errors and structural anomalies before they trigger critical runtime crash exceptions on server nodes.` },
      { q: "Is my inputted data secure?", a: "Yes. DevSuite executes all parser rules, conversions, and checks client-side within your browser sandbox. Your data remains fully local, private, and secure." }
    ]
  };
  return acc;
}, {} as Record<string, GuideInfo>);

export const ERRORS_REGISTRY: Record<string, ErrorInfo> = Object.keys(TOOLS_REGISTRY).reduce((acc, slug) => {
  const tool = TOOLS_REGISTRY[slug];
  acc[tool.errorSlug] = {
    title: `Troubleshooting ${tool.title} Errors`,
    description: `Diagnose and resolve common errors, syntax failures, and validation warnings when using ${tool.title.toLowerCase()}.`,
    icon: "🔧",
    toolSlug: tool.toolSlug,
    guideSlug: tool.guideSlug,
    compareSlug: tool.compareSlug,
    codeExample: {
      bad: "// Incorrect/malformed input segment\n" + (slug.includes("json") ? '{"user": "Alice",}' : "user: Alice\n\taddress: US"),
      good: "// Corrected/validated input segment\n" + (slug.includes("json") ? '{"user": "Alice"}' : "user: Alice\n  address: US"),
      explanation: "Ensure there are no trailing characters, tab mixings, or invalid syntax blocks violating the parser specifications."
    },
    causes: [
      "Input content contains invisible whitespace characters or control codes.",
      "Syntax brackets or tag tags are left open, breaking elements.",
      "String parameters mix double quotes and single quote markers."
    ],
    solutions: [
      "Run the input through our editor linter to find the exact line-gutter flagging the issue.",
      "Ensure all quotes and bracket elements have closing matches.",
      "Replace mixed tab spaces with standardized space indentations."
    ],
    faqs: [
      { q: "How do I fix character errors?", a: "Check the syntax error log gutter to identify the character position causing issues, check for missing quotes or commas, and replace tab key spaces with spaces." }
    ]
  };
  return acc;
}, {} as Record<string, ErrorInfo>);

export const COMPARE_REGISTRY: Record<string, CompareInfo> = Object.keys(TOOLS_REGISTRY).reduce((acc, slug) => {
  const tool = TOOLS_REGISTRY[slug];
  const compareName = tool.title.split(" ")[0] || "Tool";
  acc[tool.compareSlug] = {
    title: `${compareName} Comparison & Analysis`,
    description: `Compare specifications, performance, syntax differences, and optimal developer use cases.`,
    icon: "⚖️",
    toolSlug: tool.toolSlug,
    guideSlug: tool.guideSlug,
    errorSlug: tool.errorSlug,
    toolA: `${compareName} Mode`,
    toolB: "Alternative Mode",
    matrix: [
      { feature: "Syntax Strictness", valA: "Extremely High (Standard Specs)", valB: "Moderate (Flexible)" },
      { feature: "Performance Latency", valA: "Sub-millisecond (Browser Engine)", valB: "Variable (Network dependent)" },
      { feature: "Payload Size Impact", valA: "Optimized / Minified Options", valB: "Full Verbose Tags" }
    ],
    prosA: [
      "Extremely fast client-side execution.",
      "Ensures absolute data integrity and format standards."
    ],
    consA: [
      "Errors on minor syntax deviations.",
      "Requires correct inputs for parsing."
    ],
    prosB: [
      "Easier manually editing due to loose validation rules.",
      "Readable formats."
    ],
    consB: [
      "Increases network transfer byte sizes.",
      "Vulnerable to multi-platform parsing conflicts."
    ],
    faqs: [
      { q: "Which tool standard should I choose?", a: "Choose the standard that matches your system constraints. For API payloads, JSON is typically preferred due to low bandwidth overhead; for configuration settings, YAML provides better manual readability." }
    ]
  };
  return acc;
}, {} as Record<string, CompareInfo>);
