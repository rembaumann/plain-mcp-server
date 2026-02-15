import { z } from "zod";
import { client, searchThreads, getThreadWithTimeline } from "../plain-client.js";

export const listThreadsSchema = z.object({
  status: z
    .enum(["TODO", "SNOOZED", "DONE"])
    .optional()
    .describe("Filter by thread status"),
  priority: z
    .number()
    .min(0)
    .max(3)
    .optional()
    .describe("Filter by priority (0=urgent, 1=high, 2=normal, 3=low)"),
  labelTypeIds: z
    .array(z.string())
    .optional()
    .describe("Filter by label type IDs"),
  customerIds: z
    .array(z.string())
    .optional()
    .describe("Filter by customer IDs"),
  assigneeIds: z
    .array(z.string())
    .optional()
    .describe("Filter by assignee user IDs"),
  first: z.number().min(1).max(100).default(25).describe("Number of results to return"),
  after: z.string().optional().describe("Pagination cursor"),
});

export async function listThreads(args: z.infer<typeof listThreadsSchema>) {
  const filters: Record<string, unknown> = {};
  if (args.status) filters.statuses = [args.status];
  if (args.priority !== undefined) filters.priorities = [args.priority];
  if (args.labelTypeIds) filters.labelTypeIds = args.labelTypeIds;
  if (args.customerIds) filters.customerIds = args.customerIds;
  if (args.assigneeIds) filters.assignedToUser = args.assigneeIds;

  const res = await client.getThreads({
    filters,
    first: args.first,
    after: args.after ?? undefined,
  });
  if (res.error) throw new Error(`getThreads failed: ${JSON.stringify(res.error)}`);
  return res.data;
}

export const searchThreadsSchema = z.object({
  query: z.string().describe("Full-text search query"),
  first: z.number().min(1).max(100).default(25).describe("Number of results"),
  after: z.string().optional().describe("Pagination cursor"),
});

export async function searchThreadsTool(args: z.infer<typeof searchThreadsSchema>) {
  return searchThreads(args.query, args.first, args.after);
}

export const getThreadSchema = z.object({
  threadId: z.string().describe("Thread ID"),
  timelineFirst: z.number().min(1).max(100).default(50).describe("Number of timeline entries"),
  timelineAfter: z.string().optional().describe("Pagination cursor for timeline"),
});

export async function getThread(args: z.infer<typeof getThreadSchema>) {
  return getThreadWithTimeline(args.threadId, args.timelineFirst, args.timelineAfter);
}
