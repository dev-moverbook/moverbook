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
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import CardListContainer from "@/app/components/shared/CardListContainer";
import { Id } from "@/convex/_generated/dataModel";
import { useUpdateReferral } from "../hooks/useUpdateReferral";

const ReferralsTab = () => {
  const { companyId } = useSlugContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { createReferral, createLoading, createError, setCreateError } =
    useCreateReferral();

  const referralsResponse = useQuery(
    api.referrals.getActiveReferralsByCompanyId,
    companyId ? { companyId } : "skip"
  );

  const [editingReferral, setEditingReferral] = useState<{
    id: Id<"referrals">;
    name: string;
  } | null>(null);

  const { updateReferral, updateLoading, updateError, setUpdateError } =
    useUpdateReferral();

  const handleUpdateReferral = async (
    referralId: Id<"referrals">,
    newName: string
  ): Promise<boolean> => {
    if (!newName.trim()) {
      setUpdateError(FrontEndErrorMessages.REFERARAL_NAME_REQUIRED);
      return false;
    }

    const success = await updateReferral(referralId, { name: newName });
    if (success) {
      setEditingReferral(null);
    }
    return success;
  };

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
    <SectionContainer isLast={true}>
      <CenteredContainer>
        <SectionHeader
          title="Referrals"
          actions={
            <Button onClick={() => setIsModalOpen(true)}>+ Add Referral</Button>
          }
        />
        {referrals.length === 0 ? (
          <p className="text-gray-500">No active referrals found.</p>
        ) : (
          <CardListContainer>
            {referrals.map((referral) => (
              <ReferralItem
                key={referral._id}
                referralId={referral._id}
                name={referral.name}
                onEdit={(id, name) => setEditingReferral({ id, name })}
              />
            ))}
          </CardListContainer>
        )}
        <CreateReferralModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateReferral}
          loading={createLoading}
          error={createError}
        />
        {editingReferral && (
          <CreateReferralModal
            isOpen={!!editingReferral}
            onClose={() => setEditingReferral(null)}
            onSubmit={(newName) =>
              handleUpdateReferral(editingReferral.id, newName)
            }
            initialName={editingReferral.name}
            loading={updateLoading}
            error={updateError}
            mode="edit"
          />
        )}
      </CenteredContainer>
    </SectionContainer>
  );
};

export default ReferralsTab;
