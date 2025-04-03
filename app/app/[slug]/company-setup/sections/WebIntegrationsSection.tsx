"use client";

import { useState } from "react";
import { WebIntegrationsSchema } from "@/types/convex-schemas";
import { WebIntegrationsFormData } from "@/types/form-types";
import { Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";

interface WebIntegrationsSectionProps {
  webIntegrations: WebIntegrationsSchema;
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
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      webform: webIntegrations.webform || "",
      webformEmbeddedCode: webIntegrations.webformEmbeddedCode || "",
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

  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Web Integrations"
          isEditing={isEditing}
          onEditClick={handleEditClick}
        />

        <FieldGroup>
          <FieldRow
            label="Web Form URL"
            name="webform"
            value={formData.webform}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <FieldRow
            label="Embedded Code"
            name="webformEmbeddedCode"
            value={formData.webformEmbeddedCode}
            isEditing={isEditing}
            onChange={handleChange}
          />

          {isEditing && (
            <FormActions
              onSave={handleSave}
              onCancel={handleCancel}
              isSaving={updateLoading}
              error={updateError}
            />
          )}
        </FieldGroup>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default WebIntegrationsSection;
