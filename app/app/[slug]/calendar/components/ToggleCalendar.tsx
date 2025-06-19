"use client";

interface ToggleCalendarProps {
  isWeekView: boolean;
  onToggle: () => void;
}

const ToggleCalendar: React.FC<ToggleCalendarProps> = ({
  isWeekView,
  onToggle,
}) => {
  return (
    <div className="flex justify-center mt-1">
      <button
        onClick={onToggle}
        className=" text-grayText hover:text-whiteText transition "
      >
        {isWeekView ? (
          <p className="text-xs underline">Expand</p>
        ) : (
          <p className="text-xs underline">Collapse</p>
        )}
      </button>
    </div>
  );
};

export default ToggleCalendar;
