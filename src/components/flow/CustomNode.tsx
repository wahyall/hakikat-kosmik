"use client";

/**
 * CustomNode.tsx — Node kustom untuk React Flow (layout VERTIKAL).
 *
 * - Warna background border sesuai kategori (CATEGORY_COLORS)
 * - Handle TOP  = target (incoming dari akibat di atas)
 * - Handle BOTTOM = source (outgoing ke sebab di bawah)
 * - Highlight jika: terpilih, ter-highlight timeline, cocok search, atau
 *   sedang aktif di Animasi Telusur (pulse emerald)
 * - Dim jika tidak cocok filter
 * - Badge "F" untuk node filosofis, "B" untuk node boundary
 */

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/lib/flow/layout";
import type { ChainNode } from "@/data/chain-nodes";
import { useFlowStore } from "@/store/flow-store";

export interface ChainNodeData extends Record<string, unknown> {
  node: ChainNode;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
  isTraversalActive?: boolean;
  simStatus?: "survives" | "altered" | "fails";
  correlationRole?: "source" | "target" | null;
}

function CustomNodeImpl({ data, id }: NodeProps) {
  const chainData = data as unknown as ChainNodeData;
  const node = chainData.node;
  const color = CATEGORY_COLORS[node.category];

  const simStatus = chainData.simStatus;
  const simClass =
    simStatus === "fails"
      ? "ring-2 ring-rose-500 saturate-50 opacity-60"
      : simStatus === "altered"
      ? "ring-2 ring-amber-500"
      : "";

  const correlationRole = chainData.correlationRole;

  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);
  const timelineTimeValue = useFlowStore((s) => s.timelineTimeValue);
  const searchQuery = useFlowStore((s) => s.searchQuery);
  const setSelectedNode = useFlowStore((s) => s.setSelectedNode);
  const traversalActive = useFlowStore((s) => s.traversalActive);
  const traversalNodeId = useFlowStore((s) => s.traversalNodeId);

  const isSelected = selectedNodeId === id;
  const isTraversalNode = traversalActive && traversalNodeId === id;

  // Search match?
  const matchesSearch =
    !searchQuery ||
    node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.toLowerCase());

  // Timeline highlight
  let timelineHighlight = false;
  if (timelineTimeValue != null) {
    if (
      Math.abs(
        Math.log10(Math.max(node.timeValue, 1e-50)) -
          Math.log10(Math.max(timelineTimeValue, 1e-50))
      ) < 0.5
    ) {
      timelineHighlight = true;
    }
  }

  const isDimmed = !matchesSearch || chainData.isDimmed;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setSelectedNode(id);
      }}
      className={cn(
        "group relative cursor-pointer rounded-lg border-2 px-3 py-2 transition-all",
        "shadow-sm hover:shadow-md hover:scale-[1.02]",
        "w-[260px] min-h-[80px] flex flex-col justify-between",
        color.bg,
        color.border,
        color.text,
        isDimmed && "opacity-30",
        (isSelected || timelineHighlight) && "ring-2 ring-offset-1 " + color.ring,
        (isSelected || timelineHighlight) && "shadow-md scale-[1.03]",
        correlationRole === "source" && "ring-2 ring-violet-500 shadow-lg shadow-violet-500/20 scale-[1.04] z-10",
        correlationRole === "target" && "ring-2 ring-sky-500 shadow-lg shadow-sky-500/20 scale-[1.04] z-10",
        isTraversalNode &&
          "ring-4 ring-emerald-500 shadow-lg shadow-emerald-500/30 scale-[1.06] z-10 animate-traverse-pulse",
        simClass
      )}
    >
      {/* Handle: TOP = target (incoming dari akibat) */}
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className={cn(
          "!w-2 !h-2 !border",
          isTraversalNode ? "!bg-emerald-500 !border-emerald-700" : "!bg-foreground/50 !border-foreground/30"
        )}
      />
      {/* Handle: BOTTOM = source (outgoing ke sebab) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className={cn(
          "!w-2 !h-2 !border",
          isTraversalNode ? "!bg-emerald-500 !border-emerald-700" : "!bg-foreground/50 !border-foreground/30"
        )}
      />
      {/* Side Handles for Correlations (prevent overlapping nodes) */}
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="!w-1.5 !h-3 !border !bg-violet-500/60 !border-violet-700 opacity-40 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="source-left"
        className="!w-1.5 !h-3 !border !bg-violet-500/60 !border-violet-700 opacity-40 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="target-right"
        className="!w-1.5 !h-3 !border !bg-sky-500/60 !border-sky-700 opacity-40 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="!w-1.5 !h-3 !border !bg-sky-500/60 !border-sky-700 opacity-40 group-hover:opacity-100 transition-opacity"
      />

      {/* Header: label + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={cn("inline-block w-2 h-2 rounded-full flex-shrink-0", color.dot)} />
          <h3 className="text-xs font-semibold leading-tight truncate">
            {node.label}
          </h3>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {correlationRole === "source" && (
            <span className="text-[9px] font-bold bg-violet-600 text-white rounded px-1 py-0.5 shadow-sm">
              Akibat
            </span>
          )}
          {correlationRole === "target" && (
            <span className="text-[9px] font-bold bg-sky-600 text-white rounded px-1 py-0.5 shadow-sm">
              Sebab
            </span>
          )}
          {isTraversalNode && (
            <span className="text-[10px] font-bold bg-emerald-500 text-white rounded px-1 py-0.5 animate-pulse">
              ●
            </span>
          )}
          {node.isPhilosophical && (
            <span className="text-[10px] font-bold bg-yellow-400 text-yellow-950 rounded px-1 py-0.5">
              F
            </span>
          )}
          {node.isBoundary && (
            <span className="text-[10px] font-bold bg-gray-400 text-gray-950 rounded px-1 py-0.5">
              B
            </span>
          )}
          {simStatus === "fails" && (
            <span className="text-[10px] font-bold bg-rose-500 text-white rounded px-1 py-0.5">
              ✕
            </span>
          )}
          {simStatus === "altered" && (
            <span className="text-[10px] font-bold bg-amber-400 text-amber-950 rounded px-1 py-0.5">
              ≈
            </span>
          )}
        </div>
      </div>

      {/* Time label */}
      <p className="text-[10px] opacity-75 mt-1 italic truncate">
        {node.timeLabel}
      </p>

      {/* Hint */}
      <p className="text-[9px] opacity-50 mt-1">
        Klik untuk detail ↓
      </p>
    </div>
  );
}

export const CustomNode = memo(CustomNodeImpl);
