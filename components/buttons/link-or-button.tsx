import { WithRequired } from "@tanstack/react-query";
import Link from "next/link";
import React, { ComponentProps, ReactNode } from "react";
import Button from "./button";

type LinkOrButtonProps = ComponentProps<typeof Button> &
  Omit<ComponentProps<typeof Link>, "href"> & { href?: string };

const LinkOrButton = React.forwardRef<any, LinkOrButtonProps>((props, ref) => {
  if (props.href) {
    const linkProps = { ...props } as ComponentProps<typeof Link>;
    return <Link {...linkProps} />;
  } else {
    return <Button {...props} />;
  }
});

export default LinkOrButton;
