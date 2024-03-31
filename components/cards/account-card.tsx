import ModalsContext from "@/contexts/modals.context";
import UserContext from "@/contexts/user";
import Modals from "@/modules/constants/Modals";
import { classNames } from "@/modules/functions/css";
import { AccountType } from "@/pages/dashboard/accounts";
import { useContext } from "react";

type AccountCardProps = {
  accountType: AccountType;
};

export default function AccountCard({ accountType }: AccountCardProps) {
  const modals = useContext(ModalsContext);
  const user = useContext(UserContext);
  const account = user?.accounts?.[accountType.key];
  const handleClickAccountCard = account
    ? () =>
        modals.show(Modals.DASHBOARD.ACCOUNTS.SHOW, {
          account,
          accountType,
          onRevoke: () => accountType.onRevoke(user),
        })
    : () => accountType.onClick(user!);

  return (
    <li
      onClick={handleClickAccountCard}
      key={accountType.key}
      className={classNames(
        "col-span-1 group cursor-pointer rounded-xl px-4 pt-4 flex flex-col min-w-fit text-center gap-y-1 items-center aspect-square justify-center transition-colors",
        account == undefined
          ? classNames(accountType.color, "text-white")
          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600"
      )}
    >
      <div className="inline-flex w-1/2 sm:p-1 aspect-square">
        <accountType.Icon className="w-full h-full" />
      </div>

      {account ? (
        <div className="flex items-center gap-x-1">
          <h1 className="text-md">{accountType.name}</h1>
        </div>
      ) : (
        <h1 className="text-md">{accountType.name}</h1>
      )}
    </li>
  );
}
