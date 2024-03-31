import React, { ChangeEvent, MouseEvent } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { classNames as merge } from "@/modules/functions/css";
import { ActionError } from "@/types";
import Heading from "../headings/heading";

type InputProps = {
  onClear?: (event?: React.SyntheticEvent<HTMLButtonElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  className?: string;
  errors?: ActionError[];
  type?: string;
};

export default function Input({
  onClear = () => {},
  onChange = () => {},
  value,
  placeholder,
  className,
  errors = [],
  type = "text",
}: InputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { currentTarget } = event;
    currentTarget.dataset.displayClear =
      currentTarget.value.length > 0 ? "true" : "false";
    onChange(event);
  };

  const handleClickClear = (event: MouseEvent<HTMLButtonElement>) => {
    const { currentTarget } = event;
    (currentTarget.previousElementSibling as HTMLElement).dataset.displayClear =
      "false";
    onClear();
  };

  return (
    <div className="flex flex-col">
      <div
        className={merge(
          "relative flex pl-3 font-semibold caret-red-500 transition-all appearance-none",
          className,
          errors.length > 0
            ? "ring-red-400 ring-2 ring-inset placeholder-red-400 text-red-400"
            : null
        )}
      >
        {type == "url" ? (
          <input
            className={merge(
              "flex select-none pl-1 w-[4.5rem] items-center text-gray-400 bg-transparent"
            )}
            value="https://"
            disabled
          />
        ) : null}
        <input
          onChange={handleChange}
          value={value}
          type={type}
          placeholder={placeholder}
          className={merge(
            "w-full py-3 pl-1 pr-10 peer outline-none bg-transparent"
          )}
        />
        <button
          className="flex rounded-xl absolute inset-y-0 right-0 items-center pr-3 opacity-0 peer-data-[display-clear=true]:peer-focus:opacity-100 active:opacity-100 transition-all duration-75"
          onClick={handleClickClear}
        >
          <XCircleIcon className="h-5 w-5 text-gray-400 " aria-hidden="true" />
        </button>
      </div>
      {errors.map((error) => {
        if (!error.message) return;
        return (
          <p className="p-4 pb-0 transition-opacity font-bold text-red-400 text-sm">
            {error.message}
          </p>
        );
      })}
    </div>
  );
}
