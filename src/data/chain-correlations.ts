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
    id: "corr-homo-stars",
    source: "a-homo-sapiens",
    target: "a-first-stars",
    kind: "dependency",
    label: "tersusun dari unsur tempaan",
    reason:
      "Tubuh manusia tersusun dari unsur berat (C, N, O, Fe) yang hanya bisa ditempa di inti & ledakan bintang — 'kita adalah debu bintang'. Link lintas-era (300 ribu vs. 13,4 miliar tahun lalu), bukan edge kausal langsung.",
    citation: "Rees (1999); NASA",
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
    id: "corr-abio-nucleo",
    source: "a-abiogenesis",
    target: "a-nucleosynthesis",
    kind: "dependency",
    label: "unsur penyusunnya dari",
    reason:
      "Molekul kehidupan pertama bergantung pada ketersediaan unsur ringan (H, dan turunannya) yang komposisinya ditetapkan pada nukleosintesis Big Bang. Korelasi lintas-era jarak-jauh, bukan edge parent-child.",
    citation: "Barnes (2012)",
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
    id: "corr-rain-earth",
    source: "c-rain",
    target: "a-earth-formation",
    kind: "dependency",
    label: "siklus airnya butuh",
    reason:
      "Hujan dan siklus air mensyaratkan planet berbatu dengan air permukaan; menghubungkan cabang contoh-hujan ke pembentukan Bumi di cabang kosmologis-utama.",
    citation: "NASA",
    propagatesFailure: true,
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
    id: "corr-you-homo",
    source: "b-you",
    target: "a-homo-sapiens",
    kind: "thematic",
    label: "adalah satu individu dari",
    reason:
      "Pembaca ('Anda') adalah satu individu dari spesies Homo sapiens; menautkan awal cabang silsilah-manusia ke node biologis di cabang kosmologis-utama.",
    citation: "Smithsonian Human Origins",
    propagatesFailure: false,
  },
  {
    id: "corr-f-lauhulmahfuz-sebabpertama",
    source: "f-lauhul-mahfuz",
    target: "a-first-cause",
    kind: "thematic",
    label: "menuntut Yang Mengetahui lebih dulu",
    reason:
      "Ilmu yang mendahului rantai sebab-akibat mengandaikan Wujud yang tidak bergantung pada rantai itu sendiri (Wajib al-Wujud) — menautkan bacaan lauhul mahfuz ke muara Sebab Pertama.",
    citation: "Ibnu Sina, al-Isyarat; SEP: Foreknowledge and Free Will",
    propagatesFailure: false,
  },
];
