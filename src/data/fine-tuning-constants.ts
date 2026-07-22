/**
 * fine-tuning-constants.ts
 *
 * Data konstanta fisika fundamental untuk "What If?" Fine-Tuning Mode.
 * Pengguna dapat menggeser slider untuk tiap konstanta dan melihat dampak
 * dramatis pada kehidupan — argumen desain yang sangat kuat.
 *
 * Sumber utama:
 * - Rees, M. Just Six Numbers (1999)
 * - Barnes, L. "The Fine-Tuning of the Universe for Intelligent Life" (2012, arXiv:1112.4647)
 * - Penrose, R. The Road to Reality (2004) — perhitungan entropi awal
 * - Davies, P. The Goldilocks Enigma (2006)
 * - Susskind, L. The Cosmic Landscape (2005)
 *
 * Catatan: untuk konstanta yang sangat kecil (G, Λ), slider bekerja dalam
 * skala logaritmik — relatif terhadap nilai aktual (10^x kali nilai nominal).
 * Untuk konstanta dimensionless (α, ε, me/mp, Q), slider bekerja linear.
 */

export type ConstantCategory = "gaya" | "massa" | "geometri" | "struktur";

export interface FineTuningConstant {
  id: string;
  name: string;
  symbol: string;
  category: ConstantCategory;
  /** Nilai nominal (display) */
  valueDisplay: string;
  /** Unit (atau "(dimensionless)") */
  unit: string;
  /**
   * Mode slider:
   * - "log"     : slider bekerja dalam faktor 10^x relatif nominal (untuk G, Λ)
   * - "linear"  : slider bekerja linear dalam rentang [min, max] (untuk α, ε, me/mp, Q, D)
   */
  sliderMode: "log" | "linear";
  /** Nilai nominal (untuk reset) */
  nominalValue: number;
  /** Untuk log: eksponen min/max (mis. -3 sampai +3 = 1/1000x hingga 1000x) */
  logExponentMin: number;
  logExponentMax: number;
  /** Untuk linear: nilai min/max slider */
  linearMin?: number;
  linearMax?: number;
  /** Rentang habitability (untuk evaluasi status) — dalam satuan nilai aktual */
  habitableMin: number;
  habitableMax: number;
  /** Dampak jika nilai lebih besar dari rentang habitability */
  consequenceIfLarger: string;
  /** Dampak jika nilai lebih kecil dari rentang habitability */
  consequenceIfSmaller: string;
  /** Apakah konstanta ini bagian dari "Just Six Numbers" Martin Rees? */
  isReesNumber?: boolean;
  /** Sumber klaim fine-tuning */
  source: string;
}

export const fineTuningConstants: FineTuningConstant[] = [
  // ====================================================================
  // 4 KONSTANTA UTAMA UNTUK SLIDER (sesuai rekomendasi brainstorm)
  // ====================================================================

  {
    id: "alpha",
    name: "Konstanta Struktur Halus",
    symbol: "α",
    category: "gaya",
    valueDisplay: "≈ 1/137,036",
    unit: "(dimensionless)",
    sliderMode: "linear",
    nominalValue: 0.00729735,
    linearMin: 0.003,
    linearMax: 0.015,
    habitableMin: 0.006,
    habitableMax: 0.009,
    consequenceIfLarger:
      "Elektron tidak terikat ke inti atom — semua atom terionisasi, tidak ada kimia, tidak ada molekul, tidak ada kehidupan.",
    consequenceIfSmaller:
      "Ikatan kimia terlalu lemah — reaksi fusi bintang tidak bisa berjalan, tidak ada sintesis unsur berat (C, O, Fe) yang dibutuhkan kehidupan.",
    isReesNumber: false,
    source: "Rees (1999); Barnes (2012) — perubahan ±10% sudah mematikan",
  },
  {
    id: "G",
    name: "Konstanta Gravitasi",
    symbol: "G",
    category: "gaya",
    valueDisplay: "6,674 × 10⁻¹¹",
    unit: "m³ kg⁻¹ s⁻²",
    sliderMode: "log",
    nominalValue: 6.674e-11,
    logExponentMin: -2,
    logExponentMax: 2,
    habitableMin: 6.674e-12,
    habitableMax: 6.674e-10,
    consequenceIfLarger:
      "Bintang menyala terlalu cepat — bintang masif membakar bahan bakar dalam <1 juta tahun (vs 10 miliar tahun Matahari), tidak ada waktu untuk evolusi kehidupan.",
    consequenceIfSmaller:
      "Gravitasi terlalu lemah — awan gas tidak bisa runtuh untuk menyalakan fusi nuklir; tidak ada bintang, tidak ada cahaya, tidak ada unsur berat.",
    isReesNumber: true,
    source: "Rees (1999) — bagian dari rasio N = 10³⁶ (EM/gravitasi)",
  },
  {
    id: "Lambda",
    name: "Konstanta Kosmologis (Dark Energy)",
    symbol: "Λ",
    category: "struktur",
    valueDisplay: "≈ 1,1 × 10⁻⁵²",
    unit: "m⁻² (atau 10⁻¹²² dalam satuan Planck)",
    sliderMode: "log",
    nominalValue: 1.1e-52,
    logExponentMin: -3,
    logExponentMax: 3,
    habitableMin: 1.1e-53,
    habitableMax: 1.1e-51,
    consequenceIfLarger:
      "Ekspansi alam semesta terlalu cepat — gravitasi tidak sempat mengumpulkan materi menjadi galaksi, bintang, planet. Hanya gas tipis yang terus menipis.",
    consequenceIfSmaller:
      "Ekspansi terlalu lambat — alam semesta cepat recollapse dalam Big Crunch sebelum sempat membentuk struktur kompleks apapun.",
    isReesNumber: true,
    source: "Weinberg (1987); Penrose (2004) — fine-tuning ~1:10¹²⁰",
  },
  {
    id: "me-mp",
    name: "Rasio Massa Elektron-Proton",
    symbol: "mₑ/mₚ",
    category: "massa",
    valueDisplay: "≈ 1/1836",
    unit: "(dimensionless)",
    sliderMode: "linear",
    nominalValue: 0.000544617,
    linearMin: 0.0002,
    linearMax: 0.002,
    habitableMin: 0.0004,
    habitableMax: 0.0008,
    consequenceIfLarger:
      "Elektron terlalu berat — orbital atom mengecil drastis, kimia berubah total, molekul organik tidak bisa stabil, DNA mustahil.",
    consequenceIfSmaller:
      "Elektron terlalu ringan — orbital atom terlalu luas, ikatan kimia terlalu lemah, molekul tidak bisa membentuk struktur tetap.",
    isReesNumber: false,
    source: "Barnes (2012); Rees (1999) — terkait ε",
  },

  // ====================================================================
  // 2 KONSTANTA TAMBAHAN (untuk demo lebih kaya)
  // ====================================================================

  {
    id: "Q",
    name: "Amplitudo Riak Kosmik (Fluktuasi CMB)",
    symbol: "Q",
    category: "struktur",
    valueDisplay: "≈ 10⁻⁵",
    unit: "(dimensionless)",
    sliderMode: "log",
    nominalValue: 1e-5,
    logExponentMin: -3,
    logExponentMax: 3,
    habitableMin: 1e-6,
    habitableMax: 1e-4,
    consequenceIfLarger:
      "Riak terlalu besar — hanya lubang hitam raksasa yang terbentuk, tidak ada galaksi berstruktur, tidak ada bintang, tidak ada planet.",
    consequenceIfSmaller:
      "Riak terlalu kecil — materi terdistribusi seragam, gravitasi tidak punya benih untuk mengumpulkan materi, tidak ada struktur apapun terbentuk.",
    isReesNumber: true,
    source: "Rees (1999) — Q = 10⁻⁵",
  },
  {
    id: "dimensions",
    name: "Jumlah Dimensi Spasial",
    symbol: "D",
    category: "geometri",
    valueDisplay: "3",
    unit: "(spasial; + 1 temporal)",
    sliderMode: "linear",
    nominalValue: 3,
    linearMin: 1,
    linearMax: 5,
    habitableMin: 3,
    habitableMax: 3,
    consequenceIfLarger:
      "Orbit planet tidak stabil secara matematis (atom juga) — gerak dua-body tidak punya solusi tertutup, struktur kompleks mustahil.",
    consequenceIfSmaller:
      "Topologi terlalu sederhana — tidak ada saluran usus yang bisa ada tanpa membelah organisme, jaringan saraf kompleks mustahil.",
    isReesNumber: true,
    source: "Rees (1999); Tegmark (1997) — D=3 satu-satunya yang stabil",
  },
];

/**
 * Statistik:
 * - 6 konstanta total (4 utama + 2 tambahan)
 * - 4 dari 6 adalah "Just Six Numbers" Martin Rees (G, Λ, Q, D)
 * - α dan mₑ/mₚ juga kritis (dibahas Barnes 2012)
 *
 * Catatan desain:
 * - Slider log untuk G, Λ, Q (rentang luas, eksponen 10^x)
 * - Slider linear untuk α, mₑ/mₚ, D (rentang sempit, presisi)
 * - Status habitability dievaluasi real-time: hijau (habitable) / merah (steril)
 */

// ====================================================================
// DATA PENROSE ENTROPY — angka spektakuler untuk konteks fine-tuning
// ====================================================================

export interface PenroseEntropy {
  /** Probabilitas alam semesta dimulai dalam keadaan entropi rendah */
  probability: string;
  /** Eksponen (untuk visualisasi) */
  exponent: string;
  /** Konteks */
  description: string;
  source: string;
}

export const penroseEntropy: PenroseEntropy = {
  probability: "1",
  exponent: "10^(10^123)",
  description:
    "Roger Penrose (1979, 2004) menghitung probabilitas bahwa alam semesta dimulai dalam keadaan entropi rendah (kondisi yang diperlukan untuk panah waktu dan kehidupan). Hasilnya: 1 banding 10^(10^123) — angka yang begitu kecil sehingga jika setiap atom di alam semesta menjadi angka nol, masih belum cukup. Inilah fine-tuning paling spektakuler yang diketahui sains — titik di mana banyak fisikawan (Susskind, Linde) mendorong multiverse sebagai 'penjelasan', sementara yang lain (Penrose sendiri) tetap skeptis.",
  source: "Penrose, R. The Road to Reality (2004), Bab 27",
};

// ====================================================================
// DATA PENDEKATAN ALTERNATIF (untuk konteks "Perspektif Lain")
// ====================================================================

export interface FineTuningResponse {
  position: string;
  author: string;
  summary: string;
  problem: string;
}

export const fineTuningResponses: FineTuningResponse[] = [
  {
    position: "Multiverse + Anthropic Principle",
    author: "Susskind, Linde, Carroll",
    summary:
      "Ada banyak (mungkin tak terhingga) alam semesta dengan konstanta berbeda. Kita mengamati konstanta yang habitable karena hanya di alam semesta seperti itulah pengamat bisa ada (weak anthropic principle).",
    problem:
      "Boltzmann Brain problem: jika multiverse tak terhingga, lebih mungkin pengamat muncul dari fluktuasi kuantum acak (otak terisolasi) daripada dari evolusi kosmis — yang justru merusak argumen bahwa observasi kita dapat dipercaya.",
  },
  {
    position: "Argumen Desain (Theism)",
    author: "Collins, Craig, Holder",
    summary:
      "Fine-tuning adalah bukti positif untuk Pencipta yang merancang alam untuk dapat menampung kehidupan — sejalan dengan QS Al-Anbiya:30, QS Al-Baqarah:29, dan QS Al-Mulk:3-4 ('tidak ada kecacatan dalam ciptaan Yang Maha Pemurah').",
    problem:
      "Jika Pencipta merancang, mengapa repot-repot dengan multiverse? Tidak ada konflik logis; multiverse sendiri butuh penjelasan (siapa yang membuat mesin multiverse?).",
  },
  {
    position: "Necessity (Hukum Fisika Lebih Dalam)",
    author: "Hawking, M-theory",
    summary:
      "Mungkin konstanta TIDAK bebas — ditentukan oleh teori unifikasi yang lebih dalam (M-theory, string landscape). Jika demikian, fine-tuning hanya sementara — sebelum teori sejati ditemukan.",
    problem:
      "String landscape justru menghasilkan ~10^500 solusi berbeda — memilih satu solusi habitable kembali ke multiverse/anthropic. Belum ada teori unifikasi teruji.",
  },
];
