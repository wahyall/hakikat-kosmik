import { describe, it, expect } from "bun:test";
import { nodeSensitivities, type ConstantId } from "../src/data/fine-tuning-impact";
import { chainNodes } from "../src/data/chain-nodes";
import { fineTuningConstants } from "../src/data/fine-tuning-constants";
import { chainCorrelations } from "../src/data/chain-correlations";
import { simulate, nominalValues } from "../src/lib/flow/simulation";

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

describe("simulate engine", () => {
  it("all-nominal → every node survives and anyChange is false", () => {
    const res = simulate(nominalValues());
    expect(res.anyChange).toBe(false);
    for (const [, o] of res.outcomes) expect(o.status).toBe("survives");
    expect(res.counts.fails).toBe(0);
    expect(res.counts.altered).toBe(0);
    expect(res.firstFailure).toBeNull();
  });

  it("alpha out of range → nucleosynthesis fails directly", () => {
    const v = nominalValues();
    v.alpha = 0.02; // > habitableMax 0.009
    const res = simulate(v);
    const nucleo = res.outcomes.get("a-nucleosynthesis")!;
    expect(nucleo.status).toBe("fails");
    expect(nucleo.dueToConstant).toBe("alpha");
    expect(nucleo.viaCascade).toBeFalsy();
    expect(res.anyChange).toBe(true);
  });

  it("cascade flows old→young: failing nucleosynthesis kills the present", () => {
    const v = nominalValues();
    v.G = 6.674e-9; // > habitableMax 6.674e-10
    const res = simulate(v);
    // a-now has NO direct sensitivity — it can only fail via cascade
    const now = res.outcomes.get("a-now")!;
    expect(now.status).toBe("fails");
    expect(now.viaCascade).toBe(true);
    // the direct hit is upstream (older)
    expect(res.outcomes.get("a-nucleosynthesis")!.viaCascade).toBeFalsy();
  });

  it("firstFailure is the oldest (smallest timeValue) direct hit", () => {
    const v = nominalValues();
    v.alpha = 0.02;
    const res = simulate(v);
    expect(res.firstFailure).not.toBeNull();
    expect(res.firstFailure!.nodeId).toBe("a-nucleosynthesis");
  });

  it("off-nominal but in-range → sensitive node is altered, not failed", () => {
    const v = nominalValues();
    v.alpha = 0.0085; // in [0.006, 0.009] but != nominal 0.00729735
    const res = simulate(v);
    expect(res.outcomes.get("a-recombination")!.status).toBe("altered");
    expect(res.counts.fails).toBe(0);
  });

  it("analogy/thematic correlations do not propagate failure", () => {
    const v = nominalValues();
    v.alpha = 0.02; // kills nucleosynthesis; c-fusion links to it via ANALOGY only
    const res = simulate(v);
    // c-fusion has its OWN alpha-critical sensitivity, so it fails directly — assert
    // that a purely thematic target is unaffected instead:
    // a-first-cause is linked from d-physics via thematic; nothing should force it to fail
    expect(res.outcomes.get("a-first-cause")!.status).toBe("survives");
  });

  it("failedInOrder is sorted by ascending timeValue", () => {
    const v = nominalValues();
    v.alpha = 0.02;
    const res = simulate(v);
    // verify monotonic non-decreasing timeValue
    const tv = new Map(chainNodes.map((n) => [n.id, n.timeValue]));
    for (let i = 1; i < res.failedInOrder.length; i++) {
      expect(tv.get(res.failedInOrder[i])).toBeGreaterThanOrEqual(
        tv.get(res.failedInOrder[i - 1])
      );
    }
  });
});
