"use client";

import { Toast } from "@/components/ui/toast";

export interface AuthNoticeValue {
  title: string;
  description: string;
}

export function AuthNotice({ notice, onDismiss }: { notice: AuthNoticeValue | null; onDismiss: () => void }) {
  if (!notice) return null;
  return (
    <div className="fixed inset-x-4 bottom-4 z-[var(--z-toast)] sm:left-auto">
      <Toast key={notice.title} variant="info" title={notice.title} description={notice.description} onDismiss={onDismiss} />
    </div>
  );
}
