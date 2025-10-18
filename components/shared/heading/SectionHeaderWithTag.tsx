import RemovableTag from "@/components/shared/ui/RemovableTag"; // update path as needed

interface SectionHeaderWithTagProps {
  tag: {
    label: string;
    onRemove: () => void;
    className?: string;
  };
  action?: React.ReactNode;
}

const SectionHeaderWithTag: React.FC<SectionHeaderWithTagProps> = ({
  tag,
  action,
}) => {
  return (
    <div className="px-4 md:px-0 pt-4">
      <div className="flex items-center justify-between max-w-screen-sm mx-auto">
        <RemovableTag
          label={tag.label}
          onRemove={tag.onRemove}
          className={tag.className}
        />
        {action}
      </div>
    </div>
  );
};

export default SectionHeaderWithTag;
