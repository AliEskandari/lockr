const VIEWS = (userId: string) => {
  return {
    dimensions: [{ name: "date" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: "eventName",
              stringFilter: {
                value: "social_unlock_view",
              },
            },
          },
          {
            filter: {
              fieldName: "customEvent:social_unlock_user_id",
              stringFilter: {
                value: userId,
              },
            },
          },
        ],
      },
    },
    orderBys: [
      {
        dimension: {
          dimensionName: "date",
        },
      },
    ],
  };
};

const UNLOCKS = (userId: string) => {
  return {
    dimensions: [{ name: "date" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: "eventName",
              stringFilter: {
                value: "social_unlock_unlock",
              },
            },
          },
          {
            filter: {
              fieldName: "customEvent:social_unlock_user_id",
              stringFilter: {
                value: userId,
              },
            },
          },
        ],
      },
    },
    orderBys: [
      {
        dimension: {
          dimensionName: "date",
        },
      },
    ],
  };
};

const LAST_7_DAYS = {
  dateRanges: [
    {
      startDate: "7daysAgo",
      endDate: "today",
    },
  ],
};

const LAST_30_DAYS = {
  dateRanges: [
    {
      startDate: "30daysAgo",
      endDate: "today",
    },
  ],
};

const LAST_90_DAYS = {
  dateRanges: [
    {
      startDate: "90daysAgo",
      endDate: "today",
    },
  ],
};

const ALL_TIME = {
  dateRanges: [
    {
      startDate: "2022-12-01",
      endDate: "today",
    },
  ],
};

export const VIEWS_LAST_7_DAYS = (userId: string) => {
  return {
    ...VIEWS(userId),
    ...LAST_7_DAYS,
  };
};
export const UNLOCKS_LAST_7_DAYS = (userId: string) => {
  return {
    ...UNLOCKS(userId),
    ...LAST_7_DAYS,
  };
};
export const VIEWS_LAST_30_DAYS = (userId: string) => {
  return {
    ...VIEWS(userId),
    ...LAST_30_DAYS,
  };
};
export const UNLOCKS_LAST_30_DAYS = (userId: string) => {
  return {
    ...UNLOCKS(userId),
    ...LAST_30_DAYS,
  };
};
export const UNLOCKS_LAST_90_DAYS = (userId: string) => {
  return {
    ...UNLOCKS(userId),
    ...LAST_90_DAYS,
  };
};
export const VIEWS_LAST_90_DAYS = (userId: string) => {
  return {
    ...VIEWS(userId),
    ...LAST_90_DAYS,
  };
};
export const UNLOCKS_ALL_TIME = (userId: string) => {
  return {
    ...UNLOCKS(userId),
    ...ALL_TIME,
  };
};
export const VIEWS_ALL_TIME = (userId: string) => {
  return {
    ...VIEWS(userId),
    ...ALL_TIME,
  };
};
