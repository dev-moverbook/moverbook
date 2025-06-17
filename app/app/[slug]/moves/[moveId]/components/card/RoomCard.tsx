import React from "react";
import CustomCard from "@/app/components/shared/CustomCard";
import { MoveItem, MoveSchema } from "@/types/convex-schemas";
import CardHeaderWithActions from "@/app/components/shared/CardHeaderWithActions";

interface RoomCardProps {
  room: string;
  items: MoveItem[];
}

const RoomCard = ({ room, items }: RoomCardProps) => {
  return (
    <CustomCard className="flex flex-col  justify-between gap-4 p-4">
      <CardHeaderWithActions
        title={room}
        className="p-0"
        actions={<p>Quantity</p>}
      />
      <div className="flex flex-col gap-1 text-grayCustom2">
        {items.map((item) => (
          <div key={item.item} className="flex items-center justify-between">
            <p>{item.item}</p>
            <p>{item.quantity}</p>
          </div>
        ))}
      </div>
    </CustomCard>
  );
};

export default RoomCard;
