"use client";

/**
 * GlossaryPanel.tsx — Panel kamus istilah Arab/falsafi/kosmologi.
 *
 * Mencakup 4 kategori:
 *  - falsafi     (wajib/mumkin/mumtani', kaun, tasalsul, dll.)
 *  - epistemologi (an-Nabhani: tafkir, maklumat asabiqah, al-asma')
 *  - kosmologi    (Big Bang, inflasi, GUT, rekombinasi, dll.)
 *  - logika       (□p, ◇p, ¬◇p, PSR, Kalam, Hilbert's Hotel)
 *
 * Fitur:
 *  - Filter kategori (chip)
 *  - Search box
 *  - Daftar istilah dengan kartu (Arab + transliterasi + definisi + penjelasan)
 *  - Klik kartu → expand detail
 *  - Hover term related → highlight
 */

import { useState, useMemo } from "react";
import { useFlowStore } from "@/store/flow-store";
import { glossaryTerms, type GlossaryCategory, type GlossaryTerm } from "@/data/glossary-terms";
import { X, BookMarked, Search, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_META: Record<
  GlossaryCategory,
  { label: string; color: string; bg: string; text: string }
> = {
  falsafi: {
    label: "Falsafi",
    color: "amber",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-300",
  },
  epistemologi: {
    label: "Epistemologi",
    color: "emerald",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  kosmologi: {
    label: "Kosmologi",
    color: "violet",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    text: "text-violet-700 dark:text-violet-300",
  },
  logika: {
    label: "Logika",
    color: "cyan",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    text: "text-cyan-700 dark:text-cyan-300",
  },
};

export function GlossaryPanel() {
  const panelMode = useFlowStore((s) => s.panelMode);
  const setPanelMode = useFlowStore((s) => s.setPanelMode);
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isOpen = panelMode === "glossary";

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((t) => {
      if (activeCategory !== "all" && t.category !== activeCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          t.term.toLowerCase().includes(q) ||
          (t.transliteration?.toLowerCase().includes(q) ?? false) ||
          t.shortDef.toLowerCase().includes(q) ||
          t.explanation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, search]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-y-0 right-0 z-20 w-full sm:w-[520px] bg-background/95 backdrop-blur border-l shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Kamus Istilah
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Falsafi · Epistemologi · Kosmologi · Logika
          </p>
        </div>
        <button
          onClick={() => setPanelMode("none")}
          className="p-1.5 rounded hover:bg-muted"
          aria-label="Tutup kamus"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search + filter chips */}
      <div className="p-3 border-b space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari istilah (Arab, transliterasi, atau makna)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          <FilterChip
            label="Semua"
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {(Object.keys(CATEGORY_META) as GlossaryCategory[]).map((c) => (
            <FilterChip
              key={c}
              label={CATEGORY_META[c].label}
              active={activeCategory === c}
              colorClass={CATEGORY_META[c].text}
              onClick={() => setActiveCategory(c)}
            />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground">
          Menampilkan <strong>{filteredTerms.length}</strong> dari {glossaryTerms.length} istilah
        </p>
      </div>

      {/* Body — scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-3 space-y-2">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted-foreground">
              Tidak ada istilah yang cocok dengan pencarian.
            </div>
          ) : (
            filteredTerms.map((term) => (
              <TermCard
                key={term.id}
                term={term}
                isExpanded={expandedId === term.id}
                onToggle={() =>
                  setExpandedId(expandedId === term.id ? null : term.id)
                }
              />
            ))
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="p-3 border-t bg-muted/30 text-[10px] text-muted-foreground leading-relaxed">
        <div className="flex items-start gap-1.5">
          <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <p>
            Klik kartu untuk membaca penjelasan lengkap. Istilah Arab ditulis dengan teks asli +
            transliterasi Latin. Untuk penjelasan mendalam, lihat Mode Argumen dan sumber primer
            yang dirujuk pada setiap node.
          </p>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  colorClass,
  onClick,
}: {
  label: string;
  active: boolean;
  colorClass?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-[10px] px-2 py-0.5 rounded-full border transition-colors",
        active
          ? colorClass
            ? `${colorClass} border-current bg-current/5 font-semibold`
            : "bg-foreground text-background border-foreground"
          : "border-border text-muted-foreground hover:border-foreground/50"
      )}
    >
      {label}
    </button>
  );
}

function TermCard({
  term,
  isExpanded,
  onToggle,
}: {
  term: GlossaryTerm;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const meta = CATEGORY_META[term.category];
  return (
    <div
      className={cn(
        "border rounded-md overflow-hidden transition-all",
        meta.bg,
        "border-current/20"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-2.5 flex items-start justify-between gap-2 hover:bg-foreground/5"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4 className="text-xs font-bold">{term.term}</h4>
            {term.arabic && (
              <span className="text-[14px] font-arabic leading-none" dir="rtl" lang="ar">
                {term.arabic}
              </span>
            )}
          </div>
          {term.transliteration && (
            <p className="text-[10px] italic text-muted-foreground mt-0.5">
              {term.transliteration}
            </p>
          )}
          <p className="text-[11px] mt-1 leading-snug">{term.shortDef}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className={cn("text-[9px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded", meta.text)}>
            {meta.label}
          </span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>
      {isExpanded && (
        <div className="px-2.5 pb-2.5 pt-1 border-t border-current/10">
          <p className="text-[11px] leading-relaxed">{term.explanation}</p>
          {term.related && term.related.length > 0 && (
            <div className="mt-2 pt-2 border-t border-current/10">
              <p className="text-[9px] uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                Terkait
              </p>
              <div className="flex flex-wrap gap-1">
                {term.related.map((rid) => {
                  const related = glossaryTerms.find((t) => t.id === rid);
                  if (!related) return null;
                  return (
                    <span
                      key={rid}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/5 border border-current/10"
                    >
                      {related.term}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
