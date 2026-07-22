"use client";

/**
 * QuranReferencePanel.tsx — Iterasi 2: Panel Rujukan Qur'ani.
 *
 * Mengumpulkan semua rujukan Qur'ani yang tersebar di seluruh node, menampilkannya
 * dalam satu panel dengan filter berdasarkan surah. Format setiap entri:
 *   - Surah + nomor ayat (QS Al-Fatihah:2)
 *   - Parafrase makna (bukan kutipan teks Arab — hemat layar)
 *   - Tautan ke node terkait (klik → buka DetailPanel node tsb)
 */

import { useFlowStore } from "@/store/flow-store";
import { chainNodes, type ChainNode, type QuranReference } from "@/data/chain-nodes";
import { X, BookOpen, Sparkles, ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface AggregatedRef {
  ref: QuranReference;
  node: ChainNode;
  refKey: string; // unique
}

export function QuranReferencePanel() {
  const panelMode = useFlowStore((s) => s.panelMode);
  const setPanelMode = useFlowStore((s) => s.setPanelMode);
  const setSelectedNode = useFlowStore((s) => s.setSelectedNode);

  const [filter, setFilter] = useState<string>("");

  // Kumpulkan semua rujukan Qur'ani dari semua node — hooks dipanggil sebelum early return
  const allRefs = useMemo<AggregatedRef[]>(() => {
    const list: AggregatedRef[] = [];
    chainNodes.forEach((node) => {
      if (!node.quranRefs) return;
      node.quranRefs.forEach((ref, idx) => {
        list.push({
          ref,
          node,
          refKey: `${node.id}-${idx}`,
        });
      });
    });
    return list;
  }, []);

  // Daftar surah unik untuk filter chips
  const uniqueSurahs = useMemo(() => {
    const set = new Set<string>();
    allRefs.forEach((r) => set.add(r.ref.surah));
    return Array.from(set).sort();
  }, [allRefs]);

  const filtered = useMemo(() => {
    if (!filter) return allRefs;
    return allRefs.filter((r) => r.ref.surah === filter);
  }, [allRefs, filter]);

  if (panelMode !== "quran") return null;

  const handleJumpToNode = (nodeId: string) => {
    setSelectedNode(nodeId);
    setPanelMode("none");
  };

  return (
    <div className="absolute inset-y-0 right-0 z-30 w-full sm:w-[440px] bg-background/95 backdrop-blur border-l shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Rujukan Qur&apos;ani
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {allRefs.length} rujukan dari {uniqueSurahs.length} surah · Parafrase makna
          </p>
        </div>
        <button
          onClick={() => setPanelMode("none")}
          className="p-1.5 rounded hover:bg-muted"
          aria-label="Tutup panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter chips */}
      <div className="px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter("")}
            className={cn(
              "text-[10px] px-2 py-1 rounded-full border transition-colors",
              filter === ""
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-background hover:bg-muted border-border"
            )}
          >
            Semua
          </button>
          {uniqueSurahs.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "text-[10px] px-2 py-1 rounded-full border transition-colors",
                filter === s
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-background hover:bg-muted border-border"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-3">
          <div className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3 text-[11px] leading-relaxed">
            <strong className="text-emerald-900 dark:text-emerald-100">Catatan penting:</strong>{" "}
            Parafrase makna disusun ringkas untuk keterbacaan UI. Untuk teks Arab dan terjemahan
            resmi, rujuk mushaf Al-Qur&apos;an dan tafsir otoritatif (Ibnu Katsir, Al-Azhar karya
            Hamka, dll).
          </div>

          {filtered.map(({ ref, node, refKey }) => (
            <div
              key={refKey}
              className="rounded-md border bg-background p-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  QS {ref.surah}:{ref.ayat}
                </h4>
                <button
                  onClick={() => handleJumpToNode(node.id)}
                  className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                  title={`Buka node: ${node.label}`}
                >
                  {node.label.length > 24 ? node.label.slice(0, 22) + "…" : node.label}
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-foreground/90 italic">
                &ldquo;{ref.paraphrase}&rdquo;
              </p>
              <p className="text-[9px] text-muted-foreground mt-1.5">
                Terkait node: <span className="font-mono">{node.id}</span>
              </p>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-xs text-muted-foreground">
              Tidak ada rujukan Qur&apos;ani pada filter ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
