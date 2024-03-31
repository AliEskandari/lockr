import { encode } from "../functions/urls";
import { isProd } from "../functions/env";

export const Paths = {
  Home: "/",
  Pricing: "/pricing",
  About: "/about",
  Contact: "/contact",
  Terms: "/terms",
  Privacy: "/privacy",
  Cookies: "/cookies",
  NotFound: "/not-found",
  SocialUnlock: "/:id",
  CreateFreeLock: "/create-free-lock",
  Collections: { Show: "/collections/:id" },
  Twitter: "https://twitter.com/lockr_social",
  Youtube: "https://www.youtube.com/@lockr_social",
  Mail: "mailto:contact@lockr.social",
  Stripe: {
    Checkout: ({
      prefilled_email,
      client_reference_id,
    }: {
      prefilled_email: string;
      client_reference_id: string;
    }) => {
      let href = isProd()
        ? "https://buy.stripe.com/7sIeUV1jL2oO9LG9AA"
        : "https://buy.stripe.com/test_bIYfZl4qDarE8Io6oo";
      return href + "?" + encode({ prefilled_email, client_reference_id });
    },

    CustomerPortal: ({ prefilled_email }: { prefilled_email: string }) => {
      let href = isProd()
        ? "https://billing.stripe.com/p/login/6oE3fdad890t4HC8ww"
        : "https://billing.stripe.com/p/login/test_4gw28E0xA7N6bok5kk";
      return href + "?" + encode({ prefilled_email });
    },
  },

  Dashboard: {
    SocialUnlocks: {
      Overview: "/dashboard/social-unlocks/overview",
      Create: "/dashboard/social-unlocks/create",
      Analytics: "/dashboard/social-unlocks/analytics",
    },
    Collections: {
      Overview: "/dashboard/collections/overview",
      Create: "/dashboard/collections/create",
    },
    Unlocked: "/dashboard/unlocked",
    Accounts: "/dashboard/accounts",
    Settings: "/dashboard/settings",
  },
  StayRoutes: ["/[social-unlock-id]", "/collections/[collection-id]"],
} as const;

export const API = {
  Paths: {
    Auth: {
      Google: (query: object) => `/auth/google?${encode(query)}`,
      Twitter: (query: object) => `/auth/twitter?${encode(query)}`,
      Instagram: `/auth/instagram`,
    },
  },
} as const;
