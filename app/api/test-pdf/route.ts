import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const runtime = "nodejs"; // IMPORTANT

export async function GET() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
          }
          h1 {
            color: #16a34a;
          }
          .box {
            border: 1px solid #ddd;
            padding: 20px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>Quote PDF Test</h1>
        <p>This PDF was generated on the server.</p>

        <div class="box">
          <strong>Customer:</strong> John Doe<br />
          <strong>Total:</strong> $1,250.00<br />
          <strong>Date:</strong> ${new Date().toLocaleDateString()}
        </div>
      </body>
    </html>
  `);

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return new NextResponse(Buffer.from(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="test-quote.pdf"',
    },
  });
}
