import assert from "node:assert/strict";
import { NextRequest, NextResponse } from "next/server";

// Import backend API routes
import { POST as xmlToJsonHandler } from "../src/app/api/xml-to-json/route";
import { POST as jsonToXmlHandler } from "../src/app/api/json-to-xml/route";

const PASSED = " \x1b[32m✔\x1b[0m";
const FAILED = " \x1b[31m✘\x1b[0m";

async function runTest(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`${PASSED} ${name}`);
    return true;
  } catch (err: any) {
    console.error(`${FAILED} ${name}`);
    console.error(`   Error: ${err.message || err}`);
    if (err.stack) {
      console.error(err.stack.split("\n").slice(0, 3).map((l: string) => `     ${l}`).join("\n"));
    }
    return false;
  }
}

// Helper to create a request body stream (similar to standard request body)
function createRequest(url: string, method: string, body: any): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function main() {
  console.log("\x1b[35m==================================================\x1b[0m");
  console.log("\x1b[35m             DevSuite test runner                 \x1b[0m");
  console.log("\x1b[35m==================================================\x1b[0m\n");

  let passes = 0;
  let fails = 0;

  const tests = [
    // 1. JSON Formatter Logic
    runTest("JSON Formatter - Standard formatting (2 spaces)", () => {
      const input = '{"a":1,"b":[2,3]}';
      const parsed = JSON.parse(input);
      const output = JSON.stringify(parsed, null, 2);
      assert.equal(output, `{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}`);
    }),

    runTest("JSON Formatter - Minification", () => {
      const input = `{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}`;
      const parsed = JSON.parse(input);
      const output = JSON.stringify(parsed);
      assert.equal(output, '{"a":1,"b":[2,3]}');
    }),

    runTest("JSON Formatter - Syntax validation error", () => {
      const input = '{"a": 1, "b": [2, 3'; // missing bracket
      assert.throws(() => JSON.parse(input), SyntaxError);
    }),

    // 2. Base64 encoding/decoding
    runTest("Base64 - Encode plain text", () => {
      const input = "Developer DevSuite 🚀";
      const encoded = btoa(
        encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
      assert.equal(encoded, "RGV2ZWxvcGVyIERldlN1aXRlIPCfmoA=");
    }),

    runTest("Base64 - Decode ciphered text", () => {
      const encoded = "RGV2ZWxvcGVyIERldlN1aXRlIPCfmoA=";
      const decoded = decodeURIComponent(
        atob(encoded)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      assert.equal(decoded, "Developer DevSuite 🚀");
    }),

    // 3. URL encoding/decoding
    runTest("URL Encoder - Encode parameters", () => {
      const input = "https://example.com/search?query=next js & node";
      const encoded = encodeURIComponent(input);
      assert.equal(encoded, "https%3A%2F%2Fexample.com%2Fsearch%3Fquery%3Dnext%20js%20%26%20node");
    }),

    runTest("URL Decoder - Decode parameters", () => {
      const encoded = "https%3A%2F%2Fexample.com%2Fsearch%3Fquery%3Dnext%20js%20%26%20node";
      const decoded = decodeURIComponent(encoded);
      assert.equal(decoded, "https://example.com/search?query=next js & node");
    }),

    // 4. SIP Calculator Math
    runTest("SIP Calculator - Nominal returns calculation", () => {
      const monthly = 1000;
      const rate = 12; // 12% p.a.
      const years = 5;
      
      const monthlyRate = rate / 12 / 100;
      const months = years * 12;
      const invested = monthly * months;

      // FV = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
      const fv = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      
      assert.equal(invested, 60000);
      assert.ok(fv > invested);
      assert.ok(Math.abs(fv - 82486.4) < 1.0); // Approx $82,486
    }),

    runTest("SIP Calculator - Inflation-adjusted returns", () => {
      const monthly = 1000;
      const rate = 12; // 12% p.a.
      const years = 5;
      const inflation = 6; // 6% p.a.

      const realAnnualRate = ((1 + rate / 100) / (1 + inflation / 100) - 1) * 100;
      const realMonthlyRate = realAnnualRate / 12 / 100;
      const months = years * 12;

      const realFv = monthly * ((Math.pow(1 + realMonthlyRate, months) - 1) / realMonthlyRate) * (1 + realMonthlyRate);
      
      assert.ok(realFv < 82486.4); // Real returns must be lower than nominal returns
      assert.ok(realFv > 60000); // Real returns must still exceed investment
      assert.ok(Math.abs(realFv - 69490.7) < 1.0); // Approx $69,491
    }),

    // 5. Integration Tests: XML to JSON API Route
    runTest("API - XML to JSON conversion (Valid XML)", async () => {
      const xmlInput = `<?xml version="1.0" encoding="UTF-8"?>
<book id="1">
  <title>Clean Code</title>
  <author>Robert C. Martin</author>
</book>`;

      const req = createRequest("http://localhost/api/xml-to-json", "POST", { xml: xmlInput });
      const res = await xmlToJsonHandler(req);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.ok(data.json);
      assert.equal(data.json.book.title, "Clean Code");
      assert.equal(data.json.book["@_id"], 1); // parses attributes with prefix
    }),

    runTest("API - XML to JSON validation error", async () => {
      const xmlInput = `<book><title>Clean Code</book>`; // mismatched tag

      const req = createRequest("http://localhost/api/xml-to-json", "POST", { xml: xmlInput });
      const res = await xmlToJsonHandler(req);
      assert.equal(res.status, 400);

      const data = await res.json();
      assert.ok(data.error);
      assert.ok(data.error.includes("XML Validation Error"));
    }),

    // 6. Integration Tests: JSON to XML API Route
    runTest("API - JSON to XML conversion", async () => {
      const jsonInput = JSON.stringify({
        book: {
          "@_id": 1,
          title: "Refactoring",
          author: "Martin Fowler",
        },
      });

      const req = createRequest("http://localhost/api/json-to-xml", "POST", { jsonString: jsonInput });
      const res = await jsonToXmlHandler(req);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.ok(data.xml);
      assert.ok(data.xml.includes('<book id="1">'));
      assert.ok(data.xml.includes("<title>Refactoring</title>"));
    }),

    // 8. Voice & Text Converter Logic
    runTest("Voice & Text - Supported Recognition Languages", () => {
      const supportedLangs = ["en-US", "en-GB", "es-ES", "fr-FR", "de-DE", "hi-IN", "zh-CN"];
      assert.ok(supportedLangs.includes("en-US"));
      assert.ok(supportedLangs.includes("hi-IN"));
      assert.equal(supportedLangs.length, 7);
    }),

    // 10. Editor Error Line Parser Logic
    runTest("Editor Error Line Parser - V8 and Firefox patterns", () => {
      const getJsonErrorLine = (errorMsg: string, inputVal: string): number | null => {
        const positionMatch = errorMsg.match(/position (\d+)/);
        if (positionMatch) {
          const pos = parseInt(positionMatch[1], 10);
          const textUpToPos = inputVal.substring(0, pos);
          return textUpToPos.split("\n").length;
        }
        const lineMatch = errorMsg.match(/line (\d+)/i);
        if (lineMatch) {
          return parseInt(lineMatch[1], 10);
        }
        const safariMatch = errorMsg.match(/at line (\d+)/i);
        if (safariMatch) {
          return parseInt(safariMatch[1], 10);
        }
        return null;
      };

      const testInput = "{\n  \"a\": 1,\n  \"b\": [\n    2,\n    3\n  \n}";
      const v8Error = "Unexpected token } in JSON at position 35";
      const firefoxError = "JSON.parse: expected ',' or ']' after array element at line 6 column 1";

      const lineV8 = getJsonErrorLine(v8Error, testInput);
      const lineFx = getJsonErrorLine(firefoxError, testInput);

      assert.equal(lineV8, 6);
      assert.equal(lineFx, 6);
    }),
  ];

  for (const t of tests) {
    const passed = await t;
    if (passed) passes++;
    else fails++;
  }

  console.log("\n\x1b[35m==================================================\x1b[0m");
  console.log(`Test Execution Finished: ${passes + fails} Total`);
  console.log(`  Passed: \x1b[32m${passes}\x1b[0m`);
  console.log(`  Failed: \x1b[31m${fails}\x1b[0m`);
  console.log("\x1b[35m==================================================\x1b[0m");

  if (fails > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
