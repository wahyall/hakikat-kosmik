"use client";

/**
 * TimelineScrubber.tsx — Skala waktu logaritmik kosmos (horizontal, white-theme simple).
 *
 * Desain minimalis berwarna putih:
 *  - Background putih bersih, garis tipis, tipografi modern
 *  - Hanya titik + label singkat (nama era + waktu) yang tampil permanen
 *  - Tooltip card muncul saat hover dengan info lengkap (suhu + deskripsi)
 *  - Marker aktif disorot dengan accent color sesuai grup era
 *  - Klik marker untuk lompat ke node era di kanvas
 *
 * Saat user klik marker:
 *  1. setTimelineTimeValue(timeValue) — node dgn log-time dekat akan di-highlight
 *  2. setSelectedNode(nodeId)         — buka DetailPanel untuk node tsb
 *  3. setFocusNode(nodeId)            — canvas otomatis pan/zoom ke node tsb
 */

import { useMemo, useState } from "react";
import { useFlowStore } from "@/store/flow-store";
import { chainNodes, UNIVERSE_AGE_SECONDS } from "@/data/chain-nodes";
import { cn } from "@/lib/utils";
import { X, Clock, Thermometer } from "lucide-react";

// Rentang log10: dari -44 (Planck) hingga +18 (masa kini)
const MIN_LOG = -44;
const MAX_LOG = 18;
const RANGE = MAX_LOG - MIN_LOG;

function logScale(value: number): number {
  const v = Math.max(value, 1e-50);
  const log = Math.log10(v);
  return ((log - MIN_LOG) / RANGE) * 100;
}

interface EraMarker {
  id: string;
  nodeId: string;
  eraName: string;
  shortLabel: string; // label singkat di bawah titik (mis. "Planck")
  timeDisplay: string; // angka waktu (mis. "10⁻⁴³ s")
  timeValue: number;
  temperature: string;
  description: string;
  group: "early" | "particle" | "structure" | "present";
}

const YEAR_SEC = 365.25 * 24 * 3600;

const ERA_MARKERS: EraMarker[] = [
  {
    id: "m-planck",
    nodeId: "a-planck-epoch",
    eraName: "Era Planck",
    shortLabel: "Planck",
    timeDisplay: "10⁻⁴³ s",
    timeValue: 1e-43,
    temperature: "~10³² K",
    description:
      "Saat ketika 4 gaya fundamental masih menyatu. Fisika konvensional belum berlaku — batas gravitasi kuantum.",
    group: "early",
  },
  {
    id: "m-inflation",
    nodeId: "a-inflation-start",
    eraName: "Inflasi Kosmik",
    shortLabel: "Inflasi",
    timeDisplay: "10⁻³⁶ s",
    timeValue: 1e-36,
    temperature: "~10²⁷ K",
    description:
      "Pemuaian eksponensial sebesar 10²⁶× dalam <10⁻³² detik. Menjelaskan kenapa alam semesta datar & homogen.",
    group: "early",
  },
  {
    id: "m-electroweak",
    nodeId: "a-electroweak",
    eraName: "Era Elektrolemah",
    shortLabel: "Elektrolemah",
    timeDisplay: "10⁻¹² s",
    timeValue: 1e-12,
    temperature: "~10¹⁵ K",
    description:
      "Medan Higgs memutus simetri — partikel elementer (elektron, quark, boson W/Z) memperoleh massa.",
    group: "early",
  },
  {
    id: "m-hadron",
    nodeId: "a-hadron-proton",
    eraName: "Era Hadron",
    shortLabel: "Hadron",
    timeDisplay: "10⁻⁶ s",
    timeValue: 1e-6,
    temperature: "~10¹² K",
    description:
      "Quark & gluon terkonfinasi menjadi proton & neutron. Terjadi baryogenesis (asimetri materi-antimateri).",
    group: "particle",
  },
  {
    id: "m-lepton",
    nodeId: "a-hadron-neutron",
    eraName: "Era Lepton",
    shortLabel: "Lepton",
    timeDisplay: "1 s",
    timeValue: 1,
    temperature: "~10¹⁰ K",
    description:
      "Rasio proton:neutron membeku pada 7:1. Pasangan elektron-positron musnah, menyisakan elektron.",
    group: "particle",
  },
  {
    id: "m-nucleo",
    nodeId: "a-nucleosynthesis",
    eraName: "Nukleosintesis",
    shortLabel: "Nukleosintesis",
    timeDisplay: "3–20 mnt",
    timeValue: 600,
    temperature: "~10⁹ K",
    description:
      "Proton + neutron membentuk inti ringan: 75% Hidrogen-1, 25% Helium-4, jejak Litium-7.",
    group: "particle",
  },
  {
    id: "m-recomb",
    nodeId: "a-recombination",
    eraName: "Rekombinasi (CMB)",
    shortLabel: "Rekombinasi",
    timeDisplay: "380.000 th",
    timeValue: 380_000 * YEAR_SEC,
    temperature: "~3.000 K",
    description:
      "Elektron bergabung dengan inti → atom netral. Foton bebas untuk pertama kalinya → CMB hari ini.",
    group: "particle",
  },
  {
    id: "m-stars",
    nodeId: "a-first-stars",
    eraName: "Bintang Pertama",
    shortLabel: "Bintang I",
    timeDisplay: "~100 jt th",
    timeValue: 1e8 * YEAR_SEC,
    temperature: "~60 K",
    description:
      "Populasi III menyala dari gas H/He murni. Supernova mereka menyemai alam semesta dgn unsur berat.",
    group: "structure",
  },
  {
    id: "m-solar",
    nodeId: "a-solar-system",
    eraName: "Tata Surya",
    shortLabel: "Tata Surya",
    timeDisplay: "9,2 M th",
    timeValue: UNIVERSE_AGE_SECONDS - 4.6e9 * YEAR_SEC,
    temperature: "~5 K",
    description:
      "Awan molekul runtuh → Matahari & cakram protoplanet. Bumi terbentuk ~4,54 M th lalu.",
    group: "structure",
  },
  {
    id: "m-now",
    nodeId: "a-now",
    eraName: "Masa Kini",
    shortLabel: "Kini",
    timeDisplay: "13,8 M th",
    timeValue: UNIVERSE_AGE_SECONDS,
    temperature: "2,7 K",
    description:
      "Anda di sini. CMB mendingin ke 2,725 K. Kehidupan, kesadaran, dan refleksi filosofis muncul.",
    group: "present",
  },
];

const GROUP_STYLES: Record<
  EraMarker["group"],
  {
    dotActive: string;
    chipText: string;
    cardBorder: string;
    legendColor: string;
  }
> = {
  early: {
    dotActive: "bg-indigo-600 border-indigo-700 ring-4 ring-indigo-100",
    chipText: "text-indigo-700",
    cardBorder: "border-indigo-300",
    legendColor: "bg-indigo-500",
  },
  particle: {
    dotActive: "bg-violet-600 border-violet-700 ring-4 ring-violet-100",
    chipText: "text-violet-700",
    cardBorder: "border-violet-300",
    legendColor: "bg-violet-500",
  },
  structure: {
    dotActive: "bg-amber-600 border-amber-700 ring-4 ring-amber-100",
    chipText: "text-amber-700",
    cardBorder: "border-amber-300",
    legendColor: "bg-amber-500",
  },
  present: {
    dotActive: "bg-emerald-600 border-emerald-700 ring-4 ring-emerald-100",
    chipText: "text-emerald-700",
    cardBorder: "border-emerald-300",
    legendColor: "bg-emerald-500",
  },
};

export function TimelineScrubber() {
  const timelineTimeValue = useFlowStore((s) => s.timelineTimeValue);
  const setTimelineTimeValue = useFlowStore((s) => s.setTimelineTimeValue);
  const setSelectedNode = useFlowStore((s) => s.setSelectedNode);
  const setFocusNode = useFlowStore((s) => s.setFocusNode);
  const setBranch = useFlowStore((s) => s.setBranch);
  const [hoveredState, setHoveredState] = useState<{
    marker: EraMarker;
    rect: DOMRect;
  } | null>(null);

  const activeMarkerId = useMemo(() => {
    if (timelineTimeValue == null) return null;
    const targetLog = Math.log10(Math.max(timelineTimeValue, 1e-50));
    let bestId: string | null = null;
    let bestDist = Infinity;
    for (const m of ERA_MARKERS) {
      const mLog = Math.log10(Math.max(m.timeValue, 1e-50));
      const d = Math.abs(mLog - targetLog);
      if (d < bestDist) {
        bestDist = d;
        bestId = m.id;
      }
    }
    return bestId;
  }, [timelineTimeValue]);

  // Menghitung posisi visual titik (persentase) agar setiap marker memiliki jarak minimal
  const markerPositions = useMemo(() => {
    const minGap = 5.8; // persentase minimum antar marker (mencegah tumpang tindih label & dot)
    const maxAllowed = 97.5;
    const minAllowed = 2.5;

    const rawPos = ERA_MARKERS.map((m) => logScale(m.timeValue));
    const pos = [...rawPos];

    // Forward pass: dorong ke kanan jika terlalu dekat dengan marker sebelumnya
    for (let i = 1; i < pos.length; i++) {
      if (pos[i] - pos[i - 1] < minGap) {
        pos[i] = pos[i - 1] + minGap;
      }
    }

    // Backward pass: jika marker paling kanan melewati maxAllowed, tarik kembali ke kiri
    if (pos[pos.length - 1] > maxAllowed) {
      pos[pos.length - 1] = maxAllowed;
      for (let i = pos.length - 2; i >= 0; i--) {
        if (pos[i + 1] - pos[i] < minGap) {
          pos[i] = pos[i + 1] - minGap;
        }
      }
    }

    // Enforce minAllowed
    if (pos[0] < minAllowed) {
      pos[0] = minAllowed;
      for (let i = 1; i < pos.length; i++) {
        if (pos[i] - pos[i - 1] < minGap) {
          pos[i] = pos[i - 1] + minGap;
        }
      }
    }

    return pos;
  }, []);

  const handleTickClick = (m: EraMarker) => {
    const node = chainNodes.find((n) => n.id === m.nodeId);
    if (node && node.branch !== "kosmologis-utama") {
      setBranch("kosmologis-utama");
    }
    setTimelineTimeValue(m.timeValue);
    setSelectedNode(m.nodeId);
    setFocusNode(m.nodeId);
  };

  const handleReset = () => {
    setTimelineTimeValue(null);
    setSelectedNode(null);
  };

  const isActive = timelineTimeValue != null;

  const groupLegend = [
    { group: "early" as const, label: "Era Awal" },
    { group: "particle" as const, label: "Era Partikel" },
    { group: "structure" as const, label: "Era Struktur" },
    { group: "present" as const, label: "Masa Kini" },
  ];

  const hoveredMarker = hoveredState?.marker ?? null;

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-sm">
      {/* ============ HEADER ============ */}
      <div className="px-4 sm:px-5 pt-2 pb-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-900 text-white flex-shrink-0">
            <Clock className="w-3 h-3" />
          </div>
          <div>
            <h4 className="text-[12px] sm:text-[13px] font-bold tracking-tight text-slate-900 leading-tight">
              Skala Waktu Kosmos
            </h4>
            {hoveredMarker ? (
              <p className="text-[10px] sm:text-[11px] text-slate-700 leading-tight flex items-center gap-1.5 font-medium">
                <span className={cn("font-bold", GROUP_STYLES[hoveredMarker.group].chipText)}>
                  {hoveredMarker.eraName}
                </span>
                <span className="text-slate-400 font-normal">({hoveredMarker.timeDisplay})</span>
                <span className="text-slate-500 font-normal hidden sm:inline">— {hoveredMarker.description}</span>
              </p>
            ) : (
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                <span className="font-mono font-semibold text-slate-700">10⁻⁴³ s</span> (Planck) →{" "}
                <span className="font-mono font-semibold text-slate-700">13,8 M th</span> (Kini) · skala log · hover untuk detail
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2.5">
            {groupLegend.map((g) => (
              <div key={g.group} className="flex items-center gap-1.5">
                <span className={cn("w-2 h-2 rounded-full", GROUP_STYLES[g.group].legendColor)} />
                <span className="text-[10px] text-slate-500 font-medium">{g.label}</span>
              </div>
            ))}
          </div>

          {isActive && (
            <button
              onClick={handleReset}
              title="Reset pilihan"
              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
            >
              <X className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ============ TIMELINE TRACK ============ */}
      <div className="relative px-4 sm:px-5 py-2">
        <div className="relative overflow-hidden pb-1">
          <div className="relative min-w-[760px] h-[64px]">
            {/* Garis utama timeline */}
            <div className="absolute left-0 right-0 h-px bg-slate-300" style={{ top: "14px" }} />

            {/* Minor ticks (setiap orde-of-magnitude) */}
            {Array.from({ length: 63 }, (_, i) => -44 + i).map((log) => {
              const pos = ((log - MIN_LOG) / RANGE) * 100;
              const isMajor = log % 10 === 0;
              return (
                <div
                  key={log}
                  className="absolute -translate-x-1/2"
                  style={{
                    left: `${pos}%`,
                    top: isMajor ? "10px" : "12px",
                    height: isMajor ? "8px" : "4px",
                    width: "1px",
                    background: isMajor ? "rgb(148 163 184)" : "rgb(203 213 225)",
                  }}
                />
              );
            })}

            {/* Era markers (titik + label) */}
            {ERA_MARKERS.map((m, idx) => {
              const pos = markerPositions[idx];
              const isActiveTick = activeMarkerId === m.id;
              const isHovered = hoveredState?.marker.id === m.id;
              const styles = GROUP_STYLES[m.group];

              return (
                <div
                  key={m.id}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${pos}%`, top: 0 }}
                  onMouseEnter={(e) => {
                    const dotBtn = e.currentTarget.querySelector("button");
                    const rect = dotBtn
                      ? dotBtn.getBoundingClientRect()
                      : e.currentTarget.getBoundingClientRect();
                    setHoveredState({ marker: m, rect });
                  }}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <button
                    onClick={() => handleTickClick(m)}
                    title={`${m.eraName} — klik untuk lompat ke node`}
                    className="relative flex flex-col items-center group focus:outline-none"
                  >
                    {/* Dot on the line */}
                    <span
                      className={cn(
                        "rounded-full border-2 transition-all duration-150 group-hover:scale-125",
                        isActiveTick
                          ? styles.dotActive
                          : isHovered
                            ? "bg-slate-700 border-slate-900 scale-125"
                            : "bg-white border-slate-400",
                      )}
                      style={{ width: "12px", height: "12px", marginTop: "8px" }}
                    />
                    {/* Label singkat di bawah */}
                    <span
                      className={cn(
                        "mt-1.5 text-[10px] font-semibold leading-none whitespace-nowrap transition-colors",
                        isActiveTick
                          ? styles.chipText
                          : isHovered
                            ? "text-slate-900 font-bold scale-105"
                            : "text-slate-600",
                      )}
                    >
                      {m.shortLabel}
                    </span>
                    <span className="mt-0.5 text-[9px] font-mono leading-none whitespace-nowrap text-slate-400">
                      {m.timeDisplay}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ ENDPOINT LABELS ============ */}
        <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-mono min-w-[760px]">
          <span>← Big Bang (t = 0)</span>
          <span className="hidden sm:inline text-slate-400">log₁₀(detik): −44 ←→ +18</span>
          <span>Masa Kini (t = 13,8 M th) →</span>
        </div>
      </div>

      {/* ============ FIXED FLOATING TOOLTIP CARD ============ */}
      {hoveredState && (() => {
        const m = hoveredState.marker;
        const styles = GROUP_STYLES[m.group];
        const cardWidth = 220;
        const halfCard = cardWidth / 2;
        const markerCenterX = hoveredState.rect.left + hoveredState.rect.width / 2;
        const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
        
        // Clamp center X so tooltip never clips outside screen
        const clampedCenterX = Math.min(Math.max(markerCenterX, halfCard + 12), viewportWidth - halfCard - 12);
        const arrowOffsetX = markerCenterX - clampedCenterX;

        return (
          <div
            className={cn(
              "fixed z-50 w-[220px] bg-white rounded-lg border-2 shadow-2xl px-3 py-2.5 text-left pointer-events-none transition-opacity duration-150 animate-in fade-in zoom-in-95",
              styles.cardBorder
            )}
            style={{
              left: `${clampedCenterX}px`,
              top: `${hoveredState.rect.top - 8}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            {/* Panah Penunjuk (Arrow) */}
            <div
              className={cn(
                "absolute w-2.5 h-2.5 bg-white border-r-2 border-b-2",
                styles.cardBorder
              )}
              style={{
                bottom: "-6px",
                left: `calc(50% + ${arrowOffsetX}px)`,
                transform: "translateX(-50%) rotate(45deg)",
              }}
            />
            <h5 className={cn("text-[12px] font-bold leading-tight mb-1.5", styles.chipText)}>
              {m.eraName}
            </h5>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-[10px] font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                {m.timeDisplay}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] text-orange-600 font-medium">
                <Thermometer className="w-3 h-3" />
                {m.temperature}
              </span>
            </div>
            <p className="text-[10px] leading-snug text-slate-600">
              {m.description}
            </p>
            <p className="mt-1.5 text-[9px] text-slate-400 italic">
              Klik untuk lompat ke node era ini →
            </p>
          </div>
        );
      })()}
    </div>
  );
}
