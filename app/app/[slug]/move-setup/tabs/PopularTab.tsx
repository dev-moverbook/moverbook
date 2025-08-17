import SelectableCardContainer from "@/app/components/shared/containers/SelectableCardContainer";
import SingleCardContainer from "@/app/components/shared/SingleCardContainer";
import { Doc, Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/app/components/shared/SectionContainer";

interface PopularTabProps {
  items: Doc<"items">[];
  isEditMode: boolean;
  handleEditItem: (item: Doc<"items">) => void;
  handleOpenDeleteModal: (itemId: Id<"items">) => void;
  isDeleteMode: boolean;
  handleOpenItemModal: () => void;
}

const PopularTab: React.FC<PopularTabProps> = ({
  items,
  isEditMode,
  isDeleteMode,
  handleEditItem,
  handleOpenDeleteModal,
  handleOpenItemModal,
}) => {
  const popularItems = items.filter((item) => item.isPopular);

  return (
    <SectionContainer isLast={true}>
      <SingleCardContainer>
        <SelectableCardContainer
          onClick={handleOpenItemModal}
          centerText="ITEM"
          showPlusIcon={true}
        />
        {popularItems.map((item) => (
          <SelectableCardContainer
            key={item._id}
            topLeftText="Popular"
            centerText={item.name}
            bottomCenterText={`${item.size}ft³`}
            onEdit={isEditMode ? () => handleEditItem(item) : undefined}
            onDelete={
              isDeleteMode ? () => handleOpenDeleteModal(item._id) : undefined
            }
            showEditIcon={isEditMode}
            showDeleteIcon={isDeleteMode}
          />
        ))}
      </SingleCardContainer>
    </SectionContainer>
  );
};

export default PopularTab;
