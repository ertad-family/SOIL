/**
 * Script to generate PDF from the whitepaper page
 *
 * Flow: Playwright renders page → extracts HTML → pandoc converts to PDF
 *
 * Usage:
 *   npx tsx scripts/generate-whitepaper-pdf.ts
 *
 * Requirements:
 *   - Dev server must be running on localhost:3000
 *   - Playwright browsers installed (npx playwright install chromium)
 *   - pandoc installed (apt install pandoc)
 */

import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const WHITEPAPER_URL = "http://localhost:3000/whitepaper";
const OUTPUT_PDF = path.join(
  process.cwd(),
  "public/documents/SOIL_Research_Methodology_White_Paper.pdf"
);
const TEMP_HTML = path.join(process.cwd(), ".temp-whitepaper.html");

async function generatePDF() {
  console.log("Starting PDF generation from whitepaper page...");

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to whitepaper page
    console.log(`Loading ${WHITEPAPER_URL}...`);
    await page.goto(WHITEPAPER_URL, { waitUntil: "networkidle" });

    // Wait for content to be fully rendered
    await page.waitForSelector("main", { timeout: 10000 });

    // Extract the main content HTML
    console.log("Extracting content...");
    const content = await page.evaluate(() => {
      const main = document.querySelector("main");
      if (!main) return "";

      // Clone to avoid modifying the page
      const clone = main.cloneNode(true) as HTMLElement;

      // Remove any interactive elements
      clone.querySelectorAll("button, nav, [role='navigation']").forEach((el) => el.remove());

      // Convert citation links to plain text with URL
      clone.querySelectorAll("a").forEach((a) => {
        const href = a.getAttribute("href");
        if (href && href.startsWith("https://doi.org")) {
          // Keep DOI links as markdown-style
          a.textContent = a.textContent || "";
        }
      });

      return clone.innerHTML;
    });

    // Get metadata from page
    const title = await page.title();
    const version = await page.evaluate(() => {
      const versionEl = document.querySelector('p[class*="text-slate-500"]');
      return versionEl?.textContent || "Version 1.2 | January 2026";
    });

    // Build complete HTML document for pandoc
    const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: "Times New Roman", serif; line-height: 1.6; }
    h1, h2, h3 { font-family: "Helvetica", sans-serif; }
    a { color: #2563eb; }
    blockquote { border-left: 3px solid #ccc; padding-left: 1em; margin-left: 0; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f5f5f5; }
    code { background-color: #f5f5f5; padding: 2px 4px; }
  </style>
</head>
<body>
${content}
</body>
</html>`;

    // Write temporary HTML file
    fs.writeFileSync(TEMP_HTML, htmlDoc);
    console.log("Temporary HTML created...");

    // Convert with pandoc (using xelatex for Unicode support)
    console.log("Converting to PDF with pandoc...");
    execSync(
      `pandoc "${TEMP_HTML}" -o "${OUTPUT_PDF}" \
        --pdf-engine=xelatex \
        -V geometry:margin=1in \
        -V fontsize=11pt \
        -V documentclass=article \
        --toc \
        --toc-depth=2 \
        -V colorlinks=true \
        -V linkcolor=blue \
        -V urlcolor=blue \
        -V mainfont="DejaVu Serif" \
        -V sansfont="DejaVu Sans" \
        -V monofont="DejaVu Sans Mono" \
        --metadata title="SOIL Research Methodology White Paper"`,
      { stdio: "inherit" }
    );

    // Clean up temp file
    fs.unlinkSync(TEMP_HTML);

    console.log(`PDF generated successfully: ${OUTPUT_PDF}`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Clean up temp file on error
    if (fs.existsSync(TEMP_HTML)) {
      fs.unlinkSync(TEMP_HTML);
    }
    process.exit(1);
  } finally {
    await browser.close();
  }
}

generatePDF();
