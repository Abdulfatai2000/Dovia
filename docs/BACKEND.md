# Backend architecture

Route handlers under src/app/api return JSON placeholders. Future handlers will validate input, check authentication and permissions, and delegate to services. Services will use MongoDB/Mongoose models. Groq access stays on the server.

Next.js 16 uses src/proxy.ts. It currently passes requests through without enforcing authentication. Workspace routes will be protected after Auth.js is configured. No backend SDKs are installed in Phase 0.
