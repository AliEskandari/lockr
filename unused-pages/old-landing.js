import {
  ChartBarIcon,
  CodeBracketIcon,
  CubeIcon,
  EnvelopeIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import SocialUnlock from "../components/social-unlock/social-unlock";
import { TYPES } from "../lib/constants/actions";
import Modals from "@/modules/constants/Modals";
import { Paths } from "@/modules/routes";
import ModalsContext from "@/contexts/modals.context";
import Layout from "./_layout";

const FEATURES = [
  {
    heading: "Grow your followers",
    subheading: "SOCIAL UNLOCKS",
    description:
      "Turn your audience into followers by letting them perform social actions before unlocking your content.",
    content: (
      <div>
        <SocialUnlock
          socialUnlock={{
            title: "Download my pack",
            actions: {
              ids: [0, 1],
              entities: {
                0: {
                  id: 0,
                  type: TYPES.YOUTUBE.SUBSCRIBE_TO_CHANNEL,
                  url: Paths.Youtube,
                  directConnect: true,
                },
                1: {
                  id: 1,
                  type: TYPES.TWITTER.FOLLOW_USER,
                  url: Paths.Twitter,
                },
              },
            },
            destinationURL: "",
          }}
        />
      </div>
    ),
  },
  {
    heading: "Customize layout",
    subheading: "FEATURE",
    description:
      "Fully customize your social unlocks to fit your branding by choosing out themes, colors, and animated backgrounds.",
    content: (
      <div className="p-14 rounded-xl">
        <SwatchIcon className="w-32 h-32" />
      </div>
    ),
  },
  {
    heading: "Capture emails",
    subheading: "FEATURE",
    description:
      "Seamlessly collect and manage emails from your audience. Create seperate email lists to keep everything organized.",
    content: (
      <div className="p-14 rounded-xl">
        <EnvelopeIcon className="w-32 h-32" />
      </div>
    ),
  },
  {
    heading: "Integrate widgets",
    subheading: "FEATURE",
    description:
      "Add your video, stream or social widgets to give more context to your content.",
    content: (
      <div className="p-14 rounded-xl">
        <CubeIcon className="w-32 h-32" />
      </div>
    ),
  },
  {
    heading: "Analytics",
    subheading: "FEATURE",
    description:
      "Track the amount of clicks and views your social unlocks receive on a daily basis. Pinpoint exactly when and which content is going viral.",
    content: (
      <div className="p-14 rounded-xl">
        <ChartBarIcon className="w-32 h-32" />
      </div>
    ),
  },
  {
    heading: "Embed on your site",
    subheading: "FEATURE",
    description:
      "Use the embed feature to easily place the social unlock including all of its features on your own domain.",
    content: (
      <div className="p-14 rounded-xl">
        <CodeBracketIcon className="w-32 h-32" />
      </div>
    ),
  },
];

export default function Home() {
  const modals = useContext(ModalsContext);
  return (
    <>
      <Head>
        <title>Create Free Social Unlocks - Lockr</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex-grow px-4 md:px-10">
        <div className="pt-10 pb-24 md:pb-56 my-5 md:text-center">
          <h1 className="font-bold text-5xl md:text-7xl mb-4 break-words">
            Get the recognition you deserve
          </h1>
          <p className="text-3xl mb-10 font-extralight">
            Let your audience perform actions before unlocking your content
          </p>
          <Link
            href={Paths.CreateFreeLock}
            className="rounded-xl px-8 py-4 text-white bg-red-500 hover:bg-red-600 active:bg-red-700 transition-colors"
          >
            Create free lock
          </Link>
        </div>
        {FEATURES.map((feature) => (
          <div key={feature.heading} className="flex py-14 md:py-28 space-x-10">
            <div className="w-full md:w-7/12 flex flex-col justify-center">
              <h3 className="text-lg text-red-500">{feature.subheading}</h3>
              <h1 className="text-3xl md:text-5xl font-semibold mb-4">
                {feature.heading}
              </h1>
              <p className="text-2xl font-extralight">{feature.description}</p>
            </div>
            <div className="hidden md:w-5/12 md:flex justify-center items-center">
              {feature.content}
            </div>
          </div>
        ))}

        <div className="flex py-28 flex-col items-center text-center">
          <h1 className="block text-5xl font-semibold mb-6">
            Ready to grow your audience?
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => modals.show(Modals.AUTH.SIGN_UP)}
              className="px-5 py-3 rounded-xl text-sm bg-red-500 text-white"
            >
              Get started for free
            </button>
            <Link
              href={Paths.Pricing}
              className="px-5 py-3 rounded-xl text-sm bg-gray-100 dark:bg-gray-800"
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

Home.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>;
};
