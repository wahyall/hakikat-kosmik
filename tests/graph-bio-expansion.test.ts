import { describe, it, expect } from "bun:test";
import { chainNodes, UNIVERSE_AGE_SECONDS } from "../src/data/chain-nodes";
import { chainEdges } from "../src/data/chain-edges";

const BIO_IDS = [
  "a-goe-oxygenation",
  "a-eukaryogenesis",
  "a-cambrian-explosion",
  "a-tetrapod-transition",
  "a-kpg-extinction",
];

describe("Branch A biological expansion", () => {
  const byId = new Map(chainNodes.map((n) => [n.id, n]));

  it("adds all 5 biological nodes on the kosmologis-utama branch", () => {
    for (const id of BIO_IDS) {
      const n = byId.get(id);
      expect(n).toBeDefined();
      expect(n!.branch).toBe("kosmologis-utama");
      expect(n!.category).toBe("biologis");
      expect(n!.description.length).toBeGreaterThan(0);
      expect((n!.sources?.length ?? 0)).toBeGreaterThan(0);
    }
  });

  it("orders the bio nodes strictly between abiogenesis and homo sapiens", () => {
    const abio = byId.get("a-abiogenesis")!.timeValue;
    const homo = byId.get("a-homo-sapiens")!.timeValue;
    const tvs = BIO_IDS.map((id) => byId.get(id)!.timeValue);
    for (const tv of tvs) {
      expect(tv).toBeGreaterThan(abio);
      expect(tv).toBeLessThan(homo);
    }
    // GOE oldest → K-Pg youngest, strictly increasing
    const sorted = [...tvs].sort((a, b) => a - b);
    expect(tvs).toEqual(sorted);
    expect(new Set(tvs).size).toBe(tvs.length);
  });

  it("rewires the causal chain homo→kpg→tetrapod→cambrian→eukaryo→goe→abiogenesis", () => {
    const has = (source: string, target: string) =>
      chainEdges.some((e) => e.source === source && e.target === target);
    expect(has("a-homo-sapiens", "a-kpg-extinction")).toBe(true);
    expect(has("a-kpg-extinction", "a-tetrapod-transition")).toBe(true);
    expect(has("a-tetrapod-transition", "a-cambrian-explosion")).toBe(true);
    expect(has("a-cambrian-explosion", "a-eukaryogenesis")).toBe(true);
    expect(has("a-eukaryogenesis", "a-goe-oxygenation")).toBe(true);
    expect(has("a-goe-oxygenation", "a-abiogenesis")).toBe(true);
    // old direct shortcut removed
    expect(has("a-homo-sapiens", "a-abiogenesis")).toBe(false);
  });

  it("keeps timeValue helper sane", () => {
    expect(UNIVERSE_AGE_SECONDS).toBeGreaterThan(0);
  });
});
