import React from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import LabeledTextarea from "@/app/components/shared/labeled/LabeledTextarea";
import LabeledSelect from "@/app/components/shared/labeled/LabeledSelect";
import { MOVE_STATUS_OPTIONS, MoveStatus } from "@/types/types";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { Id } from "@/convex/_generated/dataModel";
import Header3 from "@/app/components/shared/heading/Header3";

const InternalNotes = () => {
  const { salesRepOptions, setMoveFormData, moveFormData } = useMoveForm();

  const { salesRep, moveStatus, notes } = moveFormData;

  return (
    <SectionContainer showBorder={false}>
      <Header3 wrapperClassName="px-0" showCheckmark={false}>
        Internal Notes
      </Header3>
      <LabeledSelect
        label="Sales Rep"
        value={salesRep ?? ""}
        options={salesRepOptions}
        onChange={(value) =>
          setMoveFormData({ ...moveFormData, salesRep: value as Id<"users"> })
        }
      />
      <LabeledSelect
        label="Move Status"
        value={moveStatus}
        options={MOVE_STATUS_OPTIONS}
        onChange={(value) =>
          setMoveFormData({ ...moveFormData, moveStatus: value as MoveStatus })
        }
      />
      <LabeledTextarea
        label="Notes"
        value={notes ?? ""}
        onChange={(e) =>
          setMoveFormData({ ...moveFormData, notes: e.target.value })
        }
        placeholder="Add internal note"
      />
    </SectionContainer>
  );
};

export default InternalNotes;
