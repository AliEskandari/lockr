import Toggle from "@/components/toggles/toggle";
import AuthUserContext from "@/contexts/auth-user";
import SettingsContext from "@/contexts/settings";
import UserContext from "@/contexts/user";
import { isPro } from "@/modules/functions/user";
import { Paths } from "@/modules/routes";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { format, fromUnixTime } from "date-fns";
import Link from "next/link";
import { ChangeEvent, ReactNode, useContext } from "react";
import Layout from "./_layout";

export default function Settings() {
  const authUser = useContext(AuthUserContext);
  const user = useContext(UserContext);
  const { settings, setSetting } = useContext(SettingsContext);

  if (!authUser || !user) return null;

  return (
    <div id="settings" className="flex flex-col flex-1">
      <div className="flex flex-col gap-y-6 max-w-md">
        <div>
          <h1 className="text-gray-400 tracking-wide text-sm px-4 mb-1">
            Settings
          </h1>
          <div className="flex flex-col rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3">
            {authUser.email}
          </div>
        </div>
        <div>
          <div className="flex flex-col rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-1 divide-y dark:divide-gray-700">
            <div className="flex items-center justify-between py-3">
              <span>Dark</span>
              <Toggle
                checked={settings.darkMode}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSetting("darkMode", event.target.checked)
                }
              />
            </div>
            <div className="flex items-center justify-between py-3">
              <span>Follow System Theme</span>
              <Toggle
                checked={settings.useSystemDefault}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSetting("useSystemDefault", event.target.checked)
                }
              />
            </div>
          </div>
        </div>
        {isPro(user) ? (
          <>
            <div>
              <h1 className="text-gray-400 tracking-wide text-sm px-4 mb-1">
                Invoices
              </h1>
              <div className="flex flex-col rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-1 divide-y dark:divide-gray-700">
                {Object.values(user.stripe.invoices)?.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={invoice.hosted_invoice_url}
                    className="flex items-center justify-between py-3"
                  >
                    <label className="flex gap-x-1 items-center">
                      {format(fromUnixTime(invoice.created), "MM/dd/yyy")}
                      <span className="text-gray-400 text-sm">
                        ({invoice.status})
                      </span>
                    </label>
                    <ChevronRightIcon className="text-gray-500 h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h1 className="text-gray-400 tracking-wide text-sm px-4 mb-1">
                Subscription
              </h1>
              <div className="flex flex-col rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-1 divide-y dark:divide-gray-700">
                <Link
                  href={Paths.Stripe.CustomerPortal({
                    prefilled_email: user.email,
                  })}
                  className="flex text-start py-3 w-full justify-between items-center"
                >
                  Update Billing Information
                  <ChevronRightIcon className="text-gray-500 h-5 w-5" />
                </Link>
                <Link
                  href={Paths.Stripe.CustomerPortal({
                    prefilled_email: user.email,
                  })}
                  className="text-red-500 text-start py-3"
                >
                  Cancel Subscription
                </Link>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

Settings.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>;
};
