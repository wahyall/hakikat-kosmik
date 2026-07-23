/**
 * buildVirtualElements.ts — helper MURNI (tanpa React) untuk mengubah satu
 * VirtualTimeline menjadi node + edge React Flow yang ditempel ke canvas
 * SETELAH layout dagre. Posisi dihitung manual (offset dari node anchor)
 * agar dagre tidak menggeser node asli.
 *
 * Konvensi visual: virtual node bergaya dashed/ungu (di VirtualBranchNode.tsx);
 * edge penghubung juga dashed & ungu, beda tegas dari edge kausal biasa.
 */

import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";
import type { VirtualTimeline } from "@/data/virtual-timelines";

const VIRTUAL_COLOR = "#8b5cf6";
const OFFSET_X = 340; // ke kanan dari anchor
const STEP_Y = 130; // jarak vertikal antar virtual node

export function buildVirtualElements(
  timeline: VirtualTimeline,
  anchorPos: { x: number; y: number }
): { nodes: Node[]; edges: Edge[] } {
  const ordered = [...timeline.nodes].sort((a, b) => a.order - b.order);

  const nodes: Node[] = ordered.map((v, i) => ({
    id: v.id,
    type: "virtual",
    position: { x: anchorPos.x + OFFSET_X, y: anchorPos.y + i * STEP_Y },
    data: { virtual: v },
    draggable: false,
    selectable: true,
  }));

  const dashedStyle = { stroke: VIRTUAL_COLOR, strokeWidth: 2, strokeDasharray: "6 4" };
  const marker = { type: MarkerType.ArrowClosed, width: 14, height: 14, color: VIRTUAL_COLOR };

  const edges: Edge[] = [];
  // anchor → virtual pertama
  edges.push({
    id: `ve-${timeline.branchFromNodeId}-to-${ordered[0].id}`,
    source: timeline.branchFromNodeId,
    target: ordered[0].id,
    type: "smoothstep",
    style: dashedStyle,
    markerEnd: marker,
    zIndex: 20,
  });
  // rantai antar virtual node
  for (let i = 1; i < ordered.length; i++) {
    edges.push({
      id: `ve-${ordered[i - 1].id}-to-${ordered[i].id}`,
      source: ordered[i - 1].id,
      target: ordered[i].id,
      type: "smoothstep",
      style: dashedStyle,
      markerEnd: marker,
      zIndex: 20,
    });
  }

  return { nodes, edges };
}
