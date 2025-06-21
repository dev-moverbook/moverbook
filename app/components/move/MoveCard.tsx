import React from "react";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
import {
  formatAccessType,
  formatCurrency,
  formatDateToLong,
  formatMoveSize,
  formatMoveType,
  getStatusColor,
} from "@/app/frontendUtils/helper";
import { MoveSchema } from "@/types/convex-schemas";
import Link from "next/link";
import { useSlugContext } from "@/app/contexts/SlugContext";

interface MoveCardProps {
  move: MoveSchema;
}

const MoveCard: React.FC<MoveCardProps> = ({ move }) => {
  const { moveDate, name, status, _id } = move;
  const { slug } = useSlugContext();
  const tags = [
    formatMoveSize(move.locations[0].moveSize),
    formatAccessType(move.locations[0].accessType),
    formatMoveType(move.locations[0].moveType),
    move.referral,
  ].filter(Boolean) as string[];

  const price = formatCurrency(2);

  return (
    <Link href={`/app/${slug}/moves/${_id}`}>
      <div className="bg-black py-2 px-4 text-white shadow-md border-b border-grayCustom hover:bg-background2 transition-colors duration-200">
        <div className="max-w-screen-sm mx-auto">
          <p className="text-xs text-grayCustom2">
            {formatDateToLong(moveDate)}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{name}</h3>
              <div className="flex items-center gap-1 text-sm">
                <span style={{ color: getStatusColor(status) }}>●</span>{" "}
                <span className="">{status}</span>
                <span className="text-greenCustom font-medium pl-2">
                  {price}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-1">
            {tags.map((tag, i) => (
              <Badge key={i} className="">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MoveCard;
