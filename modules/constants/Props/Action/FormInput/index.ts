import { ActionType } from "@/types";
import { ActionFormInputProps } from "@/components/buttons/action-form-input";
import Youtube from "./Youtube";
import Twitter from "./Twitter";
import Instagram from "./Instagram";

export type FormInputType = {
  [key in ActionType]: Pick<
    ActionFormInputProps,
    "input" | "directConnect" | "provider"
  >;
};

const FormInput: FormInputType = {
  ...Instagram,
  ...Twitter,
  ...Youtube,
};

export default FormInput;
