import React from "react";
import type { UserResource } from "@clerk/types";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header4 from "@/app/components/shared/heading/Header4";
import { useGetMoveReps } from "@/app/hooks/queries/useGetMoveReps";
import LabeledTextarea from "@/app/components/shared/labeled/LabeledTextarea";
import LabeledSelect from "@/app/components/shared/labeled/LabeledSelect";
import { Id } from "@/convex/_generated/dataModel";
import { MOVE_STATUS_OPTIONS } from "@/types/types";
interface InternalNotesProps {
  user: UserResource;
  companyId: Id<"companies">;
}

const InternalNotes = ({ user, companyId }: InternalNotesProps) => {
  const { users, isLoading, isError, errorMessage } = useGetMoveReps(companyId);

  return (
    <SectionContainer>
      <Header4>Internal Notes</Header4>
      <LabeledSelect
        label="Move Rep"
        value={user.id}
        options={
          users?.map((user) => ({
            label: user.name,
            value: user._id,
          })) ?? []
        }
        onChange={(e) => {}}
      />
      <LabeledSelect
        label="Move Status"
        value={user.id}
        options={MOVE_STATUS_OPTIONS}
        onChange={(e) => {}}
      />
      <LabeledTextarea
        label="Notes"
        value={"test"}
        onChange={(e) => {}}
        placeholder="Add internal notes"
      />
    </SectionContainer>
  );
};

export default InternalNotes;
