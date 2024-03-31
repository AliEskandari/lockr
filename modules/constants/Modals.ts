const Modals = {
  AUTH: { SIGN_UP: "/sign-up", SIGN_IN: "/sign-in" },
  DASHBOARD: {
    SOCIAL_UNLOCKS: {
      OVERVIEW: {
        EDIT: "/dashboard/social-unlocks/overview/edit",
        SHARE: "/dashboard/social-unlocks/overview/share",
        QR_CODE: "/dashboard/social-unlocks/overview/qr-code",
        DELETE: "/dashboard/social-unlocks/overview/delete",
      },
    },
    COLLECTIONS: {
      OVERVIEW: {
        DELETE: "/dashboard/collections/overview/delete",
        SHARE: "/dashboard/collections/overview/share",
        EDIT: "/dashboard/collections/overview/edit",
      },
    },
    UNLOCKED: {
      OVERVIEW: {
        DELETE: "/dashboard/social-pages/overview/delete",
        DELETE_LINK: "/dashboard/social-pages/overview/delete-link",
        CREATE: "/dashboard/social-pages/overview/create",
      },
    },
    ACCOUNTS: {
      SHOW: "/dashboard/accounts/show",
    },
  },
  SOCIAL_UNLOCK: {
    SHARE: "/social-unlock/share",
  },
} as const;

export default Modals;
