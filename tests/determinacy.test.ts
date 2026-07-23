import { describe, it, expect } from "bun:test";
import type { NodeSensitivity } from "../src/data/fine-tuning-impact";
import { nodeSensitivities } from "../src/data/fine-tuning-impact";
import {
  classifyDeterminacy,
  shouldShowContingencyBadge,
} from "../src/lib/flow/determinacy";

describe("classifyDeterminacy", () => {
  it("labels a node with >=1 sensitivity as 'kontingen' and lists its constants", () => {
    const res = classifyDeterminacy("a-nucleosynthesis", nodeSensitivities);
    expect(res.label).toBe("kontingen");
    // a-nucleosynthesis is sensitive to G and alpha
    expect(res.dependsOnConstants).toContain("G");
    expect(res.dependsOnConstants).toContain("alpha");
  });

  it("labels a node with no sensitivity entry as 'netral' with an empty list", () => {
    const res = classifyDeterminacy("a-now", nodeSensitivities);
    expect(res.label).toBe("netral");
    expect(res.dependsOnConstants).toEqual([]);
  });

  it("dedupes repeated constant ids", () => {
    const map: Record<string, NodeSensitivity[]> = {
      x: [
        { constantId: "G", role: "critical", effect: "e", source: "s" },
        { constantId: "G", role: "contributing", effect: "e2", source: "s2" },
      ],
    };
    const res = classifyDeterminacy("x", map);
    expect(res.dependsOnConstants).toEqual(["G"]);
    expect(res.label).toBe("kontingen");
  });

  it("reads ONLY the passed map, not the global nodeSensitivities (no recompute)", () => {
    const map: Record<string, NodeSensitivity[]> = {
      "custom-node": [{ constantId: "Q", role: "critical", effect: "e", source: "s" }],
    };
    // custom id present in passed map → kontingen
    expect(classifyDeterminacy("custom-node", map).label).toBe("kontingen");
    // a real id that IS in the global map but NOT in the passed map → netral,
    // proving the function does not fall back to the global data / simulate().
    expect(classifyDeterminacy("a-nucleosynthesis", map).label).toBe("netral");
  });
});

describe("shouldShowContingencyBadge", () => {
  it("shows only when sim is enabled, something changed, and label is kontingen", () => {
    expect(shouldShowContingencyBadge(true, true, "kontingen")).toBe(true);
  });
  it("hides when nothing changed (slider at nominal)", () => {
    expect(shouldShowContingencyBadge(true, false, "kontingen")).toBe(false);
  });
  it("hides when the fine-tuning panel is closed", () => {
    expect(shouldShowContingencyBadge(false, true, "kontingen")).toBe(false);
  });
  it("hides for netral nodes", () => {
    expect(shouldShowContingencyBadge(true, true, "netral")).toBe(false);
  });
});
