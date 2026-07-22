/**
 * layout.ts — Wrapper dagre untuk auto-layout hierarkis.
 *
 * Mengatur node React Flow agar tidak bertumpuk, dengan arah:
 *   ATAS (akibat / efek) → BAWAH (sebab / asal)
 *
 * Konvensi edge kita: source = akibat, target = sebab.
 * Maka di dagre, kita pakai direction "TB" (top-to-bottom) supaya
 * node "akibat" muncul di atas dan "sebab pertama" muncul di bawah.
 */

import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 90;

export interface LayoutOptions {
  direction?: "LR" | "TB";
  nodeSep?: number;
  rankSep?: number;
}

/**
 * Hitung posisi node dengan dagre, return node baru dengan posisi yang sudah dihitung.
 */
export function getLayoutedElements<TNode extends Node, TEdge extends Edge>(
  nodes: TNode[],
  edges: TEdge[],
  options: LayoutOptions = {}
): { nodes: TNode[]; edges: TEdge[] } {
  const { direction = "TB", nodeSep = 60, rankSep = 120 } = options;

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: direction,
    nodesep: nodeSep,
    ranksep: rankSep,
    marginx: 40,
    marginy: 40,
  });

  nodes.forEach((node) => {
    g.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      // React Flow pakai posisi top-left, dagre pakai pusat. Sesuaikan.
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

/**
 * Konstanta kategori → warna (sesuai CSS variable Tailwind).
 * Warna dipilih agar kontras dan bermakna:
 * - personal: warm amber (manusia sehari-hari)
 * - biologis: hijau (kehidupan)
 * - geologis: tan/cokelat (batuan)
 * - astronomis: unggu gelap (bintang/galaksi)
 * - partikel: cyan (subatomik)
 * - filosofis: emas terang (argumen)
 */
export const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; ring: string; dot: string; label: string }> = {
  personal: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-300 dark:border-amber-800",
    text: "text-amber-900 dark:text-amber-100",
    ring: "ring-amber-400",
    dot: "bg-amber-500",
    label: "Personal",
  },
  biologis: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-300 dark:border-emerald-800",
    text: "text-emerald-900 dark:text-emerald-100",
    ring: "ring-emerald-400",
    dot: "bg-emerald-500",
    label: "Biologis",
  },
  geologis: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-300 dark:border-orange-800",
    text: "text-orange-900 dark:text-orange-100",
    ring: "ring-orange-400",
    dot: "bg-orange-700",
    label: "Geologis",
  },
  astronomis: {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-300 dark:border-violet-800",
    text: "text-violet-900 dark:text-violet-100",
    ring: "ring-violet-400",
    dot: "bg-violet-500",
    label: "Astronomis",
  },
  partikel: {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    border: "border-cyan-300 dark:border-cyan-800",
    text: "text-cyan-900 dark:text-cyan-100",
    ring: "ring-cyan-400",
    dot: "bg-cyan-500",
    label: "Partikel",
  },
  filosofis: {
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    border: "border-yellow-300 dark:border-yellow-800",
    text: "text-yellow-900 dark:text-yellow-100",
    ring: "ring-yellow-400",
    dot: "bg-yellow-500",
    label: "Filosofis",
  },
};
