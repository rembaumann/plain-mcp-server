import { z } from "zod";
import { getThreadClusters, getTimeSeriesMetric, getSingleValueMetric } from "../plain-client.js";

export const getThreadClustersSchema = z.object({
  timeRange: z
    .enum(["LAST_7_DAYS", "LAST_30_DAYS", "LAST_90_DAYS"])
    .default("LAST_30_DAYS")
    .describe("Time range for clustering threads"),
});

export async function getThreadClustersTool(
  args: z.infer<typeof getThreadClustersSchema>
) {
  return getThreadClusters(args.timeRange);
}

export const getMetricsSchema = z.object({
  type: z
    .enum(["time_series", "single_value"])
    .describe("Whether to get time-series data or a single aggregate value"),
  metricType: z
    .string()
    .describe(
      "Metric type. Time-series: THREADS_CREATED, THREADS_RESOLVED, FIRST_RESPONSE_TIME, RESOLUTION_TIME. Single-value: OPEN_THREAD_COUNT, UNASSIGNED_THREAD_COUNT, AVERAGE_FIRST_RESPONSE_TIME, AVERAGE_RESOLUTION_TIME"
    ),
  startDate: z
    .string()
    .describe("Start date in ISO 8601 format (e.g. 2025-01-01T00:00:00Z)"),
  endDate: z
    .string()
    .describe("End date in ISO 8601 format (e.g. 2025-01-31T23:59:59Z)"),
});

export async function getMetricsTool(args: z.infer<typeof getMetricsSchema>) {
  const timeRange = {
    startDate: args.startDate,
    endDate: args.endDate,
  };

  if (args.type === "time_series") {
    return getTimeSeriesMetric(args.metricType, timeRange);
  }
  return getSingleValueMetric(args.metricType, timeRange);
}
