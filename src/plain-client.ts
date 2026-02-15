import { PlainClient } from "@team-plain/typescript-sdk";
import {
  SEARCH_THREADS_QUERY,
  GET_THREAD_TIMELINE_QUERY,
  SEARCH_CUSTOMERS_QUERY,
  GET_THREAD_CLUSTERS_QUERY,
  TIME_SERIES_METRIC_QUERY,
  SINGLE_VALUE_METRIC_QUERY,
} from "./queries/graphql.js";

const apiKey = process.env.PLAIN_API_KEY;
if (!apiKey) {
  throw new Error("PLAIN_API_KEY environment variable is required");
}

export const client = new PlainClient({ apiKey });

// --- Raw GraphQL helpers ---

async function rawQuery(query: string, variables: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await client.rawRequest({ query, variables });
  if (res.error) throw new Error(`GraphQL request failed: ${JSON.stringify(res.error)}`);
  return res.data as Record<string, unknown>;
}

export async function searchThreads(query: string, first = 25, after?: string) {
  const data = await rawQuery(SEARCH_THREADS_QUERY, { query, first, after });
  return data.searchThreads;
}

export async function getThreadWithTimeline(threadId: string, first = 50, after?: string) {
  const data = await rawQuery(GET_THREAD_TIMELINE_QUERY, { threadId, first, after });
  return data.thread;
}

export async function searchCustomers(query: string, first = 25, after?: string) {
  const data = await rawQuery(SEARCH_CUSTOMERS_QUERY, { query, first, after });
  return data.searchCustomers;
}

export async function getThreadClusters(timeRange: string) {
  const data = await rawQuery(GET_THREAD_CLUSTERS_QUERY, { timeRange });
  return data.threadClusters;
}

export async function getTimeSeriesMetric(metricType: string, timeRange: Record<string, unknown>) {
  const data = await rawQuery(TIME_SERIES_METRIC_QUERY, { metricType, timeRange });
  return data.timeSeriesMetric;
}

export async function getSingleValueMetric(metricType: string, timeRange: Record<string, unknown>) {
  const data = await rawQuery(SINGLE_VALUE_METRIC_QUERY, { metricType, timeRange });
  return data.singleValueMetric;
}
