"use client";

import React, { useState } from "react";
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
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";
import AddItemButton from "@/app/components/shared/buttons/AddItemButton";
import { useActiveReferrals } from "@/app/hooks/queries/referrals/useActiveReferrals";
import { QueryStatus } from "@/types/enums";

const ReferralsTab = () => {
  const { companyId } = useSlugContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReferral, setEditingReferral] = useState<{
    id: Id<"referrals">;
    name: string;
  } | null>(null);

  const { createReferral, createLoading, createError, setCreateError } =
    useCreateReferral();

  const { updateReferral, updateLoading, updateError, setUpdateError } =
    useUpdateReferral();

  const result = useActiveReferrals(companyId);

  const handleCreateReferral = async (name: string): Promise<boolean> => {
    if (!companyId) {
      console.error(FrontEndErrorMessages.COMPANY_NOT_FOUND);
      setCreateError(FrontEndErrorMessages.GENERIC);
      return false;
    }
    return await createReferral(companyId, name);
  };

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

  switch (true) {
    case !companyId:
      return <ErrorMessage message={"Failed to load referrals."} />;

    case result.status === QueryStatus.LOADING:
      return null;

    case result.status === QueryStatus.ERROR:
      return <ErrorMessage message={result.errorMessage} />;

    default: {
      const { referrals } = result;

      return (
        <SectionContainer isLast>
          <CenteredContainer>
            <SectionHeader
              title="Referrals"
              actions={
                <AddItemButton
                  label="Referral"
                  onClick={() => setIsModalOpen(true)}
                />
              }
              className="px-0 pb-4"
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

            {/* Create */}
            <CreateReferralModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleCreateReferral}
              loading={createLoading}
              error={createError}
            />

            {/* Edit (reuses the same modal) */}
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
    }
  }
};

export default ReferralsTab;
