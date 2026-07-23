"use client";

/**
 * FineTuningMode.tsx — "What If?" interactive fine-tuning slider.
 *
 * Pengguna menggeser slider untuk 6 konstanta fisika fundamental (α, G, Λ,
 * mₑ/mₚ, Q, D). UI menampilkan:
 *  - Status habitability real-time (hijau = habitable / merah = steril)
 *  - Konsekuensi spesifik jika konstanta diluar rentang habitable
 *  - Penrose entropy (1/10^(10^123)) sebagai konteks spektakuler
 *  - 3 respons terhadap fine-tuning: Multiverse / Theism / Necessity
 *
 * Tujuan: argumen desain (teleologis) sebagai komplemen argumen kosmologis
 * utama. Fine-tuning tidak membuktikan Allah secara formal, tetapi
 * meningkatkan probabilitas posterior — sejalan dengan QS Al-Mulk:3-4.
 */

import { useMemo } from "react";
import { useFlowStore } from "@/store/flow-store";
import {
  fineTuningConstants,
  penroseEntropy,
  fineTuningResponses,
  type FineTuningConstant,
} from "@/data/fine-tuning-constants";
import { simulate } from "@/lib/flow/simulation";
import type { ConstantId } from "@/data/fine-tuning-impact";
import {
  X,
  SlidersHorizontal,
  FlaskConical,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function FineTuningMode() {
  const panelMode = useFlowStore((s) => s.panelMode);
  const setPanelMode = useFlowStore((s) => s.setPanelMode);
  const values = useFlowStore((s) => s.simValues);
  const setSimValue = useFlowStore((s) => s.setSimValue);
  const resetSim = useFlowStore((s) => s.resetSim);

  const isOpen = panelMode === "finetuning";

  const sim = useMemo(() => simulate(values), [values]);
  const overallStatus = sim.counts.fails === 0;

  if (!isOpen) return null;

  return (
    <div className="absolute inset-y-0 right-0 z-20 w-full sm:w-[560px] bg-background/95 backdrop-blur border-l shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-violet-50 via-amber-50 to-rose-50 dark:from-violet-950/30 dark:via-amber-950/30 dark:to-rose-950/30">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            &ldquo;What If?&rdquo; — Mode Fine-Tuning
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Geser konstanta fisika &rarr; lihat dampak pada kehidupan
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={resetSim}
            className="text-[10px] px-2 py-1 rounded border hover:bg-muted flex items-center gap-1"
            aria-label="Reset ke nilai aktual"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button
            onClick={() => setPanelMode("none")}
            className="p-1.5 rounded hover:bg-muted"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status banner */}
      <div
        className={cn(
          "p-3 border-b text-[11px] leading-relaxed flex items-start gap-2 transition-colors",
          overallStatus
            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
            : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800"
        )}
      >
        {overallStatus ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
        )}
        <div>
          {overallStatus ? (
            <p>
              <strong className="text-emerald-900 dark:text-emerald-100">
                Status: ALAM SEMESTA HABITABLE.
              </strong>{" "}
              Semua konstanta berada dalam rentang yang memungkinkan kehidupan. Inilah yang kita
              amati — pertanyaan filosofis: mengapa?
            </p>
          ) : (
            <p>
              <strong className="text-rose-900 dark:text-rose-100">
                Status: ALAM SEMESTA STERIL.
              </strong>{" "}
              Salah satu atau lebih konstanta di luar rentang habitable. Kehidupan seperti yang kita
              kenal tidak akan muncul.
            </p>
          )}
        </div>
      </div>

      {/* Body — sliders + cards */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-3 space-y-3">
          {fineTuningConstants.map((c) => (
            <ConstantSlider
              key={c.id}
              constant={c}
              value={values[c.id]}
              onChange={(v) => setSimValue(c.id as ConstantId, v)}
            />
          ))}

          {/* Penrose entropy card */}
          <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 p-3 space-y-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <h4 className="text-[11px] font-bold text-amber-800 dark:text-amber-200">
                Entropi Awal Alam Semesta — Penrose (2004)
              </h4>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900 dark:text-amber-100">
              Probabilitas alam semesta dimulai dalam keadaan entropi rendah (yang diperlukan untuk
              panah waktu dan kehidupan):
            </p>
            <p className="text-center text-base font-mono font-bold text-amber-700 dark:text-amber-300 my-1">
              1 banding 10
              <sup style={{ fontSize: "0.7em" }}>10
                <sup style={{ fontSize: "0.8em" }}>123</sup>
              </sup>
            </p>
            <p className="text-[11px] leading-relaxed text-amber-900 dark:text-amber-100">
              {penroseEntropy.description}
            </p>
            <p className="text-[9px] text-muted-foreground italic">{penroseEntropy.source}</p>
          </div>

          {/* Three responses */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground pt-2">
              Tiga Respons terhadap Fine-Tuning
            </h4>
            {fineTuningResponses.map((r) => (
              <div
                key={r.position}
                className="rounded-md bg-foreground/[0.03] border border-border p-2.5 space-y-1"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[11px] font-bold">{r.position}</p>
                  <p className="text-[9px] text-muted-foreground italic">{r.author}</p>
                </div>
                <p className="text-[10px] leading-relaxed">{r.summary}</p>
                <p className="text-[10px] leading-relaxed text-rose-700 dark:text-rose-300">
                  <strong>Problema:</strong> {r.problem}
                </p>
              </div>
            ))}
          </div>

          {/* Closing reflection */}
          <div className="rounded-md bg-foreground text-background p-3 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" />
              <p className="text-[11px] font-bold">Refleksi: Fine-Tuning &amp; Tauhid</p>
            </div>
            <p className="text-[11px] leading-relaxed">
              Fine-tuning BUKAN bukti formal untuk Allah — ia tidak menutup pintu multiverse. Tetapi
              ia meningkatkan probabilitas posterior desain secara dramatis. Bagi tradisi Islam,
              ini sejalan dengan QS Al-Mulk:3-4:{" "}
              <em>
                &ldquo;Yang menciptakan tujuh langit berlapis-lapis. Kamu sekali-kali tidak melihat
                pada ciptaan Yang Maha Pemurah sesuatu yang tidak seimbang.&rdquo;
              </em>{" "}
              Konstanta fisika yang tampak &lsquo;disetel&rsquo; adalah salah satu manifestasi
              ketidakseimbangan-ketidakseimbangan yang tidak ada — keindahan matematis yang mengarah
              pada Yang Maha Mengatur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConstantSlider({
  constant,
  value,
  onChange,
}: {
  constant: FineTuningConstant;
  value: number;
  onChange: (v: number) => void;
}) {
  const isHabitable = value >= constant.habitableMin && value <= constant.habitableMax;

  // Faktor relatif (untuk log mode) atau rasio (untuk linear)
  const relativeFactor = value / constant.nominalValue;
  const factorLabel =
    constant.sliderMode === "log"
      ? relativeFactor >= 100 || relativeFactor <= 0.01
        ? `${relativeFactor.toExponential(2)}×`
        : `${relativeFactor.toFixed(3)}×`
      : relativeFactor >= 10 || relativeFactor <= 0.1
      ? `${relativeFactor.toExponential(2)}×`
      : `${relativeFactor.toFixed(3)}×`;

  const isNominal = Math.abs(value - constant.nominalValue) / constant.nominalValue < 0.001;

  // Slider handler
  const handleSlider = (raw: number) => {
    if (constant.sliderMode === "log") {
      // raw = eksponen (mis. -2 sampai +2); value = nominal * 10^raw
      const v = constant.nominalValue * Math.pow(10, raw);
      onChange(v);
    } else {
      // raw = nilai langsung
      onChange(raw);
    }
  };

  // Nilai slider saat ini (untuk UI)
  const sliderValue =
    constant.sliderMode === "log"
      ? Math.log10(value / constant.nominalValue)
      : value;

  const sliderMin =
    constant.sliderMode === "log" ? constant.logExponentMin : constant.linearMin!;
  const sliderMax =
    constant.sliderMode === "log" ? constant.logExponentMax : constant.linearMax!;

  // Tentukan consequence yang relevan
  let consequence = "";
  if (isNominal) {
    consequence = "Nilai aktual — alam semesta yang kita amati. Habitable untuk kehidupan.";
  } else if (value > constant.habitableMax) {
    consequence = constant.consequenceIfLarger;
  } else if (value < constant.habitableMin) {
    consequence = constant.consequenceIfSmaller;
  } else {
    consequence = "Dalam rentang habitable — kehidupan seperti yang kita kenal mungkin muncul.";
  }

  return (
    <div
      className={cn(
        "rounded-md border p-2.5 space-y-2 transition-colors",
        isHabitable
          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
          : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800"
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-base font-mono font-bold flex-shrink-0">{constant.symbol}</span>
          <span className="text-[11px] font-semibold truncate">{constant.name}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className={cn(
              "text-[9px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded",
              isHabitable
                ? "bg-emerald-500 text-emerald-950"
                : "bg-rose-500 text-rose-950"
            )}
          >
            {isHabitable ? "Habitable" : "Steril"}
          </span>
        </div>
      </div>

      <div className="flex items-baseline justify-between text-[10px] text-muted-foreground">
        <span>
          Nominal: <strong className="text-foreground font-mono">{constant.valueDisplay}</strong>{" "}
          <span className="text-muted-foreground">{constant.unit}</span>
        </span>
        <span>
          Sekarang:{" "}
          <strong className={cn("font-mono", isNominal ? "text-emerald-700 dark:text-emerald-300" : "text-foreground")}>
            {factorLabel}
          </strong>
        </span>
      </div>

      <input
        type="range"
        min={sliderMin}
        max={sliderMax}
        step={constant.sliderMode === "log" ? 0.05 : (sliderMax - sliderMin) / 100}
        value={sliderValue}
        onChange={(e) => handleSlider(parseFloat(e.target.value))}
        className={cn(
          "w-full h-2 rounded-lg appearance-none cursor-pointer",
          isHabitable
            ? "accent-emerald-500"
            : "accent-rose-500"
        )}
      />

      {/* Marker nominal */}
      {constant.sliderMode === "log" && (
        <div className="relative h-1 -mt-1.5 mb-0.5">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between text-[8px] text-muted-foreground">
            <span>
              10^{constant.logExponentMin}×
            </span>
            <span className="text-emerald-700 dark:text-emerald-300 font-bold">1× (aktual)</span>
            <span>
              10^{constant.logExponentMax}×
            </span>
          </div>
        </div>
      )}

      <p
        className={cn(
          "text-[10px] leading-relaxed rounded p-1.5",
          isHabitable
            ? "bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100"
            : "bg-rose-100/50 dark:bg-rose-900/30 text-rose-900 dark:text-rose-100"
        )}
      >
        {consequence}
      </p>

      <p className="text-[9px] text-muted-foreground italic">{constant.source}</p>
    </div>
  );
}
