<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# Dovia Development Instructions

## Quota-Saving Mode

Codex/Kilo usage for this project is limited.

Prioritize IMPLEMENTATION over extensive autonomous testing.

### Do NOT automatically perform:

- Browser automation
- Playwright testing
- Screenshot generation
- Screenshot inspection
- Visual regression testing
- Automated accessibility scans
- Testing every route in the browser
- Testing every responsive width automatically
- Image pixel/luminance/crop analysis
- Repeated end-to-end testing
- Repeated `npm run lint`
- Repeated `npm run build`
- Repeated `npm run dev`
- Temporary QA/test scripts
- Unrelated refactoring
- Investigation of unrelated warnings
- Future-phase work

Only perform these if the user explicitly asks.

---

## Implementation Workflow

For every task:

1. Read only the files necessary for the requested work.
2. Implement the requested feature.
3. Reuse the existing Dovia architecture and design system.
4. Do not modify unrelated files.
5. Do not start another phase automatically.

After ALL requested implementation is complete:

```bash
npm run lint
npm run build