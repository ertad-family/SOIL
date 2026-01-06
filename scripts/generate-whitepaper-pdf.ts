/**
 * Script to generate PDF from the whitepaper page using Playwright
 *
 * Usage:
 *   npx tsx scripts/generate-whitepaper-pdf.ts
 *
 * Requirements:
 *   - Dev server must be running on localhost:3000
 *   - Playwright browsers installed (npx playwright install chromium)
 */

import { chromium } from "playwright";
import path from "path";

const WHITEPAPER_URL = "http://localhost:3000/whitepaper";
const OUTPUT_PATH = path.join(
  process.cwd(),
  "public/documents/SOIL_Research_Methodology_White_Paper.pdf"
);

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

    // Hide the sticky table of contents for PDF (it's fixed position)
    await page.addStyleTag({
      content: `
        /* Hide navigation elements */
        header, footer, nav { display: none !important; }

        /* Hide sticky TOC sidebar */
        .lg\\:block.fixed { display: none !important; }

        /* Hide mobile TOC button */
        button[class*="fixed"] { display: none !important; }

        /* Adjust main content to take full width */
        main {
          max-width: 100% !important;
          padding: 40px !important;
        }

        /* Set background for print */
        body {
          background: white !important;
          color: #1a1a1a !important;
        }

        /* Adjust text colors for print */
        .text-slate-400, .text-slate-500 { color: #4a4a4a !important; }
        .text-marble-100, .text-marble-200 { color: #1a1a1a !important; }
        .text-gold-400 { color: #8B7355 !important; }

        /* Card backgrounds */
        [class*="Card"], [class*="card"] {
          background: #f5f5f5 !important;
          border: 1px solid #ddd !important;
        }

        /* Links - show URL for citations */
        a[href^="https://doi.org"] {
          color: #2563eb !important;
          text-decoration: underline !important;
        }

        /* Page breaks */
        section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      `,
    });

    // Generate PDF
    console.log(`Generating PDF to ${OUTPUT_PATH}...`);
    await page.pdf({
      path: OUTPUT_PATH,
      format: "A4",
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 9px; color: #666; width: 100%; text-align: center; padding: 5px 0;">
          SOIL Research Methodology White Paper
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 9px; color: #666; width: 100%; text-align: center; padding: 5px 0;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span> | soilplatform.org
        </div>
      `,
    });

    console.log("PDF generated successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

generatePDF();
