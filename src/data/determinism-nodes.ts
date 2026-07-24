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
 * Diperluas dengan rantai mekanisme marâtib al-qadar (ilmu → kitabah →
 * masyi'ah → khalq → kasb), sub-cabang mahw wa itsbat, kolom pembanding Barat
 * (Boethius, Molinisme, kompatibilisme Frankfurt), dan node sintesis yang
 * mengonvergensikan ketiga kolom kembali ke satu titik pisah argumentatif.
 *
 * Prinsip framing (WAJIB dijaga di seluruh copy):
 * - Lauhul mahfuz = CATATAN ILMU, bukan mesin pemaksa. Ilmu yang mendahului
 *   TIDAK menyebabkan/ memaksa hasil — analogi: guru yang tahu murid akan
 *   lulus/gagal tanpa pengetahuannya menjadi penyebab hasil ujian. Tulisan
 *   (kitabah) MENGIKUTI ilmu yang mendahului, bukan menciptakan paksaan;
 *   jangan pernah dirumuskan sebagai "ilmu bergantung pada perbuatan".
 * - Lapisan jembatan ini SENGAJA menamai posisi teologis/filosofis sebagai
 *   konsep pembanding, bukan polemik mazhab: kasb (Al-Asy'ari) dan ikhtiyâr
 *   (Al-Maturidi) dari sisi Islam; Boethius, Molinisme, dan kompatibilisme
 *   (Frankfurt) sebagai paralel Barat. Nama-nama ini disebut untuk
 *   perbandingan argumen, bukan untuk memihak satu mazhab atas mazhab lain.
 *
 * Sumber (verifikasi silang min. 2, konvensi chain-nodes.ts):
 * - QS Al-An'am:59, QS Al-Hadid:22 — Tafsir Kemenag; Tafsir Al-Wajiz
 *   (Wahbah az-Zuhaili); Tafsir Al-Madinah al-Munawwarah.
 * - Qadar mubram vs muallaq — NU Online; Detik Hikmah.
 * - Marâtib al-qadar (ilmu, kitabah, masyi'ah, khalq) — Almanhaj: Tingkatan
 *   Qadar; hadis Muslim (takdir dicatat 50.000 tahun sebelum penciptaan);
 *   QS Ar-Ra'd:39 (mahw wa itsbat) — Tafsir Ibnu Katsir.
 * - Foreknowledge ≠ causation; hard determinism vs compatibilism (Frankfurt)
 *   — SEP "Foreknowledge and Free Will"; SEP "Compatibilism"; Britannica
 *   "Free will and moral responsibility".
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
      "Sebagian ketetapan bersifat mubram — final dan di luar kendali manusia. Nilai konstanta fisika itu sendiri adalah contoh mubram par excellence: tak ada ikhtiar atau doa yang mengubah α atau G. Justru di sinilah simulasi Fine-Tuning bertemu konsep qadar: konstanta yang Anda geser di simulasi = qadha' mubram yang tertulis. Simulasi membuktikan konstanta BISA bernilai lain (kontingen), maka nilai yang teraktual adalah ketetapan yang ditulis — bisa direnungi, tidak bisa digeser manusia.",
    sources: ["NU Online: Takdir Mubram dan Muallaq", "Detik Hikmah"],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
  },
  {
    id: "f-maratib-ilm",
    label: "Marâtib 1 — Al-'Ilm (Ilmu)",
    category: "filosofis",
    timeLabel: "Tingkat qadar ke-1",
    timeValue: -1,
    description:
      "Tingkat pertama ketetapan: ilmu Allah yang azali meliputi segala sesuatu — yang telah, sedang, akan terjadi, bahkan yang seandainya terjadi. Termasuk di dalamnya: apa yang akan setiap orang pilih secara bebas. Ilmu ini mendahului segalanya, tetapi mengetahui sesuatu tidak sama dengan memaksakannya.",
    sources: ["Almanhaj: Tingkatan Qadar (al-'Ilm)", "QS Saba':3", "QS Al-Hajj:70"],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
    quranRefs: [
      {
        surah: "Saba'",
        ayat: 3,
        paraphrase:
          "Tidak ada yang tersembunyi dari-Nya seberat zarrah pun di langit maupun di bumi — ilmu Allah meliputi yang terkecil sekalipun, mendahului setiap kejadian.",
      },
    ],
  },
  {
    id: "f-maratib-kitabah",
    label: "Marâtib 2 — Al-Kitâbah (Penulisan)",
    category: "filosofis",
    timeLabel: "Tingkat qadar ke-2 · jembatan inti",
    timeValue: -1,
    description:
      "Tingkat kedua: Allah menuliskan seluruh takdir di Lauh Mahfuz BERDASARKAN ilmu-Nya yang mendahului — menurut hadis, 50.000 tahun sebelum langit dan bumi diciptakan, dengan al-qalam (pena). Inilah jembatan intinya: tulisan MENGIKUTI pengetahuan atas apa yang akan dipilih, bukan menciptakan paksaan. Ditulis karena diketahui, bukan terjadi karena ditulis.",
    sources: [
      "Hadis Muslim (takdir dicatat 50.000 tahun sebelum penciptaan)",
      "QS Al-Hajj:70",
      "Almanhaj: Tingkatan Qadar (al-Kitabah)",
    ],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
    quranRefs: [
      {
        surah: "Al-Hajj",
        ayat: 70,
        paraphrase:
          "Tidakkah engkau tahu bahwa Allah mengetahui apa yang di langit dan di bumi? Semua itu (tercatat) dalam sebuah kitab; sungguh yang demikian mudah bagi Allah — penulisan didasarkan pada ilmu yang meliputi.",
      },
    ],
  },
  {
    id: "f-maratib-masyiah",
    label: "Marâtib 3 — Al-Mashî'ah (Kehendak)",
    category: "filosofis",
    timeLabel: "Tingkat qadar ke-3",
    timeValue: -1,
    description:
      "Tingkat ketiga: tidak ada sesuatu pun terjadi kecuali dengan kehendak Allah. Namun kehendak manusia tidak dihapus — justru kehendak memilih itu berlangsung DI DALAM kehendak Allah yang mengizinkannya. Manusia benar-benar berkehendak; kehendaknya tidak berada di luar kuasa Sang Pencipta kehendak.",
    sources: ["Almanhaj: Tingkatan Qadar (al-Masyi'ah)", "QS At-Takwir:29"],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
    quranRefs: [
      {
        surah: "At-Takwir",
        ayat: 29,
        paraphrase:
          "Dan kamu tidak dapat menghendaki (menempuh jalan itu) kecuali apabila dikehendaki Allah, Tuhan semesta alam — kehendak manusia nyata, namun tidak lepas dari kehendak-Nya.",
      },
    ],
  },
  {
    id: "f-maratib-khalq",
    label: "Marâtib 4 — Al-Khalq (Penciptaan)",
    category: "filosofis",
    timeLabel: "Tingkat qadar ke-4",
    timeValue: -1,
    description:
      "Tingkat keempat: Allah menciptakan segala sesuatu, termasuk perbuatan hamba. Alam beserta sebab-akibatnya adalah ciptaan — bukan mesin mandiri yang berjalan sendiri tanpa Pencipta. Dengan tingkat ini lengkaplah rukun qadar: ilmu, tulisan, kehendak, lalu penciptaan.",
    sources: ["Almanhaj: Tingkatan Qadar (al-Khalq)", "QS Ash-Shaffat:96"],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
    quranRefs: [
      {
        surah: "Ash-Shaffat",
        ayat: 96,
        paraphrase:
          "Padahal Allah-lah yang menciptakan kamu dan apa yang kamu perbuat — perbuatan pun berada dalam lingkup penciptaan-Nya.",
      },
    ],
  },
  {
    id: "f-kasb",
    label: "Kasb — Perbuatan yang 'Diusahakan'",
    category: "filosofis",
    philosopher: "Al-Asy'ari (kasb) & Al-Maturidi (ikhtiyâr)",
    timeLabel: "Tanggung jawab manusia",
    timeValue: -1,
    description:
      "Bagaimana perbuatan bisa 'dicipta Allah' sekaligus 'milik manusia'? Melalui kasb (usaha/perolehan): Allah menciptakan perbuatan, tetapi manusia yang mengusahakan dan memilihnya, sehingga pahala dan dosa benar-benar melekat padanya. Al-Asy'ari menyebutnya kasb; Al-Maturidi menekankan ikhtiyâr (pilihan nyata) manusia. Inilah sisi Islam dari 'kompatibilisme': ketetapan tidak meniadakan tanggung jawab.",
    objection:
      "Objeksi: jika perbuatan tetap dicipta Allah, bukankah kasb hanya istilah tanpa kuasa nyata? Kritik ini dilontarkan sejak masa klasik terhadap rumusan kasb.",
    response:
      "Tanggapan: kasb menandai beda nyata antara gerak terpaksa (jatuh karena gravitasi) dan gerak pilihan (mengangkat tangan) — keduanya dicipta, tapi hanya yang kedua 'diusahakan' dan karenanya dipertanggungjawabkan.",
    sources: ["QS Al-Baqarah:286", "SEP: Al-Ash'ari / Ash'arism"],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
    quranRefs: [
      {
        surah: "Al-Baqarah",
        ayat: 286,
        paraphrase:
          "Ia mendapat (pahala) dari kebajikan yang diusahakannya (kasabat) dan mendapat (dosa) dari kejahatan yang dikerjakannya — usaha manusia menentukan tanggung jawabnya.",
      },
    ],
  },
  {
    id: "f-mahw-itsbat",
    label: "Mahw wa Itsbat — Menghapus & Menetapkan",
    category: "filosofis",
    timeLabel: "Mekanisme muallaq vs mubram",
    timeValue: -1,
    description:
      "QS Ar-Ra'd:39: Allah menghapus dan menetapkan apa yang Dia kehendaki, dan di sisi-Nya Ummul-Kitab. Ada catatan yang bisa dihapus-ditetapkan — di sinilah doa dan ikhtiar bekerja (qadar muallaq) — dan ada Ummul-Kitab (Lauh Mahfuz) yang tidak berubah (qadar mubram). Perubahan itu sendiri sudah diketahui dan tercakup dalam ilmu yang mendahului, jadi bukan berarti Allah 'berubah pikiran'.",
    sources: ["QS Ar-Ra'd:39", "Tafsir Ibnu Katsir", "NU Online: Takdir Mubram dan Muallaq"],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
    quranRefs: [
      {
        surah: "Ar-Ra'd",
        ayat: 39,
        paraphrase:
          "Allah menghapus dan menetapkan apa yang Dia kehendaki, dan di sisi-Nya terdapat Ummul-Kitab (Induk Kitab) — membedakan catatan yang bisa berubah (muallaq) dari yang tetap (mubram).",
      },
    ],
  },
  {
    id: "f-barat-boethius",
    label: "Pembanding — Boethius (Kekinian Abadi)",
    category: "filosofis",
    philosopher: "Boethius",
    timeLabel: "Paralel Barat: ilmu di luar waktu",
    timeValue: -1,
    description:
      "Boethius (w. ~524 M) menjawab 'jika Tuhan sudah tahu, apakah kita bebas?': Tuhan tidak berada dalam waktu, melainkan dalam kekinian abadi (eternal present) yang melihat seluruh waktu sekaligus. Maka pengetahuan-Nya bukan 'fore-knowledge' yang mendahului secara temporal lalu memaksa, melainkan penglihatan yang serentak. Paralel dengan al-'Ilm: mengetahui ≠ menyebabkan.",
    objection:
      "Objeksi: memindah pengetahuan ke 'keabadian' belum otomatis menjamin kebebasan tanpa argumen tambahan (kritik kontemporer atas solusi Boethius).",
    sources: ["SEP: Foreknowledge and Free Will", "Boethius, Consolation of Philosophy, Buku V"],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
  },
  {
    id: "f-barat-molinisme",
    label: "Pembanding — Molinisme (Scientia Media)",
    category: "filosofis",
    philosopher: "Luis de Molina",
    timeLabel: "Paralel Barat: tahu pilihan bebas, lalu menetapkan",
    timeValue: -1,
    description:
      "Molina (abad ke-16) mengajukan pengetahuan tengah (scientia media): Tuhan mengetahui apa yang AKAN dipilih secara bebas oleh setiap makhluk dalam setiap situasi yang mungkin, lalu — atas dasar itu — menetapkan untuk mewujudkan dunia tertentu. Paralel nyaris persis dengan al-Kitâbah yang didasarkan pada al-'Ilm: ditetapkan karena diketahui pilihan bebasnya, bukan memaksanya.",
    objection:
      "Objeksi (grounding objection): atas dasar apa 'kebenaran' tentang pilihan bebas yang belum terjadi itu ada, sebelum makhluknya diciptakan?",
    sources: ["SEP: Foreknowledge and Free Will (middle knowledge)", "Luis de Molina, Concordia"],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
  },
  {
    id: "f-barat-kompatibilisme",
    label: "Pembanding — Kompatibilisme (Frankfurt)",
    category: "filosofis",
    philosopher: "Harry Frankfurt",
    timeLabel: "Paralel Barat: bebas + determinisme kompatibel",
    timeValue: -1,
    description:
      "Kompatibilisme: kebebasan dan determinisme tidak bertentangan. Bebas bukan berarti 'bisa berbuat lain dalam kondisi persis sama', melainkan bertindak sesuai kehendak sendiri tanpa paksaan eksternal. Frankfurt: seseorang bertindak bebas jika keinginan tingkat-duanya selaras dengan keinginan tingkat-pertamanya. Paralel dengan kasb: ketetapan menyeluruh tetap menyisakan ruang tanggung jawab atas pilihan sendiri.",
    sources: [
      "SEP: Compatibilism",
      "Britannica: Free will and moral responsibility",
      "Frankfurt (1969, 1971)",
    ],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
  },
  {
    id: "f-sintesis",
    label: "Titik Temu & Titik Pisah",
    category: "filosofis",
    timeLabel: "Sintesis dua bacaan",
    timeValue: -1,
    description:
      "Kedua bacaan sepakat pada satu hal: rantai sebab-akibat berjalan PASTI dari kondisi awalnya — konstanta yang tersetel plus hukum-hukumnya. Perbedaannya tinggal SATU: apakah ada Penulis Yang Mengetahui di baliknya. Determinisme membaca alam sebagai 'tertulis tanpa penulis' (brute fact). Lauhul mahfuz membaca alam sebagai 'tertulis oleh Yang Mengetahui', berdasarkan ilmu atas pilihan bebas — sehingga presisi bukan kebetulan dan pilihan tetap bermakna. Titik pisah inilah — perlu-tidaknya Penulis — yang menyambung langsung ke pertanyaan Sebab Pertama.",
    sources: ["Sintesis argumentatif fitur (lihat node-node hulu Jalur E)"],
    branch: "determinisme-ketetapan",
    isPhilosophical: true,
  },
];

export const determinismEdges: ChainEdge[] = [
  // --- Tulang punggung (kepala) ---
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
  // --- Titik cabang → tiga lensa ---
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
  // --- Kolom pembanding Barat berakar dari Pertanyaan Ilusi ---
  {
    id: "e-f-ilusi-to-boethius",
    source: "f-pertanyaan-ilusi",
    target: "f-barat-boethius",
    causalLabel: "dijawab Barat via",
    branch: "determinisme-ketetapan",
  },
  // --- Kolom mekanisme Islam (marâtib) ---
  {
    id: "e-f-lauhulmahfuz-to-ilm",
    source: "f-lauhul-mahfuz",
    target: "f-maratib-ilm",
    causalLabel: "mekanismenya",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-ilm-to-kitabah",
    source: "f-maratib-ilm",
    target: "f-maratib-kitabah",
    causalLabel: "menjadi dasar",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-kitabah-to-masyiah",
    source: "f-maratib-kitabah",
    target: "f-maratib-masyiah",
    causalLabel: "lalu",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-masyiah-to-khalq",
    source: "f-maratib-masyiah",
    target: "f-maratib-khalq",
    causalLabel: "lalu",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-khalq-to-kasb",
    source: "f-maratib-khalq",
    target: "f-kasb",
    causalLabel: "menyisakan",
    branch: "determinisme-ketetapan",
  },
  // --- Sub-cabang mahw/itsbat ---
  {
    id: "e-f-lauhulmahfuz-to-mahwitsbat",
    source: "f-lauhul-mahfuz",
    target: "f-mahw-itsbat",
    causalLabel: "punya mekanisme",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-mahwitsbat-to-muallaq",
    source: "f-mahw-itsbat",
    target: "f-qadar-muallaq",
    causalLabel: "menghasilkan",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-mahwitsbat-to-mubram",
    source: "f-mahw-itsbat",
    target: "f-qadar-mubram",
    causalLabel: "menghasilkan",
    branch: "determinisme-ketetapan",
  },
  // --- Kolom pembanding Barat ---
  {
    id: "e-f-boethius-to-molinisme",
    source: "f-barat-boethius",
    target: "f-barat-molinisme",
    causalLabel: "lalu",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-molinisme-to-kompatibilisme",
    source: "f-barat-molinisme",
    target: "f-barat-kompatibilisme",
    causalLabel: "lalu",
    branch: "determinisme-ketetapan",
  },
  // --- Konvergensi ke sintesis ---
  {
    id: "e-f-determinisme-to-sintesis",
    source: "f-determinisme-pra-tertulis",
    target: "f-sintesis",
    causalLabel: "sepakat pada takdir pasti",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-lauhulmahfuz-to-sintesis",
    source: "f-lauhul-mahfuz",
    target: "f-sintesis",
    causalLabel: "sepakat pada takdir pasti",
    branch: "determinisme-ketetapan",
  },
];
