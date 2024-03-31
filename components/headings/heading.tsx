import React from "react";
import { classNames as merge } from "@/modules/functions/css";

type HeadingProps = {
  children?: string;
  className?: string;
  level?: keyof typeof classes;
};

const classes = { 1: "text-3xl font-bold lowercase tracking-tight", 2: "" };

export default function Heading({
  children,
  className,
  level = 1,
}: HeadingProps) {
  return (
    <h1 className={merge("font-extrabold", className, classes[level])}>
      {children}
    </h1>
  );
}
