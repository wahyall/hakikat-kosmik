import { describe, it, expect } from "bun:test";
import { nodeSensitivities, type ConstantId } from "../src/data/fine-tuning-impact";
import { chainNodes } from "../src/data/chain-nodes";
import { fineTuningConstants } from "../src/data/fine-tuning-constants";

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
