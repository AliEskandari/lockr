import {
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeBracketIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  LockOpenIcon,
  PencilIcon,
  QrCodeIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useContext } from "react";
import Modals from "@/modules/constants/Modals";
import { Paths } from "@/modules/routes";
import ModalsContext from "@/contexts/modals.context";
import { classNames } from "@/modules/functions/css";
import GenericMenu from "../menus/generic-menu";
import { SocialUnlock } from "@/types";

type SocialUnlockTableProps = {
  data: SocialUnlock[];
};

export default function SocialUnlockTable({ data }: SocialUnlockTableProps) {
  const columnHelper = createColumnHelper<SocialUnlock>();
  const columns = [
    columnHelper.accessor("title", {
      id: "title",
      header: () => "Title",
    }),
    columnHelper.accessor("unlocks", {
      id: "unlocks",
      header: () => <LockOpenIcon className="h-5 w-5 stroke-2" />,
    }),
    columnHelper.accessor("views", {
      id: "views",
      header: () => <EyeIcon className="h-5 w-5 stroke-2" />,
    }),
    columnHelper.display({
      id: "action-menu",
      cell: (props) => <ActionMenuDropdown row={props.row} />,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <>
      <div
        id="table-wrapper"
        className="flex flex-col overflow-y-hidden overflow-x-scroll min-w-full flex-1"
      >
        <table className="divide-y divide-gray-300 dark:divide-gray-700">
          {/* Table Headers */}
          <thead className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      scope="col"
                      className={classNames(
                        header.index == 0
                          ? "pl-4 pr-3 sm:pl-6 min-w-[200px] max-w-md" // 1st col header
                          : "px-3", // rest of col headers
                        header.id == "action-menu"
                          ? "sticky right-0" // action menu col header
                          : null,
                        "text-left text-gray-500 font-semibold py-2" // all col headers
                      )}
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          {/* Table Rows */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className="group/row hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className={classNames(
                          cell.column.id == "title"
                            ? "font-semibold pl-4 pr-3 sm:pl-6" // 1st col
                            : "px-3", // rest of cols
                          cell.column.id == "action-menu"
                            ? "sticky right-0 bg-white dark:bg-gray-900 group-hover/row:bg-gray-50 dark:group-hover/row:bg-gray-800 focus-within:z-10" // action menu col
                            : null,
                          "whitespace-nowrap py-3" // all cols
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="justify-between whitespace-nowrap overflow-x-auto border-t border-gray-200 dark:border-gray-800 flex items-center w-full px-4 py-3 sm:px-6">
        {/* Row stats */}
        <div>
          <p className="text-sm text-gray-500">
            <span className="font-medium">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
            </span>
            to{" "}
            <span className="font-medium">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                table.getRowModel().rows.length}
            </span>{" "}
            of <span className="font-medium">{data.length}</span>
          </p>
        </div>
        {/* Pagination Buttons */}
        <div>
          <nav
            className="isolate inline-flex space-x-3"
            aria-label="Pagination"
          >
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center rounded-xl px-2 py-2 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 focus:z-20 disabled:text-gray-500"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" /> Prev
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="relative inline-flex items-center rounded-xl px-2 py-2 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 focus:z-20 disabled:text-gray-500"
            >
              <span className="sr-only">Next</span>
              Next <ChevronRightIcon
                className="h-5 w-5"
                aria-hidden="true"
              />{" "}
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}

const _Modals = Modals.DASHBOARD.SOCIAL_UNLOCKS.OVERVIEW;

function ActionMenuDropdown({ row }: { row: Row<SocialUnlock> }) {
  const socialUnlock = row.original;
  const router = useRouter();
  const modals = useContext(ModalsContext);
  const actionMenuItems = [
    {
      name: "Open",
      onClick: function () {
        router.push(Paths.SocialUnlock.replace(":id", socialUnlock.id!));
      },
      icon: ArrowTopRightOnSquareIcon,
    },
    {
      name: "Edit",
      onClick: function () {
        modals.show(_Modals.EDIT, { socialUnlock });
      },
      icon: PencilIcon,
    },
    {
      name: "Share",
      onClick: function () {
        modals.show(_Modals.SHARE, { socialUnlock });
      },
      icon: ShareIcon,
    },
    {
      name: "QR code",
      onClick: function () {
        modals.show(_Modals.QR_CODE, { socialUnlock });
      },
      icon: QrCodeIcon,
    },
    {
      name: "Embed",
      onClick: function () {
        modals.show(_Modals.QR_CODE, { socialUnlock });
      },
      icon: CodeBracketIcon,
    },
    {
      name: "Delete",
      onClick: function () {
        modals.show(_Modals.DELETE, { socialUnlock });
      },
      icon: TrashIcon,
    },
  ];
  return (
    <GenericMenu
      menuItems={actionMenuItems}
      placement="left-start"
      classNames={{
        MenuButton: "active:text-gray-700 rounded-full",
        MenuItems:
          "right-1/2 w-40 bg-white dark:bg-gray-900 ring-gray-300 dark:ring-gray-700",
        MenuItem: "w-full",
      }}
    >
      <span className="sr-only">Open action menu</span>
      <EllipsisVerticalIcon className="h-6 w-6" />
    </GenericMenu>
  );
}
