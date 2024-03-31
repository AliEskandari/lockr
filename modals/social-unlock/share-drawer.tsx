import { Paths } from "@/modules/routes";
import copy from "copy-to-clipboard";
import { useRouter } from "next/router";
import { MouseEvent, useEffect, useRef, useState } from "react";
import Button from "@/components/buttons/button";
import GenericDrawer from "@/modals/generic-drawer";
import Modals from "@/modules/constants/Modals";

type ShareDrawerProps = {
  socialUnlock: any;
  onClose: () => void;
};

function ShareDrawer({ socialUnlock, ...props }: ShareDrawerProps) {
  const { onClose } = props;
  const shareButtonRef = useRef<HTMLButtonElement | null>(null);
  const [url, setURL] = useState("");
  const router = useRouter();

  const ITEMS = [
    {
      title: "Share",
      onClick: async (event: MouseEvent<HTMLButtonElement>) => {
        copy(url);
        shareButtonRef.current!.innerText = "Copied Link!";
      },
      ref: shareButtonRef,
    },
    {
      title: "Remove Ads",
      onClick: async () => {
        router.push(Paths.Pricing);
      },
    },
    // {
    //   title: "QR Code",
    // },
  ];

  useEffect(() => {
    if (socialUnlock) {
      setURL(
        location.origin + Paths.SocialUnlock.replace(":id", socialUnlock.id)
      );
    }
  }, [socialUnlock]);

  const handleClose = () => {
    shareButtonRef.current!.innerText = "Share";
    onClose();
  };

  return (
    <GenericDrawer
      {...props}
      onClose={handleClose}
      className="md:max-w-md w-full"
    >
      <div className="text-start flex flex-col bg-white dark:bg-gray-900 gap-y-3">
        {ITEMS.map((item) => (
          <Button
            key={item.title}
            onClick={item.onClick}
            ref={item.ref}
            className="w-full py-3 font-normal bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 text-lg"
          >
            {item.title}
          </Button>
        ))}
      </div>
    </GenericDrawer>
  );
}
ShareDrawer.KEY = Modals.SOCIAL_UNLOCK.SHARE;

export default ShareDrawer;
