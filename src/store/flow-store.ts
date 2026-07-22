/**
 * flow-store.ts — Zustand store untuk state visualisasi graf.
 *
 * Mengelola:
 * - Branch aktif (A/B/C/D/All)
 * - Node yang dipilih (untuk detail panel)
 * - Query pencarian
 * - Highlight dari timeline scrubber (timeValue terpilih)
 * - Toggle mode "Argumen" (overlay falsafi Islam — DEFAULT ON, kerangka utama situs)
 * - Toggle mode "Perspektif Lain" (panel kritik — DEFAULT OFF, bacaan tambahan opsional)
 * - Kategori yang difilter (per category)
 * - 5 fitur iterasi: GuidedTour, QuranPanel, ReflectionMode, Bookmarks, ExportView
 * - Animasi Telusur (mode presentasi): highlight node satu-per-satu dari
 *   masa kini mundur ke Sebab Pertama dengan delay ~1s per node
 */

import { create } from "zustand";
import type { ChainBranch, ChainCategory } from "@/data/chain-nodes";
import type { ConstantId } from "@/data/fine-tuning-impact";
import { nominalValues } from "@/lib/flow/simulation";

export type ActiveBranch = ChainBranch | "all";

export type PanelMode =
  | "none"
  | "tour"
  | "quran"
  | "reflection"
  | "bookmarks"
  | "export"
  | "glossary"
  | "finetuning";

interface FlowState {
  // Filter & view
  activeBranch: ActiveBranch;
  searchQuery: string;
  activeCategories: Set<ChainCategory>;
  // Selection
  selectedNodeId: string | null;
  // Timeline scrubber
  timelineTimeValue: number | null; // null = tidak ada highlight dari scrubber
  // Toggle modes (overlay utama & panel kritik)
  showArgumentOverlay: boolean; // DEFAULT true — kerangka falsafi Islam
  showPerspectivePanel: boolean; // DEFAULT false — bacaan tambahan opsional
  // Panel mode untuk 5 fitur iterasi (mutually exclusive)
  panelMode: PanelMode;
  // Tour state
  tourStep: number;
  // Animasi Telusur (mode presentasi)
  traversalActive: boolean;
  traversalIndex: number;
  traversalNodeId: string | null;
  // Focus node — ketika user klik tik timeline, set id ini agar canvas
  // otomatis pan/zoom ke node tersebut (consumed sekali, lalu di-clear).
  focusNodeId: string | null;
  // Fine-tuning simulation
  simValues: Record<ConstantId, number>;
  showCorrelations: boolean;
  // Actions
  setBranch: (b: ActiveBranch) => void;
  setSearchQuery: (q: string) => void;
  toggleCategory: (c: ChainCategory) => void;
  setSelectedNode: (id: string | null) => void;
  setTimelineTimeValue: (v: number | null) => void;
  toggleArgumentOverlay: () => void;
  togglePerspectivePanel: () => void;
  setPanelMode: (m: PanelMode) => void;
  setTourStep: (n: number) => void;
  startTraversal: () => void;
  stopTraversal: () => void;
  setTraversalIndex: (i: number) => void;
  setTraversalNodeId: (id: string | null) => void;
  setFocusNode: (id: string | null) => void;
  setSimValue: (id: ConstantId, v: number) => void;
  resetSim: () => void;
  toggleCorrelations: () => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  activeBranch: "all",
  searchQuery: "",
  activeCategories: new Set<ChainCategory>([
    "personal",
    "biologis",
    "geologis",
    "astronomis",
    "partikel",
    "filosofis",
  ]),
  selectedNodeId: null,
  timelineTimeValue: null,
  // Default: Mode Argumen (falsafi Islam) AKTIF sebagai kerangka utama
  showArgumentOverlay: true,
  // Default: Perspektif Lain (kritik) TIDAK aktif — bacaan tambahan opsional
  showPerspectivePanel: false,
  panelMode: "none",
  tourStep: 0,
  // Animasi Telusur — default OFF
  traversalActive: false,
  traversalIndex: 0,
  traversalNodeId: null,
  focusNodeId: null,
  simValues: nominalValues(),
  showCorrelations: false,

  setBranch: (b) =>
    set({ activeBranch: b, selectedNodeId: null, timelineTimeValue: null }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleCategory: (c) =>
    set((state) => {
      const next = new Set(state.activeCategories);
      if (next.has(c)) {
        next.delete(c);
      } else {
        next.add(c);
      }
      // Jangan biarkan kosong
      if (next.size === 0) return state;
      return { activeCategories: next };
    }),
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  setTimelineTimeValue: (v) => set({ timelineTimeValue: v }),
  toggleArgumentOverlay: () =>
    set((s) => ({ showArgumentOverlay: !s.showArgumentOverlay })),
  togglePerspectivePanel: () =>
    set((s) => ({ showPerspectivePanel: !s.showPerspectivePanel })),
  setPanelMode: (m) =>
    set((s) => ({ panelMode: s.panelMode === m ? "none" : m })),
  setTourStep: (n) => set({ tourStep: n }),
  startTraversal: () =>
    set({
      traversalActive: true,
      traversalIndex: 0,
      traversalNodeId: null,
      // Pindah ke Branch A otomatis agar traversal selalu mulai dari rangkaian utuh
      activeBranch: "kosmologis-utama",
      selectedNodeId: null,
      timelineTimeValue: null,
    }),
  stopTraversal: () =>
    set({
      traversalActive: false,
      traversalIndex: 0,
      traversalNodeId: null,
    }),
  setTraversalIndex: (i) => set({ traversalIndex: i }),
  setTraversalNodeId: (id) => set({ traversalNodeId: id }),
  setFocusNode: (id) => set({ focusNodeId: id }),
  setSimValue: (id, v) =>
    set((s) => ({ simValues: { ...s.simValues, [id]: v } })),
  resetSim: () => set({ simValues: nominalValues() }),
  toggleCorrelations: () =>
    set((s) => ({ showCorrelations: !s.showCorrelations })),
}));
