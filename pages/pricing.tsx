import ModalsContext, { ModalContextType } from "@/contexts/modals.context";
import UserContext from "@/contexts/user";
import Modals from "@/modules/constants/Modals";
import { classNames as merge } from "@/modules/functions/css";
import { Paths } from "@/modules/routes";
import { User } from "@/types";
import { CheckCircleIcon as CheckCircleIconOutline } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import { ComponentType, ReactNode, useContext } from "react";
import Layout from "./_layout";

type PricingTier = {
  heading: string;
  subheading: string;
  description: string;
  features: string[];
  cta: string;
  classNames: {
    all: string;
    subheading: string;
    button: string;
    check: string;
  };
  icons: {
    check: ComponentType<any> | null;
  };
  badge?: ReactNode;
  onClick: (args: {
    user: User | null | undefined;
    router: NextRouter;
    modals: ModalContextType;
  }) => void;
};

const TIERS: PricingTier[] = [
  {
    heading: "Pro $11.99",
    subheading: "per month",
    description:
      "All the benefits of free PLUS enhanced features to help you grow your social media marketing.",
    features: [
      "Complete access to our tools without limitations",
      "Ad free experience for your audience",
      "Monitor your growth with custom analytics",
      "Seamlessly collect emails from your audience",
      "Keep your content organized with custom tags",
    ],
    cta: "Get started",
    classNames: {
      all: "bg-red-100 dark:bg-red-900 text-black dark:text-white",
      subheading: "text-gray-700 dark:text-gray-300",
      button: "bg-red-500 text-white",
      check: "text-red-500",
    },
    icons: {
      check: CheckCircleIcon,
    },
    badge: (
      <h3 className="absolute -top-2 left-6 px-3 py-1 rounded-xl bg-red-500 text-white uppercase text-xs">
        Recommended
      </h3>
    ),
    onClick: ({ user, router, modals }) =>
      user
        ? router.push(
            Paths.Stripe.Checkout({
              prefilled_email: user.email,
              client_reference_id: user.id,
            })
          )
        : modals.show(Modals.AUTH.SIGN_UP),
  },
  {
    heading: "Free $0",
    subheading: "forever",
    description: "All the basics that help you grow your audience.",
    features: [
      "Basic access to our tools: Social unlocks, Collections, Social pages and Smart links",
      "Customize your pages from a selection of animated backgrounds",
      "Integrate your social widgets",
    ],
    cta: "Sign up",
    classNames: {
      all: "bg-gray-100 dark:bg-gray-800 text-black dark:text-white",
      subheading: "text-gray-500",
      button: "bg-gray-200 dark:bg-gray-700 text-black dark:text-white",
      check: "text-red-500",
    },
    icons: {
      check: CheckCircleIconOutline,
    },
    onClick: ({ modals }) => modals.show(Modals.AUTH.SIGN_UP),
  },
  {
    heading: "Enterprise",
    subheading: "",
    description:
      "Are you a business or agency that's interested in storing more emails or receiving more traffic? Talk to us about our enterprise plans.",
    features: [],
    cta: "Contact us",
    classNames: {
      all: "bg-gray-100 dark:bg-gray-800 text-black dark:text-white",
      subheading: "text-gray-500",
      button: "bg-gray-200 dark:bg-gray-700 text-black dark:text-white",
      check: "text-red-500",
    },
    icons: { check: null },
    onClick: ({ router }) => router.push("mailto:contact@lockr.social"),
  },
];

export default function Pricing() {
  const modals = useContext(ModalsContext);
  const router = useRouter();
  const user = useContext(UserContext);

  return (
    <>
      <Head>
        <title>Pricing - Lockr</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex-grow px-4 md:px-10">
        <div className="pb-6 sm:pt-10 sm:pb-24 my-5 text-start sm:text-center">
          <h1 className="font-bold text-5xl sm:text-7xl mb-4 break-words">
            Choose your plan
          </h1>
          <p className="text-2xl sm:text-3xl mb-6 font-extralight">
            Completely free to get started
          </p>
        </div>
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 ">
          {TIERS.map((tier) => (
            <div
              className={merge(
                "relative flex flex-col w-full md:w-1/3 p-6 rounded-xl",
                tier.classNames.all
              )}
            >
              {tier.badge}
              <h1 className="font-semibold text-3xl pt-2">{tier.heading}</h1>
              <p className={merge("text-xs pb-4", tier.classNames.subheading)}>
                {tier.subheading}
              </p>
              <p className="text-sm mb-4">{tier.description}</p>
              <div id="features" className="mb-20">
                {tier.features.map((feature) => (
                  <div className="py-4 flex">
                    <div className={merge("w-1/6", tier.classNames.check)}>
                      {tier.icons.check ? (
                        <tier.icons.check className="w-6 h-6" />
                      ) : null}
                    </div>
                    <div className="flex-1">{feature}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => tier.onClick({ modals, user, router })}
                className={merge(
                  "mt-auto w-full py-3 rounded-xl",
                  tier.classNames.button
                )}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
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
          </div>
        </div>
      </div>
    </>
  );
}

Pricing.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>;
};
