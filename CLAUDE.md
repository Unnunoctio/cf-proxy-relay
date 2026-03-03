# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev     # Local dev server (wrangler dev)
pnpm deploy  # Deploy to Cloudflare Workers (wrangler deploy)
pnpm test    # Run tests with vitest
```

Tests use `@cloudflare/vitest-pool-workers` — they run in the Workers runtime, not Node.

**Secrets:** managed directly with Wrangler — `wrangler secret put API_KEY`. For local dev, copy `.dev.vars.example` to `.dev.vars`.

## Architecture

This is a **Cloudflare Worker** that acts as an authenticated HTTP proxy relay. Entry point is `src/index.js`, which routes `OPTIONS` to the CORS handler and everything else to `proxyHandler`.

### Request flow

```
fetch event → src/index.js
  → OPTIONS → middleware/cors.js (returns 204 preflight)
  → POST    → handlers/proxy.js (proxyHandler)
               ├── middleware/auth.js     — validates X-API-Key against env.API_KEY binding
               ├── validators/request.js  — validates url (http/https only) and method
               ├── services/proxy.js      — builds and executes the outbound fetch
               │    ├── utils/header.js   — merges DEFAULT_HEADERS + custom, strips FORBIDDEN_HEADERS
               │    ├── utils/body.js     — serializes body per Content-Type
               │    └── utils/response.js — parses upstream response (JSON/text/binary→base64)
               └── utils/response.js      — formatResponse / formatError (structured JSON)
```

### Key design points

- **Only POST is accepted** at the proxy endpoint. The JSON body carries `{ url, method, headers, body, timeout }`.
- **`API_KEY` is a Cloudflare secret binding** — if absent in env (local dev without the binding), auth is bypassed automatically (`auth.js:3`).
- **DEFAULT_HEADERS** (`src/config/constants.js`) impersonate a browser UA to help bypass Cloudflare bot detection on the upstream side. Custom headers from the request are merged on top; `FORBIDDEN_HEADERS` (`host`, `connection`, `content-length`) are always stripped.
- **Timeout** defaults to 30 000 ms and uses `AbortSignal.timeout()` — `AbortError` is caught in `proxyHandler` and returns a 504.
- Binary upstream responses are returned as `{ type: "binary", base64: "...", contentType }`.

### Secrets & environment

`API_KEY` is a Cloudflare secret binding set via `wrangler secret put API_KEY`. In local dev it is loaded from `.dev.vars` (gitignored — copy from `.dev.vars.example`). If the binding is absent, `auth.js` bypasses auth automatically, so local dev works without a key.
