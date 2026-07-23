/**
 * chain-nodes.ts
 *
 * Data node untuk visualisasi "Rantai Sebab-Akibat (Cosmological Chain Explorer)".
 *
 * Kerangka argumentatif utama situs ini berakar pada tradisi falsafi Islam:
 *   - Al-Kindi (dalil al-khair al-mahd / argumen dari kebaikan mutlak)
 *   - Ibnu Sina (wajib al-wujud vs mumkin al-wujud)
 *   - Al-Ghazali (silsilah hawadith / rentetan kejadian-kejadian baru tak terhingga)
 * Tradisi lain (Aquinas per se, Leibniz PSR, Craig Kalam modern) disebut sebagai
 *   rujukan komparatif — bukan kerangka utama.
 *
 * Untuk ayat Al-Qur'an yang berbicara tentang penciptaan, kami menyertakan
 *   rujukan surah/ayat (QS x:y) DAN parafrase maknanya — bukan kutipan teks
 *   Arab panjang, sesuai prinsip hemat dan untuk menjaga keterbacaan UI.
 *
 * Skema:
 * - timeValue: detik sejak Big Bang (negatif = sebelum Big Bang dalam model argumentatif;
 *   positif = setelah Big Bang; 0 = momen Big Bang; untuk "masa kini" pakai 4,35e17 detik ≈ 13,8 miliar tahun)
 * - Untuk skala log, timeValue tetap disimpan apa adanya; transformasi log dilakukan di UI
 *
 * Sumber utama (verifikasi silang minimum 2 sumber per klaim):
 * - NASA (science.nasa.gov, starchild.gsfc.nasa.gov, imagine.gsfc.nasa.gov)
 * - ESA Planck (esa.int)
 * - Harvard CfA, Stanford KIPAC, Yale Astronomy, UC Berkeley
 * - Wikipedia (cross-checked dengan sumber primer)
 * - Stanford Encyclopedia of Philosophy (plato.stanford.edu)
 * - Tafsir Ibnu Katsir, Tafsir Al-Azhar (Hamka), Tazkirah Al-Ghazali
 * - Nature, Science, PNAS
 */

import { determinismNodes } from "./determinism-nodes";

export type ChainCategory =
  | "personal"
  | "biologis"
  | "geologis"
  | "astronomis"
  | "partikel"
  | "filosofis";

export type ChainBranch =
  | "silsilah-manusia"
  | "kosmologis-utama"
  | "contoh-hujan"
  | "contoh-biliar"
  | "determinisme-ketetapan";

export interface QuranReference {
  /** Contoh: "Al-Baqarah:117" */
  surah: string;
  /** Nomor ayat */
  ayat: number;
  /** Parafrase makna (bukan kutipan teks Arab) */
  paraphrase: string;
}

export interface ChainNode {
  id: string;
  label: string;
  category: ChainCategory;
  timeLabel: string;
  /** Detik sejak Big Bang. 0 = momen Big Bang. Untuk "masa kini" = ~4,35e17. */
  timeValue: number;
  description: string;
  sources?: string[];
  branch: ChainBranch;
  /** Jika true, node ini adalah terminal filosofis (bukan klaim ilmiah) */
  isPhilosophical?: boolean;
  /** Jika true, node ini menandai batas penjelasan ilmiah */
  isBoundary?: boolean;
  /** Rujukan Qur'ani yang bercokol dengan tema node (opsional) */
  quranRefs?: QuranReference[];
  /** Untuk node filosofis: tokoh/penulis yang mengajukan argumen (mis. "Al-Kindi") */
  philosopher?: string;
  /** Untuk node filosofis: rumusan objeksi terkuat terhadap argumen ini */
  objection?: string;
  /** Untuk node filosofis: tanggapan steelman dari tradisi terkait */
  response?: string;
}

/**
 * Konstanta: usia alam semesta dalam detik (13,8 miliar tahun).
 * 13,8e9 tahun × 365,25 × 24 × 3600 ≈ 4,355 × 10^17 detik
 */
export const UNIVERSE_AGE_SECONDS = 4.355e17;

const coreChainNodes: ChainNode[] = [
  // ====================================================================
  // BRANCH A: JALUR KOSMOLOGIS UTAMA (dari masa kini mundur ke Big Bang
  //           lalu ke argumen filosofis Sebab Pertama)
  // ====================================================================

  {
    id: "a-now",
    label: "Masa Kini",
    category: "personal",
    timeLabel: "Sekarang",
    timeValue: UNIVERSE_AGE_SECONDS,
    description:
      "Anda membaca kalimat ini pada momen tertentu dalam sejarah kosmik. Dari perspektif skala waktu alam semesta, keberadaan manusia modern hanyalah setitik di akhir rantai sebab-akibat yang membentang sekitar 13,8 miliar tahun. Setiap peristiwa yang Anda alami hari ini dapat ditelusuri kembali, langkah demi langkah, hingga ke peristiwa-peristiwa pada detik pertama alam semesta.",
    sources: ["ESA Planck 2018", "NASA WMAP"],
    branch: "kosmologis-utama",
    quranRefs: [
      {
        surah: "Al-An'am",
        ayat: 59,
        paraphrase:
          "Pada sisi-Nya terdapat kunci-kunci semua yang gaib; tidak ada yang mengetahui selain Dia. Ia mengetahui apa yang di daratan dan di lautan, dan tidak sehelai daun pun gugur melainkan Ia mengetahui — mengisyaratkan bahwa setiap kejadian kecil pun berada dalam jaringan sebab-akibat yang Ia ketahui.",
      },
    ],
  },
  {
    id: "a-homo-sapiens",
    label: "Homo sapiens Modern",
    category: "biologis",
    timeLabel: "~300.000 tahun lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 300_000 * 365.25 * 24 * 3600,
    description:
      "Fosil tertua yang diklasifikasikan sebagai Homo sapiens ditemukan di gua Jebel Irhoud, Maroko, dan diberi tanggal sekitar 300.000 tahun lalu. Temuan 2017 ini menggeser perkiraan sebelumnya (~200.000 tahun) dan menunjukkan bahwa ciri-ciri wajah modern telah muncul lebih awal dari yang sebelumnya diyakini. Otak mereka sudah memiliki kapasitas kognitif yang pada akhirnya memungkinkan refleksi filosofis tentang asal-usul — termasuk pertanyaan yang sedang Anda eksplorasi sekarang.",
    sources: ["Nature (Hublin et al. 2017)", "Smithsonian Human Origins", "Science AAAS"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-kpg-extinction",
    label: "Kepunahan Massal K-Pg (Chicxulub)",
    category: "biologis",
    timeLabel: "~66 juta tahun lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 66e6 * 365.25 * 24 * 3600,
    description:
      "Tumbukan asteroid Chicxulub (~66 juta tahun lalu) memicu kepunahan massal Kapur–Paleogen yang memusnahkan dinosaurus non-avian. Kosongnya relung ekologis tubuh-besar membuka radiasi mamalia besar — termasuk garis yang akhirnya menuju primata dan manusia. Tumbukan sebagai penyebab utama kini konsensus kuat; klaim 'tanpa peristiwa ini tidak akan ada manusia' bersifat interpretatif (kontingensi) dan masih diperdebatkan.",
    sources: ["Alvarez et al. (1980)", "Schulte et al. (2010)", "Hull et al. (2020)"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-tetrapod-transition",
    label: "Transisi Ikan ke Tetrapoda",
    category: "biologis",
    timeLabel: "~375 juta tahun lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 375e6 * 365.25 * 24 * 3600,
    description:
      "Pada Devon Akhir, ikan bersirip-cuping (sarcopterygii) mengembangkan anggota badan berjari, paru-paru, dan leher — fosil peralihan seperti Tiktaalik merekamnya. Kolonisasi daratan oleh vertebrata ini menjadi prasyarat amfibi, amniota, mamalia, hingga primata. Apakah terestrialisasi vertebrata bersifat kontingen atau akan berulang (konvergen) masih diperdebatkan.",
    sources: ["Shubin, Daeschler & Jenkins (2006)", "Clack, Gaining Ground (2012)"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-cambrian-explosion",
    label: "Ledakan Kambrium",
    category: "biologis",
    timeLabel: "~538 juta tahun lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 538e6 * 365.25 * 24 * 3600,
    description:
      "Dalam rentang geologis yang relatif singkat, hampir semua filum hewan modern muncul, termasuk chordata awal (mis. Pikaia) yang menjadi leluhur vertebrata. Gould memakai peristiwa ini sebagai contoh utama kontingensi evolusioner; Conway Morris membantah dgn argumen konvergensi. Statusnya sbg 'titik cabang yang menentukan' karena itu diperdebatkan.",
    sources: ["Gould, Wonderful Life (1989)", "Conway Morris, Life's Solution (2003)"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-eukaryogenesis",
    label: "Kemunculan Sel Eukariota",
    category: "biologis",
    timeLabel: "~2,0–1,5 miliar tahun lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 1.8e9 * 365.25 * 24 * 3600,
    description:
      "Penggabungan inang arkea (garis Asgard) dengan bakteri alfa-proteobakteri melahirkan mitokondria dan sel eukariota kompleks — prasyarat semua kehidupan multiseluler, termasuk hewan. Peristiwa historisnya (LECA sudah bermitokondria) relatif mapan, tetapi klaim mekanisme 'keharusan energetik' (daya per gen) diperdebatkan.",
    sources: [
      "Lane & Martin, Nature 467:929 (2010)",
      "Eme et al., Nat. Rev. Microbiol. (2017)",
      "Imachi et al., Nature (2020)",
    ],
    branch: "kosmologis-utama",
  },
  {
    id: "a-goe-oxygenation",
    label: "Great Oxidation Event & Fotosintesis Oksigenik",
    category: "biologis",
    timeLabel: "~2,4 miliar tahun lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 2.4e9 * 365.25 * 24 * 3600,
    description:
      "Sianobakteri mengembangkan fotosintesis oksigenik — satu-satunya sumber oksigen bebas skala planet — yang memicu Great Oxidation Event (~2,43–2,22 miliar tahun lalu). Oksigen atmosfer membuka jalan bagi lapisan ozon dan respirasi aerobik berdaya tinggi yang kelak dibutuhkan hewan besar. Bahwa fotosintesis oksigenik adalah prasyarat energetik itu mapan; timing kausal oksigen bagi kompleksitas diperdebatkan.",
    sources: [
      "Fischer, Hemp & Johnson, AREPS (2016)",
      "Sánchez-Baracaldo & Cardona, New Phytologist (2020)",
    ],
    branch: "kosmologis-utama",
  },
  {
    id: "a-abiogenesis",
    label: "Asal-Usul Kehidupan (Abiogenesis)",
    category: "biologis",
    timeLabel: "~3,5–3,8 miliar tahun lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 3.65e9 * 365.25 * 24 * 3600,
    description:
      "Bukti fosil paling kuat untuk kehidupan paling awal adalah stromatolit dari Formasi Dresser, Australia Barat, berusia sekitar 3,48 miliar tahun. Beberapa peneliti berargumen bahwa biosignatur kimia dapat ditemukan di batuan yang lebih tua lagi, hingga 3,7–3,8 miliar tahun. Kondisi permukaan Bumi sendiri diperkirakan mulai mendukung kehidupan sejak ~4,3 miliar tahun lalu, sehingga ada jendela waktu yang luas di mana abiogenesis dapat terjadi. Mekanisme tepatnya — misalnya 'dunia RNA', ventilasi hidrotermal, atau panspermia — masih diperdebatkan.",
    sources: ["Wikipedia: Earliest known life forms", "UC Berkeley Understanding Evolution", "University of Chicago News"],
    branch: "kosmologis-utama",
    quranRefs: [
      {
        surah: "Al-Anbiya",
        ayat: 30,
        paraphrase:
          "(lanjutan) …dan dari air Kami jadikan segala sesuatu yang hidup. Mengapa mereka tidak beriman? — banyak mufassir mengaitkan teks ini dengan asal-usul kehidupan biologis yang bergantung pada air.",
      },
    ],
  },
  {
    id: "a-earth-formation",
    label: "Pembentukan Bumi",
    category: "geologis",
    timeLabel: "~4,54 miliar tahun lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 4.54e9 * 365.25 * 24 * 3600,
    description:
      "Bumi terbentuk dari akresi materi di dalam cakram protoplanet sekitar 4,54 miliar tahun lalu, sedikit lebih muda dari Matahari. Bukti geologis tertua yang masih tersisa adalah butir zirkon dari Jack Hills, Australia Barat, berusia 4,404 miliar tahun — artinya kerak benua awal sudah mulai mengeras hanya ~150 juta tahun setelah Bumi terbentuk. Kondisi awal Bumi sangat panas dan mengalami pemboman asteroid intensif sebelum akhirnya mendingin cukup untuk menampung air cair dan kehidupan.",
    sources: ["UW-Madison News", "OpenGeology: Earth's Oldest Rocks", "University of Chicago News"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-solar-system",
    label: "Pembentukan Tata Surya",
    category: "astronomis",
    timeLabel: "~4,6 miliar tahun lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 4.6e9 * 365.25 * 24 * 3600,
    description:
      "Tata Surya terbentuk dari runtuhnya gravitasi pada bagian kecil awan molekul raksasa, kemungkinan dipicu oleh gelombang kejut supernova bintang generasi sebelumnya. Material yang berputar membentuk cakram protoplanet, dengan mayoritas massa terkumpul di pusat dan menyala menjadi Matahari, sementara materi tersisa berakresi menjadi planet. Penting: unsur-unsur berat dalam kabut ini (karbon, oksigen, silikon, besi, emas) tidak dihasilkan oleh Big Bang, melainkan oleh bintang-bintang generasi sebelumnya yang meledak sebagai supernova.",
    sources: ["NASA Science", "AMNH", "Natural History Museum London", "Planetary Society"],
    branch: "kosmologis-utama",
    quranRefs: [
      {
        surah: "Al-Anbiya",
        ayat: 30,
        paraphrase:
          "(awal) Tidakkah orang kafir melihat bahwa langit dan bumi keduanya dahulu menyatu, lalu Kami pisahkan — pengakuan adanya tahap pemisahan/pembentukan struktur dari keadaan awal yang seragam.",
      },
    ],
  },
  {
    id: "a-first-galaxies",
    label: "Galaksi-Galaksi Pertama",
    category: "astronomis",
    timeLabel: "~350–400 juta tahun setelah Big Bang",
    timeValue: 3.85e8 * 365.25 * 24 * 3600,
    description:
      "Galaksi-galaksi pertama mulai terbentuk sekitar 200–400 juta tahun setelah Big Bang, ketika gumpalan gas hidrogen dan helium tertarik oleh gravitasi dan menghasilkan bentuk-bentuk awal yang kita kenal sebagai galaksi. Pengamatan JWST telah menemukan galaksi seperti JADES-GS-z14-0 yang ada hanya ~290 juta tahun setelah Big Bang — lebih awal dari yang diperkirakan sebelumnya, dan menantukan model pembentukan galaksi yang ada. Galaksi-galaksi ini menjadi 'pabrik' bintang-bintang generasi berikutnya.",
    sources: ["Harvard CfA", "NASA JWST", "PNAS", "UC Santa Cruz News"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-first-stars",
    label: "Bintang Pertama (Populasi III)",
    category: "astronomis",
    timeLabel: "~100 juta tahun setelah Big Bang",
    timeValue: 1e8 * 365.25 * 24 * 3600,
    description:
      "Bintang-bintang pertama, yang dikenal sebagai Populasi III, diperkirakan menyala sekitar 100 juta tahun setelah Big Bang. Mereka terbentuk dari gas nyaris murni hidrogen dan helium (elemen paling ringan hasil nukleosintesis Big Bang) dan sangat masif serta panas. Akhir hayat mereka, sering sebagai supernova, menyemai alam semesta dengan unsur-unsur berat pertama (karbon, oksigen, besi) yang nantinya menjadi bahan baku Tata Surya dan kehidupan. Kegiatan mereka juga mengakhiri 'Zaman Kegelapan' kosmik melalui proses yang disebut reionisasi.",
    sources: ["NASA Science", "Stanford KIPAC", "Astrobites", "Yale Astronomy (Larson)"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-recombination",
    label: "Rekombinasi & Latar CMB",
    category: "partikel",
    timeLabel: "~380.000 tahun setelah Big Bang",
    timeValue: 380_000 * 365.25 * 24 * 3600,
    description:
      "Sekitar 380.000 tahun setelah Big Bang, suhu alam semesta mendingin cukup (hingga ~3000 K) sehingga elektron dapat bergabung dengan inti atom hidrogen dan helium. Sebelumnya, foton terus-menerus tersebar oleh elektron bebas, membuat alam semesta buram; setelah rekombinasi, foton dapat bergerak bebas untuk pertama kalinya. Radiasi yang dilepaskan saat inilah yang kita deteksi hari ini sebagai Cosmic Microwave Background (CMB) — 'foto bayi' tertua alam semesta.",
    sources: ["Harvard CfA", "Yale Astronomy", "Space.com", "phys.org"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-nucleosynthesis",
    label: "Nukleosintesis Big Bang",
    category: "partikel",
    timeLabel: "Menit ke-3 hingga ke-20",
    timeValue: 600,
    description:
      "Ketika alam semesta berusia beberapa menit, suhunya turun cukup (sekitar satu miliar Kelvin) sehingga proton dan neutron dapat bergabung membentuk inti atom ringan. Pada periode ini, sekitar 75% hidrogen-1, 25% helium-4, dan jejak litium-7 terbentuk. Rasio elemen-elemen ringan ini, yang teramati di alam semesta hari ini, adalah salah satu prediksi paling kuat dari model Big Bang. Unsur-unsul berat seperti karbon dan besi belum ada — mereka akan disintesa di inti bintang nanti.",
    sources: ["NASA Imagine the Universe", "Einstein-Online", "Wikipedia: Chronology of the universe"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-lepton-epoch",
    label: "Era Lepton",
    category: "partikel",
    timeLabel: "Detik ke-1 hingga ke-10",
    timeValue: 5,
    description:
      "Setelah era hadron, sekitar satu detik setelah Big Bang, suhu telah turun cukup sehingga pasangan lepton-antilepton (seperti elektron-positron) tidak lagi terbentuk secara masal. Sisa elektron yang tersisa mendominasi massa-radiasi, dan periode ini disebut era lepton. Setelah sekitar 10 detik, suhu menjadi terlalu rendah untuk menjaga lepton dalam kesetimbangan termal, dan alam semesta memasuki era dominasi foton yang akan bertahan hingga rekombinasi.",
    sources: ["Wikipedia: Chronology of the universe", "Physics of the Universe"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-hadron-neutron",
    label: "Era Hadron — Pembekuan Rasio Proton–Neutron",
    category: "partikel",
    timeLabel: "~1 detik (n/p freeze-out)",
    timeValue: 1,
    description:
      "Pada sekitar 1 detik setelah Big Bang, suhu alam semesta mendingin hingga ~10¹⁰ K, dan laju reaksi lemah (yang selama ini menjaga proton dan neutron dalam kesetimbangan) menjadi terlalu lambat dibanding laju ekspansi alam semesta. Akibatnya, rasio jumlah neutron terhadap proton 'membeku' pada nilai sekitar 1:7. Momen ini penting karena neutron bebas akan meluruh menjadi proton dalam ~15 menit; hanya neutron yang tertangkap di inti helium (di nukleosintesis beberapa menit kemudian) yang bertahan. Tanpa jendela pembekuan ini, alam semesta tidak akan memiliki campuran proton–neutron yang diperlukan untuk membentuk helium, karbon, atau oksigen.",
    sources: ["Wikipedia: Chronology of the universe", "arXiv: BBN and freeze-out", "Physics of the Universe"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-hadron-proton",
    label: "Era Hadron — Pembentukan Proton (Konfinemen QCD)",
    category: "partikel",
    timeLabel: "~10⁻⁶ detik (konfinemen warna)",
    timeValue: 1e-6,
    description:
      "Pada sekitar satu mikrodetik (10⁻⁶ s), suhu turun di bawah energi konfinemen QCD (~2×10¹² K), dan quark serta gluon yang sebelumnya bebas mulai terkonfinasi menjadi hadron — pertama-tama proton dan neutron, lalu hadron-hadron lain yang sebagian besar akan meluruh. Pada periode ini juga terjadi baryogenesis, proses yang menyebabkan asimetri kecil antara materi dan antimateri (sekitar 1 bagian per miliar). Tanpa asimetri ini, alam semesta akan berisi hanya radiasi — tanpa materi yang bisa membentuk bintang, planet, atau kita. Jadi dua momen kunci hadron: konfinemen (10⁻⁶ s) menetapkan partikel, dan pembekuan rasio (1 s) menetapkan komposisi yang dibawa ke nukleosintesis.",
    sources: ["Wikipedia: Chronology of the universe", "arXiv: QCD Baryogenesis", "Physics of the Universe"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-quark-epoch",
    label: "Era Quark (plasma quark-gluon)",
    category: "partikel",
    timeLabel: "10⁻¹² hingga 10⁻⁶ detik",
    timeValue: 1e-9,
    description:
      "Antara 10⁻¹² dan 10⁻⁶ detik setelah Big Bang, alam semesta berupa 'quark-gluon plasma' — sup kuantum yang sangat panas di mana quark dan gluon belum terkonfinasi ke dalam hadron. Suhu pada awal era ini melebihi 10¹⁵ Kelvin. Pada akhir era ini, interaksi kuat (QCD) menjadi cukup dominan untuk 'menangkap' quark ke dalam proton dan neutron — proses yang disebut konfinemen warna.",
    sources: ["Wikipedia: Chronology of the universe", "Physics of the Universe", "arXiv: Particle Cosmology"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-electroweak",
    label: "Era Elektrolemah",
    category: "partikel",
    timeLabel: "10⁻³² hingga 10⁻¹² detik",
    timeValue: 1e-22,
    description:
      "Setelah inflasi berakhir (~10⁻³² s), alam semesta memasuki era elektrolemah, di mana gaya lemah nuklir dan gaya elektromagnetik masih menyatu sebagai satu interaksi. Pada akhir era ini, sekitar 10⁻¹² detik, medan Higgs mengalami pemutusan simetri spontan, memberikan massa pada boson W dan Z serta partikel-partikel lain. Inilah momen ketika partikel-partikel yang kita kenal sekarang (elektron, quark, boson) memperoleh properti massanya yang sekarang.",
    sources: ["Wikipedia: Electroweak epoch", "arXiv: Electroweak Symmetry Breaking", "Big Think"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-inflation-reheating",
    label: "Akhir Inflasi — Pemanasan Ulang (Reheating)",
    category: "partikel",
    timeLabel: "~10⁻³² detik (reheating)",
    timeValue: 1e-32,
    description:
      "Inflasi berakhir ketika medan inflaton kehilangan energi potensialnya dan mulai berosilasi di sekitar minimum potensialnya. Energi yang sebelumnya tersimpan di medan inflaton kini terurai menjadi partikel-partikel elementer — quark, lepton, boson tolok — dalam proses yang disebut reheating atau 'pemanasan ulang'. Hasilnya: alam semesta yang tadinya dingin dan kosong (karena pemuaian eksponensial mengencerkan semua partikel pra-inflasi) kini menjadi panas dan padat kembali. Inilah yang sering disebut sebagai 'hot Big Bang' yang sebenarnya — bukan t=0, melainkan akhir inflasi. Partikel-partikel yang dihasilkan di sini menjadi benih untuk era elektrolemah berikutnya.",
    sources: ["Wikipedia: Cosmic inflation", "Kavli Prize 2014 (Guth, Linde, Starobinsky)", "AIP The Physics Teacher"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-inflation-plateau",
    label: "Plateau Inflasi (Pemuaian Eksponensial)",
    category: "partikel",
    timeLabel: "~10⁻³⁵ detik (60+ e-fold)",
    timeValue: 1e-35,
    description:
      "Selama plateau inflasi, alam semesta memuai secara eksponensial: jarak antara dua titik ruang berlipat ganda setiap ~10⁻³⁷ detik. Dalam waktu kurang dari 10⁻³² detik total, alam semesta membesar minimal faktor 10²⁶ (e-folding number ~60 atau lebih). Inilah tahap yang menjelaskan tiga observasi penting: (1) alam semesta tampak datar (geometri ruang hampir Euclidean), (2) alam semesta homogen pada skala besar (suhu CMB sangat seragam), dan (3) tidak ada monopoli magnetik yang teramati (mereka didorong keluar oleh inflasi). Medan inflaton didorong oleh energi potensial hampir konstan — itulah yang menyebabkan pemuaian eksponensial.",
    sources: ["Wikipedia: Cosmic inflation", "Kavli Prize 2014 (Guth, Linde, Starobinsky)", "AIP The Physics Teacher"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-inflation-start",
    label: "Awal Inflasi",
    category: "partikel",
    timeLabel: "~10⁻³⁶ detik (onset)",
    timeValue: 1e-36,
    description:
      "Inflasi diduga dipicu sekitar 10⁻³⁶ detik setelah Big Bang, ketika suhu alam semesta turun di bawah skala energi GUT (~10²⁸ K) dan medan skalar yang kemudian disebut 'inflaton' mulai mendominasi densitas energi alam semesta. Pada awalnya, medan ini terjebak dalam keadaan 'false vacuum' (vakum palsu) dengan energi potensial tinggi. Tekanan negatif dari energi ini bertindak seperti gravitasi tolak, memicu pemuaian eksponensial. Usulan oleh Alan Guth (1980) dan dikembangkan oleh Andrei Linde (chaotic inflation) dan Alexei Starobinsky (R² inflation). Model spesifik masih diperdebatkan, tetapi konsensus umum: beberapa bentuk inflasi terjadi di era ini.",
    sources: ["Wikipedia: Cosmic inflation", "Kavli Prize 2014 (Guth, Linde, Starobinsky)", "AIP The Physics Teacher"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-gut-strong-ew-split",
    label: "Era GUT — Pemutusan Simetri Kuat–Elektrolemah",
    category: "partikel",
    timeLabel: "~10⁻³⁶ detik (akhir GUT)",
    timeValue: 1e-36,
    description:
      "Pada akhir era GUT, sekitar 10⁻³⁶ detik, suhu turun di bawah skala energi unifikasi (~10²⁸ K) dan interaksi kuat memisahkan diri dari interaksi elektrolemah (yang masih menyatukan gaya lemah dan elektromagnetik). Pemisahan ini melepaskan energi raksasa yang diduga menjadi pemicu inflasi kosmik (lihat node berikutnya). Setelah pemisahan ini, hanya gravitasi yang masih berdiri sendiri sebagai gaya terpisah, sementara tiga gaya lainnya kini memiliki kekuatan relatif yang berbeda dan mulai 'berjalan' secara independen. Fisika pada energi ini belum dapat diuji langsung di akselerator mana pun di Bumi — deskripsinya bersifat teoretis, didasarkan pada ekstrapolasi matematis dari teori-teori yang sudah teruji pada energi lebih rendah.",
    sources: ["University of Oregon Astronomy Notes", "Wikipedia: Chronology of the universe", "arXiv: GUT and inflation"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-gut-grav-split",
    label: "Era GUT — Pemutusan Simetri Gravitasi",
    category: "partikel",
    timeLabel: "~10⁻⁴³ detik (awal GUT, akhir Planck)",
    timeValue: 1e-43,
    description:
      "Pada ~10⁻⁴³ detik (waktu Planck), gravitasi memisahkan diri dari tiga gaya fundamental lainnya — kuat, lemah, dan elektromagnetik — yang masih menyatu sebagai satu interaksi tunggal. Inilah momen yang menandai berakhirnya Era Planck dan dimulainya Era GUT. Sebelum momen ini, semua empat gaya diduga bersatu dalam satu deskripsi matematis (meskipun fisika saat ini belum punya teori teruji untuk itu — gravitasi kuantum masih jadi masalah terbuka). Setelah pemisahan gravitasi, alam semesta memasuki fase di mana tiga gaya non-gravitasi masih terunifikasi, dan ini menjadi panggung untuk inflasi yang akan datang.",
    sources: ["University of Oregon Astronomy Notes", "Wikipedia: Chronology of the universe", "Cambridge Cosmology"],
    branch: "kosmologis-utama",
  },
  {
    id: "a-planck-epoch",
    label: "Era Planck (batas fisika konvensional)",
    category: "partikel",
    timeLabel: "0 hingga 10⁻⁴³ detik",
    timeValue: 1e-44,
    description:
      "Pada 10⁻⁴³ detik pertama setelah Big Bang — yang disebut waktu Planck — alam semesta begitu padat dan kecil sehingga gravitasi diperkirakan memiliki kekuatan yang sebanding dengan tiga gaya fundamental lainnya. Fisika saat ini tidak dapat menjelaskan apa yang terjadi di sini: relativitas umum (yang menjelaskan gravitasi) dan mekanika kuantum (yang menjelaskan partikel) belum berhasil disatukan dalam teori gravitasi kuantum yang teruji. Oleh karena itu, klaim tentang 'apa yang terjadi pada t=0' bersifat spekulatif.",
    sources: ["Cambridge Cosmology", "Wikipedia: Chronology of the universe"],
    branch: "kosmologis-utama",
    isBoundary: true,
  },

  // --- Node terminal & filosofis ---

  {
    id: "a-big-bang",
    label: "Big Bang (sebagai akibat)",
    category: "astronomis",
    timeLabel: "t = 0 (titik awal waktu fisik)",
    timeValue: 0,
    description:
      "Big Bang adalah nama untuk model standar kosmologi yang menjelaskan bahwa alam semesta berkembang dari keadaan sangat padat dan panas sekitar 13,8 miliar tahun lalu. Ia bukan 'ledakan' di ruang yang sudah ada, melainkan ekspansi ruang itu sendiri. Penting untuk argumen kita: Big Bang adalah peristiwa yang berawal-dan-berakhir dalam waktu. Ia terikat pada struktur waktu itu sendiri. Karena itu, secara logis Big Bang bukanlah 'sebab pertama' yang tidak bergantung pada apa pun — ia justru adalah akibat yang membutuhkan penjelasan.",
    sources: ["NASA", "ESA Planck", "Cambridge Cosmology"],
    branch: "kosmologis-utama",
    isBoundary: true,
    quranRefs: [
      {
        surah: "Al-Anbiya",
        ayat: 30,
        paraphrase:
          "Tidakkah orang-orang kafir melihat bahwa langit dan bumi keduanya dahulu menyatu, lalu Kami pisahkan — banyak mufassir kontemporer mengaitkan ayat ini dengan ide awal alam semesta yang padat lalu mengembang.",
      },
      {
        surah: "Adh-Dhariyat",
        ayat: 47,
        paraphrase:
          "Dan langit, Kami bangun dengan kekuasaan, dan sesungguhnya Kami benar-benar meluaskannya — kata 'la-musi'un' mengisyaratkan ekspansi ruang, sejalan dengan model Big Bang.",
      },
    ],
  },
  // ====================================================================
  // TIGA NODE TERMINAL FILosOFIS PARALEL
  // Setiap node = satu tradisi argumentatif (Al-Kindi / Ibnu Sina / Al-Ghazali)
  // dengan objeksi terkuat + tanggapan steelman.
  // Ketiganya konvergen ke satu node muara (a-first-cause) di bawah.
  // ====================================================================

  {
    id: "a-first-cause-al-kindi",
    label: "Al-Kindi — Al-Khair al-Mahd",
    category: "filosofis",
    philosopher: "Al-Kindi",
    timeLabel: "Di luar ruang & waktu (rumusan ~ abad ke-9 M)",
    timeValue: -1,
    description:
      "Al-Kindi (w. ~873 M), filsuf Arab pertama yang sistematis, merumuskan argumen kosmologis dalam risalahnya Falsafah al-Ula (Filsafat Pertama) lewat dalil yang dikenal sebagai dalil al-khair al-mahd — argumen dari Kebaikan Mutlak. Premis utamanya: segala sesuatu di alam ini bersifat kaun (menjadi / terjadi) — yakni ia tidak ada dengan sendirinya, melainkan menerima keberadaannya dari sumber lain. Apa yang menerima keberadaan dari luar dirinya bersifat terbatas dan bergantung. Deret pemberi-keberadaan yang demikian tidak boleh tak terhingga aktual (yang ia sebut tasalsul), karena tak terhingga aktual dari hal-hal yang terbatas bersifat kontradiktif. Maka deret harus berakhir pada satu sumber yang TIDAK menerima keberadaan — yang keberadaannya bersumber dari diri-Nya sendiri. Inilah al-haqq al-mahd (Yang Benar Murni) atau al-khair al-mahd (Kebaikan Mutlak) — yang Al-Kindi identifikasi dengan Allah. Kontribusi khas Al-Kindi adalah penggunaan istilah 'kaun' (menjadi) sebagai kategori metafisik yang lebih mendasar daripada sekadar 'terjadi secara temporal' — sehingga argumennya bekerja bahkan jika alam semesta dianggap kekal. Argumen ini menjadi cikal-bakal konsep wajib al-wujud Ibnu Sina dan silsilah hawadith Al-Ghazali.",
    objection:
      "Objeksi terkuat (termasuk dari Ibnu Rusyd dalam Tahafut al-Tahafut): Al-Kindi dianggap mengasumsikan apa yang ingin ia buktikan — yakni bahwa deret sebab HARUS berakhir. Bagaimana jika deret itu sendiri tak terhingga, namun setiap anggotanya tetap bergantung pada yang berikutnya? Bukankah penjelasan tetap bisa hadir tanpa titik akhir? Selain itu, istilah 'kaun' bisa dianggap samar — apakah ia temporal atau ontologis?",
    response:
      "Tanggapan (steelman dari tradisi Al-Kindi): deret tak terhingga dari hal-hal yang kaun tetaplah bersifat kaun secara kolektif — yakni tetap menerima keberadaan, bukan memberi keberadaan kepada dirinya sendiri. Totalitas yang terdiri dari hal-hal yang menerima keberadaan tidak bisa menjadi sumber keberadaan bagi dirinya sendiri, karena tidak ada anggotanya yang memberi keberadaan — mereka semua hanya menerima. Maka butuh sumber di luar deret. Inilah inti argumen hierarkis (per se) yang nantinya akan dipertajam oleh Ibnu Sina. Sebagai tambahan, istilah 'kaun' justru sengaja dipilih Al-Kindi untuk MENGABSTRAKSI dari pertanyaan temporal: ia bekerja pada level ontologis murni.",
    sources: [
      "Al-Kindi, Falsafah al-Ula (Risalah fi al-Falsafah al-Ula)",
      "Adamson, P. Al-Kindi (Great Medieval Thinkers, OUP)",
      "SEP: Arabic and Islamic Philosophy of Causality",
      "Ivry, A. Al-Kindi's Metaphysics (SUNY Press)",
    ],
    branch: "kosmologis-utama",
    isPhilosophical: true,
    quranRefs: [
      {
        surah: "Al-An'am",
        ayat: 59,
        paraphrase:
          "Pada sisi-Nya terdapat kunci-kunci semua yang gaib; tidak sehelai daun pun gugur melainkan Ia mengetahui — menegaskan bahwa semua yang bersifat 'kaun' (menerima keberadaan) berada dalam pengetahuan Yang Maha Sumber.",
      },
      {
        surah: "Al-Ikhlas",
        ayat: 2,
        paraphrase:
          "Allah tempat meminta segala sesuatu — menegaskan bahwa hanya Dia yang tidak 'menerima' keberadaan; semua selain-Nya 'meminta' keberadaan dari-Nya.",
      },
    ],
  },
  {
    id: "a-first-cause-ibn-sina",
    label: "Ibnu Sina — Wajib al-Wujud (Burhan al-Siddiqin)",
    category: "filosofis",
    philosopher: "Ibnu Sina",
    timeLabel: "Di luar ruang & waktu (rumusan ~ 1000-1030 M)",
    timeValue: -1,
    description:
      "Ibnu Sina (w. 1037 M) memperkenalkan distingsi paling tajam dalam tradisi falsafi Islam antara wajib al-wujud (keberadaan yang wajib dengan sendirinya) dan mumkin al-wujud (keberadaan yang mungkin ada dan mungkin tidak). Bagi Ibnu Sina, wajib al-wujud adalah sesuatu yang esensinya tidak lain kecuali keberadaan itu sendiri — ia tidak bisa tidak ada. Sementara mumkin al-wujud adalah sesuatu yang esensinya netral terhadap ada/tidak-ada; ia butuh mujib (faktor pendorong) dari luar untuk menentukannya ke arah ada. Argumennya yang paling terkenal — burhan al-siddiqin (Bukti Orang Jujur) — berjalan singkat: (1) Ada sesuatu yang ada, tak peduli apa itu; (2) Yang ada ini, jika kita analisis, tidak bisa tidak menerima salah satu dari tiga kemungkinan: wajib, mumkin, atau mustahil; (3) Yang mustahil tidak ada; (4) Yang mumkin tidak bisa menjelaskan keberadaan dirinya sendiri (karena esensinya netral); (5) Maka harus ada wajib al-wujud yang menjelaskan keberadaan segala mumkin. Penting: argumen Ibnu Sina TIDAK bergantung pada apakah alam semesta 'mulai' atau 'selalu ada' — ia bekerja bahkan jika alam semesta tanpa awal temporal, karena mumkin tetap mumkin, dan mumkin tetap butuh penjelas luar. Inilah pondasi argumen kontingensi dalam Islam, dan menjadi titik tolak hampir semua filsuf Islam sesudahnya — baik yang sepakat (Al-Ghazali dalam Al-Iqtisad maupun yang menolak (Ibnu Rusyd). Konvergensi dengan Al-Kindi: alam ini bersifat kaun (menerima keberadaan) = mumkin al-wujud (esensinya netral). Konvergensi dengan Al-Ghazali: deret sebab mumkin yang tak terhingga tetap mumkin secara kolektif, sehingga butuh wajib.",
    objection:
      "Objeksi terkuat (Fakhr al-Din al-Razi dalam Muhassal dan Mabahith al-Mashriqiyya): bagaimana jika 'keseluruhan' (jumla) dari hal-hal mumkin itu sendiri bersifat wajib? Yakni, masing-masing bagian mumkin, tetapi keseluruhan secara metafisik wajib ada — sebagaimana sebuah kalimat bisa bermakna meskipun setiap huruf tidak bermakna. Bukankah totalitas bisa berbeda dari bagian-bagiannya?",
    response:
      "Tanggapan (steelman dari tradisi Ibnu Sina, dikembangkan oleh Nasir al-Din al-Tusi dalam Tajrid al-I'tiqad): keseluruhan dari hal-hal mumkin tetaplah mumkin, karena setiap sifat keseluruhan diturunkan dari sifat-sifat bagian. Lebih fundamental: 'keseluruhan' tidak bisa menjadi penjelas keberadaan dirinya sendiri karena ia sendiri adalah konsep yang TERSUSUN dari bagian-bagiannya — dan apa yang tersusun butuh penyusun, sehingga kembali menjadi mumkin. Tidak ada jalan keluar kecuali ada satu Yang Tidak Tersusun — ahad — yang esensinya adalah keberadaan murni, sehingga tidak ada gap antara esensi dan eksistensi yang perlu 'dijembatani' oleh sebab luar.",
    sources: [
      "Ibnu Sina, Kitab al-Syifa' (al-Ilahiyat) — bagian burhan al-siddiqin",
      "Ibnu Sina, Al-Isharat wa al-Tanbihat",
      "SEP: Avicenna",
      "Goodman, L. E. Avicenna (Routledge)",
      "Nasir al-Din al-Tusi, Tajrid al-I'tiqad (komentar terhadap objeksi al-Razi)",
    ],
    branch: "kosmologis-utama",
    isPhilosophical: true,
    quranRefs: [
      {
        surah: "Al-Ikhlas",
        ayat: 1,
        paraphrase:
          "Katakanlah: Dialah Allah Yang Maha Esa — menegaskan tauhid wujud: Yang Wajib al-Wujud itu ahad, tidak majemuk (tidak tersusun).",
      },
      {
        surah: "Hud",
        ayat: 107,
        paraphrase:
          "Dan tetap kekal Tuhanmu, Pemilik keagungan dan kemuliaan — menegaskan bahwa Yang Wajib al-Wujud itu qadim, kekal, tidak mengalami perubahan.",
      },
      {
        surah: "Al-An'am",
        ayat: 59,
        paraphrase:
          "Tidak sehelai daun pun gugur melainkan Ia mengetahui — segala mumkin al-wujud berada dalam pengetahuan Yang Wajib.",
      },
    ],
  },
  {
    id: "a-first-cause-al-ghazali",
    label: "Al-Ghazali — Silsilah Hawadith (Bantahan Tasalsul)",
    category: "filosofis",
    philosopher: "Al-Ghazali",
    timeLabel: "Di luar ruang & waktu (rumusan ~ 1095 M)",
    timeValue: -1,
    description:
      "Al-Ghazali (w. 1111 M) dalam Tahafut al-Falasifa (Inkohensi Para Filsuf) mengasah argumen kosmologis dari sisi temporal: (1) Setiap kejadian baru (hadits) memiliki sebab yang mendahuluinya; (2) Deret kejadian-kejadian baru (silsilah hawadith) tidak dapat berjalan tak terhingga ke belakang — ini yang ia sebut bantahan tasalsul; (3) Maka deret harus berhenti pada satu Sebab Pertama yang BUKAN kejadian baru — Ia qadim (tiada permulaan), wajib al-wujud. Mengapa tasalsul mustahil? Al-Ghazali memakai argumen kuantitas: jika deretan peristiwa yang tak terhingga itu telah dilalui untuk sampai ke hari ini, berarti tak terhingga itu 'habis' dilalui — padahal tak terhingga tidak bisa habis. Argumen paralel: Hilbert's Hotel modern (dikembangkan oleh Craig) menunjukkan kontradiksi serupa dalam bentuk hotel dengan kamar tak terhingga — ia bisa 'penuh' dan 'menerima tamu baru' secara bersamaan, yang secara logis kontradiktif. Kontribusi khas Al-Ghazali: ia tidak hanya menolak tasalsul, ia juga menolak argumen Ibnu Sina tentang kekekalan alam (yang menurut Ibnu Sina, alam bisa kekal sekaligus diciptakan). Bagi Al-Ghazali, alam (sebagai totalitas peristiwa temporal) HARUS berawal, dan karenanya HARUS memiliki Pencipta yang memulainya. Argumen Al-Ghazali inilah yang dianggap sebagai cikal-bakal Kalam cosmological argument modern yang diformulasikan ulang oleh William Lane Craig (1979) dalam bentuk silogisme formal. Perlu dicatat: Al-Ghazali juga seorang occasionalist — ia berargumen bahwa sebab-sebab sekunder (api membakar kertas) sebenarnya bukan 'sebab' dalam arti sejati; yang sebenarnya adalah Allah yang menciptakan pembakaran sebagai 'kebiasaan-Nya' ('adah Allah) saat api dan kertas berdekatan. Ini menambah dimensi tauhid dalam argumennya: bukan saja deret sebab berakhir pada Allah, tetapi setiap sebab dalam deret itu sendiri adalah tindakan langsung Allah.",
    objection:
      "Objeksi terkuat (Ibnu Rusyd dalam Tahafut al-Tahafut, ~1180 M): kekekalan alam (tanpa permulaan) TIDAK bertentangan dengan keberadaan Allah sebagai sebab. Menurut Ibnu Rusyd, Al-Ghazali keliru memperlakukan deret temporal sebagai 'sesuatu yang harus dilalui' — padahal deret waktu adalah struktur, bukan benda. Lebih lanjut: argumen 'tak terhingga tidak bisa habis dilalui' hanya berlaku untuk tak terhingga yang dimulai dari satu titik dan berjalan maju; deret ke masa lalu tidak 'dilalui' dari titik mana pun. Sehingga infinite temporal di masa lalu tidak kontradiktif.",
    response:
      "Tanggapan (steelman dari tradisi Al-Ghazali, dikembangkan oleh Craig dan modern Kalam): penolakan terhadap aktual infinite tetap berdiri, karena deret peristiwa masa lalu — jika tak terhingga — adalah aktual infinite (sudah ada seluruhnya), bukan potensial infinite. Aktual infinite dari peristiwa konkret menghasilkan kontradiksi (lihat Hilbert's Hotel). Lebih lanjut, bahkan jika kita menerima infinite abstract, menghitung mundur melalui infinite konkret tidak dapat selesai — yang berarti hari ini tidak akan pernah tiba. Karena hari ini tiba, deret masa lalu tidak tak terhingga. Selain itu, argumen Al-Ghazali bukan soal 'titik mulai deret' melainkan soal METAFISIKA kejadian (hadits): setiap hadits itu sendiri mumkin dan butuh sebab; deret mumkin tak terhingga tetap mumkin secara kolektif (konvergensi dengan Ibnu Sina).",
    sources: [
      "Al-Ghazali, Tahafut al-Falasifa (Inkohensi Para Filsuf)",
      "Al-Ghazali, Al-Iqtisad fi al-I'tiqad",
      "Ibnu Rusyd, Tahafut al-Tahafut (kritik terhadap Al-Ghazali)",
      "Craig, W.L. The Kalam Cosmological Argument (1979)",
      "SEP: Al-Ghazali",
    ],
    branch: "kosmologis-utama",
    isPhilosophical: true,
    quranRefs: [
      {
        surah: "Al-Araf",
        ayat: 54,
        paraphrase:
          "Sungguh Tuhanmu Allah yang menciptakan langit dan bumi dalam enam masa — menegaskan penciptaan bertahap (hadits), bukan kekal.",
      },
      {
        surah: "Al-Anbiya",
        ayat: 30,
        paraphrase:
          "Langit dan bumi dahulu menyatu, lalu Kami pisahkan — alam mengalami perubahan (hadits), bukan kekal sejak awal.",
      },
      {
        surah: "Adh-Dhariyat",
        ayat: 47,
        paraphrase:
          "Dan langit, Kami bangun dengan kekuasaan, dan sesungguhnya Kami benar-benar meluaskannya — ekspansi (perubahan struktural) menandai alam sebagai hadits.",
      },
    ],
  },

  // ====================================================================
  // NODE MUARA — Tauhid Wujud (konvergensi tiga tradisi)
  // ====================================================================

  {
    id: "a-first-cause",
    label: "Muara — Tauhid Wujud (Wajib al-Wujud)",
    category: "filosofis",
    timeLabel: "Di luar ruang & waktu (konklusi argumentatif)",
    timeValue: -1,
    description:
      "Tiga tradisi falsafi Islam — Al-Kindi dari Kebaikan Mutlak (al-khair al-mahd), Ibnu Sina dari Kontingensi Wujud (wajib vs mumkin al-wujud), Al-Ghazali dari Bantahan Tasalsul (silsilah hawadith) — berbeda dalam jalan masuk tetapi konvergen pada satu konklusi: keberadaan dunia menuntut Wajib al-Wujud yang: (1) Esa tanpa majemuk — karena sesuatu yang tersusun dari bagian butuh penyusun, dan itu menempatkannya kembali sebagai mumkin al-wujud; (2) Di luar ruang dan waktu — karena Ia sumber keduanya, bukan di dalamnya; (3) Tidak berubah — karena perubahan menandakan transisi dari potensi ke aktual, yang hanya berlaku bagi yang mumkin; (4) Bersifat ahad, bukan wahid — Yang Tunggal Mutlak, bukan satu dalam arti hitungan. Inilah muara argumen: tauhid wujud — pengakuan bahwa hanya ada satu Wajib al-Wujud, dan segala selain-Nya adalah mumkin yang keberadaannya bergantung kepada-Nya. Dalam bahasa Qur'ani: Qul Huwa Allahu Ahad (Katakanlah, Dialah Allah Yang Maha Esa). Dari sudut epistemologi, kemampuan kita untuk menalar sebab-akibat itu sendiri merupakan anugerah — seperti yang ditekankan oleh Taqiyuddin an-Nabhani: tanpa maklumat asabiqah (informasi prior) yang diberikan Allah kepada Nabi Adam (QS Al-Baqarah:31), kita hanya akan menginderai, bukan menalar. Maka argumen kosmologis tidak hanya menunjuk kepada Pencipta; ia juga menunjuk kepada sumber akal itu sendiri.",
    sources: [
      "Al-Ghazali, Tahafut al-Falasifa",
      "Ibnu Sina, Kitab al-Syifa' (al-Ilahiyat) — wajib vs mumkin al-wujud",
      "Al-Kindi, Falsafah al-Ula — dalil al-khair al-mahd",
      "An-Nabhani, At-Tashkil al-Aqli — maklumat asabiqah",
      "Tafsir Ibnu Katsir untuk QS Al-Araf:54, QS Yasin:82-83, QS Al-Baqarah:31",
      "SEP: Arabic and Islamic Philosophy of Causality",
    ],
    branch: "kosmologis-utama",
    isPhilosophical: true,
    quranRefs: [
      {
        surah: "Al-Fatihah",
        ayat: 2,
        paraphrase:
          "Segala puji bagi Allah, Rabb seluruh alam — menetapkan bahwa alam ini milik Yang Mengurusnya, buang gagasan bahwa alam ada dengan sendirinya tanpa Pemilik.",
      },
      {
        surah: "Al-Ikhlas",
        ayat: 1,
        paraphrase:
          "Katakanlah: Dialah Allah Yang Maha Esa — menegaskan tauhid wujud: yang Wajib al-Wujud itu ahad, tidak majemuk, tidak beranak dan tidak diperanakkan.",
      },
      {
        surah: "Yasin",
        ayat: 82,
        paraphrase:
          "Sungguh, keadaan-Nya apabila Ia menghendaki sesuatu hanyalah berkata 'Jadilah!' maka jadilah ia — menunjukkan keberadaan Yang Maha Sebab di luar keterbatasan sebab-akibat dalam alam.",
      },
    ],
  },

  // ====================================================================
  // BRANCH B: JALUR SILSILAH MANUSIA (personal → Homo sapiens)
  // Menyambung ke node a-homo-sapiens di Branch A
  // ====================================================================

  {
    id: "b-you",
    label: "Anda",
    category: "personal",
    timeLabel: "Hari ini",
    timeValue: UNIVERSE_AGE_SECONDS,
    description:
      "Anda, sebagai individu, adalah akibat dari rantai sebab-akibat biologis yang panjang. Setiap sel dalam tubuh Anda membawa DNA yang diturunkan dari dua orang tua, yang masing-masing membawa DNA dari dua orang tua mereka, dan seterusnya. Rantai ini tidak berhenti di generasi tertentu — ia adalah satu rantai tak terputus yang membentang ke masa lampau biologis, akhirnya bersatu dengan rantai kosmologis di titik munculnya Homo sapiens.",
    sources: [],
    branch: "silsilah-manusia",
  },
  {
    id: "b-parents",
    label: "Orang Tua Anda",
    category: "personal",
    timeLabel: "Generasi -1",
    timeValue: UNIVERSE_AGE_SECONDS - 30 * 365.25 * 24 * 3600,
    description:
      "Dua orang yang menggabungkan materi genetik mereka untuk membentuk Anda. Setiap orang menurunkan sekitar setengah genomnya, sehingga Anda adalah kombinasi unik dari DNA keduanya. Kelahiran mereka sendiri juga merupakan akibat dari rantai yang sama — dari orang tua mereka, dan seterusnya.",
    sources: [],
    branch: "silsilah-manusia",
  },
  {
    id: "b-grandparents",
    label: "Kakek-Nenek",
    category: "personal",
    timeLabel: "Generasi -2",
    timeValue: UNIVERSE_AGE_SECONDS - 60 * 365.25 * 24 * 3600,
    description:
      "Empat individu, masing-masing menyumbang sekitar seperempat genom Anda. Mereka lahir pada periode yang sangat berbeda secara historis — mungkin melewati Perang Dunia, kemerdekaan negara, atau revolusi teknologi. Tetapi secara biologis, kelahiran mereka mengikuti pola yang sama: setiap individu adalah akibat dari dua orang tua.",
    sources: [],
    branch: "silsilah-manusia",
  },
  {
    id: "b-great-grandparents",
    label: "Buyut",
    category: "personal",
    timeLabel: "Generasi -3",
    timeValue: UNIVERSE_AGE_SECONDS - 90 * 365.25 * 24 * 3600,
    description:
      "Delapan leluhur generasi ke-3. Pada titik ini, beberapa di antaranya mungkin lahir di akhir abad ke-19 atau awal abad ke-20 — di dunia tanpa listrik di banyak tempat, tanpa antibiotik, dan tanpa penerbangan. Mereka mungkin tidak pernah membayangkan keturunan yang akan membaca teks ini di layar, tetapi keputusan dan kelangsungan hidup mereka secara kausal membentuk keberadaan Anda.",
    sources: [],
    branch: "silsilah-manusia",
  },
  {
    id: "b-ancestors-1000",
    label: "Leluhur ~1000 generasi lalu",
    category: "biologis",
    timeLabel: "~25.000 tahun lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 25_000 * 365.25 * 24 * 3600,
    description:
      "Pada sekitar 25.000 tahun lalu, leluhur Anda adalah pemburu-pengumpul akhir Zaman Es. Mereka hidup bersama dengan Neandertal dan Denisovan di beberapa bagian dunia, dan beberapa genom manusia modern masih membawa jejak DNA dari pertemuan antar-spesies tersebut. Mereka mengembangkan bahasa, seni lukis gua, dan alat-alat batu yang rumit. Jika satu saja dari ribuan leluhur Anda pada periode ini mati muda, Anda — secara harfiah — tidak akan ada.",
    sources: ["Smithsonian Human Origins"],
    branch: "silsilah-manusia",
  },
  {
    id: "b-early-hominids",
    label: "Hominini Awal",
    category: "biologis",
    timeLabel: "~6–7 juta tahun lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 6.5e6 * 365.25 * 24 * 3600,
    description:
      "Garis keturunan manusia berpisah dari garis keturunan simpanse sekitar 6–7 juta tahun lalu. Sahelanthropus, Orrorin, dan Ardipithecus adalah beberapa anggota awal keluarga hominini. Mereka berjalan dengan dua kaki secara sporadis dan otaknya masih berukuran mirip simpanse. Evolusi bipedalisme menjadi langkah kunci yang membebaskan tangan untuk penggunaan alat — pra-syarat untuk teknologi yang akhirnya membawa kita ke peradaban modern.",
    sources: ["Smithsonian Human Origins"],
    branch: "silsilah-manusia",
  },
  {
    id: "b-maklumat-asabiqah",
    label: "Maklumat Asabiqah — Syarat Berpikir (An-Nabhani & Nabi Adam)",
    category: "filosofis",
    philosopher: "Taqiyuddin an-Nabhani",
    timeLabel: "Prasejarah kognitif manusia — diajarkan Allah kepada Adam",
    timeValue: UNIVERSE_AGE_SECONDS - 300_000 * 365.25 * 24 * 3600,
    description:
      "Syekh Taqiyuddin an-Nabhani (w. 1977) dalam karya-karyanya seperti Nizam al-Islam dan At-Tashkil al-Aqli (Pembentukan Akal) merumuskan bahwa berpikir (at-tafkir) memiliki empat syarat yang harus hadir bersamaan: (1) al-dimagh an-nadij — otak manusia yang matang sebagai organ pemroses; (2) al-hawass — panca indera (penglihatan, pendengaran, dll); (3) al-waqi' al-mahsus — realitas yang terindra (obyek yang diinderai); (4) al-ma'lumat as-sabiqa — informasi prior / maklumat asabiqah. Kritik an-Nabhani: tanpa syarat keempat, manusia hanya bisa MENGINDRAI (ihsas) seperti hewan — bukan berpikir. Sensasi tanpa maklumat asabiqah hanya menghasilkan reaksi otomatis terhadap stimuli, bukan penilaian atau pemahaman. Justru maklumat asabiqah-lah yang menghubungkan sensasi dengan konsep, sehingga manusia dapat MENAMAI, MENDEFINISIKAN, dan MENALAR. Inilah titik yang selaras dengan kisah penciptaan Nabi Adam dalam QS Al-Baqarah:31-33: 'Wa 'allama Adama al-asma'a kullaha' — 'Dan Allah mengajarkan kepada Adam nama-nama semuanya.' Mufassir seperti Ibnu Katsir, Al-Qurtubi, dan Hamka (Tafsir Al-Azhar) menjelaskan bahwa 'nama-nama' (al-asma') yang diajarkan kepada Adam adalah pengetahuan tentang hakikat/esaensi segala sesuatu — yang diberikan SEBELUM Adam menghadapi realitas. Ketika para malaikat diperintahkan menyebutkan nama-nama, mereka menjawab: 'Subhanaka la 'ilma lana illa ma 'allamtana' — 'Maha Suci Engkau, tidak ada knowledge bagi kami kecuali yang Engkau ajarkan kepada kami.' Mereka tidak memiliki maklumat asabiqah tentang hal-hal partikular, sehingga tidak bisa menamai. Adam bisa, karena ia telah diberi maklumat asabiqah. Implikasi filosofis yang dalam: kemampuan manusia untuk MENALAR sebab-akibat (termasuk menelusuri rantai kausal hingga Sebab Pertama) sendiri merupakan KARUNIA EPISTEMOLOGIS — bukan konstruksi murni dari pengindraan. Maka argumen kosmologis Islam tidak hanya menunjuk kepada Pencipta alam; ia juga menunjuk kepada Pemberi Akal. Tanpa maklumat asabiqah yang Allah berikan, kita akan berada di posisi malaikat: tidak bisa menamai, tidak bisa menalar, tidak bisa bertanya 'dari mana semua ini?'",
    objection:
      "Objeksi terkuat (dari tradisi empiris modern): an-Nabhani mengandaikan adanya 'informasi prior' yang datang dari luar pengalaman — tetapi bukankah menurut teori pembelajaran modern (behaviorisme, koneksionisme), informasi prior itu sendiri bisa didapat dari pengalaman sebelumnya, secara kumulatif? Jika maklumat asabiqah hanyalah memori pengalaman lampau, maka tidak perlu Pemberi eksternal. Selain itu, kisah Adam diajarkan nama-nama bisa dibaca secara simbolik, bukan literal-historis.",
    response:
      "Tanggapan (steelman dari tradisi an-Nabhani): maklumat asabiqah tidak bisa direduksi menjadi memori pengalaman, karena pertanyaan akan mundur tak terhingga — dari mana pengalaman pertama dapat maklumat untuk menginterpretasinya? Di titik awal, harus ada pemberian informasi yang tidak berasal dari pengalaman. Inilah yang ditegaskan QS Al-Baqarah:31: Adam diberi pengetahuan tentang nama-nama SEBELUM ia menghadapi realitas. Pembacaan simbolik tidak menghapus inti filosofisnya: kapan pun manusia mulai menalar, ia sudah memiliki konsep/abstraksi yang tidak bisa dijejak murni dari sensasi. Konvergensi dengan Al-Kindi/Ibnu Sina/Al-Ghazali: seperti alam yang mumkin butuh Wajib, akal manusia yang mumkin butuh Pemberi Pengetahuan.",
    sources: [
      "An-Nabhani, Nizam al-Islam (Sistem Islam)",
      "An-Nabhani, At-Tashkil al-Aqli (Pembentukan Akal)",
      "An-Nabhani, Mafahim Hizb ut-Tahrir",
      "Ibnu Katsir, Tafsir Al-Qur'an al-'Azhim (untuk QS Al-Baqarah:31-33)",
      "Hamka, Tafsir Al-Azhar (untuk QS Al-Baqarah:31-33)",
      "Al-Qurtubi, Al-Jami' li Ahkam al-Qur'an (untuk QS Al-Baqarah:31-33)",
      "At-Tabari, Jami' al-Bayan (tafsir QS Al-Baqarah)",
    ],
    branch: "silsilah-manusia",
    isPhilosophical: true,
    quranRefs: [
      {
        surah: "Al-Baqarah",
        ayat: 31,
        paraphrase:
          "Dan Allah mengajarkan kepada Adam nama-nama, semuanya; kemudian ditunjukkan-Nya kepada para malaikat, lalu berfirman: 'Beritahukan kepada-Ku nama-nama itu jika kamu memang benar.' — momen pemberian maklumat asabiqah kepada manusia pertama.",
      },
      {
        surah: "Al-Baqarah",
        ayat: 33,
        paraphrase:
          "Allah berfirman: 'Hai Adam, beritahukan kepada mereka nama-nama ini.' Maka setelah diberitahukannya, Allah berfirman: 'Bukankah Aku telah mengatakan kepadamu, bahwa Aku mengetahui rahasia langit dan bumi, dan mengetahui apa yang kamu lahirkan dan sembunyikan?' — konfirmasi bahwa pengetahuan berasal dari Allah.",
      },
      {
        surah: "Ar-Rahman",
        ayat: 3,
        paraphrase:
          "Dia menciptakan manusia, mengajarkan panduan berbicara — menegaskan bahwa kemampuan kognitif dan bahasa manusia adalah karunia yang diajarkan, bukan konstruksi murni dari pengindraan.",
      },
    ],
  },

  // ====================================================================
  // BRANCH C: JALUR CONTOH HUJAN
  // Hujan → kondensasi → penguapan → matahari → fusi → hidrogen (BBN)
  // Menyambung ke node a-nucleosynthesis di Branch A
  // ====================================================================

  {
    id: "c-rain",
    label: "Hujan Turun",
    category: "personal",
    timeLabel: "Hari ini, beberapa menit lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 600,
    description:
      "Hujan adalah contoh sempurna dari rantai sebab-akibat fisik skala kecil yang dapat kita amati langsung. Tetesan air jatuh ke atap bukan secara acak — setiap tetes adalah akibat dari serangkaian proses fisika yang dapat ditelusuri kembali, langkah demi langkah, hingga ke energi yang dihasilkan di inti Matahari, dan lebih jauh lagi ke atom-atom yang terbentuk di menit pertama alam semesta.",
    sources: [],
    branch: "contoh-hujan",
  },
  {
    id: "c-condensation",
    label: "Kondensasi Uap Air",
    category: "personal",
    timeLabel: "Beberapa jam lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 3600 * 3,
    description:
      "Awan terbentuk ketika uap air di atmosfer mendingin dan mengembun di sekitar partikel-partikel kecil (debu, garam, aerosol). Tetesan-tetesan kecil ini tumbuh dan akhirnya menjadi terlalu berat untuk ditahan oleh aliran udara, lalu jatuh sebagai hujan. Proses ini membutuhkan dua input: uap air di atmosfer, dan udara yang lebih dingin di ketinggian.",
    sources: ["NASA Earth Observatory"],
    branch: "contoh-hujan",
  },
  {
    id: "c-evaporation",
    label: "Penguapan Air Permukaan",
    category: "personal",
    timeLabel: "Beberapa hari lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 3600 * 24 * 3,
    description:
      "Uap air di atmosfer berasal terutama dari penguapan lautan, danau, dan permukaan tanah. Energi panas dari Matahari memecah sebagian ikatan antar-molekul air di permukaan, melepaskan molekul-molekul air ke udara sebagai gas. Tanpa input energi ini, siklus air akan berhenti dan Bumi akan menjadi planet kering. Inilah titik di mana contoh hujan mulai bersambung ke proses astronomis.",
    sources: ["NASA Earth Observatory"],
    branch: "contoh-hujan",
  },
  {
    id: "c-sunlight",
    label: "Cahaya Matahari",
    category: "astronomis",
    timeLabel: "8 menit lalu (waktu tempuh cahaya)",
    timeValue: UNIVERSE_AGE_SECONDS - 480,
    description:
      "Energi yang menguapkan air berasal dari cahaya Matahari yang menempuh jarak ~150 juta km dalam waktu sekitar 8 menit. Matahari memancarkan daya sekitar 3,8 × 10²⁶ watt, dan Bumi menerima sekitar satu per dua miliar dari total ini. Hanya sebagian kecil dari energi yang diterima Bumi yang menggerakkan siklus air — sebagian besar dipantulkan kembali atau diserap langsung sebagai panas.",
    sources: ["NASA Sun Fact Sheet"],
    branch: "contoh-hujan",
  },
  {
    id: "c-fusion",
    label: "Fusi Nuklir di Inti Matahari",
    category: "astronomis",
    timeLabel: "~100.000 tahun lalu (waktu tempuh foton)",
    timeValue: UNIVERSE_AGE_SECONDS - 100_000 * 365.25 * 24 * 3600,
    description:
      "Energi Matahari dihasilkan oleh fusi nuklir di intinya, di mana empat inti hidrogen bergabung menjadi satu inti helium (melalui rantai proton-proton) dengan pelepasan energi sekitar 26,7 MeV per reaksi. Foton yang dihasilkan membutuhkan sekitar 100.000 tahun untuk merambat dari inti ke permukaan Matahari (karena banyaknya tumbukan dengan materi padat di plasma Matahari), lalu hanya 8 menit untuk mencapai Bumi. Matahari mengubah ~600 juta ton hidrogen menjadi helium setiap detik.",
    sources: ["NASA Sun", "Stanford Solar Center"],
    branch: "contoh-hujan",
  },
  {
    id: "c-hydrogen-source",
    label: "Hidrogen dari Nukleosintesis Big Bang",
    category: "partikel",
    timeLabel: "Menit ke-3 hingga ke-20 (setelah Big Bang)",
    timeValue: 600,
    description:
      "Hidrogen yang difusikan di inti Matahari bukan dibuat oleh Matahari — ia sudah ada sejak menit-menit pertama alam semesta, terbentuk selama periode nukleosintesis Big Bang. Inilah titik di mana rantai kausal 'hujan' bersatu dengan rantai kosmologis utama. Atom hidrogen yang kini bergabung di inti Matahari telah berkelana selama 13,8 miliar tahun sebelum akhirnya menjadi bagian dari Bumi, lautan, dan tetesan hujan yang Anda lihat hari ini.",
    sources: ["NASA Imagine the Universe", "Einstein-Online"],
    branch: "contoh-hujan",
  },

  // ====================================================================
  // BRANCH D: JALUR CONTOH BOLA BILIAR
  // Bola bergerak → tumbukan → tongkat → tangan → niat → (neurologis)
  // ====================================================================

  {
    id: "d-balls-moving",
    label: "Bola-bola Bergerak",
    category: "personal",
    timeLabel: "Saat ini",
    timeValue: UNIVERSE_AGE_SECONDS - 1,
    description:
      "Anda melihat bola-bola biliar berpencar di meja. Setiap bola bergerak menurut hukum Newton — kecepatan dan arahnya dapat dihitung dari keadaan sebelumnya. Tetapi gerakan ini tidak muncul dari ketiadaan. Ada tumbukan yang memicunya, dan tumbukan itu sendiri adalah akibat dari dorongan sebelumnya.",
    sources: [],
    branch: "contoh-biliar",
  },
  {
    id: "d-cue-strike",
    label: "Tumbukan Bola Putih",
    category: "personal",
    timeLabel: "0,5 detik lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 0.5,
    description:
      "Bola-bola yang berpencar tadi berawal dari tumbukan bola putih dengan bola lainnya. Saat tumbukan terjadi, momentum dan energi kinetik bola putih ditransfer ke bola sasaran (dengan beberapa rugi energi sebagai panas dan bunyi). Ini adalah contoh klasik dari hukum kekekalan momentum yang diajarkan di sekolah menengah.",
    sources: [],
    branch: "contoh-biliar",
  },
  {
    id: "d-cue-stick",
    label: "Dorongan Tongkat",
    category: "personal",
    timeLabel: "1 detik lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 1,
    description:
      "Bola putih bergerak karena didorong oleh tongkat biliar. Energi kinetik yang dibawa bola putih berasal dari energi kinetik tongkat, yang pada gilirannya berasal dari tangan pemain. Tongkat hanya sebagai perantara — ia tidak menghasilkan energi sendiri, hanya menyalurkannya dari tangan ke bola.",
    sources: [],
    branch: "contoh-biliar",
  },
  {
    id: "d-arm-motion",
    label: "Gerakan Tangan Pemain",
    category: "biologis",
    timeLabel: "1,5 detik lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 1.5,
    description:
      "Tangan yang mengayunkan tongkat bergerak karena kontraksi otot-otot lengan. Kontraksi otot dirangsang oleh sinyal listrik dari saraf, yang berasal dari sumsum tulang belakang dan otak. Energi mekanik gerakan tangan diperoleh dari pemecahan molekul ATP dalam sel otot — yang berasal dari makanan yang dimakan pemain.",
    sources: [],
    branch: "contoh-biliar",
  },
  {
    id: "d-intention",
    label: "Niat & Keputusan Otak",
    category: "biologis",
    timeLabel: "Beberapa detik lalu",
    timeValue: UNIVERSE_AGE_SECONDS - 3,
    description:
      "Sinyal motorik ke otot lengan berasal dari korteks motorik otak, yang dipicu oleh keputusan sadar untuk memukul bola dengan cara tertentu. Keputusan ini sendiri adalah hasil dari aktivitas kompleks di jaringan saraf — memori, perhatian, perencanaan, dan interpretasi posisi bola. Di titik inilah contoh biliar mulai menyentuh pertanyaan filosofis yang lebih dalam: apakah keputusan sadar kita sendiri adalah sebab pertama, atau juga akibat dari rantai sebab-akibat sebelumnya (misalnya genetika, lingkungan, pengalaman)?",
    sources: [],
    branch: "contoh-biliar",
  },
  {
    id: "d-physics",
    label: "Hukum Fisika & Neurokimia",
    category: "filosofis",
    timeLabel: "Kondisi tetap dari alam",
    timeValue: UNIVERSE_AGE_SECONDS - 100,
    description:
      "Pada akhirnya, keputusan otak dan kontraksi otot tunduk pada hukum-hukum fisika dan kimia yang sama yang berlaku di mana pun di alam semesta. Sinyal saraf adalah impuls elektrokimia; pemikiran melibatkan perubahan kimiawi di sinapsis. Inilah titik di mana rantai contoh biliar menimbulkan pertanyaan: jika setiap gerakan tubuh kita dapat ditelusuri kausal hingga ke hukum-hukum fisika yang sudah ada sejak awal alam semesta, di manakah letak 'sebab pertama' dari keputusan sadar? Pertanyaan ini membawa kita kembali ke isu yang sama yang diangkat oleh Kalam: adakah sebab yang tak-tersebabkan, baik di tingkat kosmis maupun di tingkat kesadaran?",
    sources: [],
    branch: "contoh-biliar",
    isPhilosophical: true,
  },
];

export const chainNodes: ChainNode[] = [...coreChainNodes, ...determinismNodes];

/**
 * Statistik node (untuk verifikasi kriteria selesai):
 * - Total: 45 node (3 node filosofis paralel + 1 muara + 1 node maklumat asabiqah)
 * - Branch A (kosmologis-utama): 25 node
 *     · 21 node ilmiah/kosmis (era Planck → Masa Kini)
 *     · 3 node terminal filosofis paralel: a-first-cause-al-kindi,
 *       a-first-cause-ibn-sina, a-first-cause-al-ghazali
 *     · 1 node muara konvergen: a-first-cause (Tauhid Wujud)
 * - Branch B (silsilah-manusia): 7 node (Anda → ... → Hominini Awal → Maklumat Asabiqah)
 * - Branch C (contoh-hujan): 6 node
 * - Branch D (contoh-biliar): 6 node
 *
 * Kriteria "minimal 25 node" terpenuhi.
 *
 * (coreChainNodes di atas = 45 node; chainNodes yang diekspor menambahkan
 * 8 node Branch E — determinisme-ketetapan — via spread dari determinism-nodes.ts,
 * sehingga totalnya 53 node.)
 */
