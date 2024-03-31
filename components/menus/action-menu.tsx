import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  QrCodeIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useContext } from "react";
import Modals from "@/modules/constants/Modals";
import { Paths } from "@/modules/routes";
import ModalsContext from "@/contexts/modals.context";
import GenericMenu from "./generic-menu";
import { SocialUnlock } from "@/types";

const _Modals = Modals.DASHBOARD.SOCIAL_UNLOCKS.OVERVIEW;

type Props = {
  row: { original: SocialUnlock };
};

export default function ActionMenuDropdown({ row }: Props) {
  const socialUnlock = row.original;
  const router = useRouter();
  const modals = useContext(ModalsContext);
  const actionMenuItems = [
    {
      name: "Open",
      onClick: function () {
        router.push(Paths.SocialUnlock.replace(":id", socialUnlock.id!));
      },
      icon: ArrowTopRightOnSquareIcon,
    },
    {
      name: "Edit",
      onClick: function () {
        modals.show(_Modals.EDIT, { socialUnlock });
      },
      icon: PencilIcon,
    },
    {
      name: "Share",
      onClick: function () {
        modals.show(_Modals.SHARE, { socialUnlock });
      },
      icon: ShareIcon,
    },
    {
      name: "QR code",
      onClick: function () {
        modals.show(_Modals.QR_CODE, { socialUnlock });
      },
      icon: QrCodeIcon,
    },
    {
      name: "Embed",
      onClick: function () {
        modals.show(_Modals.QR_CODE, { socialUnlock });
      },
      icon: CodeBracketIcon,
    },
    {
      name: "Delete",
      onClick: function () {
        modals.show(_Modals.DELETE, { socialUnlock });
      },
      icon: TrashIcon,
    },
  ];
  return (
    <GenericMenu
      menuItems={actionMenuItems}
      placement="left-start"
      classNames={{
        MenuButton: "text-black active:text-gray-700 rounded-full",
        MenuItems: "right-1/2 w-40",
        MenuItem: "w-full",
      }}
    >
      <span className="sr-only">Open action menu</span>
      <EllipsisVerticalIcon className="h-6 w-6" />
    </GenericMenu>
  );
}
