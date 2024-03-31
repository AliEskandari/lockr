import { Dialog } from "@headlessui/react";
import { useState, useRef } from "react";
import Modals from "@/modules/constants/Modals";
import db from "@/modules/db";
import Form from "@/components/forms/social-unlocks/form";
import GenericModal, { GenericModalProps } from "../../generic-modal";
import Button from "@/components/buttons/button";
import { SocialUnlock } from "@/types";

type EditModalProps = {
  socialUnlock: SocialUnlock;
} & GenericModalProps;

function EditModal({ socialUnlock, ...props }: EditModalProps) {
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  return (
    <GenericModal
      {...props}
      ref={scrollContainerRef}
      className="flex flex-col max-w-md w-full max-h-full !overflow-auto relative"
    >
      <div className="mb-5 text-center">
        <Dialog.Title className="text-xl font-semibold">Edit</Dialog.Title>
        <Dialog.Description className="text-sm">
          Update details and actions
        </Dialog.Description>
      </div>
      <div>
        <Form
          socialUnlock={socialUnlock}
          scrollContainerRef={scrollContainerRef}
        />
      </div>

      {/* <Button
        className="p-2 text-red-500 active:text-red-400 rounded-xl w-auto sm:w-auto  disabled:font-normal disabled:text-gray-500 disabled:active:text-gray-400 disabled:cursor-pointer"
        onClick={onClose}
      >
        Cancel
      </Button> */}
    </GenericModal>
  );
}
EditModal.KEY = Modals.DASHBOARD.SOCIAL_UNLOCKS.OVERVIEW.EDIT;

export default EditModal;
