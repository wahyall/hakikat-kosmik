"use client";

/**
 * BranchSwitcher.tsx — Tab/switcher untuk berpindah antar jalur.
 * Pilihan: A (Kosmologis), B (Silsilah), C (Hujan), D (Biliar),
 * E (Determinisme & Ketetapan), All (gabungan).
 */

import { useFlowStore, type ActiveBranch } from "@/store/flow-store";
import { cn } from "@/lib/utils";

interface BranchOption {
  value: ActiveBranch;
  label: string;
  short: string;
  description: string;
}

const OPTIONS: BranchOption[] = [
  {
    value: "kosmologis-utama",
    label: "A. Kosmologis Utama",
    short: "A",
    description: "Masa kini → Big Bang → Sebab Pertama",
  },
  {
    value: "silsilah-manusia",
    label: "B. Silsilah Manusia",
    short: "B",
    description: "Anda → Ortu → ... → Homo sapiens",
  },
  {
    value: "contoh-hujan",
    label: "C. Contoh Hujan",
    short: "C",
    description: "Hujan → Matahari → Fusi → Hidrogen BB",
  },
  {
    value: "contoh-biliar",
    label: "D. Contoh Biliar",
    short: "D",
    description: "Bola → Tongkat → Tangan → Niat → Fisika",
  },
  {
    value: "determinisme-ketetapan",
    label: "E. Determinisme & Ketetapan",
    short: "E",
    description: "Kontingensi konstanta → Lauhul Mahfuz vs determinisme → Sebab Pertama",
  },
  {
    value: "all",
    label: "Semua Jalur",
    short: "★",
    description: "Gabungan A+B+C+D dengan titik pertemuan",
  },
];

export function BranchSwitcher() {
  const activeBranch = useFlowStore((s) => s.activeBranch);
  const setBranch = useFlowStore((s) => s.setBranch);

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setBranch(opt.value)}
          title={opt.description}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all border",
            "flex items-center gap-1.5",
            activeBranch === opt.value
              ? "bg-foreground text-background border-foreground shadow-sm"
              : "bg-background hover:bg-muted border-border text-foreground/80"
          )}
        >
          <span
            className={cn(
              "inline-flex items-center justify-center w-4 h-4 rounded text-[10px] font-bold",
              activeBranch === opt.value
                ? "bg-background text-foreground"
                : "bg-muted-foreground/15 text-foreground/70"
            )}
          >
            {opt.short}
          </span>
          <span className="hidden sm:inline">{opt.label}</span>
          <span className="sm:hidden">{opt.label.replace(/^[A-Z]★?\.\s*/, "")}</span>
        </button>
      ))}
    </div>
  );
}
