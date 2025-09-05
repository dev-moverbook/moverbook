import Header3 from "@/app/components/shared/heading/Header3";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import GroupedItemsList from "@/app/app/[slug]/add-move/components/lists/GroupedItemList";
import { useMoveContext } from "@/app/contexts/MoveContext";

const InventoryMoverSection = () => {
  const { moveData } = useMoveContext();
  const items = moveData.move.moveItems;

  return (
    <div>
      <Header3 wrapperClassName={`px-4 `} showCheckmark={false}>
        Inventory
      </Header3>

      <SectionContainer>
        <GroupedItemsList items={items} />
      </SectionContainer>
    </div>
  );
};

export default InventoryMoverSection;
