import { ActionType } from "@/types";
import { ActionButtonProps } from "@/components/buttons/action-button";
import Youtube from "./Youtube";
import Twitter from "./Twitter";
import Instagram from "./Instagram";

export type ButtonType = {
  [key in ActionType]: Pick<
    ActionButtonProps,
    "title" | "onClick" | "provider" | "onClickDirect" | "style"
  >;
};

const Button: ButtonType = {
  ...Instagram,
  ...Twitter,
  ...Youtube,
};

export default Button;
