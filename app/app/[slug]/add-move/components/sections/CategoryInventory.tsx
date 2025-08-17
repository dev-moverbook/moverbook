import SelectableCardContainer from "@/app/components/shared/containers/SelectableCardContainer";
import SingleCardContainer from "@/app/components/shared/SingleCardContainer";
import { Doc } from "@/convex/_generated/dataModel";

interface CategoryInventoryProps {
  categories?: Doc<"categories">[];
}

const CategoryInventory: React.FC<CategoryInventoryProps> = ({
  categories,
}) => {
  return (
    <SingleCardContainer className="px-4">
      {categories?.map((category) => (
        <SelectableCardContainer
          key={category._id}
          id={category._id}
          centerText={category.name}
        />
      ))}
    </SingleCardContainer>
  );
};
export default CategoryInventory;
