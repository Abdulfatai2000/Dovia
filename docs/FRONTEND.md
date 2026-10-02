# Frontend architecture

Next.js App Router, TypeScript, and Tailwind CSS. Marketing, auth, and workspace route groups have independent pass-through layouts. The root layout supplies metadata and global styles.

Pages are server components by default. Dynamic pages await promised route params. Error boundaries are client components. Root, dashboard, and meeting loading states are scaffolded.

Components are structural placeholders only, including UI controls; no interactive behavior is implemented. Hooks are documented modules pending API contracts. See [ROUTES.md](./ROUTES.md) for the route inventory.
