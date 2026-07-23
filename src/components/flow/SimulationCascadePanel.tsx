"use client";

/**
 * SimulationCascadePanel.tsx — Panel khusus untuk ringkasan dampak cascade simulasi fine-tuning.
 *
 * Menampilkan:
 *  - Ringkasan dampak pada rantai peristiwa (bertahan / berubah / tak terbentuk)
 *  - Titik rantai putus pertama (first failure) & daftar node yang gagal terurut waktu
 *  - Lensa filosofis "Baca sebagai apa?" (Determinisme vs Lauhul Mahfuz) + tautan ke Jalur E
 *
 * Dipisahkan sebagai panel mandiri di luar FineTuningMode agar panel slider fine-tuning
 * tetap bersih dan terfokus pada kontrol konstanta, sementara dampak cascade dapat dipantau
 * langsung di atas canvas.
 */

import { useMemo, useState } from "react";
import { useFlowStore } from "@/store/flow-store";
import { simulate } from "@/lib/flow/simulation";
import { chainNodes } from "@/data/chain-nodes";
import {
  Activity,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";

export function SimulationCascadePanel() {
  const values = useFlowStore((s) => s.simValues);
  const resetSim = useFlowStore((s) => s.resetSim);
  const setBranch = useFlowStore((s) => s.setBranch);
  const setPanelMode = useFlowStore((s) => s.setPanelMode);

  const [isMinimized, setIsMinimized] = useState(false);

  const sim = useMemo(() => simulate(values), [values]);
  const nodeLabel = useMemo(() => {
    const m = new Map(chainNodes.map((n) => [n.id, n.label]));
    return (id: string) => m.get(id) ?? id;
  }, []);

  if (!sim.anyChange) return null;

  return (
    <div className="absolute top-4 left-4 z-30 w-[320px] sm:w-[360px] max-h-[calc(100vh-140px)] bg-background/95 backdrop-blur border border-border shadow-xl rounded-lg flex flex-col overflow-hidden transition-all">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-2.5 border-b bg-gradient-to-r from-violet-50 via-amber-50 to-rose-50 dark:from-violet-950/40 dark:via-amber-950/40 dark:to-rose-950/40">
        <div className="flex items-center gap-2 min-w-0">
          <Activity className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
          <h3 className="text-xs font-bold truncate">Dampak Cascade Simulasi</h3>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={resetSim}
            className="text-[10px] px-2 py-0.5 rounded border bg-background/80 hover:bg-muted flex items-center gap-1"
            title="Reset simulasi ke nilai nominal"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button
            onClick={() => setIsMinimized((v) => !v)}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title={isMinimized ? "Buka panel" : "Minimalkan panel"}
          >
            {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 overflow-y-auto min-h-0 space-y-0 divide-y divide-border text-[11px]">
          {/* Ringkasan cascade simulasi */}
          <div className="p-3 space-y-2 bg-muted/30">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Dampak pada Rantai Peristiwa
              </h4>
            </div>
            <div className="flex gap-2 text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                Bertahan: <strong>{sim.counts.survives}</strong>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300">
                Berubah: <strong>{sim.counts.altered}</strong>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300">
                Tak terbentuk: <strong>{sim.counts.fails}</strong>
              </span>
            </div>
            {sim.firstFailure && (
              <p className="text-[11px] leading-relaxed">
                <strong className="text-rose-700 dark:text-rose-300">Titik rantai putus:</strong>{" "}
                {nodeLabel(sim.firstFailure.nodeId)} — semua peristiwa sesudahnya tidak akan terbentuk.
              </p>
            )}
            {sim.failedInOrder.length > 0 && (
              <ol className="text-[10px] space-y-0.5 max-h-36 overflow-y-auto overscroll-contain list-decimal list-inside pr-1">
                {sim.failedInOrder.map((id) => (
                  <li key={id} className="text-rose-700/90 dark:text-rose-300/90">
                    {nodeLabel(id)}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Baca sebagai apa? — dua lensa filosofis */}
          <div className="p-3 space-y-2 bg-violet-50/40 dark:bg-violet-950/20">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <h4 className="text-[10px] font-bold uppercase tracking-wide text-violet-800 dark:text-violet-200">
                Baca sebagai apa?
              </h4>
            </div>
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              Fakta yang sama — konstanta yang bisa saja bernilai lain — dibaca dua cara:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="rounded-md border border-border bg-background/60 p-2 space-y-1">
                <p className="font-bold">Determinisme (pra-tertulis)</p>
                <p className="leading-relaxed text-[9.5px]">
                  Nilai konstanta <em>brute fact</em> — begitu saja. Rantai berjalan otomatis dari
                  kondisi awal, tanpa penulis. Presisinya: kebetulan atau multiverse.
                </p>
              </div>
              <div className="rounded-md border border-violet-300 dark:border-violet-800 bg-violet-100/40 dark:bg-violet-900/20 p-2 space-y-1">
                <p className="font-bold">Lauhul Mahfuz (telah tertulis)</p>
                <p className="leading-relaxed text-[9.5px]">
                  Konstanta &amp; rantainya ditetapkan lebih dulu berdasarkan ilmu yang mendahului,
                  agar rantai ini bisa berjalan.
                </p>
                <p className="leading-relaxed font-medium text-[9.5px] text-violet-800 dark:text-violet-200">
                  Konstanta yang Anda geser = qadha&apos; mubram yang tertulis.
                </p>
              </div>
            </div>
            <p className="text-[9.5px] leading-relaxed rounded p-1.5 bg-amber-100/50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100">
              <strong>Bukan paksaan:</strong> ilmu yang mendahului tidak sama dengan sebab yang
              memaksa — seperti guru yang sudah tahu seorang murid akan lulus atau gagal, tanpa
              pengetahuan itu menjadi penyebab hasil ujiannya.
            </p>
            <button
              onClick={() => {
                setBranch("determinisme-ketetapan");
                setPanelMode("none");
              }}
              className="text-[10px] px-2 py-1 rounded border bg-background hover:bg-muted flex items-center gap-1 font-medium"
            >
              Lihat Jalur E
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
