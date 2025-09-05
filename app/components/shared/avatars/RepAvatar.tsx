import { Doc } from "@/convex/_generated/dataModel";
import { getInitials } from "@/app/frontendUtils/helper";
import Image from "next/image";

export const RepAvatar: React.FC<{ salesRep: Doc<"users"> | null }> = ({
  salesRep,
}) => {
  const initials = getInitials(salesRep?.name || "Rep");
  return (
    <div className="mt-auto flex flex-col items-center">
      <div className="w-10 h-10 border border-grayCustom rounded-full overflow-hidden flex items-center justify-center bg-background2">
        {salesRep?.imageUrl ? (
          <Image
            src={salesRep.imageUrl}
            alt={salesRep?.name ?? "Sales rep"}
            width={40}
            height={40}
            className="rounded-full object-cover w-10 h-10"
          />
        ) : (
          <span className="text-sm text-white font-medium">{initials}</span>
        )}
      </div>
      <span className="text-sm text-grayCustom2 text-center max-w-[9rem] truncate">
        {salesRep?.name}
      </span>
    </div>
  );
};
