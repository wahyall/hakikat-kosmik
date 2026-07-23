import { describe, it, expect } from "bun:test";
import { chainNodes } from "../src/data/chain-nodes";
import { chainEdges } from "../src/data/chain-edges";
import { chainCorrelations } from "../src/data/chain-correlations";

const EXPECTED_F_IDS = [
  "f-pengalaman-memilih",
  "f-pertanyaan-ilusi",
  "f-konstanta-kontingen",
  "f-presisi-butuh-penjelasan",
  "f-determinisme-pra-tertulis",
  "f-lauhul-mahfuz",
  "f-qadar-muallaq",
  "f-qadar-mubram",
  "f-maratib-ilm",
  "f-maratib-kitabah",
  "f-maratib-masyiah",
  "f-maratib-khalq",
  "f-kasb",
  "f-mahw-itsbat",
  "f-barat-boethius",
  "f-barat-molinisme",
  "f-barat-kompatibilisme",
  "f-sintesis",
];

describe("Jalur E (determinisme-ketetapan) data", () => {
  it("adds all 18 f- nodes on the determinisme-ketetapan branch", () => {
    const ids = new Set(chainNodes.map((n) => n.id));
    for (const id of EXPECTED_F_IDS) expect(ids.has(id)).toBe(true);
    const branchNodes = chainNodes.filter((n) => n.branch === "determinisme-ketetapan");
    expect(branchNodes.length).toBe(18);
  });

  it("does not collide with existing d- (biliar) ids", () => {
    // every f- id starts with "f-", and none of the biliar d- ids were overwritten
    expect(chainNodes.some((n) => n.id === "d-physics")).toBe(true);
    for (const id of EXPECTED_F_IDS) expect(id.startsWith("f-")).toBe(true);
  });

  it("keeps all node ids unique after the spread", () => {
    const ids = chainNodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("Jalur E edges reference only existing nodes and carry the branch", () => {
    const ids = new Set(chainNodes.map((n) => n.id));
    const eEdges = chainEdges.filter((e) => e.branch === "determinisme-ketetapan");
    expect(eEdges.length).toBe(19);
    for (const e of eEdges) {
      expect(ids.has(e.source)).toBe(true);
      expect(ids.has(e.target)).toBe(true);
    }
  });

  it("repoints the Sebab Pertama link to the synthesis node", () => {
    const corr = chainCorrelations.find((c) => c.id === "corr-f-sintesis-sebabpertama");
    expect(corr).toBeDefined();
    expect(corr!.source).toBe("f-sintesis");
    expect(corr!.target).toBe("a-first-cause");
    expect(corr!.kind).toBe("thematic");
    expect(corr!.propagatesFailure).toBe(false);
    // old id is gone
    expect(chainCorrelations.find((c) => c.id === "corr-f-lauhulmahfuz-sebabpertama")).toBeUndefined();
  });

  it("adds the fine-tuning tie-in and cross-column parallel correlations", () => {
    const byId = new Map(chainCorrelations.map((c) => [c.id, c]));
    const mubram = byId.get("corr-f-mubram-bigbang");
    expect(mubram).toBeDefined();
    expect(mubram!.source).toBe("f-qadar-mubram");
    expect(mubram!.target).toBe("a-big-bang");
    expect(mubram!.kind).toBe("thematic");

    for (const [id, src, tgt] of [
      ["corr-f-boethius-ilm", "f-barat-boethius", "f-maratib-ilm"],
      ["corr-f-molinisme-kitabah", "f-barat-molinisme", "f-maratib-kitabah"],
      ["corr-f-kompatibilisme-kasb", "f-barat-kompatibilisme", "f-kasb"],
    ] as const) {
      const c = byId.get(id);
      expect(c).toBeDefined();
      expect(c!.source).toBe(src);
      expect(c!.target).toBe(tgt);
      expect(c!.kind).toBe("analogy");
      expect(c!.propagatesFailure).toBe(false);
    }
  });
});
