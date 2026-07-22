import { describe, it, expect } from "bun:test";
import { nodeSensitivities, type ConstantId } from "../src/data/fine-tuning-impact";
import { chainNodes } from "../src/data/chain-nodes";
import { fineTuningConstants } from "../src/data/fine-tuning-constants";
import { chainCorrelations } from "../src/data/chain-correlations";

const VALID_CONSTANTS: ConstantId[] = ["alpha", "G", "Lambda", "me-mp", "Q", "dimensions"];

describe("nodeSensitivities data integrity", () => {
  it("references only existing node ids", () => {
    const nodeIds = new Set(chainNodes.map((n) => n.id));
    for (const id of Object.keys(nodeSensitivities)) {
      expect(nodeIds.has(id)).toBe(true);
    }
  });

  it("references only valid constant ids present in fineTuningConstants", () => {
    const constIds = new Set(fineTuningConstants.map((c) => c.id));
    for (const list of Object.values(nodeSensitivities)) {
      for (const s of list) {
        expect(VALID_CONSTANTS).toContain(s.constantId);
        expect(constIds.has(s.constantId)).toBe(true);
      }
    }
  });

  it("every sensitivity has a non-empty effect and source", () => {
    for (const list of Object.values(nodeSensitivities)) {
      for (const s of list) {
        expect(s.effect.length).toBeGreaterThan(0);
        expect(s.source.length).toBeGreaterThan(0);
        expect(["critical", "contributing"]).toContain(s.role);
      }
    }
  });

  it("covers the key cosmological-era nodes", () => {
    for (const id of ["a-nucleosynthesis", "a-recombination", "a-first-stars", "a-abiogenesis"]) {
      expect(nodeSensitivities[id]?.length ?? 0).toBeGreaterThan(0);
    }
  });
});

describe("chainCorrelations data integrity", () => {
  it("references only existing node ids", () => {
    const nodeIds = new Set(chainNodes.map((n) => n.id));
    for (const c of chainCorrelations) {
      expect(nodeIds.has(c.source)).toBe(true);
      expect(nodeIds.has(c.target)).toBe(true);
    }
  });

  it("has unique ids", () => {
    const ids = chainCorrelations.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only dependency-kind correlations propagate failure", () => {
    for (const c of chainCorrelations) {
      expect(c.propagatesFailure).toBe(c.kind === "dependency");
    }
  });

  it("spans multiple branches (cross-branch links exist)", () => {
    const byId = new Map(chainNodes.map((n) => [n.id, n]));
    const crossBranch = chainCorrelations.filter(
      (c) => byId.get(c.source)?.branch !== byId.get(c.target)?.branch
    );
    expect(crossBranch.length).toBeGreaterThan(0);
  });

  it("has between 10 and 15 correlations", () => {
    expect(chainCorrelations.length).toBeGreaterThanOrEqual(10);
    expect(chainCorrelations.length).toBeLessThanOrEqual(15);
  });
});
