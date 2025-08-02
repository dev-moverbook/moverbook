"use client";

import React, { useState } from "react";

interface MoveTermsAndConditionsProps {
  additionalTermsAndConditions?: string;
}

const MoveTermsAndConditions: React.FC<MoveTermsAndConditionsProps> = ({
  additionalTermsAndConditions,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="space-y-2">
      <div className={isExpanded ? "prose" : "prose line-clamp-2"}>
        <h2 className="text-base md:text-sm font-bold">Terms and Conditions</h2>
        <h3 className="text-base md:text-sm font-semibold mb-2">
          For Moving Services
        </h3>

        <p>
          <strong>Effective Date:</strong> [Insert Date]
        </p>
        <p>
          <strong>Company Name:</strong> [Your Moving Company Name]
        </p>
        <p className="mb-4">
          <strong>Contact Information:</strong> [Phone | Email | Address]
        </p>

        <h4>1. Services Provided</h4>
        <p>
          We provide residential and/or commercial moving services, including
          packing, transportation, loading, unloading, and optional storage.
        </p>

        <h4>2. Estimates & Quotes</h4>
        <ul>
          <li>All quotes are non-binding unless stated otherwise.</li>
          <li>
            Final charges are based on actual time, labor, distance, materials,
            and services used.
          </li>
          <li>
            Additional charges may apply for long carries, stairs, elevator
            delays, oversized items, packing materials, or specialty items
            (e.g., pianos, safes).
          </li>
        </ul>

        <h4>3. Booking & Cancellation</h4>
        <ul>
          <li>A deposit may be required to secure your move date.</li>
          <li>
            Cancellations made less than 48 hours in advance may incur a
            cancellation fee or deposit forfeiture.
          </li>
          <li>Rescheduling is subject to availability.</li>
        </ul>

        <h4>4. Customer Responsibilities</h4>
        <ul>
          <li>
            Properly pack and label all items unless using our packing service.
          </li>
          <li>Be present or assign someone authorized during the move.</li>
          <li>Ensure clear access at all locations.</li>
          <li>Remove valuables, documents, or fragile items beforehand.</li>
        </ul>

        <h4>5. Liability & Claims</h4>
        <ul>
          <li>
            We are not liable for damage to items with pre-existing defects or
            items packed by the customer.
          </li>
          <li>
            Basic liability is $0.60 per pound per item unless otherwise agreed.
          </li>
          <li>
            Claims must be submitted in writing within 10 business days of the
            move.
          </li>
        </ul>

        <h4>6. Delays & Force Majeure</h4>
        <p>
          We are not responsible for delays due to weather, traffic, road
          conditions, mechanical issues, or other events beyond our control.
        </p>

        <h4>7. Payment Terms</h4>
        <ul>
          <li>Payment is due upon completion unless agreed in writing.</li>
          <li>Accepted methods: cash, credit card, or certified check.</li>
          <li>Late payments may incur fees or interest.</li>
        </ul>

        <h4>8. Right to Refuse Service</h4>
        <p>
          We may refuse service if the environment is unsafe, illegal items are
          present, or payment cannot be secured.
        </p>

        <h4>9. Governing Law</h4>
        <p>
          These terms are governed by the laws of the state/province of [Your
          Location].
        </p>

        <h4>10. Agreement</h4>
        <p>
          By booking and accepting our services, you agree to these Terms and
          Conditions.
        </p>

        {additionalTermsAndConditions && (
          <p className="mt-4 md:text-sm">{additionalTermsAndConditions}</p>
        )}
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

export default MoveTermsAndConditions;
