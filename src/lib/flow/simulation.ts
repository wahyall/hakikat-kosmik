/**
 * simulation.ts — mesin murni "What If?" fine-tuning.
 *
 * Menghitung dampak perubahan konstanta fisika ke seluruh node timeline:
 * status per node (survives/altered/fails) + perambatan (cascade) kegagalan
 * lewat edge kausal + korelasi dependency, plus "titik rantai putus".
 *
 * Bebas React — dapat diuji unit dengan `bun test`.
 *
 * Arah: edge/korelasi "source → target" berarti source (akibat) BERGANTUNG pada
 * target (sebab). Jika target gagal, source ikut gagal (cascade). Karena target
 * selalu lebih tua (waktu lebih kecil), kegagalan merambat dari tua → muda.
 */

import { chainNodes } from "@/data/chain-nodes";
import { chainEdges } from "@/data/chain-edges";
import { fineTuningConstants } from "@/data/fine-tuning-constants";
import { nodeSensitivities, type ConstantId } from "@/data/fine-tuning-impact";
import { chainCorrelations } from "@/data/chain-correlations";

export type NodeStatus = "survives" | "altered" | "fails";

export interface NodeOutcome {
  status: NodeStatus;
  reason: string;
  dueToConstant?: ConstantId;
  /** true jika node gagal karena hulunya gagal (bukan hit langsung) */
  viaCascade?: boolean;
}

export interface SimulationResult {
  outcomes: Map<string, NodeOutcome>;
  firstFailure: { nodeId: string; timeValue: number } | null;
  failedInOrder: string[];
  counts: { survives: number; altered: number; fails: number };
  anyChange: boolean;
}

const CONSTANTS = new Map(fineTuningConstants.map((c) => [c.id as ConstantId, c]));

export function nominalValues(): Record<ConstantId, number> {
  const v = {} as Record<ConstantId, number>;
  for (const c of fineTuningConstants) v[c.id as ConstantId] = c.nominalValue;
  return v;
}

function isOutOfRange(id: ConstantId, value: number): boolean {
  const c = CONSTANTS.get(id);
  if (!c) return false;
  return value < c.habitableMin || value > c.habitableMax;
}

function isOffNominal(id: ConstantId, value: number): boolean {
  const c = CONSTANTS.get(id);
  if (!c) return false;
  // toleransi relatif kecil supaya slider "di nominal" tidak dianggap berubah
  return Math.abs(value - c.nominalValue) / (Math.abs(c.nominalValue) || 1) > 1e-6;
}

export function simulate(values: Record<ConstantId, number>): SimulationResult {
  const anyChange = (Object.keys(values) as ConstantId[]).some((id) =>
    isOffNominal(id, values[id])
  );

  const outcomes = new Map<string, NodeOutcome>();

  // --- Fase 1: direct hit per node ---
  for (const node of chainNodes) {
    const sens = nodeSensitivities[node.id] ?? [];
    let outcome: NodeOutcome = { status: "survives", reason: "Tidak terdampak langsung." };

    // critical + out-of-range → fails
    for (const s of sens) {
      if (s.role === "critical" && isOutOfRange(s.constantId, values[s.constantId])) {
        outcome = {
          status: "fails",
          reason: s.effect,
          dueToConstant: s.constantId,
        };
        break;
      }
    }

    // kalau belum fails, cek altered
    if (outcome.status !== "fails") {
      for (const s of sens) {
        const out = isOutOfRange(s.constantId, values[s.constantId]);
        const off = isOffNominal(s.constantId, values[s.constantId]);
        // contributing yang keluar rentang → berubah (bukan gagal);
        // konstanta apa pun yang off-nominal tapi masih dalam rentang → berubah
        if ((s.role === "contributing" && out) || (off && !out)) {
          outcome = {
            status: "altered",
            reason: s.effect,
            dueToConstant: s.constantId,
          };
          break;
        }
      }
    }

    outcomes.set(node.id, outcome);
  }

  // --- Fase 2: cascade kegagalan (tua → muda) ---
  // Bangun peta prereq: dependent(source) -> daftar prereq(target).
  const prereqs = new Map<string, string[]>();
  const addDep = (source: string, target: string) => {
    if (!prereqs.has(source)) prereqs.set(source, []);
    prereqs.get(source)!.push(target);
  };
  for (const e of chainEdges) addDep(e.source, e.target);
  for (const c of chainCorrelations) if (c.propagatesFailure) addDep(c.source, c.target);

  // Iterasi sampai stabil: node gagal bila salah satu prereq-nya gagal.
  let changed = true;
  while (changed) {
    changed = false;
    for (const [dependent, deps] of prereqs) {
      const cur = outcomes.get(dependent);
      if (!cur || cur.status === "fails") continue;
      const failedDep = deps.find((d) => outcomes.get(d)?.status === "fails");
      if (failedDep) {
        outcomes.set(dependent, {
          status: "fails",
          reason: `Gagal karena prasyaratnya tidak terbentuk: ${failedDep}.`,
          viaCascade: true,
        });
        changed = true;
      }
    }
  }

  // --- Fase 3: ringkasan ---
  const timeById = new Map(chainNodes.map((n) => [n.id, n.timeValue]));
  const failed = chainNodes.filter((n) => outcomes.get(n.id)?.status === "fails");
  const failedInOrder = [...failed]
    .sort((a, b) => a.timeValue - b.timeValue)
    .map((n) => n.id);

  // firstFailure = direct hit paling tua (viaCascade falsy)
  const directFails = failed
    .filter((n) => !outcomes.get(n.id)?.viaCascade)
    .sort((a, b) => a.timeValue - b.timeValue);
  const firstFailure = directFails.length
    ? { nodeId: directFails[0].id, timeValue: directFails[0].timeValue }
    : null;

  const counts = { survives: 0, altered: 0, fails: 0 };
  for (const [, o] of outcomes) counts[o.status]++;

  void timeById;
  return { outcomes, firstFailure, failedInOrder, counts, anyChange };
}
