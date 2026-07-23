/**
 * simulateScenario.ts — mesin skenario preset ("jika kejadian X tidak terjadi").
 *
 * Berbeda dari simulate() yang digerakkan konstanta kontinu, fungsi ini
 * MEMAKSA node tertentu menjadi 'fails' (kejadian historis/diskret), lalu
 * merambatkannya lewat cascade & meringkasnya memakai helper yang sama —
 * sehingga logika cascade/summary tidak terduplikasi.
 *
 * baselineValues boleh menyimpang dari nominal (mis. user sudah menggeser
 * slider), sehingga efek slider + skenario preset bergabung.
 */

import {
  computeDirectHits,
  propagateCascade,
  summarize,
  type NodeOutcome,
  type SimulationResult,
} from "./simulation";
import type { ConstantId } from "@/data/fine-tuning-impact";
import type { WhatIfScenario } from "@/data/what-if-scenarios";

export interface ScenarioSimulationResult extends SimulationResult {
  scenarioId: string;
  triggeredBy: "forced-event";
}

export function simulateScenario(
  scenario: WhatIfScenario,
  baselineValues: Record<ConstantId, number>
): ScenarioSimulationResult {
  // computeDirectHits tidak memutasi baselineValues (hanya membaca) → aman.
  const direct = computeDirectHits(baselineValues);
  for (const nodeId of scenario.forcedFailureNodeIds) {
    const forced: NodeOutcome = { status: "fails", reason: scenario.reason };
    direct.set(nodeId, forced);
  }
  const outcomes = propagateCascade(direct);
  const { firstFailure, failedInOrder, counts } = summarize(outcomes);
  return {
    outcomes,
    firstFailure,
    failedInOrder,
    counts,
    anyChange: true,
    scenarioId: scenario.id,
    triggeredBy: "forced-event",
  };
}
