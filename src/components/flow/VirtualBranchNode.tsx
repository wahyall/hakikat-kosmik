"use client";

/**
 * VirtualBranchNode.tsx — nodeType "virtual" untuk React Flow.
 *
 * Kartu dashed/ungu yang jelas menandai node ini HIPOTETIS ("Cabang
 * Alternatif (Simulasi)"), bukan bagian dari rantai sebab-akibat nyata.
 * Konten (label + deskripsi + sumber) dari VirtualNode.
 */

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import type { VirtualNode } from "@/data/virtual-timelines";

export function VirtualBranchNode({ data }: NodeProps) {
  const v = (data as { virtual: VirtualNode }).virtual;
  return (
    <div
      className="rounded-md border-2 border-dashed bg-violet-50/90 dark:bg-violet-950/40 shadow-sm px-3 py-2 w-[240px]"
      style={{ borderColor: "#8b5cf6" }}
    >
      <Handle type="target" position={Position.Top} id="target-top" style={{ opacity: 0 }} />
      <div className="flex items-center gap-1 mb-1">
        <GitBranch className="w-3 h-3 text-violet-600 dark:text-violet-300" />
        <span className="text-[8px] uppercase tracking-wider font-bold text-violet-700 dark:text-violet-300">
          Cabang Alternatif (Simulasi)
        </span>
      </div>
      <p className="text-[11px] font-semibold leading-snug text-violet-950 dark:text-violet-50">
        {v.label}
      </p>
      <p className="text-[10px] leading-relaxed text-violet-900/80 dark:text-violet-100/80 mt-1">
        {v.description}
      </p>
      <p className="text-[8px] italic text-violet-700/70 dark:text-violet-300/70 mt-1">
        {v.source}
      </p>
      <Handle type="source" position={Position.Bottom} id="source-bottom" style={{ opacity: 0 }} />
    </div>
  );
}
