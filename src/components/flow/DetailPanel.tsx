"use client";

/**
 * DetailPanel.tsx — Panel detail di sisi kanan canvas.
 * Menampilkan: label, kategori, timeLabel, description lengkap, sumber, rujukan
 * Qur'ani (jika ada), badge. Jika node filosofis → tampilkan ajakan untuk buka
 * Mode Argumen.
 */

import { useFlowStore } from "@/store/flow-store";
import { chainNodes } from "@/data/chain-nodes";
import { CATEGORY_COLORS } from "@/lib/flow/layout";
import { cn } from "@/lib/utils";
import { BookOpen, Sparkles, X, ExternalLink, Moon, AlertCircle, ShieldCheck } from "lucide-react";

export function DetailPanel() {
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);
  const setSelectedNode = useFlowStore((s) => s.setSelectedNode);
  const toggleArgumentOverlay = useFlowStore((s) => s.toggleArgumentOverlay);
  const setPanelMode = useFlowStore((s) => s.setPanelMode);

  if (!selectedNodeId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center border-l bg-muted/20">
        <BookOpen className="w-10 h-10 text-muted-foreground/40 mb-3" />
        <h3 className="text-sm font-semibold mb-1">Detail Node</h3>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
          Klik node mana pun di kanvas untuk melihat deskripsi lengkap, label waktu, sumber referensi,
          dan rujukan Qur&apos;ani (jika ada).
        </p>
      </div>
    );
  }

  const node = chainNodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const color = CATEGORY_COLORS[node.category];

  return (
    <div className="h-full flex flex-col border-l bg-background">
      {/* Header */}
      <div className={cn("p-4 border-b", color.bg)}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className={cn("inline-block w-3 h-3 rounded-full", color.dot)} />
            <span className={cn("text-[10px] uppercase tracking-wide font-semibold", color.text)}>
              {color.label}
            </span>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-muted-foreground hover:text-foreground p-1 -mr-1 -mt-1"
            aria-label="Tutup detail"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <h2 className="text-base font-bold leading-tight">{node.label}</h2>
        <p className="text-xs italic mt-1 opacity-80">{node.timeLabel}</p>
        <div className="flex gap-1 mt-2">
          {node.isPhilosophical && (
            <span className="text-[9px] font-bold bg-yellow-400 text-yellow-950 rounded px-1.5 py-0.5">
              Node Filosofis
            </span>
          )}
          {node.isBoundary && (
            <span className="text-[9px] font-bold bg-gray-400 text-gray-950 rounded px-1.5 py-0.5">
              Batas Sains
            </span>
          )}
          {node.quranRefs && node.quranRefs.length > 0 && (
            <span className="text-[9px] font-bold bg-emerald-500 text-emerald-950 rounded px-1.5 py-0.5">
              {node.quranRefs.length} Rujukan QS
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-4">
          <section>
            <h4 className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground mb-1.5">
              Deskripsi
            </h4>
            <p className="text-sm leading-relaxed">{node.description}</p>
          </section>

          {/* Rujukan Qur'ani */}
          {node.quranRefs && node.quranRefs.length > 0 && (
            <section>
              <h4 className="text-[10px] uppercase tracking-wide font-semibold text-emerald-700 dark:text-emerald-300 mb-1.5 flex items-center gap-1">
                <Moon className="w-3 h-3" />
                Rujukan Qur&apos;ani
              </h4>
              <div className="space-y-2">
                {node.quranRefs.map((ref, i) => (
                  <div
                    key={i}
                    className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-2"
                  >
                    <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                      QS {ref.surah}:{ref.ayat}
                    </p>
                    <p className="text-[11px] leading-relaxed text-emerald-900 dark:text-emerald-100 italic">
                      {ref.paraphrase}
                    </p>
                  </div>
                ))}
                <button
                  onClick={() => setPanelMode("quran")}
                  className="text-[10px] text-muted-foreground hover:text-foreground underline"
                >
                  Lihat semua rujukan Qur&apos;ani →
                </button>
              </div>
            </section>
          )}

          {node.sources && node.sources.length > 0 && (
            <section>
              <h4 className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Sumber Verifikasi
              </h4>
              <ul className="space-y-1">
                {node.sources.map((src, i) => (
                  <li
                    key={i}
                    className="text-[11px] text-muted-foreground leading-relaxed pl-2 border-l-2 border-muted"
                  >
                    {src}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {node.isPhilosophical && (
            <div className="rounded-md bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 p-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                    Node argumentatif
                  </p>
                  <p className="text-[11px] text-yellow-800 dark:text-yellow-200 leading-relaxed">
                    Node ini bukan klaim ilmiah, melainkan konklusi filosofis dalam tradisi falsafi
                    Islam (Al-Kindi, Ibnu Sina, Al-Ghazali, an-Nabhani). Aktifkan Mode Argumen untuk
                    membaca rumusan lengkap argumen dan muaranya ke tauhid wujud.
                  </p>
                  <button
                    onClick={toggleArgumentOverlay}
                    className="text-[11px] font-medium mt-2 underline hover:no-underline"
                  >
                    Buka Mode Argumen &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Objeksi & Tanggapan untuk node filosofis terminal */}
          {node.isPhilosophical && (node.objection || node.response) && (
            <div className="space-y-2">
              {node.philosopher && (
                <div className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
                  Tradisi: {node.philosopher}
                </div>
              )}
              {node.objection && (
                <section className="rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 p-2.5">
                  <h4 className="text-[10px] uppercase tracking-wide font-semibold text-rose-700 dark:text-rose-300 mb-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Objeksi Terkuat
                  </h4>
                  <p className="text-[11px] leading-relaxed text-rose-900 dark:text-rose-100">
                    {node.objection}
                  </p>
                </section>
              )}
              {node.response && (
                <section className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-2.5">
                  <h4 className="text-[10px] uppercase tracking-wide font-semibold text-emerald-700 dark:text-emerald-300 mb-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Tanggapan (Steelman)
                  </h4>
                  <p className="text-[11px] leading-relaxed text-emerald-900 dark:text-emerald-100">
                    {node.response}
                  </p>
                </section>
              )}
            </div>
          )}

          {node.isBoundary && (
            <div className="rounded-md bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-3">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Batas penjelasan ilmiah saat ini.</strong> Fisika konvensional
                tidak dapat memberikan deskripsi mekanis di titik ini. Klaim tentang apa yang terjadi &ldquo;sebelum&rdquo; atau
                &ldquo;di luar&rdquo; harus diperlakukan sebagai argumen filosofis, bukan kesimpulan empiris.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
