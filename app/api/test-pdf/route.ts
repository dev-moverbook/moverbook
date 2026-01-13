import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { html } = await req.json();

  if (!html) {
    return new NextResponse("Missing HTML", { status: 400 });
  }

  let browser;

  try {
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      const puppeteer = (await import("puppeteer-core")).default;
      const chromium = (await import("@sparticuz/chromium")).default;

      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      const puppeteer = (await import("puppeteer")).default;
      browser = await puppeteer.launch({ headless: true });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: { "Content-Type": "application/pdf" },
    });
  } finally {
    await browser?.close();
  }
}
