import { Badge } from "@/components/ui/badge";

interface TitleWithBadgeProps {
  title: string;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
}

const TitleWithBadge: React.FC<TitleWithBadgeProps> = ({
  title,
  showBadge = false,
  badgeText = "Default",
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span>{title}</span>
      {showBadge && (
        <Badge variant="outline" className="text-xs">
          {badgeText}
        </Badge>
      )}
    </div>
  );
};

export default TitleWithBadge;
