/**
 * chain-edges.ts
 *
 * Data edge untuk visualisasi graf kausal.
 *
 * Konvensi arah:
 * - source = node AKIBAT (yang ingin dijelaskan)
 * - target = node SEBAB (penjelasannya)
 *
 * Jadi edge "A → B" dibaca: "A disebabkan oleh B" atau "A butuh B sebagai penjelasannya".
 *
 * Dalam React Flow, panah akan mengalir dari akibat ke sebab (kanan → kiri atau atas → bawah),
 * yang sesuai dengan arah telusuran "mundur mencari sebab pertama".
 *
 * label: jenis relasi kausal, untuk ditampilkan di edge.
 */

import type { Edge } from "@xyflow/react";
// Re-export agar konsisten dengan chain-nodes.ts
export type { Edge };

export interface ChainEdge extends Edge {
  /** label jenis relasi kausal */
  causalLabel?: string;
  /** branch edge ini (untuk filter) */
  branch?: "silsilah-manusia" | "kosmologis-utama" | "contoh-hujan" | "contoh-biliar" | "all";
}

export const chainEdges: ChainEdge[] = [
  // ====================================================================
  // BRANCH A: JALUR KOSMOLOGIS UTAMA
  // Arah: dari "masa kini" mundur ke Big Bang, lalu ke Sebab Pertama
  // ====================================================================

  { id: "e-a-now-to-homo", source: "a-now", target: "a-homo-sapiens", causalLabel: "diwarnai oleh kemunculan", branch: "kosmologis-utama" },
  { id: "e-a-homo-to-abiogenesis", source: "a-homo-sapiens", target: "a-abiogenesis", causalLabel: "evolusioner dari", branch: "kosmologis-utama" },
  { id: "e-a-abiogenesis-to-earth", source: "a-abiogenesis", target: "a-earth-formation", causalLabel: "terjadi di", branch: "kosmologis-utama" },
  { id: "e-a-earth-to-solar", source: "a-earth-formation", target: "a-solar-system", causalLabel: "terbentuk dari", branch: "kosmologis-utama" },
  { id: "e-a-solar-to-galaxies", source: "a-solar-system", target: "a-first-galaxies", causalLabel: "unsur beratnya berasal dari", branch: "kosmologis-utama" },
  { id: "e-a-galaxies-to-stars", source: "a-first-galaxies", target: "a-first-stars", causalLabel: "terbentuk setelah", branch: "kosmologis-utama" },
  { id: "e-a-stars-to-recombination", source: "a-first-stars", target: "a-recombination", causalLabel: "dapat muncul setelah", branch: "kosmologis-utama" },
  { id: "e-a-recombination-to-nucleo", source: "a-recombination", target: "a-nucleosynthesis", causalLabel: "membutuhkan atom dari", branch: "kosmologis-utama" },
  { id: "e-a-nucleo-to-lepton", source: "a-nucleosynthesis", target: "a-lepton-epoch", causalLabel: "menggunakan proton-neutron dari", branch: "kosmologis-utama" },
  { id: "e-a-lepton-to-hadron-neutron", source: "a-lepton-epoch", target: "a-hadron-neutron", causalLabel: "mengikuti", branch: "kosmologis-utama" },
  { id: "e-a-hadron-neutron-to-proton", source: "a-hadron-neutron", target: "a-hadron-proton", causalLabel: "menggunakan hadron dari", branch: "kosmologis-utama" },
  { id: "e-a-hadron-proton-to-quark", source: "a-hadron-proton", target: "a-quark-epoch", causalLabel: "konfinemen dari", branch: "kosmologis-utama" },
  { id: "e-a-quark-to-electroweak", source: "a-quark-epoch", target: "a-electroweak", causalLabel: "partikel-partikelnya terbentuk saat", branch: "kosmologis-utama" },
  { id: "e-a-electroweak-to-inflation-reheating", source: "a-electroweak", target: "a-inflation-reheating", causalLabel: "partikelnya terisi ulang oleh", branch: "kosmologis-utama" },
  { id: "e-a-inflation-reheating-to-plateau", source: "a-inflation-reheating", target: "a-inflation-plateau", causalLabel: "mengakhiri", branch: "kosmologis-utama" },
  { id: "e-a-inflation-plateau-to-start", source: "a-inflation-plateau", target: "a-inflation-start", causalLabel: "fase pemuaian dari", branch: "kosmologis-utama" },
  { id: "e-a-inflation-start-to-gut-strong-ew", source: "a-inflation-start", target: "a-gut-strong-ew-split", causalLabel: "dipicu pada akhir", branch: "kosmologis-utama" },
  { id: "e-a-gut-strong-ew-to-grav", source: "a-gut-strong-ew-split", target: "a-gut-grav-split", causalLabel: "fase awal GUT adalah", branch: "kosmologis-utama" },
  { id: "e-a-gut-grav-to-planck", source: "a-gut-grav-split", target: "a-planck-epoch", causalLabel: "terjadi pada akhir", branch: "kosmologis-utama" },
  { id: "e-a-planck-to-bigbang", source: "a-planck-epoch", target: "a-big-bang", causalLabel: "berakar pada", branch: "kosmologis-utama" },
  // Tiga jalur filosofis paralel dari Big Bang → masing-masing rumusan Sebab Pertama
  { id: "e-a-bigbang-to-al-kindi", source: "a-big-bang", target: "a-first-cause-al-kindi", causalLabel: "secara ontologis membutuhkan (Al-Kindi)", branch: "kosmologis-utama" },
  { id: "e-a-bigbang-to-ibn-sina", source: "a-big-bang", target: "a-first-cause-ibn-sina", causalLabel: "secara ontologis membutuhkan (Ibnu Sina)", branch: "kosmologis-utama" },
  { id: "e-a-bigbang-to-al-ghazali", source: "a-big-bang", target: "a-first-cause-al-ghazali", causalLabel: "secara temporal membutuhkan (Al-Ghazali)", branch: "kosmologis-utama" },
  // Konvergensi tiga rumusan → satu Muara (Tauhid Wujud)
  { id: "e-a-al-kindi-to-muara", source: "a-first-cause-al-kindi", target: "a-first-cause", causalLabel: "bermuara pada", branch: "kosmologis-utama" },
  { id: "e-a-ibn-sina-to-muara", source: "a-first-cause-ibn-sina", target: "a-first-cause", causalLabel: "bermuara pada", branch: "kosmologis-utama" },
  { id: "e-a-ghazali-to-muara", source: "a-first-cause-al-ghazali", target: "a-first-cause", causalLabel: "bermuara pada", branch: "kosmologis-utama" },

  // ====================================================================
  // BRANCH B: SILSILAH MANUSIA (menyambung ke a-homo-sapiens di Branch A)
  // ====================================================================

  { id: "e-b-you-to-parents", source: "b-you", target: "b-parents", causalLabel: "dilahirkan oleh", branch: "silsilah-manusia" },
  { id: "e-b-parents-to-grandparents", source: "b-parents", target: "b-grandparents", causalLabel: "dilahirkan oleh", branch: "silsilah-manusia" },
  { id: "e-b-grandparents-to-great", source: "b-grandparents", target: "b-great-grandparents", causalLabel: "dilahirkan oleh", branch: "silsilah-manusia" },
  { id: "e-b-great-to-ancestors", source: "b-great-grandparents", target: "b-ancestors-1000", causalLabel: "keturunan jauh dari", branch: "silsilah-manusia" },
  { id: "e-b-ancestors-to-hominids", source: "b-ancestors-1000", target: "b-early-hominids", causalLabel: "evolusioner dari", branch: "silsilah-manusia" },
  { id: "e-b-hominids-to-maklumat", source: "b-early-hominids", target: "b-maklumat-asabiqah", causalLabel: "evolusi kognitifnya memerlukan", branch: "silsilah-manusia" },
  { id: "e-b-maklumat-to-homo-sapiens", source: "b-maklumat-asabiqah", target: "a-homo-sapiens", causalLabel: "dipenuhi dalam penciptaan", branch: "all" },

  // ====================================================================
  // BRANCH C: CONTOH HUJAN (menyambung ke a-nucleosynthesis di Branch A)
  // ====================================================================

  { id: "e-c-rain-to-condensation", source: "c-rain", target: "c-condensation", causalLabel: "dipicu oleh", branch: "contoh-hujan" },
  { id: "e-c-condensation-to-evap", source: "c-condensation", target: "c-evaporation", causalLabel: "bahan bakunya dari", branch: "contoh-hujan" },
  { id: "e-c-evap-to-sunlight", source: "c-evaporation", target: "c-sunlight", causalLabel: "energinya berasal dari", branch: "contoh-hujan" },
  { id: "e-c-sunlight-to-fusion", source: "c-sunlight", target: "c-fusion", causalLabel: "dihasilkan oleh", branch: "contoh-hujan" },
  { id: "e-c-fusion-to-hydrogen", source: "c-fusion", target: "c-hydrogen-source", causalLabel: "bahan bakunya adalah", branch: "contoh-hujan" },
  { id: "e-c-hydrogen-to-nucleo", source: "c-hydrogen-source", target: "a-nucleosynthesis", causalLabel: "sama dengan", branch: "all" },

  // ====================================================================
  // BRANCH D: CONTOH BOLA BILIAR (rantai self-contained)
  // ====================================================================

  { id: "e-d-balls-to-strike", source: "d-balls-moving", target: "d-cue-strike", causalLabel: "dipicu oleh", branch: "contoh-biliar" },
  { id: "e-d-strike-to-stick", source: "d-cue-strike", target: "d-cue-stick", causalLabel: "didorong oleh", branch: "contoh-biliar" },
  { id: "e-d-stick-to-arm", source: "d-cue-stick", target: "d-arm-motion", causalLabel: "digerakkan oleh", branch: "contoh-biliar" },
  { id: "e-d-arm-to-intention", source: "d-arm-motion", target: "d-intention", causalLabel: "dikendalikan oleh", branch: "contoh-biliar" },
  { id: "e-d-intention-to-physics", source: "d-intention", target: "d-physics", causalLabel: "tunduk pada", branch: "contoh-biliar" },
];

/**
 * Statistik edge:
 * - Total: 43 edge
 * - Branch A: 26 edge (membentang dari masa kini ke 3 node terminal filosofis paralel
 *   + 1 node muara konvergen; dengan sub-node Hadron 2, Inflasi 3, GUT 2)
 * - Branch B: 7 edge (silsilah + node Maklumat Asabiqah + 1 cross-branch ke a-homo-sapiens)
 * - Branch C: 6 edge (hujan + 1 cross-branch ke a-nucleosynthesis)
 * - Branch D: 5 edge (self-contained)
 */
