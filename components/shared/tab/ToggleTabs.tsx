import { Label } from "@/components/ui/label";

interface ToggleTabsProps<T> {
  label?: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

const ToggleTabs = <T extends string>({
  label,
  options,
  value,
  onChange,
  className = "",
}: ToggleTabsProps<T>) => {
  return (
    <div className="">
      {label && <Label className="block text-sm font-medium">{label}</Label>}
      <div
        className={`inline-flex gap-2 rounded-lg border border-grayCustom p-1 ${className}`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-md px-4 py-1 text-sm font-medium transition ${
              value === option.value
                ? "bg-greenCustom text-white"
                : "text-grayCustom2 hover:bg-greenCustom/50 hover:text-white dark:text-gray-400"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToggleTabs;
