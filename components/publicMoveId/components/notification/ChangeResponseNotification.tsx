"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import IconButton from "@/components/shared/buttons/IconButton";
import { useUpdateCustomerAcknowledgedAt } from "@/hooks/moveChangeRequest";
import FormErrorMessage from "@/components/shared/error/FormErrorMessage";

interface ChangeResponseNotificationProps {
  changeRequest: Doc<"moveChangeRequests">;
}

const ChangeResponseNotification = ({
  changeRequest,
}: ChangeResponseNotificationProps) => {
  const { status, rejectionNotes } = changeRequest;
  const isApproved = status === "approved";

  const titleText = isApproved
    ? "Change Request Approved"
    : "Change Request Rejected";

  const { customerAcknowledgedAt, isLoading, error } =
    useUpdateCustomerAcknowledgedAt();

  const handleDismiss = async () => {
    await customerAcknowledgedAt({
      moveChangeRequestId: changeRequest._id,
    });
  };

  return (
    <Alert className=" max-w-screen-sm mx-auto border bg-transparent shadow-light-md border-grayCustom">
      <div className="flex items-start justify-between w-full gap-4">
        <div className="flex-1">
          <AlertTitle
            className={`text-lg ${isApproved ? "text-green-800" : "text-orange-800"}`}
          >
            {titleText}
          </AlertTitle>
          {rejectionNotes && (
            <AlertDescription className="text-orange-700 mt-2">
              {rejectionNotes}
            </AlertDescription>
          )}
          {isApproved && (
            <AlertDescription className="text-green-700 mt-2">
              Changes has been approved. A updated quote will be sent.
            </AlertDescription>
          )}
        </div>

        <IconButton
          icon={<X size={16} />}
          variant="ghost"
          title="Dismiss"
          className="-mt-2 -mr-2"
          onClick={handleDismiss}
          loading={isLoading}
        />
      </div>
      <FormErrorMessage className="text-center" message={error} />
    </Alert>
  );
};

export default ChangeResponseNotification;
