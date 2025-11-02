import SectionContainer from "@/components/shared/containers/SectionContainer";
import Header3 from "@/components/shared/heading/Header3";
import { Skeleton } from "@/components/ui/skeleton";

export default function LocationSharingSkeleton() {
  return (
    <div>
      <Header3 isCompleted={false}>Location Sharing</Header3>
      <SectionContainer>
        <Skeleton className="w-full h-10 mb-4 rounded-md" />
      </SectionContainer>
    </div>
  );
}
