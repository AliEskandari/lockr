import { Dialog } from "@headlessui/react";
import Modals from "@/modules/constants/Modals";
import GenericModal from "../../generic-modal";
import db from "@/modules/db";
import { Collection } from "@/types";

type DeleteModalProps = {
  collection: Collection;
  onClose: () => void;
};

function DeleteModal({ collection, ...props }: DeleteModalProps) {
  const { onClose } = props;

  const handleDelete = async () => {
    await db.Collection.delete(collection.id);
    onClose();
  };

  return (
    <GenericModal {...props} onClose={onClose} className=" max-w-sm w-full">
      <div className="mb-2 text-center">
        <Dialog.Title className="text-xl font-semibold">Delete</Dialog.Title>
        <Dialog.Description className="text-sm break-words mt-4">
          Are you sure you want to delete this collection?
        </Dialog.Description>
      </div>
      <div className="text-center flex justify-end">
        <button className="text-red-500 rounded-xl p-2 flex" onClick={onClose}>
          Close
        </button>
        <button
          className="text-red-500 rounded-xl p-2 flex font-semibold"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </GenericModal>
  );
}

DeleteModal.KEY = Modals.DASHBOARD.COLLECTIONS.OVERVIEW.DELETE;

export default DeleteModal;
