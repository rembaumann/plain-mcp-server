#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import {
  listThreadsSchema,
  listThreads,
  searchThreadsSchema,
  searchThreadsTool,
  getThreadSchema,
  getThread,
} from "./tools/threads.js";
import {
  listCustomersSchema,
  listCustomersTool,
  getCustomerSchema,
  getCustomerTool,
} from "./tools/customers.js";
import {
  getThreadClustersSchema,
  getThreadClustersTool,
  getMetricsSchema,
  getMetricsTool,
} from "./tools/analytics.js";

const server = new McpServer({
  name: "plain",
  version: "1.0.0",
});

// --- Thread tools ---

server.tool(
  "list_threads",
  "List and filter support threads by status, priority, label, assignee, or customer",
  listThreadsSchema.shape,
  async (args) => {
    const parsed = listThreadsSchema.parse(args);
    const result = await listThreads(parsed);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "search_threads",
  "Full-text search across support threads",
  searchThreadsSchema.shape,
  async (args) => {
    const parsed = searchThreadsSchema.parse(args);
    const result = await searchThreadsTool(parsed);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_thread",
  "Get a single support thread with its full conversation timeline (messages, status changes, assignments)",
  getThreadSchema.shape,
  async (args) => {
    const parsed = getThreadSchema.parse(args);
    const result = await getThread(parsed);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// --- Customer tools ---

server.tool(
  "list_customers",
  "List customers, optionally searching by name or email",
  listCustomersSchema.shape,
  async (args) => {
    const parsed = listCustomersSchema.parse(args);
    const result = await listCustomersTool(parsed);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_customer",
  "Get detailed customer information by ID or email address",
  getCustomerSchema.shape,
  async (args) => {
    const parsed = getCustomerSchema.parse(args);
    const result = await getCustomerTool(parsed);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// --- Analytics tools ---

server.tool(
  "get_thread_clusters",
  "Get AI-grouped clusters of similar support threads to identify trends and common issues (beta)",
  getThreadClustersSchema.shape,
  async (args) => {
    const parsed = getThreadClustersSchema.parse(args);
    const result = await getThreadClustersTool(parsed);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_metrics",
  "Get support metrics — time-series (threads created/resolved, response/resolution times) or single values (open count, averages)",
  getMetricsSchema.shape,
  async (args) => {
    const parsed = getMetricsSchema.parse(args);
    const result = await getMetricsTool(parsed);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// --- Start server ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Plain MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
