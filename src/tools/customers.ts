import { z } from "zod";
import { client, searchCustomers } from "../plain-client.js";

export const listCustomersSchema = z.object({
  query: z
    .string()
    .optional()
    .describe("Search query to filter customers (searches name, email, etc.)"),
  first: z.number().min(1).max(100).default(25).describe("Number of results"),
  after: z.string().optional().describe("Pagination cursor"),
});

export async function listCustomersTool(args: z.infer<typeof listCustomersSchema>) {
  if (args.query) {
    return searchCustomers(args.query, args.first, args.after);
  }

  const res = await client.getCustomers({
    first: args.first,
    after: args.after ?? undefined,
  });
  if (res.error) throw new Error(`getCustomers failed: ${JSON.stringify(res.error)}`);
  return res.data;
}

export const getCustomerSchema = z.object({
  customerId: z.string().optional().describe("Customer ID (use this or email)"),
  email: z
    .string()
    .optional()
    .describe("Customer email address (use this or customerId)"),
});

export async function getCustomerTool(args: z.infer<typeof getCustomerSchema>) {
  if (!args.customerId && !args.email) {
    throw new Error("Either customerId or email is required");
  }

  if (args.email) {
    const res = await client.getCustomerByEmail({ email: args.email });
    if (res.error) throw new Error(`getCustomerByEmail failed: ${JSON.stringify(res.error)}`);
    return res.data;
  }

  const res = await client.getCustomerById({ customerId: args.customerId! });
  if (res.error) throw new Error(`getCustomerById failed: ${JSON.stringify(res.error)}`);
  return res.data;
}
