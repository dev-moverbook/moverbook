"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import LabeledTextarea from "@/components/shared/labeled/LabeledTextarea";
import { MOVE_STATUS_OPTIONS, MoveStatus } from "@/types/types";
import { useMoveForm } from "@/contexts/MoveFormContext";
import { Id } from "@/convex/_generated/dataModel";
import Header3 from "@/components/shared/heading/Header3";
import AdaptiveSelect from "@/components/shared/select/AdaptiveSelect";
import { Label } from "@/components/ui/label";
import FieldGroup from "@/components/shared/field/FieldGroup";
import AdaptiveContainer from "@/components/shared/select/AdaptiveContainer";
import { useId } from "react";

const InternalNotes = () => {
  const salesRepId = useId();
  const moveStatusId = useId();
  const referralSourceId = useId();

  const { salesRepOptions, setMoveFormData, moveFormData, referralOptions } =
    useMoveForm();
  const referralSelectOptions =
    referralOptions?.map((referral) => ({
      label: referral.name,
      value: referral._id,
    })) ?? [];

  const { salesRep, moveStatus, notes, referralId } = moveFormData;

  return (
    <SectionContainer >
      <Header3 wrapperClassName="px-0" showCheckmark={false}>
        Internal Notes
      </Header3>

      <FieldGroup className="flex flex-col gap-4">
        <AdaptiveContainer>
          <Label htmlFor={salesRepId}>Sales Rep</Label>
          <AdaptiveSelect
            id={salesRepId}
            title="Select sales rep"
            options={salesRepOptions}
            value={salesRep ?? ""}
            onChange={(value) =>
              setMoveFormData({
                ...moveFormData,
                salesRep: value as Id<"users">,
              })
            }
            placeholder="Choose a sales rep"
            triggerLabel="Sales Reps"
            description="Choose a sales rep for the move."
            showAllOption={false}
            showSearch={false}
          />
        </AdaptiveContainer>

        <AdaptiveContainer>
          <Label htmlFor={moveStatusId}>Move Status</Label>
          <AdaptiveSelect
            id={moveStatusId}
            title="Select source"
            options={MOVE_STATUS_OPTIONS}
            value={moveStatus ?? ""}
            onChange={(value) =>
              setMoveFormData({
                ...moveFormData,
                moveStatus: value as MoveStatus,
              })
            }
            placeholder="Choose a move status"
            triggerLabel="Move Statuses"
            description="Choose a move status for the move."
            showSearch={false}
            showAllOption={false}
          />
        </AdaptiveContainer>

        <AdaptiveContainer>
          <Label htmlFor={referralSourceId}>Referral Source*</Label>
          <AdaptiveSelect
            id={referralSourceId}
            title="Select source"
            options={referralSelectOptions}
            value={referralId ?? ""}
            onChange={(value) =>
              setMoveFormData({
                ...moveFormData,
                referralId: value as Id<"referrals">,
              })
            }
            placeholder="Choose a source"
            triggerLabel="Sources"
            description="Choose a referral source for the move."
            showAllOption={false}
            showSearch={false}
          />
        </AdaptiveContainer>
        <LabeledTextarea
          label="Notes"
          value={notes ?? ""}
          onChange={(e) =>
            setMoveFormData({ ...moveFormData, notes: e.target.value })
          }
          placeholder="Add internal note"
        />
      </FieldGroup>
    </SectionContainer>
  );
};

export default InternalNotes;
