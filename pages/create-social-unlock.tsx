import Form, { FormProps } from "@/components/forms/social-unlocks/form";
import SocialUnlockComponent from "@/components/social-unlock/social-unlock";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { SocialUnlock } from "@/types";

export default function CreateFreeLock() {
  const [formSocialUnlock, setFormSocialUnlock] = useState<SocialUnlock | null>(
    null
  );
  const scrollContainerRef = useRef<HTMLElement | null>(null);

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
          content="Let your audience take action before unlocking your content. Choose actions from popular websites like YouTube, Twitter and Instagram!"
        ></meta>
      </Head>
      <main className="flex flex-col gap-y-20 py-14 px-4">
        <section className="text-start md:text-center flex flex-col gap-y-7">
          <h1 className="text-5xl font-black">
            Lock your content behind social actions
          </h1>
          <h3 className="text-3xl">Try it for free!</h3>
        </section>

        <section className="w-full mx-auto flex md:flex-nowrap gap-x-6">
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
