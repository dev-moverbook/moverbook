"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";

export const generateQuotePdf = action({
  args: {},
  handler: async (ctx, args) => {
    try {
      const response = await fetch(`https://moverbook.com/api/test-pdf`);

      if (!response.ok) {
        throw new Error(`PDF route failed: ${response.status}`);
      }

      const pdfBuffer = await response.arrayBuffer();

      return { byteLength: pdfBuffer.byteLength };
    } catch (error) {
      console.error("generateQuotePdf failed", {
        error,
      });

      // surface a clean, intentional failure
      throw new Error("QUOTE_PDF_GENERATION_FAILED");
    }
  },
});
