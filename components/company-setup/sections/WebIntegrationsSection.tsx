"use client";

import { useState } from "react";
import { WebIntegrationsFormData } from "@/types/form-types";
import { Doc, Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/components/shared/section/SectionContainer";
import CenteredContainer from "@/components/shared/containers/CenteredContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import FormActions from "@/components/shared/buttons/FormActions";
import FieldGroup from "@/components/shared/field/FieldGroup";
import FieldRow from "@/components/shared/field/FieldRow";

interface WebIntegrationsSectionProps {
  webIntegrations: Doc<"webIntegrations">;
  updateWebIntegrations: (
    webIntegrationsId: Id<"webIntegrations">,
    updates: WebIntegrationsFormData
  ) => Promise<boolean>;
  updateLoading: boolean;
  updateError: string | null;
  setUpdateError: (error: string | null) => void;
}

const WebIntegrationsSection: React.FC<WebIntegrationsSectionProps> = ({
  webIntegrations,
  updateWebIntegrations,
  updateLoading,
  updateError,
  setUpdateError,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<WebIntegrationsFormData>({
    webform: webIntegrations.webform || "",
    webformEmbeddedCode: webIntegrations.webformEmbeddedCode || "",
    externalReviewUrl: webIntegrations.externalReviewUrl || "",
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      webform: webIntegrations.webform || "",
      webformEmbeddedCode: webIntegrations.webformEmbeddedCode || "",
      externalReviewUrl: webIntegrations.externalReviewUrl || "",
    });
    setUpdateError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const success = await updateWebIntegrations(webIntegrations._id, formData);
    if (success) {
      setIsEditing(false);
      setUpdateError(null);
    }
  };

  const hasNoChanges =
    formData.webform === webIntegrations.webform &&
    formData.webformEmbeddedCode === webIntegrations.webformEmbeddedCode &&
    formData.externalReviewUrl === webIntegrations.externalReviewUrl;

  const isDisabled = isEditing && hasNoChanges;

  return (
    <SectionContainer isLast={true}>
      <CenteredContainer>
        <SectionHeader
          title="Web Integrations"
          isEditing={isEditing}
          onEditClick={handleEditClick}
          onCancelEdit={handleCancel}
          className="px-0 pb-4"
        />

        <FieldGroup>
          <FieldRow
            label="Web Form URL"
            name="webform"
            value={formData.webform}
            isEditing={isEditing}
            onChange={handleChange}
            placeholder="Enter web form URL"
          />

          <FieldRow
            label="Embedded Code"
            name="webformEmbeddedCode"
            value={formData.webformEmbeddedCode}
            isEditing={isEditing}
            onChange={handleChange}
            placeholder="Enter embedded code"
          />
          <FieldRow
            label="External Review URL"
            name="externalReviewUrl"
            value={formData.externalReviewUrl}
            isEditing={isEditing}
            onChange={handleChange}
            placeholder="Enter external review URL"
          />

          {isEditing && (
            <FormActions
              onSave={(e) => {
                e.preventDefault();
                handleSave();
              }}
              onCancel={handleCancel}
              isSaving={updateLoading}
              error={updateError}
              disabled={isDisabled}
            />
          )}
        </FieldGroup>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default WebIntegrationsSection;
