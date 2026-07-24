"use client";

/**
 * ScenarioPicker.tsx — daftar skenario preset "jika kejadian X tidak terjadi",
 * dikelompokkan per kategori. Memilih satu memanggil setActiveScenario(id);
 * memilih ulang yang sama mengosongkannya. Skenario "diperdebatkan" diberi
 * badge eksplisit + reason ditampilkan (rigor data, tidak disembunyikan).
 */

import { whatIfScenarios, type WhatIfScenario } from "@/data/what-if-scenarios";
import { useFlowStore } from "@/store/flow-store";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

const CATEGORY_LABELS: Record<WhatIfScenario["category"], string> = {
  kosmologis: "Kosmologis",
  biologis: "Biologis",
  sejarah: "Sejarah",
};
const CATEGORY_ORDER: WhatIfScenario["category"][] = ["kosmologis", "biologis", "sejarah"];

export function ScenarioPicker() {
  const activeScenarioId = useFlowStore((s) => s.activeScenarioId);
  const setActiveScenario = useFlowStore((s) => s.setActiveScenario);

  return (
    <div className="space-y-2">
      <h4 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground pt-2 flex items-center gap-1.5">
        <Zap className="w-3.5 h-3.5 text-violet-500" />
        Atau, pilih skenario kejadian
      </h4>
      <p className="text-[10px] text-muted-foreground leading-relaxed">
        Alih-alih menggeser konstanta, paksa satu kejadian historis gagal terjadi
        dan lihat rantainya runtuh. Cabang ungu putus-putus = kemungkinan yang tak
        terwujud (hipotetis).
      </p>

      {CATEGORY_ORDER.map((cat) => (
        <div key={cat} className="space-y-1.5">
          <p className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground/80">
            {CATEGORY_LABELS[cat]}
          </p>
          {whatIfScenarios
            .filter((s) => s.category === cat)
            .map((s) => {
              const isActive = activeScenarioId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveScenario(isActive ? null : s.id)}
                  className={cn(
                    "w-full text-left rounded-md border p-2 space-y-1 transition-colors",
                    isActive
                      ? "bg-violet-100 dark:bg-violet-950/50 border-violet-500"
                      : "bg-background hover:bg-muted border-border"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold leading-snug">{s.title}</span>
                    {s.scientificStatus === "diperdebatkan" && (
                      <span className="flex-shrink-0 text-[8px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                        Hipotesis diperdebatkan
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                  {isActive && (
                    <p className="text-[10px] leading-relaxed text-violet-900 dark:text-violet-100 bg-violet-50 dark:bg-violet-900/30 rounded p-1.5 mt-1">
                      {s.reason}
                      <span className="block mt-1 text-[8px] italic text-muted-foreground">
                        Sumber: {s.source}
                      </span>
                    </p>
                  )}
                </button>
              );
            })}
        </div>
      ))}
    </div>
  );
}
