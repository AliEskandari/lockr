import { Dialog } from "@headlessui/react";
import Modals from "@/modules/constants/Modals";
import GenericModal from "../../generic-modal";
import { GenericImage } from "@/components/images/generic-image";
import { AccountType } from "@/pages/dashboard/accounts";
import { Account } from "@/types";

type ShowModalProps = {
  account?: Account;
  accountType?: AccountType;
  onRevoke: () => Promise<void>;
  onClose: () => void;
};

function ShowModal({
  account,
  accountType,
  onRevoke,
  ...props
}: ShowModalProps) {
  const { onClose } = props;

  const handleDisconnect = async () => {
    await onRevoke();
    onClose();
  };

  return (
    <GenericModal {...props} onClose={onClose} className=" max-w-sm w-full">
      <div className="flex flex-col gap-y-6 text-center">
        <Dialog.Title className="text-xl font-semibold flex items-center justify-center gap-x-2">
          {accountType?.Icon ? <accountType.Icon className="w-6 h-6" /> : null}
          {accountType?.name}
        </Dialog.Title>

        <Dialog.Description className="break-words flex flex-col items-center justify-center gap-y-4">
          <div className="flex items-center justify-start gap-x-2 text-lg bg-gray-100 dark:bg-gray-800 rounded-full px-6 py-3">
            <GenericImage
              className="rounded-full overflow-hidden h-20 border"
              src={account?.picture}
            />
            {account?.name}
          </div>
        </Dialog.Description>
      </div>
      <div className="mt-4 text-center flex justify-end">
        <button
          className="text-red-500 rounded-xl p-2 outline-none"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="text-red-500 rounded-xl p-2 font-semibold"
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      </div>
    </GenericModal>
  );
}

ShowModal.KEY = Modals.DASHBOARD.ACCOUNTS.SHOW;

export default ShowModal;
