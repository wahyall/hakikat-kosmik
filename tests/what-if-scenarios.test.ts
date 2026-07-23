import { describe, it, expect } from "bun:test";
import { whatIfScenarios } from "../src/data/what-if-scenarios";
import { chainNodes } from "../src/data/chain-nodes";

describe("whatIfScenarios data integrity", () => {
  const nodeIds = new Set(chainNodes.map((n) => n.id));

  it("has 15 scenarios, 5 per category", () => {
    expect(whatIfScenarios.length).toBe(15);
    for (const cat of ["kosmologis", "biologis", "sejarah"] as const) {
      expect(whatIfScenarios.filter((s) => s.category === cat).length).toBe(5);
    }
  });

  it("has unique ids", () => {
    const ids = whatIfScenarios.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every forcedFailureNodeId references an existing chain node", () => {
    for (const s of whatIfScenarios) {
      expect(s.forcedFailureNodeIds.length).toBeGreaterThan(0);
      for (const id of s.forcedFailureNodeIds) expect(nodeIds.has(id)).toBe(true);
    }
  });

  it("every scenario has non-empty title/description/reason/source and valid status", () => {
    for (const s of whatIfScenarios) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.description.length).toBeGreaterThan(0);
      expect(s.reason.length).toBeGreaterThan(0);
      expect(s.source.length).toBeGreaterThan(0);
      expect(["mapan", "diperdebatkan"]).toContain(s.scientificStatus);
      expect(typeof s.hasVirtualTimeline).toBe("boolean");
    }
  });
});
