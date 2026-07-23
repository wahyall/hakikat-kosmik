/**
 * determinism-nodes.ts
 *
 * Jalur E — "Determinisme & Ketetapan (Lauhul Mahfuz)".
 * Rantai argumentatif yang menyambungkan kontingensi konstanta fisika (yang
 * dibuktikan mesin Fine-Tuning) dengan dua bacaan filosofis: determinisme
 * pra-tertulis (brute fact) vs lauhul mahfuz (telah tertulis berdasarkan ilmu
 * yang mendahului). Bermuara ke Sebab Pertama (a-first-cause) via korelasi
 * tematik (lihat chain-correlations.ts).
 *
 * Prinsip framing (WAJIB dijaga di seluruh copy):
 * - Lauhul mahfuz = CATATAN ILMU, bukan mesin pemaksa. Ilmu yang mendahului
 *   TIDAK menyebabkan/ memaksa hasil — analogi: guru yang tahu murid akan
 *   lulus/gagal tanpa pengetahuannya menjadi penyebab hasil ujian.
 * - Skope istilah: lauhul mahfuz, qadar muallaq, qadar mubram — TANPA nama
 *   mazhab teologis.
 *
 * Sumber (verifikasi silang min. 2, konvensi chain-nodes.ts):
 * - QS Al-An'am:59, QS Al-Hadid:22 — Tafsir Kemenag; Tafsir Al-Wajiz
 *   (Wahbah az-Zuhaili); Tafsir Al-Madinah al-Munawwarah.
 * - Qadar mubram vs muallaq — NU Online; Detik Hikmah.
 * - Foreknowledge ≠ causation; hard determinism vs compatibilism (Frankfurt)
 *   — SEP "Foreknowledge and Free Will"; Britannica "Free will and moral
 *   responsibility".
 *
 * Catatan arsitektur: file ini hanya meng-import TIPE dari chain-nodes.ts &
 * chain-edges.ts (`import type`), sehingga tidak ada import cycle runtime.
 */

import type { ChainNode } from "./chain-nodes";
import type { ChainEdge } from "./chain-edges";

export const determinismNodes: ChainNode[] = [
  {
    id: "f-pengalaman-memilih",
    label: "Pengalaman Memilih",
    category: "personal",
    timeLabel: "Sehari-hari",
    timeValue: -1,
    description:
      "Setiap hari Anda merasa memilih: menu makan siang, jalan pulang, kata yang diucapkan. Pengalaman ini terasa nyata dan langsung. Dari sinilah pertanyaan bermula: apakah pilihan itu benar-benar bebas, atau hanya mata rantai sebab-akibat yang tak Anda sadari?",
    sources: [],
    branch: "determinisme-ketetapan",
  },
  {
    id: "f-pertanyaan-ilusi",
    label: "Apakah Pilihan Itu Ilusi?",
    category: "filosofis",
    timeLabel: "Pertanyaan filosofis",
    timeValue: -1,
    description:
      "Jika segala sesuatu punya sebab (Jalur A) dan seluruh rantai itu sudah diketahui sejak awal, apakah 'pilihan' hanyalah ilusi? Filsafat Barat membelah jawabannya: determinisme keras (bebas itu tak ada), vs kompatibilisme (bebas dan determinisme bisa berdampingan — Frankfurt). Pertanyaan ini menuntut kita memeriksa fondasinya: seberapa 'terpasang' rantai sebab-akibat itu sebenarnya?",
    sources: [
      "SEP: Foreknowledge and Free Will",
      "Britannica: Free will and moral responsibility (Compatibilism)",
    ],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
  },
  {
    id: "f-konstanta-kontingen",
    label: "Konstanta Fisika Itu Kontingen",
    category: "filosofis",
    timeLabel: "Prasyarat rantai sebab-akibat",
    timeValue: -1,
    description:
      "Mesin Fine-Tuning membuktikannya secara literal: konstanta seperti α, G, dan Λ bisa saja bernilai lain — geser sedikit, seluruh pohon peristiwa runtuh. Artinya konstanta bukan hasil rantai sebab-akibat di DALAM alam; ia PRASYARAT yang menentukan rantai mana pun yang mungkin terjadi. Node ini secara visual 'menunjuk' ke hasil simulasi: buka Mode Fine-Tuning dan geser slider untuk melihatnya.",
    sources: ["Rees, Just Six Numbers (1999)", "Barnes, arXiv:1112.4647 (2012)"],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
  },
  {
    id: "f-presisi-butuh-penjelasan",
    label: "Presisi Itu Menuntut Penjelasan",
    category: "filosofis",
    timeLabel: "Titik cabang dua bacaan",
    timeValue: -1,
    description:
      "Karena konstanta kontingen, presisi yang menghasilkan alam layak-huni bukan keniscayaan — ia menuntut penjelasan. Ada dua bacaan yang bersaing atas fakta yang sama: (1) determinisme pra-tertulis — kebetulan/brute fact; (2) lauhul mahfuz — ditetapkan berdasarkan ilmu yang mendahului. Keduanya membaca output simulasi yang identik dengan lensa berbeda.",
    sources: ["Penrose, The Road to Reality (2004)"],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
  },
  {
    id: "f-determinisme-pra-tertulis",
    label: "Bacaan 1 — Determinisme (Pra-tertulis)",
    category: "filosofis",
    philosopher: "Tradisi determinisme/kompatibilisme Barat",
    timeLabel: "Bacaan tanpa Penulis",
    timeValue: -1,
    description:
      "Bacaan pertama: nilai konstanta adalah brute fact — begitu saja, tak ada yang perlu dijelaskan lebih jauh. Rantai sebab-akibat berjalan otomatis begitu kondisi awal ada, tanpa perlu agen atau penulis. Presisinya dijelaskan sebagai kebetulan, atau lewat multiverse (kita kebetulan di alam yang 'kena jackpot').",
    objection:
      "Kelemahan: 'brute fact' dan multiverse sama-sama tak teruji dan menggeser, bukan menjawab, pertanyaan mengapa justru nilai ini yang teraktual.",
    sources: [
      "Britannica: Free will and moral responsibility (Hard determinism)",
      "Susskind, The Cosmic Landscape (2005)",
    ],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
  },
  {
    id: "f-lauhul-mahfuz",
    label: "Bacaan 2 — Lauhul Mahfuz (Telah Tertulis)",
    category: "filosofis",
    timeLabel: "Bacaan dengan ilmu yang mendahului",
    timeValue: -1,
    description:
      "Bacaan kedua: konstanta dan rantai sebab-akibatnya ditetapkan lebih dulu berdasarkan ilmu yang mendahului — tercatat di Lauh Mahfuz. Pembeda penting: ilmu yang mendahului BUKAN sebab yang memaksa. Seperti guru yang sudah tahu seorang murid akan lulus atau gagal — pengetahuan itu sendiri tidak menjadi penyebab hasil ujiannya. Lauhul mahfuz adalah catatan ilmu, bukan mesin pemaksa; mengetahui sesuatu akan terjadi tidak sama dengan membuatnya terjadi.",
    sources: [
      "Tafsir Kemenag & Tafsir Al-Wajiz (Wahbah az-Zuhaili) untuk QS Al-An'am:59, QS Al-Hadid:22",
      "SEP: Foreknowledge and Free Will (foreknowledge ≠ causation)",
    ],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
    quranRefs: [
      {
        surah: "Al-An'am",
        ayat: 59,
        paraphrase:
          "Pada sisi-Nya kunci-kunci yang gaib; tidak sehelai daun pun gugur dan tidak ada yang basah atau kering melainkan tertulis dalam Kitab yang nyata — menegaskan lauhul mahfuz sebagai catatan ilmu yang menyeluruh, mendahului setiap kejadian.",
      },
      {
        surah: "Al-Hadid",
        ayat: 22,
        paraphrase:
          "Tiada suatu bencana pun menimpa di bumi atau pada dirimu melainkan telah tertulis dalam kitab sebelum Kami menciptakannya — catatan (ilmu) mendahului kejadian, bukan sebaliknya.",
      },
    ],
  },
  {
    id: "f-qadar-muallaq",
    label: "Qadar Muallaq (Terbuka lewat Ikhtiar)",
    category: "filosofis",
    timeLabel: "Sub-catatan lauhul mahfuz",
    timeValue: -1,
    description:
      "Sebagian ketetapan bersifat muallaq — masih terbuka dan bergantung pada ikhtiar serta doa manusia. Contoh: kesehatan dan rezeki, yang hasil akhirnya dapat berubah sesuai upaya. Ini menutup kesalahpahaman bahwa 'telah tertulis' berarti manusia pasif; ikhtiar tetap bermakna dan tak boleh ditinggalkan.",
    sources: ["NU Online: Takdir Mubram dan Muallaq", "Detik Hikmah"],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
  },
  {
    id: "f-qadar-mubram",
    label: "Qadar Mubram (Final, di Luar Kendali)",
    category: "filosofis",
    timeLabel: "Sub-catatan lauhul mahfuz",
    timeValue: -1,
    description:
      "Sebagian ketetapan bersifat mubram — final dan di luar kendali manusia. Nilai konstanta fisika itu sendiri adalah contoh mubram par excellence: tak ada ikhtiar atau doa yang mengubah α atau G. Di sinilah simulasi Fine-Tuning dan konsep qadar bertemu: parameter dasar alam adalah ketetapan yang tidak bisa digeser manusia, hanya bisa direnungi.",
    sources: ["NU Online: Takdir Mubram dan Muallaq", "Detik Hikmah"],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
  },
];

export const determinismEdges: ChainEdge[] = [
  {
    id: "e-f-memilih-to-ilusi",
    source: "f-pengalaman-memilih",
    target: "f-pertanyaan-ilusi",
    causalLabel: "memunculkan pertanyaan",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-ilusi-to-kontingen",
    source: "f-pertanyaan-ilusi",
    target: "f-konstanta-kontingen",
    causalLabel: "diperiksa lewat",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-kontingen-to-presisi",
    source: "f-konstanta-kontingen",
    target: "f-presisi-butuh-penjelasan",
    causalLabel: "menghasilkan",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-presisi-to-determinisme",
    source: "f-presisi-butuh-penjelasan",
    target: "f-determinisme-pra-tertulis",
    causalLabel: "bacaan 1",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-presisi-to-lauhulmahfuz",
    source: "f-presisi-butuh-penjelasan",
    target: "f-lauhul-mahfuz",
    causalLabel: "bacaan 2",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-lauhulmahfuz-to-muallaq",
    source: "f-lauhul-mahfuz",
    target: "f-qadar-muallaq",
    causalLabel: "mencakup",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-lauhulmahfuz-to-mubram",
    source: "f-lauhul-mahfuz",
    target: "f-qadar-mubram",
    causalLabel: "mencakup",
    branch: "determinisme-ketetapan",
  },
];
