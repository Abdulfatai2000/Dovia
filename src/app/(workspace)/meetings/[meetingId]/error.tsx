"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="space-y-3"><h1>Something went wrong</h1><button type="button" onClick={reset}>Try again</button></div>;
}
