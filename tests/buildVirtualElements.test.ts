import { describe, it, expect } from "bun:test";
import { buildVirtualElements } from "../src/lib/flow/buildVirtualElements";
import { virtualTimelines } from "../src/data/virtual-timelines";

const vt = virtualTimelines.find((v) => v.scenarioId === "scenario-no-chicxulub")!;

describe("buildVirtualElements", () => {
  it("produces one RF node per virtual node, all type 'virtual'", () => {
    const { nodes } = buildVirtualElements(vt, { x: 100, y: 200 });
    expect(nodes.length).toBe(vt.nodes.length);
    for (const n of nodes) expect(n.type).toBe("virtual");
  });

  it("uses the virtual node ids and carries the source data", () => {
    const { nodes } = buildVirtualElements(vt, { x: 0, y: 0 });
    expect(nodes.map((n) => n.id)).toEqual(vt.nodes.map((v) => v.id));
    // data.virtual carries the original VirtualNode
    expect((nodes[0].data as { virtual: { id: string } }).virtual.id).toBe(vt.nodes[0].id);
  });

  it("offsets nodes to the side of the anchor, stacked by order", () => {
    const anchor = { x: 500, y: 300 };
    const { nodes } = buildVirtualElements(vt, anchor);
    for (const n of nodes) {
      expect(n.position.x).toBeGreaterThan(anchor.x); // offset ke samping kanan
    }
    // stacked: y strictly increasing with order
    for (let i = 1; i < nodes.length; i++) {
      expect(nodes[i].position.y).toBeGreaterThan(nodes[i - 1].position.y);
    }
  });

  it("connects anchor→first virtual, then chains virtuals; all edges dashed", () => {
    const { edges } = buildVirtualElements(vt, { x: 0, y: 0 });
    expect(edges.length).toBe(vt.nodes.length); // anchor→v0, v0→v1, ...
    expect(edges[0].source).toBe(vt.branchFromNodeId);
    expect(edges[0].target).toBe(vt.nodes[0].id);
    for (const e of edges) {
      expect((e.style as { strokeDasharray?: string }).strokeDasharray).toBeTruthy();
    }
  });

  it("edge and node ids are unique within the result", () => {
    const { nodes, edges } = buildVirtualElements(vt, { x: 0, y: 0 });
    const ids = [...nodes.map((n) => n.id), ...edges.map((e) => e.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });
});
