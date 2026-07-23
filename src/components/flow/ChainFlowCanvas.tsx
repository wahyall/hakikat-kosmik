"use client";

/**
 * ChainFlowCanvas.tsx — Canvas React Flow utama.
 *
 * Menggabungkan: React Flow + dagre auto-layout (VERTIKAL / top-to-bottom) +
 * minimap + zoom control + filter berdasarkan branch/kategori +
 * highlight dari timeline/search/selection + Animasi Telusur (presentasi).
 *
 * Konvensi arah: ATAS (akibat) → BAWAH (sebab).
 * Handle node kustom: TOP = target (incoming dari akibat),
 *                     BOTTOM = source (outgoing ke sebab).
 */

import { useMemo, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  MarkerType,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { chainEdges as edgesData } from "@/data/chain-edges";
import { chainNodes as nodesData } from "@/data/chain-nodes";
import { CustomNode, type ChainNodeData } from "./CustomNode";
import { getLayoutedElements, CATEGORY_COLORS } from "@/lib/flow/layout";
import { useFlowStore } from "@/store/flow-store";
import { cn } from "@/lib/utils";
import { simulate } from "@/lib/flow/simulation";
import { chainCorrelations } from "@/data/chain-correlations";
import { classifyDeterminacy, shouldShowContingencyBadge } from "@/lib/flow/determinacy";
import { nodeSensitivities } from "@/data/fine-tuning-impact";

const nodeTypes = { custom: CustomNode };

/**
 * Urutan telusur (Animasi Telusur) — dari "masa kini" mundur ke Sebab Pertama.
 * Selalu memakai Branch A (jalur kosmologis utama), terlepas dari branch aktif,
 * karena ini adalah rangkaian utuh dari akibat terkini ke sebab pertama.
 */
const TRAVERSAL_SEQUENCE = [
  "a-now",
  "a-homo-sapiens",
  "a-abiogenesis",
  "a-earth-formation",
  "a-solar-system",
  "a-first-galaxies",
  "a-first-stars",
  "a-recombination",
  "a-nucleosynthesis",
  "a-lepton-epoch",
  "a-hadron-neutron",
  "a-hadron-proton",
  "a-quark-epoch",
  "a-electroweak",
  "a-inflation-reheating",
  "a-inflation-plateau",
  "a-inflation-start",
  "a-gut-strong-ew-split",
  "a-gut-grav-split",
  "a-planck-epoch",
  "a-big-bang",
  // Jalur filosofis traversal: Al-Ghazali (paling populer di Kalam).
  // Dua jalur lain (Al-Kindi, Ibnu Sina) dapat dieksplorasi manual via klik node.
  "a-first-cause-al-ghazali",
  "a-first-cause",
];

const TRAVERSAL_STEP_MS = 1100; // ~1 detik per node

// Edge korelasi (Task 7) — cross-cutting, TIDAK ikut layout dagre agar
// tidak mendistorsi susunan vertikal kausal. Digabung setelah layout.
const CORRELATION_STYLE: Record<string, string> = {
  dependency: "#8b5cf6", // violet
  "shared-cause": "#0ea5e9", // sky
  analogy: "#14b8a6", // teal
  thematic: "#f59e0b", // amber
};

const CORRELATION_LABELS: Record<string, string> = {
  dependency: "Dependensi",
  "shared-cause": "Sebab bersama",
  analogy: "Analogi",
  thematic: "Tematik",
};

function FlowInner() {
  const activeBranch = useFlowStore((s) => s.activeBranch);
  const activeCategories = useFlowStore((s) => s.activeCategories);
  const searchQuery = useFlowStore((s) => s.searchQuery);
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);
  const timelineTimeValue = useFlowStore((s) => s.timelineTimeValue);
  const setSelectedNode = useFlowStore((s) => s.setSelectedNode);
  const setBranch = useFlowStore((s) => s.setBranch);
  const simValues = useFlowStore((s) => s.simValues);
  const panelMode = useFlowStore((s) => s.panelMode);
  const showCorrelations = useFlowStore((s) => s.showCorrelations);

  // Traversal state
  const traversalActive = useFlowStore((s) => s.traversalActive);
  const traversalIndex = useFlowStore((s) => s.traversalIndex);
  const traversalNodeId = useFlowStore((s) => s.traversalNodeId);
  const setTraversalIndex = useFlowStore((s) => s.setTraversalIndex);
  const setTraversalNodeId = useFlowStore((s) => s.setTraversalNodeId);
  const stopTraversal = useFlowStore((s) => s.stopTraversal);

  // Focus node (dari klik tik timeline) — pan/zoom ke node tsb lalu clear
  const focusNodeId = useFlowStore((s) => s.focusNodeId);
  const setFocusNode = useFlowStore((s) => s.setFocusNode);

  const { setCenter, getNode } = useReactFlow();
  const traversalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filter node berdasarkan branch aktif
  const filteredNodes = useMemo(() => {
    return nodesData.filter((n) => {
      if (activeBranch === "all") return true;
      if (n.branch === activeBranch) return true;
      return false;
    });
  }, [activeBranch]);

  // Filter edge: tampilkan edge yang source DAN target-nya terlihat
  const filteredEdges = useMemo(() => {
    const visibleIds = new Set(filteredNodes.map((n) => n.id));
    return edgesData.filter((e) => {
      if (activeBranch === "all") {
        return visibleIds.has(e.source) && visibleIds.has(e.target);
      }
      const edgeBranch = e.branch || "all";
      if (edgeBranch === "all") {
        return visibleIds.has(e.source) && visibleIds.has(e.target);
      }
      return (
        edgeBranch === activeBranch &&
        visibleIds.has(e.source) &&
        visibleIds.has(e.target)
      );
    });
  }, [filteredNodes, activeBranch]);

  const simEnabled = panelMode === "finetuning";
  const sim = useMemo(() => simulate(simValues), [simValues]);

  // Hitung dim/active state untuk setiap node
  const decoratedNodes = useMemo(() => {
    return filteredNodes.map((n) => {
      const matchesCategory = activeCategories.has(n.category);
      const matchesSearch =
        !searchQuery ||
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase());

      let timelineMatch = false;
      if (timelineTimeValue != null) {
        const nodeLog = Math.log10(Math.max(n.timeValue, 1e-50));
        const targetLog = Math.log10(Math.max(timelineTimeValue, 1e-50));
        if (Math.abs(nodeLog - targetLog) < 0.5) timelineMatch = true;
      }

      const isTraversalActiveNode = traversalActive && traversalNodeId === n.id;

      const determinacy = classifyDeterminacy(n.id, nodeSensitivities);
      const showContingency = shouldShowContingencyBadge(
        simEnabled,
        sim.anyChange,
        determinacy.label
      );

      return {
        ...n,
        isDimmed: !matchesCategory || !matchesSearch,
        isHighlighted: timelineMatch || isTraversalActiveNode,
        isSelected: selectedNodeId === n.id,
        isTraversalActive: isTraversalActiveNode,
        simStatus: simEnabled && sim.anyChange ? sim.outcomes.get(n.id)?.status : undefined,
        showContingency,
      };
    });
  }, [
    filteredNodes,
    activeCategories,
    searchQuery,
    timelineTimeValue,
    selectedNodeId,
    traversalActive,
    traversalNodeId,
    sim,
    simEnabled,
  ]);

  // Convert ke React Flow node format
  const rfNodes: Node<ChainNodeData>[] = useMemo(() => {
    return decoratedNodes.map((n) => ({
      id: n.id,
      type: "custom",
      position: { x: 0, y: 0 },
      data: {
        node: n,
        simStatus: n.simStatus,
        showContingency: n.showContingency,
      } as unknown as ChainNodeData,
    }));
  }, [decoratedNodes]);

  const rfEdges: Edge[] = useMemo(() => {
    return filteredEdges.map((e) => {
      // Saat traversal aktif, highlight edge yang menghubungkan node traversal saat ini
      // dengan node berikutnya dalam sequence
      const isTraversalEdge =
        traversalActive &&
        traversalIndex < TRAVERSAL_SEQUENCE.length - 1 &&
        e.source === TRAVERSAL_SEQUENCE[traversalIndex] &&
        e.target === TRAVERSAL_SEQUENCE[traversalIndex + 1];
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.causalLabel,
        type: "smoothstep",
        animated: isTraversalEdge,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
        },
        style: {
          stroke: isTraversalEdge ? "#10b981" : "currentColor",
          strokeWidth: isTraversalEdge ? 2.5 : 1.5,
          opacity: isTraversalEdge ? 1 : 0.5,
        },
        labelStyle: {
          fontSize: 10,
          fill: "currentColor",
          opacity: isTraversalEdge ? 1 : 0.7,
        },
        labelBgStyle: {
          fill: "var(--background)",
          opacity: 0.85,
        },
      };
    });
  }, [filteredEdges, traversalActive, traversalIndex]);

  const correlationEdges: Edge[] = useMemo(() => {
    if (!showCorrelations) return [];
    const visibleIds = new Set(filteredNodes.map((n) => n.id));
    return chainCorrelations
      .filter((c) => visibleIds.has(c.source) && visibleIds.has(c.target))
      .map((c) => ({
        id: c.id,
        source: c.source,
        target: c.target,
        label: c.label,
        type: "smoothstep",
        animated: false,
        markerEnd: { type: MarkerType.Arrow, width: 14, height: 14 },
        style: {
          stroke: CORRELATION_STYLE[c.kind] ?? "#8b5cf6",
          strokeWidth: 1.5,
          strokeDasharray: "5 4",
          opacity: 0.85,
        },
        labelStyle: { fontSize: 9, fill: CORRELATION_STYLE[c.kind] ?? "#8b5cf6" },
        labelBgStyle: { fill: "var(--background)", opacity: 0.85 },
        zIndex: 0,
      }));
  }, [showCorrelations, filteredNodes]);

  // Layout dengan dagre — VERTIKAL (TB)
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(rfNodes, rfEdges, {
      direction: "TB",
      nodeSep: 80,
      rankSep: 110,
    });
  }, [rfNodes, rfEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Update state ketika layout berubah
  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges([...layoutedEdges, ...correlationEdges]);
  }, [layoutedNodes, layoutedEdges, correlationEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // ====================================================================
  // ANIMASI TELUSUR — Effect untuk stepper ~1s per node
  // ====================================================================
  // Saat traversalActive true: set traversalNodeId ke node[index],
  // pan/zoom ke node itu, tunggu ~1s, lalu maju ke index+1.
  // Berhenti otomatis di node terakhir (a-first-cause).

  useEffect(() => {
    if (!traversalActive) {
      if (traversalTimerRef.current) {
        clearTimeout(traversalTimerRef.current);
        traversalTimerRef.current = null;
      }
      return;
    }

    // Pastikan branch yang aktif menampilkan Branch A (atau "all"),
    // karena traversal menggunakan node Branch A.
    if (activeBranch !== "kosmologis-utama" && activeBranch !== "all") {
      setBranch("kosmologis-utama");
    }

    const currentId = TRAVERSAL_SEQUENCE[traversalIndex];
    if (!currentId) {
      // Out of bounds → stop
      stopTraversal();
      return;
    }
    setTraversalNodeId(currentId);
    setSelectedNode(currentId);

    // Pan/zoom ke node aktif (centered)
    const node = getNode(currentId);
    if (node) {
      const w = node.measured?.width ?? 220;
      const h = node.measured?.height ?? 90;
      const cx = node.position.x + w / 2;
      const cy = node.position.y + h / 2;
      setCenter(cx, cy, { zoom: 1.3, duration: 700 });
    }

    // Jadwalkan langkah berikutnya
    if (traversalIndex < TRAVERSAL_SEQUENCE.length - 1) {
      traversalTimerRef.current = setTimeout(() => {
        setTraversalIndex(traversalIndex + 1);
      }, TRAVERSAL_STEP_MS);
    }
    // Jika sudah di node terakhir, jangan jadwalkan — biarkan traversalActive
    // tetap true sampai user klik Stop, supaya node terakhir tetap highlighted.

    return () => {
      if (traversalTimerRef.current) {
        clearTimeout(traversalTimerRef.current);
        traversalTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traversalActive, traversalIndex]);

  // Cleanup timer saat unmount
  useEffect(() => {
    return () => {
      if (traversalTimerRef.current) {
        clearTimeout(traversalTimerRef.current);
        traversalTimerRef.current = null;
      }
    };
  }, []);

  // ====================================================================
  // FOCUS NODE — ketika user klik tik timeline, pan/zoom ke node tsb.
  // Consumed sekali lalu di-clear agar tidak re-trigger.
  // ====================================================================
  useEffect(() => {
    if (!focusNodeId) return;
    const node = getNode(focusNodeId);
    if (node) {
      const w = node.measured?.width ?? 220;
      const h = node.measured?.height ?? 90;
      const cx = node.position.x + w / 2;
      const cy = node.position.y + h / 2;
      setCenter(cx, cy, { zoom: 1.25, duration: 600 });
    }
    // Clear agar tidak re-trigger pada re-render berikutnya
    setFocusNode(null);
  }, [focusNodeId, getNode, setCenter, setFocusNode]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.15, includeHiddenNodes: false }}
      minZoom={0.1}
      maxZoom={2.5}
      proOptions={{ hideAttribution: true }}
      // Mobile touch support
      panOnDrag={[0, 1, 2]}
      panOnScroll={false}
      zoomOnPinch={true}
      preventScrolling={true}
      className="bg-muted/10 w-full h-full"
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <Background
        gap={20}
        size={1}
        color="currentColor"
        className="text-muted-foreground/20"
      />
      <Controls
        className="!bg-background !border !border-border !shadow-sm !rounded-md"
        // showInteractive={false}
      />
      {showCorrelations && (
        <Panel position="bottom-right" className="!m-2">
          <div className="rounded-md border bg-background/90 backdrop-blur p-2 text-[9px] space-y-1 shadow-sm">
            <p className="font-bold uppercase tracking-wide text-muted-foreground">Korelasi</p>
            {Object.entries(CORRELATION_STYLE).map(([kind, color]) => (
              <div key={kind} className="flex items-center gap-1">
                <span className="inline-block w-4 border-t-2 border-dashed" style={{ borderColor: color }} />
                {CORRELATION_LABELS[kind]}
              </div>
            ))}
          </div>
        </Panel>
      )}
      {/* <MiniMap
        pannable
        zoomable
        className="!bg-background !border !border-border !rounded-md"
        nodeColor={(node) => {
          const data = node.data as unknown as ChainNodeData;
          if (!data?.node) return "#94a3b8";
          const cat = data.node.category;
          const colorMap: Record<string, string> = {
            personal: "#f59e0b",
            biologis: "#10b981",
            geologis: "#c2410c",
            astronomis: "#8b5cf6",
            partikel: "#06b6d4",
            filosofis: "#eab308",
          };
          return colorMap[cat] || "#94a3b8";
        }}
      /> */}

      {/* Legend overlay — hidden on mobile to save canvas space */}
      <Panel position="top-left" className="!m-2 hidden sm:block">
        <div className="bg-background/95 backdrop-blur border rounded-md p-2 shadow-sm max-w-[180px]">
          <h4 className="text-[10px] font-semibold uppercase tracking-wide mb-1.5">
            Kategori
          </h4>
          <div className="grid grid-cols-2 gap-1">
            {Object.entries(CATEGORY_COLORS).map(([k, v]) => {
              const isActive = activeCategories.has(k as never);
              return (
                <div
                  key={k}
                  className={cn(
                    "flex items-center gap-1 text-[10px] transition-opacity",
                    !isActive && "opacity-30",
                  )}
                >
                  <span
                    className={cn("inline-block w-2 h-2 rounded-full", v.dot)}
                  />
                  {v.label}
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      {/* Statistik overlay */}
      {/* <Panel position="bottom-left" className="!m-2 !ml-14 !mb-4">
        <div className="bg-background/95 backdrop-blur border rounded-md p-2 shadow-sm text-[10px]">
          <div className="flex items-center gap-3">
            <span>
              <strong>{nodes.length}</strong> node
            </span>
            <span className="text-muted-foreground">·</span>
            <span>
              <strong>{edges.length}</strong> relasi
            </span>
          </div>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            Panah mengalir dari <strong>akibat</strong> (atas) → <strong>sebab</strong> (bawah)
          </p>
        </div>
      </Panel> */}

      {/* Traversal progress overlay (hanya saat aktif) */}
      {traversalActive && (
        <Panel position="top-right" className="!m-2">
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 rounded-md p-2 shadow-sm max-w-[220px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">
                Mode Presentasi
              </span>
            </div>
            <p className="text-[10px] text-emerald-900 dark:text-emerald-100">
              Langkah <strong>{traversalIndex + 1}</strong> /{" "}
              {TRAVERSAL_SEQUENCE.length}
            </p>
            <div className="mt-1.5 h-1 w-full bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${((traversalIndex + 1) / TRAVERSAL_SEQUENCE.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </Panel>
      )}
    </ReactFlow>
  );
}

export function ChainFlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowInner />
    </ReactFlowProvider>
  );
}
