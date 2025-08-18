import IconButton from "@/app/components/shared/IconButton";
import { formatLongDate, getStatusColor } from "@/app/frontendUtils/helper";
import { Doc } from "@/convex/_generated/dataModel";
import { ChevronLeft, Phone, Truck } from "lucide-react";

interface MessageHeaderProps {
  move: Doc<"move">;
  onBack: () => void;
  onCall: () => void;
  moveCustomer: Doc<"moveCustomers">;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  move,
  moveCustomer,
  onBack,
  onCall,
}) => {
  const { moveDate, moveStatus } = move;
  const { name } = moveCustomer;

  const dotColor = getStatusColor(moveStatus);
  return (
    <div className="bg-black border-b border-grayCustom w-full">
      <div className="max-w-screen-sm mx-auto flex flex-col w-full text-white pb-3 px-1 md:px-0">
        <div className="flex justify-between items-center h-10">
          <IconButton
            onClick={onBack}
            className="flex items-center justify-center border-none hover:bg-background2 rounded"
            icon={<ChevronLeft className="text-white " />}
            title="Back"
          ></IconButton>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-lg font-medium">
              {name}
              <span
                className={`w-2 h-2 rounded-full ${dotColor}`}
                style={{ backgroundColor: dotColor }}
              />
            </div>
            <div className=" flex items-center justify-center text-sm text-grayCustom2">
              <Truck className="w-4 h-4 mr-1" />
              {formatLongDate(moveDate ? new Date(moveDate) : null)}{" "}
            </div>
          </div>
          <IconButton
            onClick={onCall}
            className="flex items-center justify-center border-none hover:bg-background2 rounded"
            icon={<Phone className="text-white " />}
            title="Call"
          ></IconButton>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
