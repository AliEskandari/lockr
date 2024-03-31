import Form, {
  CollectionFormReducer,
} from "@/components/forms/collections/form";
import Modals from "@/modules/constants/Modals";
import db from "@/modules/db";
import { PopulatedCollection } from "@/types";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import GenericModal from "../../generic-modal";

type EditModalProps = {
  collection: PopulatedCollection;
  onClose: () => void;
};

function EditModal({ collection, ...props }: EditModalProps) {
  const { onClose } = props;
  const [isValid, setIsValid] = useState(false);
  const [formState, setFormState] = useState<CollectionFormReducer.State>();

  const handleSaveClick = async () => {
    const populatedCollection = structuredClone(
      formState as PopulatedCollection
    );
    const collection = db.Collection.unpopulate(populatedCollection);
    await db.Collection.update(collection.id, collection);
    onClose();
  };

  return (
    <GenericModal
      className="flex flex-col w-full max-w-md max-h-full"
      {...props}
    >
      <div className="mb-5 text-center">
        <Dialog.Title className="text-xl font-semibold">Edit</Dialog.Title>
        <Dialog.Description className="text-sm">
          Update details and social unlocks
        </Dialog.Description>
      </div>
      <div className="overflow-auto">
        <Form
          collection={collection}
          onValidation={(state: CollectionFormReducer.State) => {
            setIsValid(state.isValid);
            setFormState(state);
          }}
        />
      </div>
      <div className="mt-2 flex space-x-2 justify-end">
        {/* Cancel */}
        <button
          className="p-2 text-red-500 active:text-red-400 rounded-xl w-auto sm:w-auto  disabled:font-normal disabled:text-gray-500 disabled:active:text-gray-400 disabled:cursor-pointer"
          onClick={onClose}
        >
          Cancel
        </button>
        {/* Create */}
        <button
          className="p-2 text-red-500 active:text-red-400 rounded-xl font-semibold w-auto sm:w-auto disabled:text-gray-500 disabled:active:text-gray-400 disabled:cursor-pointer"
          onClick={handleSaveClick}
          disabled={!isValid}
        >
          Save
        </button>
      </div>
    </GenericModal>
  );
}
EditModal.KEY = Modals.DASHBOARD.COLLECTIONS.OVERVIEW.EDIT;

export default EditModal;
