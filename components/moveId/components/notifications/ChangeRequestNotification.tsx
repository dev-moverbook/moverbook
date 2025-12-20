"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { useProcessMoveChange } from "@/hooks/moveChangeRequest";
import FormActions from "@/components/shared/buttons/FormActions";

interface ChangeRequestNotificationProps {
  changeRequest: Doc<"moveChangeRequests">;
}

const ChangeRequestNotification = ({
  changeRequest,
}: ChangeRequestNotificationProps) => {
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [rejectionNotes, setRejectionNotes] = useState<string>("");

  const { processMoveChangeRequest, isLoading, error } = useProcessMoveChange();

  const handleApprove = async () => {
    await processMoveChangeRequest({
      moveChangeRequestId: changeRequest._id,
      updates: {
        status: "approved",
      },
    });
  };

  const handleReject = async () => {
    await processMoveChangeRequest({
      moveChangeRequestId: changeRequest._id,
      updates: {
        status: "rejected",
        rejectionNotes: rejectionNotes.trim(),
      },
    });
  };

  const handleCancelReject = () => {
    setIsRejecting(false);
    setRejectionNotes("");
  };

  const hasLocationChanges = !!changeRequest.requestedLocations?.length;
  const hasInventoryChanges = !!changeRequest.requestedMoveItems?.length;

  return (
    <Alert className="my-4 max-w-screen-sm flex flex-col gap-2 bg-transparent mx-auto border-grayCustom">
      <div className="flex items-start gap-4 mb-4">
        <AlertTriangle className="h-5 w-5 text-orange-600 mt-1" />
        <div className="flex-1">
          <AlertTitle className="text-orange-800 text-lg">
            Customer requested changes to quote
          </AlertTitle>
          <AlertDescription className="text-orange-700 mt-2">
            <span className="block mb-2">
              Review the requested updates to locations and/or inventory. If
              approved, a new quote will need to be sent.
            </span>

            {(hasLocationChanges || hasInventoryChanges) && (
              <ul className="list-disc list-inside space-y-1 mt-3 text-sm">
                {hasLocationChanges && <li>Updated locations</li>}
                {hasInventoryChanges && <li>Updated inventory</li>}
              </ul>
            )}
          </AlertDescription>
        </div>
      </div>

      {isRejecting ? (
        <div className="space-y-3">
          <div>
            <label className="font-medium">
              Reason for rejection{" "}
              <span className="text-gray-500">(optional)</span>
            </label>
            <Textarea
              placeholder="Add rejection notes here..."
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              className="mt-1 resize-none"
              rows={1}
            />
          </div>

          <FormActions
            onSave={(e) => {
              e.preventDefault();
              handleReject();
            }}
            cancelLabel="Back"
            saveLabel="Reject"
            onCancel={handleCancelReject}
            isSaving={isLoading}
            error={error}
            disabled={isLoading}
          />
        </div>
      ) : (
        <FormActions
          onSave={(e) => {
            e.preventDefault();
            handleApprove();
          }}
          saveLabel="Approve"
          cancelLabel="Reject"
          onCancel={() => setIsRejecting(true)}
          isSaving={isLoading}
          error={error}
          disabled={isLoading}
        />
      )}
    </Alert>
  );
};

export default ChangeRequestNotification;
