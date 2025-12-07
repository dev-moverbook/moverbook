"use client";

import { useState } from "react";

const AdditionalLiabilityTerms = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="space-y-2">
      <div className={isExpanded ? "prose" : "prose line-clamp-1"}>
        <h2>Additional Liability Coverage</h2>

        <p>
          Hi <strong>[Customer Name]</strong>,
        </p>

        <p>Here is the additional liability coverage for your move.</p>

        <p>We appreciate your trust and look forward to a smooth move!</p>

        <p>
          Best regards,
          <br />
          <strong>[Your Company Name]</strong>
          <br />
          [Contact Info] <br />
          <a href="[Website URL]">[Website URL]</a>
        </p>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-blue-500 hover:underline"
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
};

export default AdditionalLiabilityTerms;
