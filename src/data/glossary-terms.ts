/**
 * glossary-terms.ts
 *
 * Kamus istilah untuk panel Glossary.
 * Mencakup 4 kategori:
 *  - falsafi    : istilah metafisika dalam tradisi falsafi Islam (wajib, mumkin, dll.)
 *  - epistemologi : istilah terkait teori pengetahuan (an-Nabhani, maklumat asabiqah, dll.)
 *  - kosmologi   : istilah sains kosmis (Big Bang, inflasi, GUT, dll.)
 *  - logika      : notasi logika modal (□p, ◇p, ¬◇¬p) untuk penalaran kebutuhan/kontingensi
 *
 * Untuk istilah Arab: arabic = teks Arab asli, transliteration = ejaan Latin,
 * term = istilah Indonesia yang dipakai di situs ini.
 */

export type GlossaryCategory = "falsafi" | "epistemologi" | "kosmologi" | "logika";

export interface GlossaryTerm {
  id: string;
  term: string;
  arabic?: string;
  transliteration?: string;
  category: GlossaryCategory;
  shortDef: string;
  explanation: string;
  related?: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  // ====================================================================
  // FALSAFI — Metafisika Islam (Wujud, Kausalitas, Tauhid)
  // ====================================================================

  {
    id: "wajib-al-wujud",
    term: "Wajib al-Wujud",
    arabic: "واجِبُ الوُجُود",
    transliteration: "wājib al-wujūd",
    category: "falsafi",
    shortDef: "Yang keberadaannya wajib dengan sendirinya — tidak mungkin tidak ada.",
    explanation:
      "Konsep sentral Ibnu Sina. Esensi Wajib al-Wujud tidak lain adalah keberadaan itu sendiri — tidak ada gap antara esensi (mahiyah) dan eksistensi (wujud) yang perlu dijembatani sebab luar. Ia tidak tersusun dari bagian, tidak berada di dalam ruang-waktu, dan tidak berubah. Inilah konklusi tiga tradisi falsafi Islam (Al-Kindi, Ibnu Sina, Al-Ghazali) tentang Sebab Pertama — yang dalam bahasa tauhid disebut Allah.",
    related: ["mumkin-al-wujud", "mumtani-al-wujud", "ahad", "tauhid-wujud"],
  },
  {
    id: "mumkin-al-wujud",
    term: "Mumkin al-Wujud",
    arabic: "مُمْكِنُ الوُجُود",
    transliteration: "mumkin al-wujūd",
    category: "falsafi",
    shortDef: "Yang keberadaannya mungkin ada dan mungkin tidak — butuh sebab luar untuk ada.",
    explanation:
      "Esensi mumkin al-wujud netral terhadap ada/tidak-ada. Karena netral, ia butuh mujib (faktor pendorong) dari luar untuk 'menentukannya' ke arah ada. Seluruh alam semesta — totalitas hal-hal yang berubah, tersusun, dan bergantung — termasuk mumkin al-wujud. Inilah premis utama argumen kontingensi Ibnu Sina (burhan al-siddiqin).",
    related: ["wajib-al-wujud", "mumtani-al-wujud", "burhan-al-siddiqin"],
  },
  {
    id: "mumtani-al-wujud",
    term: "Mumtani' al-Wujud",
    arabic: "مُمْتَنِعُ الوُجُود",
    transliteration: "mumtani' al-wujūd",
    category: "falsafi",
    shortDef: "Yang keberadaannya mustahil — esensinya kontradiktif dengan ada.",
    explanation:
      "Lawan dari wajib al-wujud. Contoh klasik: 'segiempat bulat' — esensinya sendiri menyangkal keberadaan. Tidak bisa ada di dunia manapun. Ibnu Sina menggunakan trilemma: setiap yang ada harus salah satu dari wajib, mumkin, atau mumtani'. Yang mumtani' tidak ada. Yang mumkin butuh sebab. Yang ada tanpa sebab = wajib.",
    related: ["wajib-al-wujud", "mumkin-al-wujud"],
  },
  {
    id: "kaun",
    term: "Kaun",
    arabic: "كَوْن",
    transliteration: "kaun",
    category: "falsafi",
    shortDef: "Menjadi / terjadi — menerima keberadaan dari sumber lain.",
    explanation:
      "Istilah kunci Al-Kindi dalam Falsafah al-Ula. Kaun lebih mendasar daripada sekadar 'terjadi secara temporal' — ia adalah kategori ontologis: sesuatu yang keberadaannya bukan dari dirinya sendiri. Argumen Al-Kindi bekerja pada level kaun, sehingga tidak bergantung pada apakah alam mulai atau selalu ada.",
    related: ["wajib-al-wujud", "mumkin-al-wujud", "al-khair-al-mahd"],
  },
  {
    id: "al-khair-al-mahd",
    term: "Al-Khair al-Mahd",
    arabic: "الْخَيْرُ الْمَحْض",
    transliteration: "al-khayr al-mahḍ",
    category: "falsafi",
    shortDef: "Kebaikan Mutlak — sebutan Al-Kindi untuk Sebab Pertama.",
    explanation:
      "Konvergen dengan al-haqq al-mahd (Yang Benar Murni). Al-Kindi menyebut sumber akhir deret kaun sebagai 'Kebaikan Mutlak' karena ia menjadi sumber segala keberadaan tanpa sendirinya menerima. Dalam bahasa tauhid, ini adalah Allah.",
    related: ["kaun", "wajib-al-wujud"],
  },
  {
    id: "burhan-al-siddiqin",
    term: "Burhan al-Siddiqin",
    arabic: "بُرْهانُ الصِّدِّيقِين",
    transliteration: "burhān al-ṣiddīqīn",
    category: "falsafi",
    shortDef: "Bukti Orang Jujur — argumen kontingensi Ibnu Sina.",
    explanation:
      "Disebut 'siddiqin' (orang jujur) karena ia tidak menipu; ia langsung menunjuk pada Yang Wajib. Premis: ada sesuatu; yang ada itu wajib/mumkin/mumtani; yang mumtani tidak ada; yang mumkin butuh sebab; maka harus ada wajib. Argumen ini tidak bergantung pada apakah alam mulai atau kekal — ia bekerja pada level ontologis murni.",
    related: ["wajib-al-wujud", "mumkin-al-wujud", "mumtani-al-wujud"],
  },
  {
    id: "tasalsul",
    term: "Tasalsul",
    arabic: "تَسَلْسُل",
    transliteration: "tasalsul",
    category: "falsafi",
    shortDef: "Regresi tak terhingga dari sebab-akibat — dianggap mustahil oleh Al-Ghazali.",
    explanation:
      "Konsep sentral kritik Al-Ghazali terhadap filsuf Peripatetik. Tasalsul = deret sebab-akibat yang berjalan terus-menerus ke belakang tanpa awal. Al-Ghazali berargumen ini mustahil karena tak terhingga aktual tidak bisa 'habis dilalui' — padahal kita tiba di hari ini. Argumen paralel: Hilbert's Hotel modern (Craig).",
    related: ["silsilah-hawadith", "hadits", "qadim"],
  },
  {
    id: "silsilah-hawadith",
    term: "Silsilah al-Hawadith",
    arabic: "سِلْسِلَةُ الْحَوادِث",
    transliteration: "silsilat al-ḥawādith",
    category: "falsafi",
    shortDef: "Deret kejadian-kejadian baru (temporal) — inti argumen Al-Ghazali.",
    explanation:
      "Kombinasi 'silsilah' (rantai) + 'hawadith' (kejadian-kejadian baru, jamak dari 'hadits'). Al-Ghazali: setiap hadits butuh sebab yang mendahuluinya; deret hawadith tidak bisa tak terhingga; maka harus ada Sebab Pertama yang bukan hadits — Ia qadim. Inilah cikal-bakal Kalam cosmological argument modern (Craig).",
    related: ["tasalsul", "hadits", "qadim"],
  },
  {
    id: "hadits",
    term: "Hadits",
    arabic: "حادِث",
    transliteration: "ḥādith",
    category: "falsafi",
    shortDef: "Kejadian baru — sesuatu yang sebelumnya tidak ada, lalu ada.",
    explanation:
      "Dalam konteks metafisika (bukan hadits Nabi), 'hadits' = segala sesuatu yang berawal. Lawan dari 'qadim' (tiada permulaan). Bagi Al-Ghazali, alam semesta adalah hadits karena mengalami perubahan temporal; maka harus memiliki Pencipta yang qadim.",
    related: ["qadim", "silsilah-hawadith", "tasalsul"],
  },
  {
    id: "qadim",
    term: "Qadim",
    arabic: "قَدِيم",
    transliteration: "qadīm",
    category: "falsafi",
    shortDef: "Tiada permulaan — kekal dari selamanya.",
    explanation:
      "Sifat Yang Wajib al-Wujud. Lawan dari 'hadits' (kejadian baru). Hanya Allah yang qadim dalam pandangan Al-Ghazali. Ibnu Sina lebih suka 'wajib al-wujud' karena tidak terikat temporal, tetapi konsepnya konvergen.",
    related: ["hadits", "wajib-al-wujud", "silsilah-hawadith"],
  },
  {
    id: "ahad",
    term: "Ahad",
    arabic: "أحَد",
    transliteration: "aḥad",
    category: "falsafi",
    shortDef: "Tunggal Mutlak — tanpa majemuk, tanpa anggota, tanpa hitungan.",
    explanation:
      "Berbeda dari 'wahid' (satu dalam hitungan). Ahad menunjuk keesaan mutlak yang tidak bisa dibagi atau dihitung. Dalam tauhid wujud: Yang Wajib al-Wujud itu ahad karena Ia tidak tersusun dari bagian. QS Al-Ikhlas:1 — 'Qul Huwa Allahu Ahad' (Katakanlah, Dialah Allah Yang Maha Esa).",
    related: ["wahid", "wajib-al-wujud", "tauhid-wujud"],
  },
  {
    id: "wahid",
    term: "Wahid",
    arabic: "واحِد",
    transliteration: "wāḥid",
    category: "falsafi",
    shortDef: "Satu dalam hitungan — berbeda dari 'ahad' (Tunggal Mutlak).",
    explanation:
      "Wahid adalah 'satu' yang masih berada dalam konteks hitungan (implisit bisa ada dua, tiga, dst.). Ahad adalah Tunggal Mutlak di luar hitungan. Distingsi penting dalam tauhid: Allah itu ahad, bukan sekadar wahid.",
    related: ["ahad", "tauhid-wujud"],
  },
  {
    id: "tauhid-wujud",
    term: "Tauhid Wujud",
    arabic: "تَوْحِيدُ الوُجُود",
    transliteration: "tawḥīd al-wujūd",
    category: "falsafi",
    shortDef: "Pengakuan bahwa hanya satu Wajib al-Wujud — segala selain-Nya mumkin.",
    explanation:
      "Muara dari argumen kosmologis Islam. Bukan hanya tauhid uluhiyah (keesaan ibadah) atau tauhid rububiyah (keesaan penciptaan), tetapi tauhid pada level wujud itu sendiri: hanya Allah yang wajib al-wujud; segala sesuatu yang ada selain-Nya adalah mumkin yang keberadaannya bergantung kepada-Nya.",
    related: ["wajib-al-wujud", "ahad", "mumkin-al-wujud"],
  },
  {
    id: "occasionalism",
    term: "Okasionalisme (‘Adah Allah)",
    arabic: "عادَةُ الله",
    transliteration: "'ādat Allāh",
    category: "falsafi",
    shortDef: "Pandangan bahwa sebab-sebab sekunder hanya 'kebiasaan' Allah — sebab sejati hanya Allah.",
    explanation:
      "Al-Ghazali berargumen bahwa api tidak 'membakar' kertas secara intrinsik. Yang terjadi: Allah menciptakan pembakaran sebagai 'kebiasaan-Nya' ('adah) ketika api dan kertas berdekatan. Ini menambah dimensi tauhid: bukan saja deret sebab berakhir pada Allah, tetapi setiap sebab dalam deret itu sendiri adalah tindakan langsung Allah.",
    related: ["silsilah-hawadith", "wajib-al-wujud"],
  },
  {
    id: "jumla",
    term: "Jumla",
    arabic: "جُمْلَة",
    transliteration: "jumla",
    category: "falsafi",
    shortDef: "Keseluruhan / totalitas — penting dalam debat Ibnu Sina vs al-Razi.",
    explanation:
      "Fakhr al-Din al-Razi mengajukan objeksi: bagaimana jika 'jumla' (keseluruhan) dari hal-hal mumkin itu sendiri bersifat wajib? Nasir al-Din al-Tusi menanggapi: jumla tetap mumkin karena ia TERSUSUN dari bagian; apa yang tersusun butuh penyusun, sehingga kembali menjadi mumkin. Tidak ada jalan keluar kecuali Yang Tidak Tersusun — ahad.",
    related: ["mumkin-al-wujud", "wajib-al-wujud", "ahad"],
  },
  {
    id: "huduth",
    term: "Huduth",
    arabic: "حُدُوث",
    transliteration: "ḥudūth",
    category: "falsafi",
    shortDef: "Permulaan ada / asal-terjadi — lawan dari qidam (kekal).",
    explanation:
      "Konsep penting dalam debat Al-Ghazali vs Ibnu Sina. Al-Ghazali: alam bersifat huduth (berawal) karena ia deret hawadith. Ibnu Sina: argumen wajib/mumkin tidak bergantung pada huduth — alam bisa kekal sekaligus diciptakan. Argumen kontingensi (Ibnu Sina) bekerja bahkan tanpa huduth temporal.",
    related: ["hadits", "qadim", "burhan-al-siddiqin"],
  },
  {
    id: "per-se-vs-per-accidens",
    term: "Per Se vs Per Accidens",
    category: "falsafi",
    shortDef: "Sebab hierarkis-simultan (per se) vs deret temporal (per accidens).",
    explanation:
      "Distingsi penting Aquinas. Per se: sebab yang menyokong akibat di sini dan sekarang (mis. tangan → palu → paku) — deret harus berakhir pada sebab suprem ontologis. Per accidens: deret temporal peristiwa lampau — secara teori bisa tak terhingga. Al-Kindi/Ibnu Sina condong ke argumen per se; Al-Ghazali condong ke per accidens (temporal).",
    related: ["silsilah-hawadith", "tasalsul", "burhan-al-siddiqin"],
  },

  // ====================================================================
  // EPISTEMOLOGI — An-Nabhani & Teori Pengetahuan Islam
  // ====================================================================

  {
    id: "tafkir",
    term: "Tafkir (Berpikir)",
    arabic: "التَّفْكِير",
    transliteration: "at-tafkīr",
    category: "epistemologi",
    shortDef: "Aktivitas mentransfer sensasi melalui informasi prior untuk menghasilkan penilaian.",
    explanation:
      "Definisi an-Nabhani: tafkir adalah transfer (naql) sensasi (ihsas) melalui maklumat asabiqah untuk menghasilkan pemahaman (idrak) atau penilaian (hukm). Tanpa salah satu dari empat syarat (otak, indra, obyek, maklumat asabiqah), tafkir tidak terjadi — yang ada hanya ihsas (sensasi hewani).",
    related: ["maklumat-asabiqah", "ihsas", "syarat-empat-berpikir"],
  },
  {
    id: "maklumat-asabiqah",
    term: "Maklumat Asabiqah",
    arabic: "المَعْلُوماتُ السّابِقَة",
    transliteration: "al-ma'lūmāt as-sābiqa",
    category: "epistemologi",
    shortDef: "Informasi prior — syarat keempat berpikir menurut an-Nabhani.",
    explanation:
      "Pengetahuan yang sudah ada di benak sebelum menghadapi realitas baru. Tanpa maklumat asabiqah, sensasi tidak bisa menjadi pemahaman. Contoh: anak kecil yang melihat pesawat untuk pertama kalinya hanya menginderai bentuk — ia tidak 'berpikir' tentang pesawat sampai ia diberi informasi sebelumnya ('itu pesawat terbang'). Selaras dengan QS Al-Baqarah:31 — Allah mengajarkan Adam nama-nama SEBELUM Adam menghadapi realitas.",
    related: ["tafkir", "ihsas", "syarat-empat-berpikir", "al-asma"],
  },
  {
    id: "ihsas",
    term: "Ihsas (Sensasi)",
    arabic: "الإحْساس",
    transliteration: "al-iḥsās",
    category: "epistemologi",
    shortDef: "Pengindraan murni — reaksi otomatis terhadap stimuli (setingkat hewan).",
    explanation:
      "Menurut an-Nabhani, ihsas adalah level kognitif hewani: indra menangkap obyek, otak menerima sinyal, tetapi tidak ada penilaian. Hewan memiliki ihsas; manusia juga memiliki ihsas, tetapi ditambah tafkir (yang membutuhkan maklumat asabiqah). Inilah pembeda kognitif manusia-hewan.",
    related: ["tafkir", "maklumat-asabiqah", "syarat-empat-berpikir"],
  },
  {
    id: "syarat-empat-berpikir",
    term: "Empat Syarat Berpikir",
    arabic: "شُرُوطُ التَّفْكِير الأَرْبَعَة",
    transliteration: "shurūṭ at-tafkīr al-arba'a",
    category: "epistemologi",
    shortDef: "Empat syarat an-Nabhani: otak matang, indra, obyek terindra, maklumat asabiqah.",
    explanation:
      "Dirumuskan Taqiyuddin an-Nabhani (w. 1977) dalam Nizam al-Islam dan At-Tashkil al-Aqli: (1) al-dimagh an-nadij — otak manusia matang; (2) al-hawass — panca indera; (3) al-waqi' al-mahsus — realitas yang terindra; (4) al-ma'lumat as-sabiqa — informasi prior. Empat syarat harus hadir bersamaan; absen salah satu = tidak ada tafkir.",
    related: ["tafkir", "maklumat-asabiqah", "ihsas"],
  },
  {
    id: "al-asma",
    term: "Al-Asma' (Nama-nama)",
    arabic: "الأَسْماء",
    transliteration: "al-asmā'",
    category: "epistemologi",
    shortDef: "Pengetahuan tentang hakikat/esaensi segala sesuatu — diajarkan Allah kepada Adam.",
    explanation:
      "QS Al-Baqarah:31 — 'Wa 'allama Adama al-asma'a kullaha' (Dan Allah mengajarkan kepada Adam nama-nama semuanya). Mufassir (Ibnu Katsir, Al-Qurtubi, Hamka) menjelaskan: al-asma' bukan sekadar label linguistik, tetapi pengetahuan tentang hakikat/esaensi segala sesuatu. Diberikan SEBELUM Adam menghadapi realitas — inilah pemberian maklumat asabiqah pertama.",
    related: ["maklumat-asabiqah", "tafkir", "syarat-empat-berpikir"],
  },
  {
    id: "idrak",
    term: "Idrak (Pemahaman)",
    arabic: "الإدْراك",
    transliteration: "al-idrāk",
    category: "epistemologi",
    shortDef: "Pemahaman — hasil pertama dari tafkir setelah sensasi + maklumat asabiqah.",
    explanation:
      "Ketika sensasi (ihsas) dipertemukan dengan maklumat asabiqah dan diolah otak, hasilnya adalah idrak — pemahaman tentang obyek. Idrak lebih tinggi dari ihsas; hewan hanya ihsas, manusia bisa idrak. Tingkat lebih tinggi lagi: hukm (penilaian), kemudian qisthus (keadilan penalaran).",
    related: ["tafkir", "ihsas", "hukm"],
  },
  {
    id: "hukm",
    term: "Hukm (Penilaian)",
    arabic: "الحُكْم",
    transliteration: "al-ḥukm",
    category: "epistemologi",
    shortDef: "Penilaian — hasil tertinggi dari tafkir; menetapkan relasi antara konsep.",
    explanation:
      "Setelah idrak (pemahaman), tafkir dapat menghasilkan hukm — penilaian tentang benar/salah, ada/tidak, sebab/akibat. Dalam argumen kosmologis, kesimpulan 'alam menuntut Wajib al-Wujud' adalah hukm yang dihasilkan dari tafkir yang menggunakan maklumat asabiqah tentang kausalitas.",
    related: ["tafkir", "idrak"],
  },

  // ====================================================================
  // KOSMOLOGI — Sains Kosmis
  // ====================================================================

  {
    id: "big-bang",
    term: "Big Bang",
    category: "kosmologi",
    shortDef: "Model standar: alam semesta berekspansi dari keadaan sangat padat-panas ~13,8 M tahun lalu.",
    explanation:
      "Bukan 'ledakan' di ruang yang sudah ada, melainkan ekspansi ruang itu sendiri. Buktinya: (1) pergeseran merah galaksi (Hubble 1929); (2) CMB latar (Penzias-Wilson 1965); (3) kelimpahan H/He cocok dengan nukleosintesis BBN. Big Bang adalah peristiwa temporal — ia sendiri AKIBAT yang butuh penjelas, bukan Sebab Pertama.",
    related: ["cmb", "nukleosintesis-bbn", "inflasi"],
  },
  {
    id: "cmb",
    term: "CMB (Cosmic Microwave Background)",
    category: "kosmologi",
    shortDef: "Radiasi sisa dari rekombinasi ~380.000 thn setelah Big Bang — 'foto bayi' alam semesta.",
    explanation:
      "Suhu rata-rata 2,725 K. Ditemukan Penzias-Wilson 1965 (Nobel 1978). Peta anisotropi (fluktuasi suhu 10⁻⁵) oleh COBE/WMAP/Planck membantu mengukur parameter kosmologi. CMB adalah bukti teramati terkuat bahwa alam semesta bermula dari keadaan panas-padat.",
    related: ["big-bang", "recombination", "nukleosintesis-bbn"],
  },
  {
    id: "nukleosintesis-bbn",
    term: "Nukleosintesis Big Bang (BBN)",
    category: "kosmologi",
    shortDef: "Pembentukan inti atom ringan (H, He, Li) pada menit ke-3 hingga ke-20.",
    explanation:
      "Suhu turun hingga ~10⁹ K memungkinkan proton-neutron bergabung. Hasil: ~75% Hidrogen-1, ~25% Helium-4, jejak Litium-7. Rasio ini cocok dengan observasi — prediksi terkuat model Big Bang. Unsur berat (C, O, Fe) belum ada — disintesa di bintang nanti.",
    related: ["big-bang", "hadron-epoch", "lepton-epoch"],
  },
  {
    id: "inflasi",
    term: "Inflasi Kosmik",
    category: "kosmologi",
    shortDef: "Pemuaian eksponensial ~10⁻³⁶ s hingga ~10⁻³² s — faktor 10²⁶+ dalam waktu <10⁻³² s.",
    explanation:
      "Diusulkan Guth (1980), dikembangkan Linde (chaotic) dan Starobinsky (R²). Menjelaskan 3 observasi: (1) flatness (alam datar); (2) horizon (suhu CMB seragam); (3) tidak ada monopoli magnetik. Berakhir dengan 'reheating' — energi medan inflaton terurai menjadi partikel.",
    related: ["big-bang", "gut", "reheating"],
  },
  {
    id: "gut",
    term: "GUT (Grand Unified Theory)",
    category: "kosmologi",
    shortDef: "Era ketika 3 gaya non-gravitasi (kuat, lemah, EM) masih menyatu — ~10⁻⁴³ s hingga 10⁻³⁶ s.",
    explanation:
      "Skala energi ~10²⁸ K — belum tercapai di akselerator mana pun. Teori: SU(5), SO(10), E6. Pada akhir GUT, interaksi kuat memisahkan diri dari elektrolemah — energi yang dilepas diduga memicu inflasi. Fisika GUT masih spekulatif.",
    related: ["inflasi", "elektrolemah", "planck-epoch"],
  },
  {
    id: "elektrolemah",
    term: "Era Elektrolemah",
    category: "kosmologi",
    shortDef: "Era gaya lemah + elektromagnetik masih menyatu — 10⁻³² s hingga 10⁻¹² s.",
    explanation:
      "Setelah inflasi berakhir, alam memasuki era elektrolemah. Pada 10⁻¹² s, medan Higgs mengalami pemutusan simetri spontan — memberi massa pada W/Z boson dan partikel lain. Inilah momen partikel-partikel memperoleh properti massanya yang sekarang.",
    related: ["inflasi", "gut", "higgs"],
  },
  {
    id: "planck-epoch",
    term: "Era Planck",
    category: "kosmologi",
    shortDef: "0 hingga 10⁻⁴³ s — batas fisika konvensional; gravitasi kuantum belum teruji.",
    explanation:
      "Skala Planck: panjang 1,6×10⁻³⁵ m, waktu 5,4×10⁻⁴⁴ s, massa 2,2×10⁻⁸ kg. Di sini gravitasi diperkirakan sekuat tiga gaya lain. Relativitas umum + mekanika kuantum belum berhasil disatukan. Klaim tentang 'apa yang terjadi pada t=0' bersifat spekulatif.",
    related: ["gut", "big-bang"],
  },
  {
    id: "recombination",
    term: "Rekombinasi",
    category: "kosmologi",
    shortDef: "Elektron bergabung dengan inti atom ~380.000 thn setelah Big Bang — alam jadi transparan.",
    explanation:
      "Suhu turun hingga ~3000 K. Sebelumnya foton terus tersebar oleh elektron bebas (alam buram). Setelah rekombinasi, foton bergerak bebas — radiasi inilah yang kita lihat sebagai CMB. 'Foto bayi' tertua alam semesta.",
    related: ["cmb", "big-bang"],
  },
  {
    id: "hadron-epoch",
    term: "Era Hadron",
    category: "kosmologi",
    shortDef: "10⁻⁶ s hingga 1 s — quark terkonfinasi menjadi proton/neutron; rasio n/p membeku.",
    explanation:
      "Dua momen kunci: (1) 10⁻⁶ s — konfinemen QCD, proton & neutron terbentuk; terjadi juga baryogenesis (asimetri materi-antimateri 1 per miliar). (2) 1 s — pembekuan rasio n/p = 1:7 karena reaksi lemah terlalu lambat vs ekspansi.",
    related: ["lepton-epoch", "nukleosintesis-bbn", "quark-epoch"],
  },
  {
    id: "lepton-epoch",
    term: "Era Lepton",
    category: "kosmologi",
    shortDef: "1 s hingga 10 s — pasangan elektron-positron dominan sebelum annihilasi.",
    explanation:
      "Setelah era hadron, pasangan lepton-antilepton tidak lagi terbentuk masal. Sisa elektron mendominasi. Setelah ~10 s, era dominasi foton dimulai dan bertahan hingga rekombinasi.",
    related: ["hadron-epoch", "nukleosintesis-bbn"],
  },
  {
    id: "quark-epoch",
    term: "Era Quark",
    category: "kosmologi",
    shortDef: "10⁻¹² s hingga 10⁻⁶ s — alam berupa plasma quark-gluon.",
    explanation:
      "Quark dan gluon belum terkonfinasi ke hadron. Suhu >10¹⁵ K. Akhir era: konfinemen warna — quark 'tertangkap' menjadi proton dan neutron.",
    related: ["hadron-epoch", "elektrolemah"],
  },
  {
    id: "higgs",
    term: "Medan Higgs",
    category: "kosmologi",
    shortDef: "Medan skalar yang memberi massa pada partikel via pemutusan simetri spontan.",
    explanation:
      "Nilai harapan vakum (VEV) ~246 GeV. Boson Higgs ditemukan di CERN 2012 (Nobel 2013 Engelert-Higgs). Pada 10⁻¹² s setelah Big Bang, medan Higgs 'jatuh' ke minimum potensial — memberi massa pada W/Z boson, elektron, quark. Sebelum ini, semua partikel tak bermassa.",
    related: ["elektrolemah", "planck-epoch"],
  },
  {
    id: "reheating",
    term: "Reheating (Pemanasan Ulang)",
    category: "kosmologi",
    shortDef: "Akhir inflasi ~10⁻³² s — energi inflaton terurai menjadi partikel.",
    explanation:
      "Inflasi berakhir saat medan inflaton berosilasi di minimum potensial. Energi terurai menjadi quark, lepton, boson tolok. Inilah 'hot Big Bang' sebenarnya — bukan t=0, melainkan akhir inflasi.",
    related: ["inflasi", "elektrolemah"],
  },
  {
    id: "baryogenesis",
    term: "Baryogenesis",
    category: "kosmologi",
    shortDef: "Proses yang menghasilkan asimetri materi-antimateri ~1 per miliar.",
    explanation:
      "Tanpa asimetri ini, alam akan berisi hanya radiasi (matter-antimatter annihilate semua). Asimetri teramati: η = n_B/n_γ ≈ 6×10⁻¹⁰. Mekanisme tepatnya masih terbuka — Sakharov conditions (1967): baryon number violation, C/CP violation, non-equilibrium.",
    related: ["hadron-epoch", "quark-epoch"],
  },
  {
    id: "lambda-cdm",
    term: "ΛCDM (Model Standar Kosmologi)",
    category: "kosmologi",
    shortDef: "Model kosmologi standar: konstanta kosmologis (Λ) + Cold Dark Matter.",
    explanation:
      "Parameter utama: H₀ ≈ 67-73 km/s/Mpc, Ω_m ≈ 0,32, Ω_Λ ≈ 0,68, Ω_b ≈ 0,05. Cocok dengan CMB, BAO, supernova. Masalah: sifat dark matter dan dark energy masih misterius; ketegangan Hubble (H₀ local vs CMB-derived).",
    related: ["big-bang", "cmb", "dark-energy"],
  },
  {
    id: "dark-energy",
    term: "Dark Energy (Energi Gelap)",
    category: "kosmologi",
    shortDef: "Komponen ~68% densitas energi alam — menyebabkan akselerasi ekspansi.",
    explanation:
      "Ditemukan 1998 dari supernova Type Ia (Nobel 2011 Perlmutter-Schmidt-Riess). Identitas: belum diketahui — kandidat utama adalah konstanta kosmologis (Λ) Einstein. Fine-tuning: kerapatan Λ ~10⁻¹²² dalam satuan Planck — angka paling kecil dalam fisika.",
    related: ["lambda-cdm", "inflasi"],
  },

  // ====================================================================
  // LOGIKA — Logika Modal & Kausalitas
  // ====================================================================

  {
    id: "modal-necessity",
    term: "Notasi □p (Kebutuhan)",
    category: "logika",
    shortDef: "p benar di semua dunia yang mungkin — setara dengan wajib.",
    explanation:
      "Notasi logika modal: □ = 'necessarily'. □p artinya p benar di semua dunia yang mungkin. Dalam metafisika Islam: p = 'Allah ada' → □p (Allah wajib ada). Setara dengan wajib al-wujud Ibnu Sina.",
    related: ["modal-possibility", "modal-impossibility", "wajib-al-wujud"],
  },
  {
    id: "modal-possibility",
    term: "Notasi ◇p (Kemungkinan)",
    category: "logika",
    shortDef: "p benar di setidaknya satu dunia yang mungkin — setara dengan mumkin.",
    explanation:
      "◇ = 'possibly'. ◇p artinya p benar di setidaknya satu dunia yang mungkin. Dalam metafisika Islam: p = 'alam semesta ada' → ◇p dan ◇¬p (alam mungkin ada, mungkin tidak) → mumkin al-wujud. ◇p setara dengan ¬□¬p (tidak harus tidak).",
    related: ["modal-necessity", "modal-impossibility", "mumkin-al-wujud"],
  },
  {
    id: "modal-impossibility",
    term: "Notasi ¬◇p / □¬p (Kemustahilan)",
    category: "logika",
    shortDef: "p salah di semua dunia yang mungkin — setara dengan mumtani'.",
    explanation:
      "¬◇p = □¬p (tidak mungkin p = harus tidak p). p salah di semua dunia yang mungkin. Contoh: 'segiempat bulat ada' → ¬◇(segiempat bulat ada). Setara dengan mumtani' al-wujud. Trilemma Ibnu Sina: setiap p yang ada harus salah satu dari □p, ◇p, atau □¬p.",
    related: ["modal-necessity", "modal-possibility", "mumtani-al-wujud"],
  },
  {
    id: "psr",
    term: "PSR (Prinsip Alasan Cukup)",
    category: "logika",
    shortDef: "Untuk setiap fakta p, ada alasan mengapa p dan bukan bukan-p.",
    explanation:
      "Principium Rationis Sufficientis — Leibniz (~1714). Setiap fakta punya alasan cukup. Konvergen dengan argumen Ibnu Sina: mumkin butuh mujib (sebab penentu). PSR lebih kuat dari sekadar 'setiap akibat punya sebab' — ia juga berlaku untuk kebenaran logika dan fakta kontingen.",
    related: ["burhan-al-siddiqin", "mumkin-al-wujud", "wajib-al-wujud"],
  },
  {
    id: "kalām",
    term: "Kalam (Cosmological Argument)",
    category: "logika",
    shortDef: "Argumen kosmologis temporal — dari kejadian (hadits) ke Sebab Pertama.",
    explanation:
      "Berakar pada Al-Ghazali, diformulasikan ulang Craig (1979): P1: segala yang mulai ada memiliki sebab; P2: alam semesta mulai ada; K: alam semesta memiliki sebab. Subkontroversial: premis 1 (apakah semuanya yang mulai ada benar-benar butuh sebab? — kuantum fluktuasi?); premis 2 (apakah alam benar-benar mulai? — multiverse kekal?).",
    related: ["silsilah-hawadith", "tasalsul", "burhan-al-siddiqin"],
  },
  {
    id: "hilbert-hotel",
    term: "Hilbert's Hotel",
    category: "logika",
    shortDef: "Paradoks: hotel dengan kamar tak terhingga bisa 'penuh' dan 'menerima tamu baru'.",
    explanation:
      "Dikembangkan Craig untuk membantah aktual infinite. Hotel dengan ∞ kamar, semua terisi. Tamu baru datang — resepsionis menggeser setiap tamu ke kamar n+1. Kamar 1 kosong, tamu baru masuk. Hotel 'penuh' tapi masih bisa menerima tamu — kontradiksi. Argumen: aktual infinite konkret mustahil; maka deret peristiwa masa lalu tak terhingga mustahil.",
    related: ["tasalsul", "silsilah-hawadith", "kalām"],
  },
];

/**
 * Statistik glossary:
 * - Total: ~40 istilah
 * - Falsafi: ~16 (wajib/mumkin/mumtani', kaun, burhan al-siddiqin, tasalsul, dll.)
 * - Epistemologi: ~7 (an-Nabhani, tafkir, maklumat asabiqah, al-asma, dll.)
 * - Kosmologi: ~13 (Big Bang, inflasi, GUT, rekombinasi, dll.)
 * - Logika: ~6 (□p, ◇p, ¬◇p, PSR, Kalam, Hilbert's Hotel)
 */
