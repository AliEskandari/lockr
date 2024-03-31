import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import { ChangeEvent, MouseEvent, useState } from "react";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithGoogle,
} from "@/modules/auth";
import Button from "@/components/buttons/button";
import Modals from "@/modules/constants/Modals";
import Image from "next/image";
import Input from "@/components/inputs/input";
import GenericDrawer from "../generic-drawer";

type SignInModalProps = {
  redirectTo: string;
  onSuccess: () => void;
  onFailure: () => void;
  onClose: () => void;
};

function SignInModal({
  redirectTo,
  onSuccess = () => {},
  onFailure = () => {},
  ...props
}: SignInModalProps) {
  const router = useRouter();
  const { onClose } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleClickCancel = () => {
    onFailure();
    onClose();
  };

  const handleClickSignIn = async (event: MouseEvent) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(email, password);
      onSuccess();
      onClose();
      if (redirectTo) router.push(redirectTo);
    } catch (error: any) {
      setError(error.message);
    }

    setEmail("");
    setPassword("");
  };

  const handleClickSignInWithGoogleButton = async (event: MouseEvent) => {
    event.preventDefault();

    try {
      await signInWithGoogle();
      onSuccess();
      onClose();
      if (redirectTo) router.push(redirectTo);
    } catch (error: any) {
      setEmail("");
      setPassword("");
      setError(error.message);
      console.log(error);
    }
  };

  const handleClickForgotPassword = async (event: MouseEvent) => {
    try {
      await sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
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
            onClick={handleClickSignInWithGoogleButton}
          >
            <Image
              alt="Google Logo"
              src="/assets/images/google/google-logo.png"
              width={24}
              height={24}
            />
            <span className="!mr-[24px] w-full">Continue with Google</span>
          </Button>

          <div className="w-full text-center font-medium text-gray-500">or</div>

          <div className="flex flex-col gap-y-1.5">
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
            <div className="px-3 text-end mb-2">
              <button onClick={handleClickForgotPassword} className="text-xs">
                Forgot password?
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-x-2">
          <Button
            className="bg-gray-100 text-black text-lg font-medium p-2.5 w-full"
            onClick={handleClickCancel}
          >
            Cancel
          </Button>
          <Button
            className="p-2.5 font-medium text-lg text-white bg-blue-500 w-full"
            type="submit"
            onClick={handleClickSignIn}
          >
            Sign in
          </Button>
        </div>
      </div>
    </GenericDrawer>
  );
}

SignInModal.KEY = Modals.AUTH.SIGN_IN;

export default SignInModal;
