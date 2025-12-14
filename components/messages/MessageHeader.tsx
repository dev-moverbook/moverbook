import IconButton from "@/components/shared/buttons/IconButton";
import { useMoveContext } from "@/contexts/MoveContext";
import { useSlugContext } from "@/contexts/SlugContext";
import { formatLongDate, getStatusColor } from "@/frontendUtils/helper";
import { ChevronLeft, Phone, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MessageHeader = () => {
  const { moveData } = useMoveContext();
  const { slug } = useSlugContext();
  const router = useRouter();
  const { moveDate, moveStatus } = moveData.move;
  const { name } = moveData.moveCustomer;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/app/${slug}/messages`);
    }
  };

  const handleCall = () => {
    if (moveData.moveCustomer.phoneNumber) {
      window.open(`tel:${moveData.moveCustomer.phoneNumber}`, "_blank");
    }
  };

  const dotColor = getStatusColor(moveStatus);
  return (
    <div className="bg-black border-b border-grayCustom w-full">
      <div className="max-w-screen-sm mx-auto flex flex-col w-full text-white pb-3 px-1 md:px-0">
        <div className="flex justify-between items-center h-10">
          <IconButton
            onClick={handleBack}
            className="flex items-center justify-center border-none hover:bg-background2 rounded"
            icon={<ChevronLeft className="text-white " />}
            title="Back"
          ></IconButton>
          <div className="flex flex-col items-center">
            <Link
              href={`/app/${slug}/customer/${moveData.moveCustomer._id}`}
              className="flex items-center gap-1 text-lg font-medium"
            >
              {name}
              <span
                className={`w-2 h-2 rounded-full ${dotColor}`}
                style={{ backgroundColor: dotColor }}
              />
            </Link>
            <div className=" flex items-center justify-center text-sm text-grayCustom2">
              <Truck className="w-4 h-4 mr-1" />
              {formatLongDate(moveDate ? new Date(moveDate) : null)}{" "}
            </div>
          </div>
          <IconButton
            onClick={handleCall}
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
