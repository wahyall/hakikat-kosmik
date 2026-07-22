/**
 * chain-correlations.ts
 *
 * Layer korelasi node↔node DI LUAR edge kausal parent-child (chain-edges.ts).
 * Menghubungkan node lintas-cabang & lintas-era untuk memperkaya simulasi
 * fine-tuning dan menampilkan keterkaitan yang tak tampak di rantai kausal linear.
 *
 * Konvensi arah (sama dengan chain-edges.ts): source = akibat, target = sebab.
 * "source bergantung pada target."
 *
 * kind:
 * - dependency   : source butuh target sebagai prasyarat fisik → MERAMBATKAN kegagalan
 * - shared-cause : keduanya bergantung sebab kosmik yang sama (tidak merambat;
 *                  masing-masing sudah dijaga sensitivitas langsungnya)
 * - analogy      : proses fisik serupa (tidak merambat)
 * - thematic     : kaitan argumentatif/tema (tidak merambat)
 */

export type CorrelationKind = "dependency" | "shared-cause" | "analogy" | "thematic";

export interface ChainCorrelation {
  id: string;
  source: string;
  target: string;
  kind: CorrelationKind;
  /** label singkat untuk edge di canvas */
  label: string;
  /** justifikasi fisis/logis */
  reason: string;
  citation?: string;
  /** hanya true untuk kind "dependency" */
  propagatesFailure: boolean;
}

export const chainCorrelations: ChainCorrelation[] = [
  {
    id: "corr-earth-stars",
    source: "a-earth-formation",
    target: "a-first-stars",
    kind: "dependency",
    label: "butuh unsur berat dari",
    reason:
      "Planet berbatu tersusun dari C, O, Si, Fe yang ditempa di inti & supernova bintang generasi awal.",
    citation: "Rees (1999)",
    propagatesFailure: true,
  },
  {
    id: "corr-solar-stars",
    source: "a-solar-system",
    target: "a-first-stars",
    kind: "dependency",
    label: "menyemai logam dari",
    reason:
      "Matahari & cakram protoplanetnya kaya logam hasil daur ulang bintang generasi sebelumnya.",
    citation: "Rees (1999)",
    propagatesFailure: true,
  },
  {
    id: "corr-stars-recomb",
    source: "a-first-stars",
    target: "a-recombination",
    kind: "dependency",
    label: "awannya runtuh setelah",
    reason:
      "Setelah rekombinasi, gas menjadi netral dan bisa mendingin lalu runtuh gravitasi menjadi bintang pertama.",
    citation: "Rees (1999)",
    propagatesFailure: true,
  },
  {
    id: "corr-sunlight-solar",
    source: "c-sunlight",
    target: "a-solar-system",
    kind: "dependency",
    label: "bersumber dari Matahari di",
    reason: "Cahaya Matahari mensyaratkan terbentuknya Matahari dalam Tata Surya.",
    citation: "NASA",
    propagatesFailure: true,
  },
  {
    id: "corr-evap-earth",
    source: "c-evaporation",
    target: "a-earth-formation",
    kind: "dependency",
    label: "butuh planet berair dari",
    reason: "Penguapan air permukaan mensyaratkan planet berbatu dengan air cair.",
    citation: "NASA",
    propagatesFailure: true,
  },
  {
    id: "corr-hominids-abio",
    source: "b-early-hominids",
    target: "a-abiogenesis",
    kind: "dependency",
    label: "garis hidup berakar pada",
    reason: "Silsilah biologis manusia berakar pada peristiwa asal-usul kehidupan pertama.",
    citation: "UC Berkeley Understanding Evolution",
    propagatesFailure: true,
  },
  {
    id: "corr-homo-abio",
    source: "a-homo-sapiens",
    target: "a-abiogenesis",
    kind: "dependency",
    label: "keturunan jauh dari",
    reason: "Homo sapiens adalah cabang jauh dari pohon kehidupan yang bermula di abiogenesis.",
    citation: "Smithsonian Human Origins",
    propagatesFailure: true,
  },
  {
    id: "corr-fusion-nucleo",
    source: "c-fusion",
    target: "a-nucleosynthesis",
    kind: "analogy",
    label: "fisika fusi serupa dengan",
    reason:
      "Fusi di inti Matahari dan nukleosintesis Big Bang sama-sama fusi nuklir ringan (meski kondisi berbeda).",
    citation: "NASA",
    propagatesFailure: false,
  },
  {
    id: "corr-galaxies-nucleo",
    source: "a-first-galaxies",
    target: "a-nucleosynthesis",
    kind: "shared-cause",
    label: "sama-sama peka konstanta dengan",
    reason:
      "Galaksi & nukleosintesis sama-sama sensitif terhadap keseimbangan G (dan Q) di alam yang sama.",
    citation: "Rees (1999)",
    propagatesFailure: false,
  },
  {
    id: "corr-homo-maklumat",
    source: "a-homo-sapiens",
    target: "b-maklumat-asabiqah",
    kind: "thematic",
    label: "kapasitas berpikirnya adalah",
    reason:
      "Kemunculan kapasitas kognitif Homo sapiens berkaitan tematik dengan syarat berpikir (maklumat asabiqah).",
    citation: "An-Nabhani, Nizham al-Islam",
    propagatesFailure: false,
  },
  {
    id: "corr-physics-firstcause",
    source: "d-physics",
    target: "a-first-cause",
    kind: "thematic",
    label: "sebagai mumkin al-wujud menuju",
    reason:
      "Hukum fisika sendiri bersifat mumkin al-wujud sehingga menuntut Wajib al-Wujud sebagai muara.",
    citation: "Ibnu Sina, al-Isyarat",
    propagatesFailure: false,
  },
  {
    id: "corr-bigbang-ghazali",
    source: "a-big-bang",
    target: "a-first-cause-al-ghazali",
    kind: "thematic",
    label: "huduts-nya menuntut",
    reason:
      "Permulaan alam (huduts) pada Big Bang menuntut muhdits — inti bantahan tasalsul Al-Ghazali.",
    citation: "Al-Ghazali, Tahafut al-Falasifah",
    propagatesFailure: false,
  },
];
