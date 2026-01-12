import { Label } from "@/components/ui/label";

interface FieldDisplayProps {
  label: string;
  value?: string | null;
  fallback?: string;
  icon?: React.ReactNode;
  valueClassName?: string;
  isLink?: boolean;
}

const FieldDisplay: React.FC<FieldDisplayProps> = ({
  label,
  value,
  fallback = "N/A",
  icon,
  valueClassName = "text-grayCustom2",
  isLink = false,
}) => {
  const displayValue = value?.trim();

  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        {icon}

        {isLink && displayValue ? (
          <a
            href={displayValue}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline cursor-pointer ${valueClassName}`}
          >
            {displayValue}
          </a>
        ) : (
          <p className={valueClassName}>{displayValue || fallback}</p>
        )}
      </div>
    </div>
  );
};

export default FieldDisplay;
