import { describe, it, expect } from "bun:test";
import { chainNodes } from "../src/data/chain-nodes";
import { chainEdges } from "../src/data/chain-edges";

const H_IDS = ["h-neolitik", "h-tulisan", "h-salamis", "h-mongol-1242", "h-black-death"];

describe("Sejarah Peradaban (sejarah-peradaban) branch", () => {
  const byId = new Map(chainNodes.map((n) => [n.id, n]));

  it("adds all 5 h- nodes on the sejarah-peradaban branch", () => {
    for (const id of H_IDS) {
      const n = byId.get(id);
      expect(n).toBeDefined();
      expect(n!.branch).toBe("sejarah-peradaban");
      expect(n!.description.length).toBeGreaterThan(0);
      expect((n!.sources?.length ?? 0)).toBeGreaterThan(0);
    }
    const branchNodes = chainNodes.filter((n) => n.branch === "sejarah-peradaban");
    expect(branchNodes.length).toBe(5);
  });

  it("keeps all node ids unique after the spread", () => {
    const ids = chainNodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("does not collide with Jalur E f- ids or biliar d- ids", () => {
    for (const id of H_IDS) expect(id.startsWith("h-")).toBe(true);
    expect(chainNodes.some((n) => n.id === "f-sintesis")).toBe(true);
    expect(chainNodes.some((n) => n.id === "d-physics")).toBe(true);
  });

  it("orders nodes oldest(neolitik)→youngest(black-death) by timeValue", () => {
    const tv = (id: string) => byId.get(id)!.timeValue;
    expect(tv("h-neolitik")).toBeLessThan(tv("h-tulisan"));
    expect(tv("h-tulisan")).toBeLessThan(tv("h-salamis"));
    expect(tv("h-salamis")).toBeLessThan(tv("h-mongol-1242"));
    expect(tv("h-mongol-1242")).toBeLessThan(tv("h-black-death"));
    // all after homo sapiens
    expect(tv("h-neolitik")).toBeGreaterThan(byId.get("a-homo-sapiens")!.timeValue);
  });

  it("edges reference only existing nodes, carry the branch, and reach a-homo-sapiens", () => {
    const ids = new Set(chainNodes.map((n) => n.id));
    const hEdges = chainEdges.filter((e) => e.branch === "sejarah-peradaban" || e.id.startsWith("e-h-"));
    expect(hEdges.length).toBeGreaterThanOrEqual(5);
    for (const e of hEdges) {
      expect(ids.has(e.source as string)).toBe(true);
      expect(ids.has(e.target as string)).toBe(true);
    }
    // oldest history node connects into the main graph at homo sapiens
    expect(hEdges.some((e) => e.source === "h-neolitik" && e.target === "a-homo-sapiens")).toBe(true);
  });
});
