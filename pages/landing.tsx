import { Paths } from "@/modules/routes";
import { useScroll } from "framer-motion";
import Head from "next/head";
import { useRef, useEffect } from "react";
import AnimatedHero from "@/components/animations/animated-hero";
import SocialUnlock from "@/components/social-unlock/social-unlock";
import constants from "@/modules/constants";

export default function Landing() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const { scrollY } = useScroll({ container: scrollContainerRef });

  useEffect(() => {
    console.log(scrollY.get());
  }, [scrollY]);

  /**
   * Set scroll container to <html> element to be used by framer when
   * doing drag to reorder.
   */
  useEffect(() => {
    scrollContainerRef.current = document.getElementById("html");
  }, []);

  return (
    <>
      <Head>
        <title>Create Free Social Unlocks - Lockr</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Let your audience take action before unlocking your content. Choose actions from popular websites like YouTube, Twitter and Instagram!"
        ></meta>
      </Head>
      <main className="flex flex-col gap-y-20 py-14 px-4 h-[400vh] ">
        <AnimatedHero className="pt-10 my-5" />

        <section
          ref={sectionRef}
          className="py-20 h-screen flex items-center flex-wrap"
        >
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-normal">
              {scrollY.get() < 0.5 ? (
                <>
                  This is a <span className="font-bold">social unlock</span>
                </>
              ) : (
                "Hello"
              )}
            </h1>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <SocialUnlock
              socialUnlock={{
                id: "",
                user: null,
                title: "Fortnite clip pack",
                actions: {
                  ids: [0, 1],
                  entities: {
                    0: {
                      id: 0,
                      type: constants.Action.Type.Youtube.SubscribeToChannel,
                      url: Paths.Youtube,
                      directConnect: true,
                    },
                    1: {
                      id: 1,
                      type: constants.Action.Type.Twitter.FollowUser,
                      url: Paths.Twitter,
                    },
                  },
                },
                destinationURL: "",
                isValid: true,
                unlocks: 0,
                views: 0,
                status: "ACTIVE",
                errors: null,
                createdAt: null,
                deletedAt: null,
              }}
            />
          </div>
        </section>
      </main>
    </>
  );
}
