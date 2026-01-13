// import { NextResponse } from "next/server";
// import puppeteer from "puppeteer-core";
// import chromium from "@sparticuz/chromium";

// export const runtime = "nodejs";

// export async function GET() {
//   let browser;

//   console.log("PDF route hit");

//   try {
//     const isProduction = process.env.NODE_ENV === "production";

//     browser = await puppeteer.launch(
//       isProduction
//         ? {
//             args: chromium.args,
//             executablePath: await chromium.executablePath(),
//             headless: true,
//           }
//         : {
//             headless: true,
//           }
//     );

//     const page = await browser.newPage();

//     await page.setContent(`
//       <html>
//         <body style="font-family: Arial; padding: 40px">
//           <h1 style="color: #16a34a">Quote PDF Test</h1>
//           <p>This PDF was generated successfully.</p>
//         </body>
//       </html>
//     `);

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//     });

//     return new NextResponse(Buffer.from(pdfBuffer), {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": 'attachment; filename="test.pdf"',
//       },
//     });
//   } catch (error) {
//     console.error("PDF generation failed", error);
//     return new NextResponse("PDF generation failed", { status: 500 });
//   } finally {
//     await browser?.close();
//   }
// }

// export async function GET() {
//   console.log("ROUTE HIT");
//   return new Response("OK");
// }

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  console.log("PDF route hit");

  let browser;

  try {
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      // ✅ Vercel / serverless
      const puppeteer = (await import("puppeteer-core")).default;
      const chromium = (await import("@sparticuz/chromium")).default;

      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      // ✅ Local / traditional server
      const puppeteer = (await import("puppeteer")).default;

      browser = await puppeteer.launch({
        headless: true,
      });
    }

    const page = await browser.newPage();

    await page.setContent(`
      <html>
        <body style="font-family: Arial; padding: 40px">
          <h1 style="color: #16a34a">Quote PDF Test</h1>
          <p>This PDF was generated successfully.</p>
        </body>
      </html>
    `);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="test.pdf"',
      },
    });
  } catch (err) {
    console.error("PDF generation failed", err);
    return new NextResponse("PDF generation failed", { status: 500 });
  } finally {
    await browser?.close();
  }
}
