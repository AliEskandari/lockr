import { Paths } from "@/modules/routes";
import type { SocialUnlock } from "@/types";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Recommendations from "@/components/recommendations/recommendations";
import SocialUnlockComponent from "@/components/social-unlock/social-unlock";
import AuthUserContext from "@/contexts/auth-user";
import analytics from "@/modules/analytics";
import db from "@/modules/db";
import { trpc } from "@/modules/trpc/trpc";
import { deleteCookie, getCookie } from "cookies-next";
import { GetServerSideProps } from "next";

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
  req,
  res,
}) => {
  try {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
    );
    const { "social-unlock-id": id } = params as { "social-unlock-id": string };
    let socialUnlock = await db.SocialUnlock.findById(id as string);

    // // Redirect if not found...
    if (!socialUnlock)
      return { redirect: { permanent: false, destination: Paths.NotFound } };

    const lockStateId = getCookie("lockStateId", { req, res });

    // // Pre-fill lock state (used when returning from connecting account)
    if (typeof lockStateId === "string") {
      const lockState = (await db.LockState.findById(lockStateId)) || {};
      delete lockState.id; // don't override lock id
      socialUnlock = { ...socialUnlock, ...lockState };
      deleteCookie("lockStateId", { req, res });
    }
    return { props: { socialUnlock } };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
};

type Props = {
  socialUnlock: SocialUnlock;
};

export default function ShowSocialUnlock({ socialUnlock }: Props) {
  const router = useRouter();
  const { isReady } = router;
  const authUser = useContext(AuthUserContext);
  const incrementViews = trpc.socialUnlock.incrementViews.useMutation();

  useEffect(() => {
    if (!isReady) return; // pre-render phase
    incrementViews.mutateAsync({ id: socialUnlock.id });
    analytics.logEvent({
      name: "social_unlock_view",
      social_unlock_id: socialUnlock.id,
      social_unlock_user_id: socialUnlock.user?.id || null,
    });
    if (!socialUnlock) {
      router.push(Paths.NotFound);
    }
  }, [isReady]);

  if (authUser === undefined) return null;

  return (
    <>
      <Head>
        <title>{socialUnlock?.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col">
        <div className="mx-auto px-2 md:mt-10 max-w-sm w-full flex flex-col min-h-full">
          {/* {!isPro(socialUnlock.user) ? <Ad /> : null} */}
          <div className="h-[50vh] lg:h-auto py-6">
            <SocialUnlockComponent
              key={socialUnlock.id}
              socialUnlock={socialUnlock}
            />
          </div>
        </div>

        <div className="mx-auto px-4 md:mt-20 max-w-md w-full gap-y-4 flex flex-col">
          <h1 className="text-xl text-gray-500 font-bold">related</h1>
          <div className="flex overflow-auto gap-x-2 rounded-xl">
            <Recommendations socialUnlock={socialUnlock} />
          </div>
        </div>
      </div>
    </>
  );
}
