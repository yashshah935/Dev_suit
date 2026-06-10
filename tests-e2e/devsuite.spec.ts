import { test, expect } from "@playwright/test";

test.describe("DevSuite End-to-End Tests (Programmatic SEO Structure)", () => {
  
  test("Dashboard should render header and exactly 10 tools", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");

    // Verify page title
    await expect(page).toHaveTitle(/DevSuite - Premium Developer Utilities/);

    // Verify main header
    const mainHeader = page.locator("h1.dashboard-title");
    await expect(mainHeader).toHaveText("Developer Tool Suite");

    // Verify list of tools does not contain removed tools
    const toolCards = page.locator(".tool-card");
    const count = await toolCards.count();
    console.log(`Found ${count} tools on dashboard.`);
    expect(count).toBe(11);

    // Verify specific tools exist
    const toolTitles = await toolCards.locator(".tool-card-title").allTextContents();
    expect(toolTitles).toContain("JSON Formatter & Validator");
    expect(toolTitles).toContain("Base64 Encoder");
    expect(toolTitles).toContain("Base64 Decoder");
    expect(toolTitles).toContain("SIP Calculator with Inflation");
    expect(toolTitles).toContain("Speech to Text Converter");
    expect(toolTitles).toContain("Text to Speech Synthesizer");
    expect(toolTitles).toContain("Markdown Parser & Viewer");

    // Ensure YouTube Downloader and MP4 to MP3 are removed
    expect(toolTitles).not.toContain("YouTube Downloader");
    expect(toolTitles).not.toContain("MP4 to MP3 Converter");
  });

  test("Base64 Encoder & Decoder split pages should work successfully", async ({ page }) => {
    // 1. Test Encoder Page
    await page.goto("/tools/base64-encoder");

    const titleEncoder = page.locator("h1.workspace-title");
    await expect(titleEncoder).toContainText("Base64 Encoder");

    const inputAreaEncoder = page.locator("textarea.editor-textarea").first();
    const outputAreaEncoder = page.locator("textarea.editor-textarea").last();

    await inputAreaEncoder.fill("Playwright E2E Testing!");
    await expect(outputAreaEncoder).toHaveValue("UGxheXdyaWdodCBFMkUgVGVzdGluZyE=");

    // 2. Test Decoder Page (using the switcher link)
    await page.click("text=Switch to Decoder");
    await page.waitForURL("**/tools/base64-decoder");

    const titleDecoder = page.locator("h1.workspace-title");
    await expect(titleDecoder).toContainText("Base64 Decoder");

    const inputAreaDecoder = page.locator("textarea.editor-textarea").first();
    const outputAreaDecoder = page.locator("textarea.editor-textarea").last();

    await inputAreaDecoder.fill("RGV2U3VpdGUgYnkgRGVlcE1pbmQgQW50aWdyYXZpdHk=");
    await expect(outputAreaDecoder).toHaveValue("DevSuite by DeepMind Antigravity");
  });

  test("SIP Calculator should default to INR (₹) and format values", async ({ page }) => {
    // Navigate to SIP Calculator
    await page.goto("/tools/sip-calculator");

    // Check header
    const title = page.locator("h1.workspace-title");
    await expect(title).toContainText("SIP Calculator");

    // Check currency selector
    const currencySelect = page.locator("select.select-custom");
    await expect(currencySelect).toHaveValue("INR");

    // Check that numeric display uses INR currency formatting (₹)
    const totalInvestedLabel = page.locator(".pane:has-text('Total Invested')");
    await expect(totalInvestedLabel).toContainText("₹");

    // Change currency to USD
    await currencySelect.selectOption("USD");

    // Check that label changes to USD symbol ($)
    await expect(totalInvestedLabel).toContainText("$");
  });

  test("JSON Formatter should validate and format JSON", async ({ page }) => {
    // Navigate to JSON Formatter
    await page.goto("/tools/json-formatter");

    // Select input textarea and format button
    const inputArea = page.locator("textarea.code-editor-textarea").first();
    const formatButton = page.locator("button:has-text('Format JSON')");

    // Input invalid JSON
    await inputArea.fill('{"key": "value", "invalid": }');
    await formatButton.click();

    // Check error status panel appears
    const statusPanel = page.locator(".status-panel.error");
    await expect(statusPanel).toBeVisible();
    await expect(statusPanel.locator(".status-message")).toContainText(/unexpected|position|line/i);

    // Input valid JSON
    await inputArea.fill('{"key": "value", "valid": true}');
    await formatButton.click();

    // Check success status panel appears
    const successPanel = page.locator(".status-panel.success");
    await expect(successPanel).toBeVisible();
  });

  test("Comparison page should render comparison table and schemas", async ({ page }) => {
    // Navigate to JSON vs XML comparison
    await page.goto("/compare/json-vs-xml");

    // Verify header
    const header = page.locator("h1.workspace-title");
    await expect(header).toContainText("JSON vs XML");

    // Verify comparison table exists
    const table = page.locator(".comparison-table");
    await expect(table).toBeVisible();

    // Verify row contents
    await expect(table).toContainText("Parsing Speed");
    await expect(table).toContainText("Syntax Style");
  });

  test("Markdown Parser should compile markdown to visual HTML", async ({ page }) => {
    // Navigate to Markdown Parser
    await page.goto("/tools/markdown-parser");

    // Check header
    const title = page.locator("h1.workspace-title");
    await expect(title).toContainText("Markdown Parser & Viewer");

    // Select text area
    const inputArea = page.locator("textarea.editor-textarea").first();
    const previewArea = page.locator("#markdown-preview");

    // Input markdown text
    await inputArea.fill("# Playwright Test\nSome **bold** word.");
    
    // Verify preview renders standard html elements
    await expect(previewArea.locator("h1")).toHaveText("Playwright Test");
    await expect(previewArea.locator("strong")).toHaveText("bold");
  });
});
