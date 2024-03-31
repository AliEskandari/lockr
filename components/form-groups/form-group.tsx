import React from "react";
import { classNames } from "@/modules/functions/css";

type FormGroupProps = {
  children: React.ReactNode;
  className?: string;
};

export default function FormGroup({ children, className }: FormGroupProps) {
  return (
    <div
      className={classNames(
        "divide-y divide-gray-200 dark:divide-gray-700",
        className
      )}
    >
      {children}
    </div>
  );
}
