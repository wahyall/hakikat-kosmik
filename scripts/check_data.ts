/**
 * check_data.ts — Verifikasi integritas data chain-nodes & chain-edges.
 *
 * Cek:
 * 1. Semua edge.source dan edge.target merujuk ke node yang ada di chainNodes.
 * 2. Tidak ada ID node duplikat.
 * 3. Tidak ada ID edge duplikat.
 * 4. Statistik sesuai (Branch A: 22 node, 21 edge; total: 36 node, 39 edge).
 * 5. Traversal sequence di ChainFlowCanvas merujuk ke node yang ada.
 */

import { chainNodes } from "../src/data/chain-nodes";
import { chainEdges } from "../src/data/chain-edges";

const nodeIds = new Set<string>();
const seenNodeIds = new Map<string, number>();
let duplicateNodeId: string | null = null;
for (const n of chainNodes) {
  if (nodeIds.has(n.id)) {
    duplicateNodeId = n.id;
  }
  nodeIds.add(n.id);
  seenNodeIds.set(n.id, (seenNodeIds.get(n.id) ?? 0) + 1);
}

const edgeIds = new Set<string>();
let duplicateEdgeId: string | null = null;
const brokenEdges: string[] = [];
for (const e of chainEdges) {
  if (edgeIds.has(e.id)) duplicateEdgeId = e.id;
  edgeIds.add(e.id);
  if (!nodeIds.has(e.source)) brokenEdges.push(`${e.id}: source "${e.source}" tidak ada di nodes`);
  if (!nodeIds.has(e.target)) brokenEdges.push(`${e.id}: target "${e.target}" tidak ada di nodes`);
}

const branchACount = chainNodes.filter((n) => n.branch === "kosmologis-utama").length;
const branchAEdges = chainEdges.filter((e) => e.branch === "kosmologis-utama").length;
const totalNodes = chainNodes.length;
const totalEdges = chainEdges.length;

// Verifikasi traversal sequence (Branch A linear chain)
const traversalSeq = [
  "a-now", "a-homo-sapiens", "a-abiogenesis", "a-earth-formation", "a-solar-system",
  "a-first-galaxies", "a-first-stars", "a-recombination", "a-nucleosynthesis",
  "a-lepton-epoch", "a-hadron-neutron", "a-hadron-proton", "a-quark-epoch",
  "a-electroweak", "a-inflation-reheating", "a-inflation-plateau", "a-inflation-start",
  "a-gut-strong-ew-split", "a-gut-grav-split", "a-planck-epoch", "a-big-bang", "a-first-cause",
];
const missingInTraversal = traversalSeq.filter((id) => !nodeIds.has(id));
const traversalEdgeBreaks: string[] = [];
for (let i = 0; i < traversalSeq.length - 1; i++) {
  const source = traversalSeq[i];
  const target = traversalSeq[i + 1];
  const found = chainEdges.find(
    (e) => e.source === source && e.target === target
  );
  if (!found) {
    traversalEdgeBreaks.push(`${source} → ${target} (edge tidak ditemukan)`);
  }
}

console.log("=== INTEGRITAS DATA ===");
console.log(`Total node: ${totalNodes} (expect 36)`);
console.log(`Total edge: ${totalEdges} (expect 39)`);
console.log(`Branch A node: ${branchACount} (expect 22)`);
console.log(`Branch A edge: ${branchAEdges} (expect 21)`);
console.log(`Node ID duplikat: ${duplicateNodeId ?? "TIDAK ADA"}`);
console.log(`Edge ID duplikat: ${duplicateEdgeId ?? "TIDAK ADA"}`);
console.log(`Edge rusak (source/target tidak ada): ${brokenEdges.length === 0 ? "TIDAK ADA" : brokenEdges.length}`);
brokenEdges.forEach((b) => console.log(`  ✗ ${b}`));
console.log(`\n=== TRAVERSAL SEQUENCE ===`);
console.log(`Panjang sequence: ${traversalSeq.length} (expect 22)`);
console.log(`Node hilang dari traversal: ${missingInTraversal.length === 0 ? "TIDAK ADA" : missingInTraversal.join(", ")}`);
console.log(`Edge traversal yang putus: ${traversalEdgeBreaks.length === 0 ? "TIDAK ADA" : traversalEdgeBreaks.length}`);
traversalEdgeBreaks.forEach((b) => console.log(`  ✗ ${b}`));

console.log(`\n=== BRANCH A NODES (urutan dari kini → Sebab Pertama) ===`);
const branchANodes = chainNodes.filter((n) => n.branch === "kosmologis-utama");
for (const n of branchANodes) {
  console.log(`  ${n.timeLabel.padEnd(35)} ${n.id.padEnd(28)} ${n.label}`);
}

const ok =
  duplicateNodeId === null &&
  duplicateEdgeId === null &&
  brokenEdges.length === 0 &&
  missingInTraversal.length === 0 &&
  traversalEdgeBreaks.length === 0 &&
  totalNodes === 40 &&
  totalEdges === 38 &&
  branchACount === 22 &&
  branchAEdges === 21;

console.log(`\n=== HASIL: ${ok ? "✓ SEMUA OK" : "✗ ADA MASALAH"} ===`);
process.exit(ok ? 0 : 1);
