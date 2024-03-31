import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { env } from "@/modules/env";
import { google } from "@google-analytics/data/build/protos/protos";

const PROPERTY_ID = env.GOOGLE_ANALYTICS__PROPERTY_ID;

export const analyticsRouter = router({
  /**
   * Fetches all data for a specific event (ex. social_unlock_view events for
   * given social unlock id)
   */
  runReport: publicProcedure
    .input(
      z.object({
        reportParams: z.object({
          dateRanges: z.array(
            z.object({
              startDate: z.string(),
              endDate: z.string(),
            })
          ),
          dimensions: z.array(
            z.object({
              name: z.string(),
            })
          ),
          metrics: z.array(
            z.object({
              name: z.string(),
            })
          ),
          dimensionFilter: z.object({
            andGroup: z.object({
              expressions: z.array(
                z.object({
                  filter: z.object({
                    fieldName: z.string(),
                    stringFilter: z.object({
                      value: z.string(),
                    }),
                  }),
                })
              ),
            }),
          }),
          orderBys: z.array(
            z.object({
              dimension: z.object({
                dimensionName: z.string(),
              }),
            })
          ),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const reportParams: Partial<google.analytics.data.v1beta.RunReportRequest> =
        input.reportParams;

      /**
       * Using a default constructor instructs the client to use
       * the credentials specified in GOOGLE_APPLICATION_CREDENTIALS
       * environment variable.
       * */
      const analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: {
          client_email: env.FIREBASE_ADMIN__CLIENT_EMAIL,
          private_key: env.FIREBASE_ADMIN__PRIVATE_KEY,
        },
      });

      const [response] = await analyticsDataClient.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: reportParams.dateRanges,
        dimensions: reportParams.dimensions,
        metrics: reportParams.metrics,
        dimensionFilter: reportParams.dimensionFilter,
        orderBys: reportParams.orderBys,
      });

      return response;
    }),
});
