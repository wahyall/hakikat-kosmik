/**
 * determinacy.ts — layer interpretasi murni di atas mesin Fine-Tuning.
 *
 * Menentukan apakah sebuah node "bergantung pada ketetapan konstanta"
 * (kontingen) atau tidak (netral), MURNI dengan membaca nodeSensitivities yang
 * sudah ada di fine-tuning-impact.ts. TIDAK memanggil simulate() dan TIDAK
 * menyimpan state — ini hanya membaca ulang data yang sudah dihitung.
 *
 * Lihat docs/desain-lauhul-mahfuz-determinisme.md §4a.
 */

import type { ConstantId, NodeSensitivity } from "@/data/fine-tuning-impact";

export type DeterminacyLabel = "kontingen" | "netral";

export interface DeterminacyResult {
  label: DeterminacyLabel;
  /** Konstanta fine-tuning yang menjadi sandaran node ini (kosong = netral). */
  dependsOnConstants: ConstantId[];
}

/**
 * Node "kontingen" bila punya >=1 sensitivitas (critical ATAU contributing)
 * terhadap konstanta fine-tuning; selain itu "netral".
 */
export function classifyDeterminacy(
  nodeId: string,
  sensitivities: Record<string, NodeSensitivity[]>
): DeterminacyResult {
  const list = sensitivities[nodeId] ?? [];
  const dependsOnConstants = [...new Set(list.map((s) => s.constantId))];
  return {
    label: dependsOnConstants.length > 0 ? "kontingen" : "netral",
    dependsOnConstants,
  };
}

/**
 * Gating badge kontingensi: hanya tampil saat panel Fine-Tuning terbuka
 * (simEnabled) DAN minimal satu slider off-nominal (anyChange) DAN node kontingen.
 */
export function shouldShowContingencyBadge(
  simEnabled: boolean,
  anyChange: boolean,
  label: DeterminacyLabel
): boolean {
  return simEnabled && anyChange && label === "kontingen";
}
