import { describe, it, expect } from "bun:test";
import { simulateScenario } from "../src/lib/flow/simulateScenario";
import { nominalValues } from "../src/lib/flow/simulation";
import type { ConstantId } from "../src/data/fine-tuning-impact";

// skenario literal minimal (tidak bergantung pada data Task 3)
const fakeScenario = {
  id: "test-scenario",
  title: "Uji",
  category: "kosmologis" as const,
  description: "",
  forcedFailureNodeIds: ["a-first-stars"],
  reason: "Dipaksa gagal untuk pengujian.",
  source: "test",
  scientificStatus: "mapan" as const,
  hasVirtualTimeline: false,
};

describe("simulateScenario", () => {
  it("forces the named node to fail regardless of nominal sliders", () => {
    const res = simulateScenario(fakeScenario, nominalValues());
    expect(res.outcomes.get("a-first-stars")!.status).toBe("fails");
    expect(res.scenarioId).toBe("test-scenario");
    expect(res.triggeredBy).toBe("forced-event");
    expect(res.anyChange).toBe(true);
  });

  it("cascades forced failure downstream (younger nodes) like a constant hit", () => {
    const res = simulateScenario(fakeScenario, nominalValues());
    // a-first-galaxies depends on a-first-stars → should cascade to fails
    expect(res.outcomes.get("a-first-galaxies")!.status).toBe("fails");
    expect(res.outcomes.get("a-now")!.status).toBe("fails");
    expect(res.outcomes.get("a-now")!.viaCascade).toBe(true);
  });

  it("firstFailure points at the forced node (oldest direct fail)", () => {
    const res = simulateScenario(fakeScenario, nominalValues());
    expect(res.firstFailure).not.toBeNull();
    expect(res.firstFailure!.nodeId).toBe("a-first-stars");
  });

  it("does not mutate the baselineValues passed in", () => {
    const base = nominalValues();
    const snapshot = JSON.stringify(base);
    simulateScenario(fakeScenario, base);
    expect(JSON.stringify(base)).toBe(snapshot);
  });

  it("combines off-nominal sliders with the forced event", () => {
    const v = nominalValues();
    v.alpha = 0.02 as number; // out of range → a-nucleosynthesis fails directly too
    const res = simulateScenario({ ...fakeScenario, forcedFailureNodeIds: ["a-kpg-extinction"] }, v);
    expect(res.outcomes.get("a-nucleosynthesis")!.status).toBe("fails"); // from slider
    expect(res.outcomes.get("a-kpg-extinction")!.status).toBe("fails"); // from forced event
  });

  it("multiple forced nodes all fail", () => {
    const res = simulateScenario(
      { ...fakeScenario, forcedFailureNodeIds: ["a-goe-oxygenation", "h-neolitik"] },
      nominalValues()
    );
    expect(res.outcomes.get("a-goe-oxygenation")!.status).toBe("fails");
    expect(res.outcomes.get("h-neolitik")!.status).toBe("fails");
  });
});
