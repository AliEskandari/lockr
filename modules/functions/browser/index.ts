import { ActionButtonProps } from "@/components/buttons/action-button";

export const openTabWithPrefix = (
  prefix = ""
): ActionButtonProps["onClick"] => {
  return (url) => {
    window.open(prefix + url, "_blank");
  };
};
