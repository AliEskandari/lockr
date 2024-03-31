import Modals from "@/modules/constants/Modals";
import { Paths } from "@/modules/routes";
import { SocialUnlock } from "@/types";
import { Dialog } from "@headlessui/react";
import { QRCodeCanvas } from "qrcode.react";
import GenericModal from "../../generic-modal";

type QRCodeCanvasComponentProps = {
  socialUnlock: SocialUnlock;
};

const QRCodeCanvasComponent = ({
  socialUnlock,
}: QRCodeCanvasComponentProps) => {
  if (!socialUnlock) return null;
  const url =
    location.origin + Paths.SocialUnlock.replace(":id", socialUnlock.id);
  return <QRCodeCanvas value={url} size={256} />;
};

type QRCodeModalProps = {
  socialUnlock: SocialUnlock;
  onClose: () => void;
};

function QRCodeModal({ socialUnlock, ...props }: QRCodeModalProps) {
  const { onClose } = props;

  function downloadURI(uri: string, name: string) {
    var link: HTMLAnchorElement | null = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link = null;
  }

  const handleDownload = () => {
    const canvas: HTMLCanvasElement | null =
      document.querySelector("#qrcode canvas");
    if (!canvas) return;
    const dataURI = canvas.toDataURL("image/png");
    downloadURI(dataURI, "qrcode.png");
  };

  return (
    <>
      <GenericModal {...props} className="max-w-sm w-full" unmount={false}>
        <div className="mb-5 text-center">
          <Dialog.Title className="text-xl font-semibold">QR Code</Dialog.Title>
          <Dialog.Description className="text-sm">
            Use this code to share your social unlock
          </Dialog.Description>
        </div>
        <div id="qrcode" className="flex justify-center mb-2 px-4">
          <QRCodeCanvasComponent socialUnlock={socialUnlock} />
        </div>
        <div className="text-center flex justify-end">
          <button
            className="text-red-500 rounded-xl p-2 flex"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="text-red-500 rounded-xl p-2 flex font-semibold"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </GenericModal>
    </>
  );
}
QRCodeModal.KEY = Modals.DASHBOARD.SOCIAL_UNLOCKS.OVERVIEW.QR_CODE;

export default QRCodeModal;
