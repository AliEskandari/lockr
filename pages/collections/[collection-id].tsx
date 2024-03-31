import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { Paths } from "@/modules/routes";
import db from "@/modules/db";
import { classNames } from "@/modules/functions/css";
import { openTabWithPrefix } from "@/modules/functions/browser";
import { PopulatedCollection } from "@/types";

namespace CollectionReducer {
  export type State = {
    collection: PopulatedCollection | null;
  };

  export type Action = {
    type: "collection-loaded";
    payload: PopulatedCollection;
  };
}

function reducer(
  state: CollectionReducer.State,
  action: CollectionReducer.Action
) {
  switch (action.type) {
    case "collection-loaded":
      return { ...state, collection: action.payload };

    default:
      return state;
  }
}

const initialState: CollectionReducer.State = {
  collection: null,
};

export default function Collection() {
  const router = useRouter();
  const { isReady } = router;
  const { "collection-id": id } = router.query;

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  });

  useEffect(() => {
    (async function () {
      if (!isReady) return; // pre-render phase
      const collection = await db.Collection.findById(id as string);

      if (!collection) {
        router.push(Paths.NotFound);
      } else {
        const populatedCollection = await db.Collection.populate(collection);
        dispatch({
          type: "collection-loaded",
          payload: populatedCollection,
        });
      }
    })();
  }, [isReady]);

  useEffect(() => {
    // if (isReady) db.Collection.incrementViews({ id });
  }, [isReady]);

  if (!state.collection) {
    // not loaded yet
    return null;
  }

  const { collectionSocialUnlocks, title, status } = state.collection;

  if (status == "deleted") {
    return (
      <>
        <Head>
          <title>{title}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="my-14 rounded-xl p-6 text-center mx-auto max-w-md flex justify-center flex-col">
          <h1 className="text-2xl font-semibold">
            This collection has be removed
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="my-4 rounded-xl p-6 mx-auto text-center max-w-2xl flex justify-center flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-1">{title}</h1>
        </div>

        {/* Collection Social Unlocks */}
        <ul
          role="list"
          className={classNames(
            "grid gap-6 grid-cols-1",
            Object.keys(collectionSocialUnlocks).length > 1
              ? "sm:grid-cols-2"
              : null
          )}
        >
          {Object.values(collectionSocialUnlocks).map(
            (collectionSocialUnlock) => (
              <li
                key={collectionSocialUnlock.id}
                className="col-span-1 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 min-w-fit"
              >
                <button
                  onClick={() =>
                    openTabWithPrefix(
                      Paths.SocialUnlock.replace(
                        ":id",
                        collectionSocialUnlock.socialUnlock.id
                      )
                    )
                  }
                  className="text-xl font-semibold p-8"
                >
                  {collectionSocialUnlock.title}
                </button>
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
}
