# Plain MCP Server

An MCP (Model Context Protocol) server for the [Plain](https://plain.com) support platform. Provides read-only access to threads, customers, and support analytics.'

This is used locally in place of Plain not offering MCP support

## Tools

| Tool | Description |
|------|-------------|
| `list_threads` | List/filter support threads by status, priority, label, assignee, customer |
| `search_threads` | Full-text search across threads |
| `get_thread` | Get a single thread with full conversation timeline |
| `list_customers` | List/search customers |
| `get_customer` | Get customer details by ID or email |
| `get_thread_clusters` | AI-grouped clusters of similar issues (beta) |
| `get_metrics` | Time-series and single-value support metrics |

## Setup

1. Create a Plain API key at **Settings → Machine Users → Create → Add API Key** with permissions: `customer:read`, `thread:read`, `label:read`

2. Install and build:
   ```bash
   npm install
   npm run build
   ```

3. Add to your Claude Code config (`~/.claude.json`):
   ```json
   {
     "mcpServers": {
       "plain": {
         "command": "node",
         "args": ["/path/to/plain-mcp-server/dist/index.js"],
         "env": {
           "PLAIN_API_KEY": "plainApiKey_xxx"
         }
       }
     }
   }
   ```

## Development

```bash
npm run dev    # Watch mode (tsc --watch)
npm run build  # One-time build
npm start      # Run the server (stdio transport)
```
