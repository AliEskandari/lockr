import React, { MouseEvent } from "react";
import { classNames } from "@/modules/functions/css";

export default function PaginationNumberButton({ table, pageNum }) {
  const current = pageNum == table?.getState().pagination.pageIndex + 1;
  return (
    <button
      onClick={({ currentTarget }: MouseEvent<HTMLButtonElement>) =>
        table.setPageIndex(Number(currentTarget.value) - 1)
      }
      aria-current="page"
      value={pageNum}
      className={
        current
          ? "relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20 bg-indigo-50 border-indigo-500 text-indigo-600 "
          : "relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20 bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
      }
    >
      {pageNum}
    </button>
  );
}
