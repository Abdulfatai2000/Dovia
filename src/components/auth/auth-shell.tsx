import type { ReactNode } from "react";
import { Brand } from "@/components/layout/brand";
import { AuthVisualPanel } from "./auth-visual-panel";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh bg-background lg:grid lg:grid-cols-[minmax(0,1.38fr)_minmax(0,1fr)]">
      <AuthVisualPanel />
      <div className="flex min-w-0 items-center justify-center px-4 py-10 sm:px-8 sm:py-14 lg:px-8 xl:px-10">
        <div className="w-full max-w-[30rem] space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <Brand compact href="/" label="Dovia home" sizes="44px"
              className="mx-auto w-fit gap-1 text-foreground hover:text-primary lg:mx-0 [&>img]:size-11" />
            <p className="text-sm text-text-secondary lg:hidden">Turn conversations into action.</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
