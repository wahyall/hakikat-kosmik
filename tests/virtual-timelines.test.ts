import { describe, it, expect } from "bun:test";
import { virtualTimelines } from "../src/data/virtual-timelines";
import { whatIfScenarios } from "../src/data/what-if-scenarios";
import { chainNodes } from "../src/data/chain-nodes";

describe("virtualTimelines data integrity", () => {
  const nodeIds = new Set(chainNodes.map((n) => n.id));
  const scenarioById = new Map(whatIfScenarios.map((s) => [s.id, s]));

  it("every timeline maps to an existing scenario flagged hasVirtualTimeline", () => {
    for (const vt of virtualTimelines) {
      const sc = scenarioById.get(vt.scenarioId);
      expect(sc).toBeDefined();
      expect(sc!.hasVirtualTimeline).toBe(true);
    }
  });

  it("every scenario flagged hasVirtualTimeline has exactly one timeline", () => {
    const flagged = whatIfScenarios.filter((s) => s.hasVirtualTimeline).map((s) => s.id).sort();
    const covered = virtualTimelines.map((vt) => vt.scenarioId).sort();
    expect(covered).toEqual(flagged);
  });

  it("branchFromNodeId references an existing node", () => {
    for (const vt of virtualTimelines) expect(nodeIds.has(vt.branchFromNodeId)).toBe(true);
  });

  it("each timeline has >=2 nodes with unique virtual- ids and ordered", () => {
    const allIds = new Set<string>();
    for (const vt of virtualTimelines) {
      expect(vt.nodes.length).toBeGreaterThanOrEqual(2);
      const orders = vt.nodes.map((n) => n.order);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
      for (const n of vt.nodes) {
        expect(n.id.startsWith("virtual-")).toBe(true);
        expect(allIds.has(n.id)).toBe(false);
        allIds.add(n.id);
        expect(n.label.length).toBeGreaterThan(0);
        expect(n.description.length).toBeGreaterThan(0);
        expect(n.source.length).toBeGreaterThan(0);
      }
    }
  });
});
