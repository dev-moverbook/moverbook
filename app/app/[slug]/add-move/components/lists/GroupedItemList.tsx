// import { MoveItemInput } from "@/types/form-types";
// import { Checkbox } from "@/components/ui/checkbox";

// interface GroupedItemsListProps {
//   items: MoveItemInput[];
//   selectedItemIndices: Set<number>;
//   onToggle: (index: number) => void;
// }

// const GroupedItemsList: React.FC<GroupedItemsListProps> = ({
//   items,
//   selectedItemIndices,
//   onToggle,
// }) => {
//   if (items.length === 0) {
//     return <p className="text-gray-500 italic">No items have been added.</p>;
//   }

//   const grouped = items.reduce<Record<string, MoveItemInput[]>>((acc, item) => {
//     if (!acc[item.room]) acc[item.room] = [];
//     acc[item.room].push(item);
//     return acc;
//   }, {});

//   let itemGlobalIndex = 0;

//   return (
//     <>
//       {Object.entries(grouped).map(([room, roomItems]) => (
//         <div key={room} className="mb-4">
//           <h4 className="font-semibold text-lg mb-2">{room}</h4>
//           <ul className="space-y-1">
//             {roomItems.map((item) => {
//               const currentIndex = itemGlobalIndex++;
//               return (
//                 <li
//                   key={currentIndex}
//                   className="flex items-center justify-between gap-2 pl-2 text-sm"
//                 >
//                   <div className="flex items-center gap-2 flex-1">
//                     <Checkbox
//                       checked={selectedItemIndices.has(currentIndex)}
//                       onCheckedChange={() => onToggle(currentIndex)}
//                       className="border-grayCustom data-[state=checked]:text-transparent data-[state=checked]:bg-greenCustom"
//                       id={`checkbox-${currentIndex}`}
//                     />
//                     {/* Desktop */}
//                     <div className="hidden md:flex w-full justify-between ">
//                       <label
//                         htmlFor={`checkbox-${currentIndex}`}
//                         className="cursor-pointer hover:underline"
//                       >
//                         <span className="mr-1">{item.quantity}x</span>
//                         <span>{item.item}</span>
//                       </label>

//                       <div className="flex gap-10 text-grayCustom2 text-sm">
//                         <p>{item.size}ft³</p>
//                         <p>{item.weight}lbs</p>
//                       </div>
//                     </div>
//                     {/* Mobile */}
//                     <label
//                       htmlFor={`checkbox-${currentIndex}`}
//                       className="md:hidden cursor-pointer hover:underline"
//                     >
//                       <span className="mr-2">{item.quantity}x</span>
//                       <span>{item.item}</span>
//                       <span className="text-grayCustom2 ml-2">
//                         ({item.size}ft³ | {item.weight}lbs)
//                       </span>
//                     </label>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       ))}
//     </>
//   );
// };

// export default GroupedItemsList;

import { MoveItemInput } from "@/types/form-types";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";

interface GroupedItemsListProps {
  items: MoveItemInput[];
  selectedItemIndices?: Set<number>;
  onToggle?: (index: number) => void;
  isEditing?: boolean;
}

const GroupedItemsList: React.FC<GroupedItemsListProps> = ({
  items,
  selectedItemIndices = new Set(),
  onToggle,
  isEditing = false,
}) => {
  if (items.length === 0) {
    return <p className="text-gray-500 italic">No items have been added.</p>;
  }

  const grouped = items.reduce<Record<string, MoveItemInput[]>>((acc, item) => {
    if (!acc[item.room]) acc[item.room] = [];
    acc[item.room].push(item);
    return acc;
  }, {});

  let itemGlobalIndex = 0;

  return (
    <div>
      {Object.entries(grouped).map(([room, roomItems]) => (
        <div key={room} className="mb-4">
          <h4 className="font-semibold text-lg mb-2">{room}</h4>
          <ul className="space-y-1">
            {roomItems.map((item) => {
              const currentIndex = itemGlobalIndex++;
              const isSelected = selectedItemIndices.has(currentIndex);

              return (
                <li
                  key={currentIndex}
                  className="flex items-center justify-between gap-2 pl-2 text-sm"
                >
                  <div className="flex items-center gap-2 flex-1">
                    {isEditing && (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggle?.(currentIndex)}
                        className="border-grayCustom data-[state=checked]:text-transparent data-[state=checked]:bg-greenCustom"
                        id={`checkbox-${currentIndex}`}
                      />
                    )}
                    <div className="flex flex-col md:flex-row md:justify-between w-full">
                      <label
                        htmlFor={`checkbox-${currentIndex}`}
                        className="cursor-pointer hover:underline"
                      >
                        <span className="mr-1">{item.quantity}x</span>
                        <span>{item.item}</span>
                      </label>
                      <div className="flex gap-6 text-grayCustom2 text-sm mt-1 md:mt-0">
                        <p>{item.size}ft³</p>
                        <p>{item.weight}lbs</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default GroupedItemsList;
