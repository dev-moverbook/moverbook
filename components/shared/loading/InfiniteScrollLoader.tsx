import { LoaderCircleIcon } from "lucide-react";

interface InfiniteScrollLoaderProps {
  status: string;
}
const InfiniteScrollLoader: React.FC<InfiniteScrollLoaderProps> = ({
  status,
}) => {
  if (status === "LoadingMore") {
    return (
      <div className="flex justify-center my-4">
        <LoaderCircleIcon className="animate-spin h-6 w-6 text-blue-600" />
      </div>
    );
  }
  if (status === "Exhausted") {
    return <p className="text-center  text-gray-400">No more events</p>;
  }
  return null;
};

export default InfiniteScrollLoader;
