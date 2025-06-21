// "use client";

// import React, { useState, useEffect } from "react";
// import { useMediaQuery } from "react-responsive";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
// import FieldGroup from "@/app/components/shared/FieldGroup";
// import FormActions from "@/app/components/shared/FormActions";
// import { MOVE_STATUS_OPTIONS, MoveStatus } from "@/types/types";
// import LabeledCheckboxGroup from "@/app/components/shared/labeled/LabeledCheckboxGroup";

// interface CategoryFormData {
//   name: string;
//   selectedStatuses: MoveStatus[];
//   setSelectedStatuses: (statuses: MoveStatus[]) => void;
// }

// interface FilterModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   selectedStatuses: MoveStatus[];
//   setSelectedStatuses: (statuses: MoveStatus[]) => void;
// }

// const FilterModal: React.FC<FilterModalProps> = ({
//   isOpen,
//   onClose,
//   selectedStatuses,
//   setSelectedStatuses,
// }) => {
//   const isMobile = useMediaQuery({ maxWidth: 768 });
//   const title = "Filter Moves";
//   const [tempStatuses, setTempStatuses] =
//     useState<MoveStatus[]>(selectedStatuses);

//   useEffect(() => {
//     if (isOpen) {
//       setTempStatuses(selectedStatuses);
//     }
//   }, [isOpen, selectedStatuses]);

//   const handleSubmit = () => {
//     setSelectedStatuses(tempStatuses);
//     onClose();
//   };

//   const formContent = (
//     <FieldGroup>
//       <LabeledCheckboxGroup
//         label="Move Status"
//         name="status"
//         values={tempStatuses.map((status) => status.toString())}
//         options={MOVE_STATUS_OPTIONS}
//         onChange={(newValues) =>
//           setTempStatuses(newValues.map((value) => value as MoveStatus))
//         }
//       />
//       <FormActions
//         onSave={handleSubmit}
//         onCancel={onClose}
//         isSaving={false}
//         error={null}
//         saveLabel="Apply Filters"
//         cancelLabel="Cancel"
//       />
//     </FieldGroup>
//   );

//   return isMobile ? (
//     <Drawer open={isOpen} onOpenChange={onClose}>
//       <DrawerContent>
//         <DrawerTitle>{title}</DrawerTitle>
//         {formContent}
//       </DrawerContent>
//     </Drawer>
//   ) : (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogTitle>{title}</DialogTitle>
//         {formContent}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default FilterModal;

// "use client";

// import React, { useState, useEffect } from "react";
// import { useMediaQuery } from "react-responsive";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
// } from "@/components/ui/drawer";
// import FieldGroup from "@/app/components/shared/FieldGroup";
// import FormActions from "@/app/components/shared/FormActions";
// import { MOVE_STATUS_OPTIONS, MoveStatus } from "@/types/types";
// import LabeledCheckboxGroup from "@/app/components/shared/labeled/LabeledCheckboxGroup";

// interface FilterModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   selectedStatuses: MoveStatus[];
//   setSelectedStatuses: (statuses: MoveStatus[]) => void;
// }

// const FilterModal: React.FC<FilterModalProps> = ({
//   isOpen,
//   onClose,
//   selectedStatuses,
//   setSelectedStatuses,
// }) => {
//   const isMobile = useMediaQuery({ maxWidth: 768 });
//   const title = "Filter Moves";

//   const [tempStatuses, setTempStatuses] =
//     useState<MoveStatus[]>(selectedStatuses);

//   useEffect(() => {
//     if (isOpen) {
//       setTempStatuses(selectedStatuses);
//     }
//   }, [isOpen, selectedStatuses]);

//   const handleSubmit = () => {
//     setSelectedStatuses(tempStatuses);
//     onClose();
//   };

//   const formContent = (
//     <FieldGroup>
//       <LabeledCheckboxGroup
//         label="Move Status"
//         name="status"
//         values={tempStatuses}
//         options={MOVE_STATUS_OPTIONS}
//         onChange={(newValues) =>
//           setTempStatuses(newValues.map((value) => value as MoveStatus))
//         }
//       />
//       <FormActions
//         onSave={handleSubmit}
//         onCancel={onClose}
//         isSaving={false}
//         error={null}
//         saveLabel="Apply Filters"
//         cancelLabel="Cancel"
//       />
//     </FieldGroup>
//   );

//   return (
//     <Drawer
//       open={isOpen}
//       onOpenChange={onClose}
//       direction={isMobile ? "bottom" : "right"}
//     >
//       <DrawerContent className={isMobile ? "" : "w-[320px] ml-auto"}>
//         <DrawerHeader>
//           <DrawerTitle>{title}</DrawerTitle>
//         </DrawerHeader>
//         <div className="p-4">{formContent}</div>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// export default FilterModal;

"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FormActions from "@/app/components/shared/FormActions";
import { MOVE_STATUS_OPTIONS, MoveStatus } from "@/types/types";
import LabeledCheckboxGroup from "@/app/components/shared/labeled/LabeledCheckboxGroup";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStatuses: MoveStatus[];
  setSelectedStatuses: (statuses: MoveStatus[]) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedStatuses,
  setSelectedStatuses,
}) => {
  const [tempStatuses, setTempStatuses] =
    useState<MoveStatus[]>(selectedStatuses);

  useEffect(() => {
    if (isOpen) {
      setTempStatuses(selectedStatuses);
    }
  }, [isOpen, selectedStatuses]);

  const handleSubmit = () => {
    setSelectedStatuses(tempStatuses);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="border-none h-screen w-full max-w-md p-6 bg-background2 overflow-y-auto z-[999]"
      >
        <SheetHeader>
          <SheetTitle className="text-lg text-white">Filter Moves</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <FieldGroup>
            <LabeledCheckboxGroup
              label="Move Status"
              name="status"
              values={tempStatuses}
              options={MOVE_STATUS_OPTIONS}
              onChange={(newValues) =>
                setTempStatuses(newValues.map((v) => v as MoveStatus))
              }
            />
            <FormActions
              onSave={handleSubmit}
              onCancel={onClose}
              isSaving={false}
              error={null}
              saveLabel="Apply Filters"
              cancelLabel="Cancel"
            />
          </FieldGroup>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterModal;
