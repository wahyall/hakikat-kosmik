/**
 * civilization-nodes.ts
 *
 * Cabang F "Sejarah Peradaban" — rangkaian tonggak peradaban manusia yang
 * menjadi anchor untuk skenario "what-if" historis (Plan 2).
 *
 * Watak rantai ini adalah SUBSTRAT-PERADABAN: tiap tahap berpijak pada
 * kapasitas yang dibangun tahap sebelumnya (bukan kausalitas fisik ketat
 * seperti Branch A/C/D). Konsisten dgn gaya telusur-mundur app.
 *
 * Metodologi counterfactual mengikuti syarat Ferguson (Virtual History, 1997):
 * dua node yang lolos uji "benar-benar dipertimbangkan orang sezaman" (Salamis,
 * Mongol 1242) vs. tiga yang bersifat prasyarat struktural (Neolitik, tulisan,
 * Maut Hitam) — dinyatakan jujur di deskripsi.
 *
 * Sumber: lihat docs/riset-skenario-virtual-timeline.md §3.
 */

import type { ChainNode } from "./chain-nodes";
import type { ChainEdge } from "./chain-edges";

const UNIVERSE_AGE_SECONDS = 4.355e17;
const SEC_PER_YEAR = 365.25 * 24 * 3600;
const yearsAgo = (y: number) => UNIVERSE_AGE_SECONDS - y * SEC_PER_YEAR;

export const civilizationNodes: ChainNode[] = [
  {
    id: "h-neolitik",
    label: "Revolusi Pertanian Neolitik",
    category: "personal",
    timeLabel: "~12.000 tahun lalu",
    timeValue: yearsAgo(12_000),
    description:
      "Transisi ke pertanian menetap dan domestikasi tanaman/hewan (~10.000 SM), muncul secara independen di beberapa pusat dunia. Ia menjadi prasyarat surplus pangan, kota, negara, dan tulisan. Karena muncul independen di banyak tempat, banyak sejarawan memandangnya nyaris-konvergen (terkondisikan lingkungan), bukan titik cabang rapuh — sebuah prasyarat struktural, bukan pilihan yang dipertimbangkan sezaman.",
    sources: ["Diamond, Guns, Germs, and Steel (1997)"],
    branch: "sejarah-peradaban",
  },
  {
    id: "h-tulisan",
    label: "Penemuan Tulisan",
    category: "personal",
    timeLabel: "~5.200 tahun lalu (Sumeria ~3200 SM)",
    timeValue: yearsAgo(5_200),
    description:
      "Sistem tulisan penuh pertama muncul di Sumeria (~3200 SM) dari kebutuhan administrasi surplus Neolitik. Tulisan tidak menciptakan pewarisan maklumat sabiqah — tradisi lisan sudah melakukannya — melainkan meningkatkan bandwidth, fidelitas, dan daya tahannya lintas generasi. Ditemukan independen sedikitnya tiga kali (Mesopotamia, Cina, Mesoamerika), sehingga tergolong robust; tesis kuat 'literasi merestruktur kognisi' sendiri diperdebatkan.",
    sources: [
      "Schmandt-Besserat, Before Writing",
      "Goody & Watt, 'The Consequences of Literacy' (1963)",
    ],
    branch: "sejarah-peradaban",
  },
  {
    id: "h-salamis",
    label: "Pertempuran Salamis (480 SM)",
    category: "personal",
    timeLabel: "480 SM (~2.500 tahun lalu)",
    timeValue: yearsAgo(2_505),
    description:
      "Kemenangan angkatan laut Yunani atas armada Xerxes di selat Salamis. Orang sezaman (Herodotus) membingkai perang ini eksplisit sebagai kelangsungan vs. penaklukan — sehingga lolos syarat Ferguson (alternatifnya dipertimbangkan saat itu). Namun tesis 'Salamis menyelamatkan Peradaban Barat' dikritik teleologis/Eurosentris: Persia umumnya memerintah lewat elite lokal, jadi signifikansinya diperdebatkan.",
    sources: ["Herodotus, Histories", "Strauss, The Battle of Salamis (2004)"],
    branch: "sejarah-peradaban",
  },
  {
    id: "h-mongol-1242",
    label: "Mundurnya Mongol dari Eropa (1242)",
    category: "personal",
    timeLabel: "1242 M",
    timeValue: yearsAgo(784),
    description:
      "Setelah menghancurkan pasukan Hungaria dan Polandia (1241), tentara Mongol menarik diri dari Eropa Tengah pada 1242. Orang sezaman lintas Kristendom — terdokumentasi oleh Matthew Paris — benar-benar mengira penaklukan sudah di ambang, sehingga skenario ini lolos syarat Ferguson dengan bersih. Sebab mundurnya diperdebatkan (kematian Ögedei Khan vs. jeda strategis vs. iklim basah); hindari narasi kausa-tunggal.",
    sources: [
      "Jackson, The Mongols and the West (2005)",
      "Matthew Paris, Chronica Majora",
      "Büntgen et al., Sci. Rep. 6:25606 (2016)",
    ],
    branch: "sejarah-peradaban",
  },
  {
    id: "h-black-death",
    label: "Maut Hitam (1347–1351)",
    category: "personal",
    timeLabel: "1347–1351 M",
    timeValue: yearsAgo(678),
    description:
      "Pandemi wabah yang menewaskan diperkirakan sepertiga populasi Eropa, masuk lewat jaringan perdagangan Eurasia. Kelangkaan buruh menaikkan upah riil dan (menurut Allen) memberi insentif teknologi hemat-tenaga yang berkontribusi pada kondisi Revolusi Industri. Sebagai guncangan eksogen ia gagal syarat Ferguson (bukan pilihan yang dipertimbangkan sezaman); rantai Maut-Hitam→Revolusi-Industri juga diperdebatkan.",
    sources: [
      "McNeill, Plagues and Peoples (1976)",
      "Allen, The British Industrial Revolution in Global Perspective (2009)",
    ],
    branch: "sejarah-peradaban",
  },
];

export const civilizationEdges: ChainEdge[] = [
  { id: "e-h-blackdeath-to-mongol", source: "h-black-death", target: "h-mongol-1242", causalLabel: "berpijak pada tatanan Eurasia pasca-", branch: "sejarah-peradaban" },
  { id: "e-h-mongol-to-salamis", source: "h-mongol-1242", target: "h-salamis", causalLabel: "mewarisi pranata politik dari", branch: "sejarah-peradaban" },
  { id: "e-h-salamis-to-tulisan", source: "h-salamis", target: "h-tulisan", causalLabel: "administrasi & sejarahnya bergantung pada", branch: "sejarah-peradaban" },
  { id: "e-h-tulisan-to-neolitik", source: "h-tulisan", target: "h-neolitik", causalLabel: "tumbuh dari surplus administratif", branch: "sejarah-peradaban" },
  { id: "e-h-neolitik-to-homo", source: "h-neolitik", target: "a-homo-sapiens", causalLabel: "dimungkinkan oleh kapasitas kognitif", branch: "all" },
];
