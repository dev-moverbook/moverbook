"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { WebIntegrationsSchema } from "@/types/convex-schemas";
import { FrontEndErrorMessages } from "@/types/errors";
import { Label } from "@/components/ui/label";
import { WebIntegrationsFormData } from "@/types/form-types";
import { Id } from "@/convex/_generated/dataModel";

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
    <div className="p-4 border rounded-md shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Web Integrations</h2>

      {updateError && <p className="text-red-500">{updateError}</p>}

      {!isEditing ? (
        <div className="space-y-2">
          <p>
            <span className="font-medium">Web Form URL:</span>{" "}
            {webIntegrations.webform || "N/A"}
          </p>
          <p>
            <span className="font-medium">Embedded Code:</span>{" "}
            {webIntegrations.webformEmbeddedCode || "N/A"}
          </p>

          <Button onClick={handleEditClick}>Edit</Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <Label className="block text-sm font-medium">Web Form URL</Label>
            <Input
              type="text"
              name="webform"
              value={formData.webform}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium">Embedded Code</Label>
            <Input
              type="text"
              name="webformEmbeddedCode"
              value={formData.webformEmbeddedCode}
              onChange={handleChange}
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSave} disabled={updateLoading}>
              {updateLoading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebIntegrationsSection;
