"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, LoaderCircle, Search, SquareCheckBig, UserRound, CheckCheck } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { useDemoQuery } from "@/hooks/use-demo-query";
import { searchWorkspace, type SearchGroup, type SearchResult } from "@/services/search.service";
import { cn } from "@/lib/utils";

const groupIcons: Record<SearchGroup, typeof CalendarDays> = {
  Meetings: CalendarDays,
  Tasks: SquareCheckBig,
  People: UserRound,
  Decisions: CheckCheck,
};

export interface GlobalSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  placeholder?: string;
  /** Float the result panel over page content instead of expanding the layout. */
  floating?: boolean;
}

/**
 * Command-style search panel over the canonical entity index.
 * Keyboard: Arrow Up/Down move, Enter opens, Escape closes.
 */
export function GlobalSearch({ value, onChange, onClose, className, inputRef, placeholder, floating = false }: GlobalSearchProps) {
  const router = useRouter();
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const load = useCallback(() => (value.trim() ? searchWorkspace(value) : null), [value]);
  const { data, loading, error } = useDemoQuery(load);

  const flat: SearchResult[] = (data?.groups ?? []).flatMap(group => group.results);
  const trimmed = value.trim();

  // Reset the highlight when the query changes, adjusting state during render instead of in an effect.
  const [lastQuery, setLastQuery] = useState(trimmed);
  if (lastQuery !== trimmed) { setLastQuery(trimmed); setActive(0); }

  // Keep the highlighted row in view during keyboard navigation.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function open(result: SearchResult) {
    router.push(result.href);
    onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
    if (!flat.length) return;
    if (event.key === "ArrowDown") { event.preventDefault(); setActive(index => (index + 1) % flat.length); return; }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive(index => (index - 1 + flat.length) % flat.length); return; }
    if (event.key === "Enter") { event.preventDefault(); const result = flat[Math.min(active, flat.length - 1)]; if (result) open(result); }
  }

  let cursor = -1;
  return <div className={cn("min-w-0", floating && "relative", className)}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) onChange(""); }}>
    <SearchInput ref={inputRef} label="Search workspace" placeholder={placeholder}
      value={value} autoComplete="off" role="combobox" aria-autocomplete="list"
      aria-controls={trimmed ? `${id}-results` : undefined} aria-expanded={Boolean(trimmed)} aria-activedescendant={flat.length ? `${id}-option-${Math.min(active, flat.length - 1)}` : undefined}
      onChange={event => onChange(event.target.value)} onKeyDown={onKeyDown} />
    {trimmed && <div
      className={cn("dovia-glass dovia-pop mt-2 overflow-y-auto rounded-md border border-border-strong bg-surface shadow-lg",
        floating ? "absolute inset-x-0 top-full z-[var(--z-dropdown)] mt-2 max-h-[min(28rem,60dvh)]" : "max-h-[min(28rem,60dvh)]")}>
      {loading && !data && <p role="status" className="flex items-center gap-2 px-4 py-3 text-sm text-text-muted">
        <LoaderCircle aria-hidden="true" className="dovia-spinner size-4" />Searching demo workspace…
      </p>}
      {error && <p role="alert" className="px-4 py-3 text-sm text-danger-foreground">{error}</p>}
      {!loading && !error && !flat.length && <div className="space-y-1 px-4 py-5 text-center">
        <p className="text-sm font-medium text-foreground">No results for &quot;{trimmed}&quot;</p>
        <p className="text-sm text-text-secondary">Try searching meetings, tasks, people, or decisions.</p>
      </div>}
      <div id={`${id}-results`} ref={listRef} role="listbox" aria-label="Search results" className="p-1.5">
        {data?.groups.map(group => {
          const Icon = groupIcons[group.group];
          return <div key={group.group} className="mb-1 last:mb-0">
            <p className="px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-text-muted uppercase">{group.group}</p>
            {group.results.map(result => {
              cursor += 1;
              const index = cursor;
              const selected = index === Math.min(active, flat.length - 1);
              return <button key={result.id} type="button" role="option" id={`${id}-option-${index}`}
                data-index={index} aria-selected={selected} tabIndex={-1}
                onMouseEnter={() => setActive(index)} onClick={() => open(result)}
                className={cn("flex w-full items-start gap-3 rounded-sm px-3 py-2.5 text-left transition-[transform,background-color] duration-150",
                  selected ? "bg-surface-hover text-foreground" : "text-text-secondary hover:translate-x-0.5 hover:bg-surface-soft")}>
                <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{result.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-text-muted">{result.context}</span>
                </span>
              </button>;
            })}
          </div>;
        })}
      </div>
        <p className="border-t border-border px-3 py-2 text-xs text-text-muted" role="status">
          <Search aria-hidden="true" className="mr-1 inline size-3" />
          {flat.length} result{flat.length === 1 ? "" : "s"} · Use arrow keys and Enter to open · Esc to close
        </p>
    </div>}
  </div>;
}
export default GlobalSearch;
