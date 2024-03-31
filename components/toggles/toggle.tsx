import React, { ChangeEvent } from "react";

type ToggleProps = {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
export default function Toggle({ checked, onChange = () => {} }: ToggleProps) {
  return (
    <label className="inline-flex relative cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-[3.2rem] h-7 appearance-none bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[26px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
  );
}
