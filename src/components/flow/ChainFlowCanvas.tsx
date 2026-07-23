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
import { X, GitCompareArrows } from "lucide-react";

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
  const selectedCorrelationId = useFlowStore((s) => s.selectedCorrelationId);
  const setSelectedCorrelation = useFlowStore((s) => s.setSelectedCorrelation);

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

  // Correlation aktif
  const activeCorrelation = useMemo(() => {
    if (!selectedCorrelationId) return null;
    return chainCorrelations.find((c) => c.id === selectedCorrelationId) ?? null;
  }, [selectedCorrelationId]);

  const nodeLabelMap = useMemo(() => {
    return new Map(nodesData.map((n) => [n.id, n.label]));
  }, []);

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

      let correlationRole: "source" | "target" | null = null;
      if (activeCorrelation) {
        if (n.id === activeCorrelation.source) correlationRole = "source";
        else if (n.id === activeCorrelation.target) correlationRole = "target";
      }

      return {
        ...n,
        isDimmed: !matchesCategory || !matchesSearch,
        isHighlighted: timelineMatch || isTraversalActiveNode,
        isSelected: selectedNodeId === n.id,
        isTraversalActive: isTraversalActiveNode,
        simStatus: simEnabled && sim.anyChange ? sim.outcomes.get(n.id)?.status : undefined,
        showContingency,
        correlationRole,
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
    activeCorrelation,
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
        correlationRole: n.correlationRole,
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
        sourceHandle: "source-bottom",
        targetHandle: "target-top",
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
    const hasSelection = selectedCorrelationId != null || selectedNodeId != null;

    const nodeBranchMap = new Map(nodesData.map((n) => [n.id, n.branch]));

    return chainCorrelations
      .filter((c) => visibleIds.has(c.source) && visibleIds.has(c.target))
      .map((c, idx) => {
        const isSelected = selectedCorrelationId === c.id;
        const isRelatedToSelectedNode =
          selectedNodeId != null && (c.source === selectedNodeId || c.target === selectedNodeId);

        const kindColor = CORRELATION_STYLE[c.kind] ?? "#8b5cf6";

        const sourceBranch = nodeBranchMap.get(c.source) ?? "all";
        const targetBranch = nodeBranchMap.get(c.target) ?? "all";

        let sourceHandle = "source-right";
        let targetHandle = "target-left";

        if (sourceBranch === targetBranch) {
          if (idx % 2 === 0) {
            sourceHandle = "source-left";
            targetHandle = "target-left";
          } else {
            sourceHandle = "source-right";
            targetHandle = "target-right";
          }
        } else if (sourceBranch !== "kosmologis-utama" && targetBranch === "kosmologis-utama") {
          sourceHandle = "source-left";
          targetHandle = "target-right";
        } else if (sourceBranch === "kosmologis-utama" && targetBranch !== "kosmologis-utama") {
          sourceHandle = "source-right";
          targetHandle = "target-left";
        }

        const baseEdgeProps = {
          id: c.id,
          source: c.source,
          target: c.target,
          sourceHandle,
          targetHandle,
          type: "smoothstep",
          pathOptions: { borderRadius: 16 },
        };

        if (isSelected) {
          return {
            ...baseEdgeProps,
            label: c.label,
            animated: true,
            interactionWidth: 25,
            markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: kindColor },
            style: {
              stroke: kindColor,
              strokeWidth: 3.5,
              strokeDasharray: "8 4",
              opacity: 1,
            },
            labelStyle: { fontSize: 11, fontWeight: 700, fill: kindColor },
            labelBgStyle: {
              fill: "var(--background)",
              opacity: 1,
              stroke: kindColor,
              strokeWidth: 1.5,
            },
            zIndex: 100,
          };
        }

        if (isRelatedToSelectedNode) {
          return {
            ...baseEdgeProps,
            label: c.label,
            animated: true,
            interactionWidth: 20,
            markerEnd: { type: MarkerType.Arrow, width: 16, height: 16, color: kindColor },
            style: {
              stroke: kindColor,
              strokeWidth: 2.5,
              strokeDasharray: "6 3",
              opacity: 0.95,
            },
            labelStyle: { fontSize: 10, fontWeight: 600, fill: kindColor },
            labelBgStyle: {
              fill: "var(--background)",
              opacity: 0.9,
              stroke: kindColor,
              strokeWidth: 1,
            },
            zIndex: 40,
          };
        }

        if (hasSelection) {
          return {
            ...baseEdgeProps,
            label: c.label,
            animated: false,
            interactionWidth: 15,
            markerEnd: { type: MarkerType.Arrow, width: 10, height: 10, color: kindColor },
            style: {
              stroke: kindColor,
              strokeWidth: 1,
              strokeDasharray: "4 4",
              opacity: 0.15,
            },
            labelStyle: { fontSize: 8, fill: kindColor, opacity: 0.2 },
            labelBgStyle: { fill: "var(--background)", opacity: 0.2 },
            zIndex: 0,
          };
        }

        return {
          ...baseEdgeProps,
          label: c.label,
          animated: false,
          interactionWidth: 20,
          markerEnd: { type: MarkerType.Arrow, width: 14, height: 14, color: kindColor },
          style: {
            stroke: kindColor,
            strokeWidth: 1.5,
            strokeDasharray: "5 4",
            opacity: 0.85,
          },
          labelStyle: { fontSize: 9, fill: kindColor },
          labelBgStyle: { fill: "var(--background)", opacity: 0.85 },
          zIndex: 5,
        };
      });
  }, [showCorrelations, filteredNodes, selectedCorrelationId, selectedNodeId]);

  // Layout dengan dagre — VERTIKAL (TB)
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(rfNodes, rfEdges, {
      direction: "TB",
      nodeSep: 180,
      rankSep: 140,
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
      if (activeCorrelation && activeCorrelation.source !== node.id && activeCorrelation.target !== node.id) {
        setSelectedCorrelation(null);
      }
    },
    [setSelectedNode, setSelectedCorrelation, activeCorrelation],
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const isCorr = chainCorrelations.some((c) => c.id === edge.id);
      if (isCorr) {
        setSelectedCorrelation(edge.id);
      }
    },
    [setSelectedCorrelation],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedCorrelation(null);
  }, [setSelectedNode, setSelectedCorrelation]);

  // Auto-center camera when a correlation edge is selected
  useEffect(() => {
    if (!selectedCorrelationId) return;
    const corr = chainCorrelations.find((c) => c.id === selectedCorrelationId);
    if (!corr) return;

    const sourceNode = getNode(corr.source);
    const targetNode = getNode(corr.target);

    if (sourceNode && targetNode) {
      const sx = sourceNode.position.x + (sourceNode.measured?.width ?? 200) / 2;
      const sy = sourceNode.position.y + (sourceNode.measured?.height ?? 80) / 2;
      const tx = targetNode.position.x + (targetNode.measured?.width ?? 200) / 2;
      const ty = targetNode.position.y + (targetNode.measured?.height ?? 80) / 2;

      const cx = (sx + tx) / 2;
      const cy = (sy + ty) / 2;
      setCenter(cx, cy, { zoom: 1.1, duration: 600 });
    }
  }, [selectedCorrelationId, getNode, setCenter]);

  // ====================================================================
  // ANIMASI TELUSUR — Effect untuk stepper ~1s per node
  // ====================================================================
  useEffect(() => {
    if (!traversalActive) {
      if (traversalTimerRef.current) {
        clearTimeout(traversalTimerRef.current);
        traversalTimerRef.current = null;
      }
      return;
    }

    if (activeBranch !== "kosmologis-utama" && activeBranch !== "all") {
      setBranch("kosmologis-utama");
    }

    const currentId = TRAVERSAL_SEQUENCE[traversalIndex];
    if (!currentId) {
      stopTraversal();
      return;
    }
    setTraversalNodeId(currentId);
    setSelectedNode(currentId);

    const node = getNode(currentId);
    if (node) {
      const w = node.measured?.width ?? 220;
      const h = node.measured?.height ?? 90;
      const cx = node.position.x + w / 2;
      const cy = node.position.y + h / 2;
      setCenter(cx, cy, { zoom: 1.3, duration: 700 });
    }

    if (traversalIndex < TRAVERSAL_SEQUENCE.length - 1) {
      traversalTimerRef.current = setTimeout(() => {
        setTraversalIndex(traversalIndex + 1);
      }, TRAVERSAL_STEP_MS);
    }

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
    setFocusNode(null);
  }, [focusNodeId, getNode, setCenter, setFocusNode]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      onPaneClick={onPaneClick}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.15, includeHiddenNodes: false }}
      minZoom={0.1}
      maxZoom={2.5}
      proOptions={{ hideAttribution: true }}
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
      />

      {/* Floating detail card untuk Korelasi yang terpilih */}
      {activeCorrelation && (
        <Panel position="top-center" className="!m-3 z-30">
          <div className="bg-background/95 backdrop-blur border-2 border-violet-500/50 rounded-xl p-3 shadow-xl max-w-[420px] w-full space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-start justify-between gap-2 border-b pb-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full text-white shadow-sm"
                  style={{ backgroundColor: CORRELATION_STYLE[activeCorrelation.kind] ?? "#8b5cf6" }}
                >
                  {CORRELATION_LABELS[activeCorrelation.kind]}
                </span>
                <h4 className="text-xs font-bold">{activeCorrelation.label}</h4>
              </div>
              <button
                onClick={() => setSelectedCorrelation(null)}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Tutup detail korelasi"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Connection flow representation */}
            <div className="flex items-center justify-between gap-2 text-[11px] bg-muted/40 p-2 rounded-lg border">
              <button
                onClick={() => {
                  const node = getNode(activeCorrelation.source);
                  if (node) {
                    const cx = node.position.x + (node.measured?.width ?? 200) / 2;
                    const cy = node.position.y + (node.measured?.height ?? 80) / 2;
                    setCenter(cx, cy, { zoom: 1.35, duration: 500 });
                  }
                }}
                className="text-left font-semibold text-violet-700 dark:text-violet-300 hover:underline flex flex-col"
              >
                <span className="text-[9px] uppercase text-muted-foreground font-normal">Akibat (Source)</span>
                {nodeLabelMap.get(activeCorrelation.source) ?? activeCorrelation.source}
              </button>
              <span className="text-muted-foreground font-mono text-xs">➔</span>
              <button
                onClick={() => {
                  const node = getNode(activeCorrelation.target);
                  if (node) {
                    const cx = node.position.x + (node.measured?.width ?? 200) / 2;
                    const cy = node.position.y + (node.measured?.height ?? 80) / 2;
                    setCenter(cx, cy, { zoom: 1.35, duration: 500 });
                  }
                }}
                className="text-right font-semibold text-sky-700 dark:text-sky-300 hover:underline flex flex-col"
              >
                <span className="text-[9px] uppercase text-muted-foreground font-normal">Sebab (Target)</span>
                {nodeLabelMap.get(activeCorrelation.target) ?? activeCorrelation.target}
              </button>
            </div>

            <p className="text-[11px] leading-relaxed text-foreground/90">
              {activeCorrelation.reason}
            </p>

            {activeCorrelation.citation && (
              <p className="text-[9px] text-muted-foreground italic border-t pt-1">
                Sumber: {activeCorrelation.citation}
              </p>
            )}
          </div>
        </Panel>
      )}

      {/* Panel Korelasi & Legend (Bottom Right) */}
      {showCorrelations && (
        <Panel position="bottom-right" className="!m-2 max-w-[260px]">
          <div className="rounded-lg border bg-background/95 backdrop-blur p-2.5 text-[9px] space-y-2 shadow-md">
            <div className="flex items-center justify-between gap-2 border-b pb-1">
              <p className="font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <GitCompareArrows className="w-3 h-3 text-violet-500" />
                Layer Korelasi
              </p>
              {selectedCorrelationId && (
                <button
                  onClick={() => setSelectedCorrelation(null)}
                  className="text-[9px] text-violet-600 dark:text-violet-400 hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Legend warna */}
            <div className="grid grid-cols-2 gap-1 text-[9px]">
              {Object.entries(CORRELATION_STYLE).map(([kind, color]) => (
                <div key={kind} className="flex items-center gap-1.5">
                  <span className="inline-block w-3 border-t-2 border-dashed" style={{ borderColor: color }} />
                  <span>{CORRELATION_LABELS[kind]}</span>
                </div>
              ))}
            </div>

            {/* Daftar korelasi interaktif */}
            <div className="space-y-1 pt-1 border-t max-h-36 overflow-y-auto pr-1">
              <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                Klik garis/item untuk sorot ({chainCorrelations.length}):
              </p>
              {chainCorrelations.map((c) => {
                const isSel = selectedCorrelationId === c.id;
                const color = CORRELATION_STYLE[c.kind] ?? "#8b5cf6";
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCorrelation(isSel ? null : c.id)}
                    className={cn(
                      "w-full text-left p-1 rounded transition-colors flex items-center justify-between gap-1 text-[9px]",
                      isSel
                        ? "bg-violet-500/15 border border-violet-500/50 font-bold text-violet-950 dark:text-violet-100"
                        : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <span className="truncate">
                      <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: color }} />
                      {c.label}
                    </span>
                    <span className="text-[8px] opacity-70 flex-shrink-0 font-mono">
                      {nodeLabelMap.get(c.source)?.slice(0, 10)}...
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Panel>
      )}

      {/* Legend category overlay */}
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

      {/* Traversal progress overlay */}
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
