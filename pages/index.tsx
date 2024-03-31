import Form, { FormProps } from "@/components/forms/social-unlocks/form";
import SocialUnlockComponent from "@/components/social-unlock/social-unlock";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { SocialUnlock } from "@/types";
import { useInView } from "framer-motion";
import { classNames } from "@/modules/functions/css";

export default function CreateFreeLock() {
  const [formSocialUnlock, setFormSocialUnlock] = useState<SocialUnlock | null>(
    null
  );
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const componentRef = useRef<HTMLElement | null>(null);
  // Use object destructuring, so you don't need to remember the exact order
  const isInView = useInView(componentRef);

  /**
   * Called whenever form validation is ran. Validation runs anytime
   * an input changes. So this runs very often.
   *
   * We use this to store an up-to-date version of the lock in a state
   * var `formSocialUnlock`. Then, when the create button is clicked, we use
   * the `formSocialUnlock` to create the lock.
   */
  const handleChange: FormProps["onChange"] = (socialUnlock) => {
    setFormSocialUnlock(socialUnlock);
  };

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
          content="Let your audience take action before unlocking your content. Choose actions from popular websites like YouTube, Twitter and Instagram!!"
        ></meta>
      </Head>
      <main ref={componentRef} className={"flex flex-col gap-y-20 py-14 px-4"}>
        <section
          style={{
            transform: isInView ? "none" : "translateY(50px)",
            opacity: isInView ? 1 : 0,
            transitionDuration: "0.75s",
            transitionDelay: "0.5s",
            transitionTimingFunction: "ease-in-out",
            transitionProperty: "transform, opacity",
          }}
          className="text-start md:text-center flex flex-col gap-y-7"
        >
          <h1 className="text-5xl font-black">
            Sell your content for likes & follows
          </h1>
          <h3 className="text-3xl">Try it for free!</h3>
        </section>

        <section
          style={{
            opacity: isInView ? 1 : 0,
            transition: "opacity 0.9s ease-in-out 1.25s",
          }}
          className="w-full mx-auto flex md:flex-nowrap gap-x-6"
        >
          <div className="w-full flex justify-center md:justify-end">
            <Form
              onChange={handleChange}
              scrollContainerRef={scrollContainerRef}
              className="max-w-md flex-1"
            />
          </div>
          <div className="hidden md:flex w-full justify-center md:justify-start items-center">
            <SocialUnlockComponent socialUnlock={formSocialUnlock} />
          </div>
        </section>
      </main>
    </>
  );
}
