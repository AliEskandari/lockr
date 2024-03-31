import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import Modals from "@/modules/constants/Modals";
import { Paths } from "@/modules/routes";
import GenericModal from "../../generic-modal";
import type { SocialUnlock } from "@/types";

type ShareModalProps = {
  socialUnlock?: SocialUnlock;
  onClose: () => void;
};

function ShareModal({ socialUnlock, ...props }: ShareModalProps) {
  const { onClose } = props;
  const [url, setURL] = useState("");
  const [buttonText, setButtonText] = useState("Copy link");

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    setButtonText("Copied!");
  };

  useEffect(() => {
    if (socialUnlock) {
      setURL(
        location.origin + Paths.SocialUnlock.replace(":id", socialUnlock.id)
      );
    }
  }, [socialUnlock]);

  return (
    <GenericModal
      {...props}
      onClose={onClose}
      beforeEnter={() => setButtonText("Copy link")}
      className="max-w-sm w-full"
    >
      <div className="mb-5 text-center">
        <Dialog.Title className="text-xl font-semibold">Share</Dialog.Title>
        <Dialog.Description className="text-sm">
          Link to social unlock
        </Dialog.Description>
      </div>
      <div className="mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl mb-2 p-2 truncate">
        {url}
      </div>
      <div className="text-center flex justify-end">
        <button className="text-red-500 rounded-xl p-2 flex" onClick={onClose}>
          Close
        </button>
        <button
          className="text-red-500 rounded-xl p-2 flex font-semibold"
          onClick={handleCopyToClipboard}
        >
          {buttonText}
        </button>
      </div>
    </GenericModal>
  );
}
ShareModal.KEY = Modals.DASHBOARD.SOCIAL_UNLOCKS.OVERVIEW.SHARE;

export default ShareModal;
