# API contract

See [ROUTES.md](./ROUTES.md) for every endpoint and supported method.

All handlers currently return HTTP 200 and `{ "success": true, "message": "Dovia API placeholder" }`. This acknowledges a placeholder only; no operation is performed. Request validation, persistence, authorization, error contracts, and pagination are deferred. Unsupported methods use Next.js default handling.
