import EmptyCollections from "@/components/empty-states/empty-collections";
import AuthUserContext from "@/contexts/auth-user";
import ModalsContext, {
  ModalsContextProvider,
  ModalContextType,
} from "@/contexts/modals.context";
import Modals from "@/modules/constants/Modals";
import db from "@/modules/db";
import { openTabWithPrefix } from "@/modules/functions/browser";
import { Paths } from "@/modules/routes";
import { Collection } from "@/types";
import {
  ArrowTopRightOnSquareIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Unsubscribe } from "firebase/firestore";
import {
  ComponentType,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import DashboardLayout from "../_layout";
import Layout from "./_layout";

type CollectionActionItem = {
  title: string;
  onClick: (args: { collection: Collection; modals: ModalContextType }) => void;
  Icon: ComponentType<any>;
};

const collectionActionItems: CollectionActionItem[] = [
  {
    title: "Open collection in new tab",
    onClick: ({ collection }) =>
      openTabWithPrefix(Paths.Collections.Show.replace(":id", collection.id)),
    Icon: ArrowTopRightOnSquareIcon,
  },
  {
    title: "Edit collection",
    onClick: async ({ collection, modals }) => {
      await db.Collection.populate(collection);
      modals.show(Modals.DASHBOARD.COLLECTIONS.OVERVIEW.EDIT, { collection });
    },
    Icon: PencilIcon,
  },
  {
    title: "Delete collection",
    onClick: ({ collection, modals }) =>
      modals.show(Modals.DASHBOARD.COLLECTIONS.OVERVIEW.DELETE, { collection }),
    Icon: TrashIcon,
  },
  {
    title: "Share collection",
    onClick: ({ collection, modals }) =>
      modals.show(Modals.DASHBOARD.COLLECTIONS.OVERVIEW.SHARE, { collection }),
    Icon: ShareIcon,
  },
];

export default function Overview() {
  const modals = useContext(ModalsContext);
  const [collections, setCollections] = useState<Collection[]>([]);
  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    (async () => {
      if (!authUser) return;
      unsubscribe = db.Collection.find(
        { "user.id": authUser.uid, status: "active" },
        (collections) => {
          setCollections(collections);
        }
      );
    })();

    return () => unsubscribe();
  }, []);

  if (!collections) {
    // not loaded yet
    return null;
  }

  if (collections.length == 0) return <EmptyCollections />;

  return (
    <ModalsContextProvider>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 @sm:grid-cols-2 @lg:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5"
      >
        {Object.values(collections).map((collection) => (
          <li
            key={collection.id}
            className="col-span-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-4 flex flex-col justify-between min-w-fit"
          >
            <div>
              <h1 className="text-xl font-semibold">{collection.title}</h1>
              <p className="mb-4">
                {collection.views} views •{" "}
                {Object.keys(collection.collectionSocialUnlocks).length} locks
              </p>
            </div>

            <div className="flex space-x-1 justify-start">
              {collectionActionItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => item.onClick({ collection, modals })}
                  className="p-1 active:bg-gray-300 dark:active:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl "
                >
                  <item.Icon className="w-6 h-6" />
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </ModalsContextProvider>
  );
}

Overview.getLayout = function getLayout(page: ReactNode) {
  return (
    <DashboardLayout>
      <Layout>{page}</Layout>
    </DashboardLayout>
  );
};
