import UserContext from "@/contexts/user";
import {
  UNLOCKS_ALL_TIME,
  UNLOCKS_LAST_30_DAYS,
  UNLOCKS_LAST_7_DAYS,
  UNLOCKS_LAST_90_DAYS,
  VIEWS_ALL_TIME,
  VIEWS_LAST_30_DAYS,
  VIEWS_LAST_7_DAYS,
  VIEWS_LAST_90_DAYS,
} from "@/modules/analytics/report-types";
import { classNames } from "@/modules/functions/css";
import tw from "@/modules/tailwind";
import { trpc } from "@/modules/trpc/trpc";
import { ValuesToUnionType } from "@/types/ValuesToUnionType";
import { google } from "@google-analytics/data/build/protos/protos";
import {
  ArrowTrendingUpIcon,
  EyeIcon,
  LockOpenIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import {
  eachDayOfInterval,
  endOfDay,
  format,
  isBefore,
  parse,
  startOfToday,
  subDays,
} from "date-fns";
import { zipObject } from "lodash";
import set from "lodash/set";
import Head from "next/head";
import {
  Dispatch as ReactDispatch,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";
import ApexLineChart from "@/components/charts/apex-line-chart";
import GenericSelect from "@/components/selects/generic-select";
import DashboardLayout from "../_layout";
import Layout from "./_layout";
import debug from "@/modules/frontend/debug";

const TIME_RANGE = {
  LAST_7_DAYS: "LAST_7_DAYS",
  LAST_30_DAYS: "LAST_30_DAYS",
  LAST_90_DAYS: "LAST_90_DAYS",
  ALL_TIME: "ALL_TIME",
} as const;

type TimeRange = ValuesToUnionType<typeof TIME_RANGE>;
type DateCount = { x: string; y: number };
type ReportData = Record<"VIEWS" | "UNLOCKS", DateCount[]>;
type Report = {
  [key in TimeRange]: ReportData;
}[TimeRange];

namespace AnalyticsReducer {
  export type Props = {};

  export type State = {
    viewsData: Array<DateCount>;
    unlocksData: Array<DateCount>;
    timeRange: TimeRange;
    reports: Record<TimeRange, Report>;
    loaded: boolean;
  };

  export type Action =
    | {
        type: "add-report";
        payload: {
          path: string;
          dateCounts: DateCount[];
        };
      }
    | {
        type: "set-time-range";
        payload: TimeRange;
      }
    | {
        type: "reports-loaded";
      };

  export type Dispatch = ReactDispatch<Action>;
}

const TIME_RANGE_BUTTONS = {
  LAST_7_DAYS: { key: TIME_RANGE.LAST_7_DAYS, name: "7 days" },
  LAST_30_DAYS: { key: TIME_RANGE.LAST_30_DAYS, name: "30 days" },
  LAST_90_DAYS: { key: TIME_RANGE.LAST_90_DAYS, name: "3 months" },
  ALL_TIME: { key: TIME_RANGE.ALL_TIME, name: "all time" },
};

const VIEW_TYPE_BUTTONS = [
  { name: "Chart view", icon: ArrowTrendingUpIcon, active: true },
  { name: "Table view", icon: TableCellsIcon, active: false },
];

/**
 * Converts report object to chart data.
 * @param {Object} report Google analytics report object
 * @returns {Array<Object>} series data
 */
const reportToData = (
  report: google.analytics.data.v1beta.IRunReportResponse
) => {
  // create date-to-eventCount map => { 2022-12-08: 1, 2022-12-10: 1 }
  const reportDateCounts =
    report.rows?.reduce(
      (reportDateCounts, { dimensionValues, metricValues }) => {
        const date = dimensionValues?.[0].value;
        const match = date?.match(/([\d]{4})([\d]{2})([\d]{2})/);
        const formattedDate = `${match?.[1]}-${match?.[2]}-${match?.[3]}`;
        return {
          ...reportDateCounts,
          [formattedDate]: parseInt(metricValues?.[0].value || "0"),
        };
      },
      {} as Record<string, number>
    ) || {};

  let start;

  if (Object.keys(reportDateCounts).length == 0) {
    // if no report data...
    start = subDays(startOfToday(), 7); // 7 days ago
  } else {
    // "2022-12-08" PST => Date instance
    start = parse(Object.keys(reportDateCounts)[0], "yyyy-MM-dd", new Date());
  }

  const allDates = eachDayOfInterval({
    start,
    end: startOfToday(),
  });

  return allDates.map((date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return {
      x: formattedDate,
      y: reportDateCounts[formattedDate] || 0,
    } as DateCount;
  });
};

const initialState = (): AnalyticsReducer.State => {
  let initialState: AnalyticsReducer.State = {
    viewsData: [],
    unlocksData: [],
    timeRange: TIME_RANGE.LAST_7_DAYS,
    reports: zipObject(
      Object.values(TIME_RANGE),
      Array(4).fill({ VIEWS: [], UNLOCKS: [] })
    ) as AnalyticsReducer.State["reports"],
    loaded: false,
  };

  return initialState;
};

const reducer = (
  state: AnalyticsReducer.State,
  action: AnalyticsReducer.Action
) => {
  switch (action.type) {
    case "add-report":
      var { timeRange } = state;
      const { dateCounts, path } = action.payload;
      const reports = set({ ...state.reports }, path, dateCounts);
      return {
        ...state,
        reports,
        viewsData: reports[timeRange].VIEWS,
        unlocksData: reports[timeRange].UNLOCKS,
      };
    case "set-time-range":
      var timeRange = action.payload;
      return {
        ...state,
        timeRange,
        viewsData: state.reports[timeRange].VIEWS,
        unlocksData: state.reports[timeRange].UNLOCKS,
      };

    case "reports-loaded":
      // store reports in localStorage with expiration date
      localStorage.setItem("reports", JSON.stringify(state.reports));
      localStorage.setItem("reportsExpiresAt", endOfDay(new Date()).toString());

      return { ...state, loaded: true };

    default:
      return state;
  }
};

export default function Analytics() {
  const user = useContext(UserContext);
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const runReport = trpc.analytics.runReport.useMutation();

  /**
   * Fetches reports and stores in state. must run AFTER initialState() runs because
   * fetching should only run if there are no cached reports.
   */
  useMemo(() => {
    // user not loaded or reports already loaded
    if (!user || runReport.isLoading) return;

    const cachedReports = localStorage.getItem("reports");
    const cachedReportsExpiresAt = localStorage.getItem("reportsExpiresAt");

    if (
      cachedReportsExpiresAt &&
      isBefore(new Date(), new Date(cachedReportsExpiresAt)) &&
      cachedReports
    ) {
      // if reports in localStorage & not expired...
      try {
        const reports: NonNullable<AnalyticsReducer.State["reports"]> =
          JSON.parse(cachedReports);
        Object.entries(reports).forEach(([timeRange, { VIEWS, UNLOCKS }]) => {
          dispatch({
            type: "add-report",
            payload: {
              dateCounts: VIEWS,
              path: `${timeRange}.VIEWS`,
            },
          });
          dispatch({
            type: "add-report",
            payload: {
              dateCounts: UNLOCKS,
              path: `${timeRange}.UNLOCKS`,
            },
          });
        });
        return dispatch({ type: "reports-loaded" });
      } catch (error) {
        debug(error);
      }
    }

    // otherwise... fetch and store latest reports
    (async function () {
      const REPORT_TYPES = [
        { params: UNLOCKS_LAST_7_DAYS(user.id), path: "LAST_7_DAYS.UNLOCKS" },
        { params: UNLOCKS_LAST_30_DAYS(user.id), path: "LAST_30_DAYS.UNLOCKS" },
        { params: UNLOCKS_LAST_90_DAYS(user.id), path: "LAST_90_DAYS.UNLOCKS" },
        { params: UNLOCKS_ALL_TIME(user.id), path: "ALL_TIME.UNLOCKS" },
        { params: VIEWS_LAST_7_DAYS(user.id), path: "LAST_7_DAYS.VIEWS" },
        { params: VIEWS_LAST_30_DAYS(user.id), path: "LAST_30_DAYS.VIEWS" },
        { params: VIEWS_LAST_90_DAYS(user.id), path: "LAST_90_DAYS.VIEWS" },
        { params: VIEWS_ALL_TIME(user.id), path: "ALL_TIME.VIEWS" },
      ];

      const promises = REPORT_TYPES.map(async ({ params, path }) => {
        const report = await runReport.mutateAsync({
          reportParams: params,
        });

        const dateCounts = reportToData(report);

        dispatch({ type: "add-report", payload: { dateCounts, path } });
      });

      await Promise.all(promises);

      dispatch({ type: "reports-loaded" });
    })();
  }, [user]);

  if (!user) return; // not loaded yet

  return (
    <>
      <Head>
        <title>Analytics - lockr</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="analytics" className="flex-1 flex flex-col overflow-visible">
        <div
          id="analytics-action-buttons"
          className="flex flex-wrap items-center gap-x-6 mb-8"
        >
          <div className="hidden sm:flex gap-x-2 w-full sm:w-auto items-center overflow-x-auto">
            {Object.values(TIME_RANGE_BUTTONS).map((timeRangeButton) => (
              <button
                key={timeRangeButton.name}
                className={classNames(
                  "px-3 py-2 font-semibold text-sm rounded-xl whitespace-nowrap   hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600",
                  timeRangeButton.key == state.timeRange
                    ? "bg-gray-200 dark:bg-gray-700" // active
                    : "bg-gray-100 dark:bg-gray-800" // in-active
                )}
                onClick={() =>
                  dispatch({
                    type: "set-time-range",
                    payload: timeRangeButton.key,
                  })
                }
              >
                {timeRangeButton.name}
              </button>
            ))}
          </div>
          <div className="flex sm:hidden">
            <GenericSelect
              options={Object.values(TIME_RANGE_BUTTONS)}
              selected={TIME_RANGE_BUTTONS[state.timeRange]}
              onChange={(option) =>
                dispatch({ type: "set-time-range", payload: option.key })
              }
              classNames={{
                Button:
                  "bg-gray-100 dark:bg-gray-800 rounded-xl w-28 text-sm font-semibold !py-2 !pl-3",
                Options: "bg-gray-100 dark:bg-gray-800 text-sm",
              }}
              emptyState={undefined}
            />
          </div>
          <div className="gap-x-2 flex items-center">
            {VIEW_TYPE_BUTTONS.map((viewType) => (
              <button
                key={viewType.name}
                className={classNames(
                  "px-4 py-2   hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 rounded-xl",
                  viewType.active
                    ? "bg-gray-200 dark:bg-gray-700" // active
                    : "bg-gray-100 dark:bg-gray-800"
                )}
              >
                <viewType.icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
        <div id="analytics-charts" className="flex flex-col gap-y-6">
          <ApexLineChart
            className="rounded-xl ring-1 ring-gray-200 dark:ring-gray-700 bg-gray-100 dark:bg-gray-800 mx-1"
            height={300}
            title={
              <h1 className="text-lg mb-4 px-2 font-semibold flex items-center justify-start gap-x-2">
                <LockOpenIcon className="h-5 w-5" /> Unlocks
              </h1>
            }
            color={tw.colors.red["500"]}
            series={[{ name: "Unlocks", data: state.unlocksData }]}
          />
          <ApexLineChart
            className="mb-4 rounded-xl ring-1 ring-gray-200 dark:ring-gray-700 bg-gray-100 dark:bg-gray-800 mx-1"
            height={300}
            title={
              <h1 className="text-lg mb-4 px-2 font-semibold flex items-center justify-start gap-x-2">
                <EyeIcon className="h-5 w-5" /> Views
              </h1>
            }
            color={tw!.colors?.blue["500"]}
            series={[{ name: "Views", data: state.viewsData }]}
          />
        </div>
      </div>
    </>
  );
}

Analytics.getLayout = function getLayout(page: ReactNode) {
  return (
    <DashboardLayout>
      <Layout>{page}</Layout>
    </DashboardLayout>
  );
};
