import { Dialog } from "@headlessui/react";
import { Paths } from "@/modules/routes";
import { useRouter } from "next/router";
import { ChangeEvent, MouseEvent, useState } from "react";
import Button from "@/components/buttons/button";
import Input from "@/components/inputs/input";
import Modals from "@/modules/constants/Modals";
import { signInWithGoogle, signUpWithEmailAndPassword } from "@/modules/auth";
import GenericDrawer from "../generic-drawer";
import Image from "next/image";

type Props = {
  onClose: () => void;
};

function SignUpModal(props: Props) {
  const router = useRouter();
  const { onClose } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleClickCancelButton = () => {
    onClose();
  };

  const handleClickSignUpButton = async (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    try {
      await signUpWithEmailAndPassword(email, password);
      onClose();
      router.push(Paths.Dashboard.SocialUnlocks.Overview);
    } catch (error: any) {
      setEmail("");
      setPassword("");
      setError(error.message);
    }
  };

  const handleGoogleSignUp = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      await signInWithGoogle();
      router.push(Paths.Dashboard.SocialUnlocks.Overview);
    } catch (error: any) {
      setEmail("");
      setPassword("");
      setError(error.message);
    }
  };

  return (
    <GenericDrawer className="max-w-xl w-full" {...props}>
      <div className="flex flex-col gap-y-5">
        <div className="text-center mb-2">
          <Dialog.Title className="text-xl font-semibold">
            Log in or sign up
          </Dialog.Title>
          <Dialog.Description className="text-sm">
            Use your Google account or your email to continue!
          </Dialog.Description>
        </div>

        <div className="flex flex-col gap-y-2">
          <Button
            className="p-3 text-lg bg-gray-100 text-black w-full flex items-center justify-center font-medium"
            onClick={handleGoogleSignUp}
          >
            <Image
              alt="Google Logo"
              src="/assets/images/google/google-logo.png"
              width={24}
              height={24}
            />
            <span className="!mr-[24px] w-full">Continue with Google</span>
          </Button>

          <div className="w-full text-center font-medium">or</div>

          <div className="flex flex-col gap-y-1.5 mb-2">
            <Input
              value={email}
              onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
                setEmail(target.value);
              }}
              type="email"
              placeholder="Email"
              className="rounded-xl text-md font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            />
            <Input
              value={password}
              onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
                setPassword(target.value);
              }}
              type="password"
              placeholder="Password"
              className="rounded-xl text-md font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 "
            />
          </div>
        </div>

        <div className="flex gap-x-2">
          <Button
            className="bg-gray-100 dark:bg-white text-black text-lg font-medium p-2.5 w-full"
            onClick={handleClickCancelButton}
          >
            Cancel
          </Button>
          <Button
            className="p-2.5 font-medium text-lg text-white bg-blue-500 w-full"
            type="submit"
            onClick={handleClickSignUpButton}
          >
            Sign up
          </Button>
        </div>
      </div>
    </GenericDrawer>
  );
}

SignUpModal.KEY = Modals.AUTH.SIGN_UP;

export default SignUpModal;
