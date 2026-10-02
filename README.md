# Dovia
Turn meetings into accountability. AI extracts decisions and action items from notes or transcripts, assigns owners and deadlines, tracks progress, and generates the next meeting's agenda.

## Development

Phase 0 scaffolds Next.js App Router, TypeScript, and Tailwind CSS. All pages and APIs are placeholders; authentication, database access, AI analysis, and integrations are not implemented.

Use Node.js 20.9 or newer, then run:

```sh
npm install
npm run dev
```

Open http://localhost:3000. Future environment variables are documented in `.env.example`; no credentials are required to build the scaffold.

```sh
npm run lint
npm run build
npm start
```

See [the route inventory](docs/ROUTES.md), [product requirements](docs/SRS.md), and [AI review flow](docs/AI.md). AI suggestions must be reviewed and confirmed by a human before final tasks are created.
