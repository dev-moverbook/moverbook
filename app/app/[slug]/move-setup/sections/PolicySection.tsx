"use client";

import React, { useState } from "react";
import { PolicySchema } from "@/types/convex-schemas";
import { useUpdatePolicy } from "../hooks/useUpdatePolicy";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { PolicyFormData } from "@/types/form-types";

interface PolicySectionProps {
  policy: PolicySchema;
}

const PolicySection: React.FC<PolicySectionProps> = ({ policy }) => {
  const { updatePolicy, updatePolicyLoading, updatePolicyError } =
    useUpdatePolicy();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<PolicyFormData>({
    weekdayHourMinimum: policy.weekdayHourMinimum,
    weekendHourMinimum: policy.weekendHourMinimum,
    deposit: policy.deposit,
    cancellationFee: policy.cancellationFee,
    cancellationCutoffHour: policy.cancellationCutoffHour,
    billOfLandingDisclaimerAndTerms: policy.billOfLandingDisclaimerAndTerms,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "billOfLandingDisclaimerAndTerms" ? value : Number(value),
    }));
  };

  const handleSave = async () => {
    const success = await updatePolicy(policy._id, formData);
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Policy Information</h2>

      {updatePolicyError && <p className="text-red-500">{updatePolicyError}</p>}

      {!isEditing ? (
        <div className="space-y-2">
          <p>
            <span className="font-medium">Weekday Hour Minimum:</span>{" "}
            {policy.weekdayHourMinimum} hours
          </p>
          <p>
            <span className="font-medium">Weekend Hour Minimum:</span>{" "}
            {policy.weekendHourMinimum} hours
          </p>
          <p>
            <span className="font-medium">Deposit:</span> ${policy.deposit}
          </p>
          <p>
            <span className="font-medium">Cancellation Fee:</span> $
            {policy.cancellationFee}
          </p>
          <p>
            <span className="font-medium">Cancellation Cutoff Hour:</span>{" "}
            {policy.cancellationCutoffHour} hours
          </p>
          <p>
            <span className="font-medium">
              Bill of Lading Disclaimer and Terms:
            </span>{" "}
            {policy.billOfLandingDisclaimerAndTerms}
          </p>
          <Button variant="default" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <Label>Weekday Hour Minimum</Label>
            <Input
              type="number"
              name="weekdayHourMinimum"
              value={formData.weekdayHourMinimum}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Weekend Hour Minimum</Label>
            <Input
              type="number"
              name="weekendHourMinimum"
              value={formData.weekendHourMinimum}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Deposit</Label>
            <Input
              type="number"
              name="deposit"
              value={formData.deposit}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Cancellation Fee</Label>
            <Input
              type="number"
              name="cancellationFee"
              value={formData.cancellationFee}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Cancellation Cutoff Hour</Label>
            <Input
              type="number"
              name="cancellationCutoffHour"
              value={formData.cancellationCutoffHour}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Bill of Lading Disclaimer and Terms</Label>
            <Textarea
              name="billOfLandingDisclaimerAndTerms"
              value={formData.billOfLandingDisclaimerAndTerms}
              onChange={handleChange}
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSave} disabled={updatePolicyLoading}>
              {updatePolicyLoading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicySection;
