import SectionContainer from "@/components/shared/containers/SectionContainer";
import Header3 from "@/components/shared/heading/Header3";
import InlineBanner from "@/components/shared/ui/InlineBanner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface StopSectionHeaderProps {
  stopCount: number;
  showBanner: boolean;
  onAddStop: (e: React.MouseEvent) => void;
}

const StopSectionHeader: React.FC<StopSectionHeaderProps> = ({
  stopCount,
  showBanner,
  onAddStop,
}) => {
  return (
    <SectionContainer className="pt-0 pb-6 px-0 md:px-0">
      <div className="flex items-center justify-between flex-wrap ">
        <Header3
          showCheckmark={false}
          className="pt-0 px-0"
          isCompleted={true}
          button={
            <div className="flex items-center gap-3">
              <InlineBanner
                message={`Stop #${stopCount} added.`}
                show={showBanner}
                className="pt-0"
              />

              <Button
                onClick={onAddStop}
                variant="outline"
                size="sm"
                className="flex flex-row items-center gap-1 "
              >
                <div className="flex flex-row items-center gap-1">
                  <Plus className="w-4 h-4" />
                  <span className="">Stop</span>
                </div>
              </Button>
            </div>
          }
        >
          Stops
        </Header3>
      </div>
    </SectionContainer>
  );
};

export default StopSectionHeader;
