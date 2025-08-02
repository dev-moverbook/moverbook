"use client";

import React, { useState } from "react";

const PreMoveTerms = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="space-y-2">
      <div className={isExpanded ? "prose" : "prose line-clamp-1"}>
        <h2>Important Information About Your Upcoming Move</h2>

        <p>
          Hi <strong>[Customer Name]</strong>,
        </p>

        <p>
          We&rsquo;re looking forward to assisting you with your upcoming move!
          Here&rsquo;s what you need to know to help ensure everything goes
          smoothly:
        </p>

        <ul>
          <li>
            <strong>📦 Move Date:</strong> [Insert Date]
          </li>
          <li>
            <strong>🕒 Arrival Window:</strong> [Insert Time Range]
          </li>
          <li>
            <strong>📍 Starting Address:</strong> [Insert Starting Address]
          </li>
          <li>
            <strong>📍 Destination Address:</strong> [Insert Destination
            Address]
          </li>
        </ul>

        <h3>Before Moving Day:</h3>
        <ul>
          <li>
            <strong>Packing:</strong> Have all items securely packed and labeled
            unless packing services are included.
          </li>
          <li>
            <strong>Access:</strong> Ensure clear access to entrances,
            elevators, and arrange any required parking permits.
          </li>
          <li>
            <strong>Valuables:</strong> Personally transport high-value or
            sensitive items.
          </li>
          <li>
            <strong>Appliances:</strong> Disconnect and prepare appliances in
            advance if they&rsquo;re being moved.
          </li>
        </ul>

        <h3>On Moving Day:</h3>
        <ul>
          <li>
            Be available during the arrival window to review the plan and sign
            paperwork.
          </li>
          <li>Clear a path from your door to the moving truck.</li>
          <li>Keep pets and children in a safe area during the move.</li>
        </ul>

        <p>
          If you have any questions, contact us at{" "}
          <a href="mailto:[Email]">[Email]</a> or call us at{" "}
          <strong>[Phone Number]</strong>.
        </p>

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

export default PreMoveTerms;
