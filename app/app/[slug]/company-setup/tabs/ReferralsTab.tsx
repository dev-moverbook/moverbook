"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { Button } from "@/app/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useCreateReferral } from "../hooks/useCreateReferral";
import CreateReferralModal from "../modals/CreateReferralsModal";
import ReferralItem from "../components/ReferralItem";
import { FrontEndErrorMessages } from "@/types/errors";

const ReferralsTab = () => {
  const { companyId } = useSlugContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { createReferral, createLoading, createError, setCreateError } =
    useCreateReferral();

  const referralsResponse = useQuery(
    api.referrals.getActiveReferralsByCompanyId,
    companyId ? { companyId } : "skip"
  );

  if (!companyId) return <p className="text-gray-500">No company selected.</p>;

  if (!referralsResponse) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-6 w-40" />
      </div>
    );
  }

  if (referralsResponse.status === ResponseStatus.ERROR) {
    return (
      <div className="text-red-500">
        Error: {referralsResponse.error || "Failed to load referrals"}
      </div>
    );
  }

  const { referrals } = referralsResponse.data;

  const handleCreateReferral = async (name: string): Promise<boolean> => {
    if (!companyId) {
      console.error(FrontEndErrorMessages.COMPANY_NOT_FOUND);
      setCreateError(FrontEndErrorMessages.GENERIC);
      return false;
    }
    return await createReferral(companyId, name);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Referrals</h2>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Referral</Button>
      </div>

      {referrals.length === 0 ? (
        <p className="text-gray-500">No active referrals found.</p>
      ) : (
        <ul className="space-y-2">
          {referrals.map((referral) => (
            <ReferralItem
              key={referral._id}
              referralId={referral._id}
              name={referral.name}
            />
          ))}
        </ul>
      )}

      <CreateReferralModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateReferral}
        createLoading={createLoading}
        createError={createError}
      />
    </div>
  );
};

export default ReferralsTab;
