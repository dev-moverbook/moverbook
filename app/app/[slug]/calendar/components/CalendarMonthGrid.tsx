// "use client";

// import React from "react";
// import { DateTime } from "luxon";
// import { useMoveFilter } from "@/app/contexts/MoveFilterContext";
// import { useSlugContext } from "@/app/contexts/SlugContext";
// import { getStatusColor } from "@/app/frontendUtils/helper";

// interface CalendarMonthGridProps {
//   dates: Date[];
//   today: Date;
//   shouldDimDate?: (date: Date) => boolean;
// }

// const CalendarMonthGrid: React.FC<CalendarMonthGridProps> = ({
//   dates,
//   today,
//   shouldDimDate,
// }) => {
//   const { isWeekView, setSelectedDate, setIsWeekView, moves } = useMoveFilter();
//   const { timeZone } = useSlugContext();

//   const handleDateClick = (date: Date) => {
//     if (!isWeekView) {
//       setSelectedDate(date);
//       setIsWeekView(true);
//     }
//   };

//   return (
//     <div className="flex flex-wrap w-full">
//       {dates.map((day) => {
//         const isToday = day.toDateString() === today.toDateString();
//         const isDimmed = shouldDimDate?.(day) ?? false;

//         const isoDate = DateTime.fromJSDate(day).setZone(timeZone).toISODate();
//         const moveStatuses = moves
//           .filter((move) => {
//             const moveDate = DateTime.fromISO(move.moveDate ?? "")
//               .setZone(timeZone)
//               .toISODate();
//             return moveDate === isoDate;
//           })
//           .map((move) => getStatusColor(move.status));

//         // const price = getPriceLabel?.(day);
//         const price = "$2.2k";

//         const baseClass =
//           "h-16 w-[14.2857%] aspect-square flex items-center justify-center font-medium transition-all overflow-hidden";
//         const hoverClass = !isWeekView
//           ? "hover:bg-background2 hover:rounded"
//           : "";
//         const todayClass = isToday ? "z-10" : "";
//         const dimmedClass = isDimmed ? "opacity-50" : "";

//         return (
//           <button
//             key={day.toISOString()}
//             type="button"
//             onClick={() => handleDateClick(day)}
//             className={`${baseClass} ${hoverClass} ${todayClass} ${dimmedClass}`}
//             disabled={isWeekView}
//           >
//             <abbr
//               aria-label={day.toDateString()}
//               className="relative font-medium flex flex-col items-center justify-start h-full pt-2"
//             >
//               {isToday && (
//                 <div className="absolute w-[26px] h-[26px] bg-background2 rounded-full top-1 z-0" />
//               )}
//               <span className="relative z-10 text-sm">{day.getDate()}</span>
//               {price && (
//                 <span className="text-[12px] mt-1 text-grayCustom2 leading-none">
//                   {price}
//                 </span>
//               )}
//               {moveStatuses.length > 0 && (
//                 <div className="mt-[4px] flex justify-center overflow-visible">
//                   <div className="flex items-center max-w-[28px] overflow-visible relative">
//                     {moveStatuses.map((color, idx) => (
//                       <div
//                         key={idx}
//                         className="rounded-full w-[6px] h-[6px] flex-shrink-0"
//                         style={{
//                           backgroundColor: color,
//                           marginRight: moveStatuses.length > 1 ? "-2px" : "0px",
//                         }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </abbr>
//           </button>
//         );
//       })}
//     </div>
//   );
// };

// export default CalendarMonthGrid;

"use client";

import React from "react";
import { DateTime } from "luxon";
import { useMoveFilter } from "@/app/contexts/MoveFilterContext";
import { useSlugContext } from "@/app/contexts/SlugContext";
import {
  getStatusColor,
  getMoveCostRange,
  formatCurrencyCompact,
} from "@/app/frontendUtils/helper";

interface CalendarMonthGridProps {
  dates: Date[];
  today: Date;
  shouldDimDate?: (date: Date) => boolean;
}

const CalendarMonthGrid: React.FC<CalendarMonthGridProps> = ({
  dates,
  today,
  shouldDimDate,
}) => {
  const { isWeekView, setSelectedDate, setIsWeekView, moves } = useMoveFilter();
  const { timeZone } = useSlugContext();

  const handleDateClick = (date: Date) => {
    if (!isWeekView) {
      setSelectedDate(date);
      setIsWeekView(true);
    }
  };

  return (
    <div className="flex flex-wrap w-full">
      {dates.map((day) => {
        const isToday = day.toDateString() === today.toDateString();
        const isDimmed = shouldDimDate?.(day) ?? false;

        const isoDate = DateTime.fromJSDate(day).setZone(timeZone).toISODate();

        const movesOnDate = moves.filter((move) => {
          const moveDate = DateTime.fromISO(move.moveDate ?? "")
            .setZone(timeZone)
            .toISODate();
          return moveDate === isoDate;
        });

        const moveStatuses = movesOnDate.map((move) =>
          getStatusColor(move.status)
        );

        const totalLow = movesOnDate.reduce((sum, move) => {
          const [low] = getMoveCostRange(move);
          return sum + low;
        }, 0);

        const price = totalLow > 0 ? formatCurrencyCompact(totalLow) : null;

        const baseClass =
          "h-16 w-[14.2857%] aspect-square flex items-center justify-center font-medium transition-all overflow-hidden";
        const hoverClass = !isWeekView
          ? "hover:bg-background2 hover:rounded"
          : "";
        const todayClass = isToday ? "z-10" : "";
        const dimmedClass = isDimmed ? "opacity-50" : "";

        return (
          <button
            key={day.toISOString()}
            type="button"
            onClick={() => handleDateClick(day)}
            className={`${baseClass} ${hoverClass} ${todayClass} ${dimmedClass}`}
            disabled={isWeekView}
          >
            <abbr
              aria-label={day.toDateString()}
              className="relative font-medium flex flex-col items-center justify-start h-full pt-2"
            >
              {isToday && (
                <div className="absolute w-[26px] h-[26px] bg-background2 rounded-full top-1 z-0" />
              )}
              <span className="relative z-10 text-sm">{day.getDate()}</span>
              {price && (
                <span className="text-[10px] mt-.5 text-grayCustom2 leading-none">
                  {price}
                </span>
              )}
              {moveStatuses.length > 0 && (
                <div className="mt-[4px] flex justify-center overflow-visible">
                  <div className="flex items-center max-w-[28px] overflow-visible relative">
                    {moveStatuses.map((color, idx) => (
                      <div
                        key={idx}
                        className="rounded-full w-[6px] h-[6px] flex-shrink-0"
                        style={{
                          backgroundColor: color,
                          marginRight: moveStatuses.length > 1 ? "-2px" : "0px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </abbr>
          </button>
        );
      })}
    </div>
  );
};

export default CalendarMonthGrid;
