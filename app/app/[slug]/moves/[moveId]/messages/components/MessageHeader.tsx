import { formatLongDate, getStatusColor } from "@/app/frontendUtils/helper";
import { MoveSchema } from "@/types/convex-schemas";
import { ChevronLeft, Phone, Truck } from "lucide-react";

interface MessageHeaderProps {
  move: MoveSchema;
  onBack: () => void;
  onCall: () => void;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  move,
  onBack,
  onCall,
}) => {
  const { name, moveDate, status } = move;
  const dotColor = getStatusColor(status);
  return (
    <div className="bg-black border-b border-grayCustom w-full">
      <div className="max-w-screen-sm mx-auto flex flex-col w-full text-white pb-3 px-1 md:px-0">
        <div className="flex justify-between items-center h-10">
          <button
            onClick={onBack}
            className="flex items-center justify-center h-10 w-10 hover:bg-background2 rounded"
          >
            <ChevronLeft className="text-white " />
          </button>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-lg font-medium">
              {name}
              <span
                className={`w-2 h-2 rounded-full ${dotColor}`}
                style={{ backgroundColor: dotColor }}
              />
            </div>
            <div className=" flex items-center justify-center text-sm text-gray-400">
              <Truck className="w-4 h-4 mr-1" />
              {formatLongDate(new Date(moveDate ?? ""))}
            </div>
          </div>
          <button
            onClick={onCall}
            className="flex items-center justify-center h-10  w-10 hover:bg-background2 rounded"
          >
            <Phone className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
