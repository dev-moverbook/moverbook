"use client";

import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TestPdfButton() {
  const generateQuotePdf = useAction(api.actions.pdf.generateQuotePdf);

  const handleClick = async () => {
    try {
      const result = await generateQuotePdf({});
      console.log("PDF generated:", result);

      alert(`PDF generated (${result.byteLength} bytes)`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("PDF generation failed");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      Generate PDF (via Convex)
    </button>
  );
}
