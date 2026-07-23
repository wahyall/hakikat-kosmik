/**
 * what-if-scenarios.ts — skenario preset "jika kejadian X tidak terjadi".
 *
 * Dikurasi manual dari riset (docs/riset-skenario-virtual-timeline.md).
 * Event-based: tiap skenario memaksa node tertentu 'fails' via simulateScenario().
 * scientificStatus "diperdebatkan" ditandai jujur (badge UI + catatan di panel).
 */

export interface WhatIfScenario {
  id: string;
  title: string;
  category: "kosmologis" | "biologis" | "sejarah";
  description: string;
  /** node yang dipaksa 'fails', terlepas dari status konstanta */
  forcedFailureNodeIds: string[];
  reason: string;
  source: string;
  scientificStatus: "mapan" | "diperdebatkan";
  /** true jika ada entri virtual-timelines.ts dengan scenarioId sama */
  hasVirtualTimeline: boolean;
}

export const whatIfScenarios: WhatIfScenario[] = [
  // ================= KOSMOLOGIS =================
  {
    id: "scenario-no-pop3-supernova",
    title: "Jika supernova bintang Populasi III tidak terjadi",
    category: "kosmologis",
    description:
      "Bintang generasi pertama meledak sebagai supernova dan menyemburkan unsur berat pertama. Tanpa penyemaian logam ini, gas antarbintang tak bisa mendingin membentuk planet berbatu.",
    forcedFailureNodeIds: ["a-first-stars"],
    reason:
      "Tanpa ledakan supernova Populasi III, unsur berat (C, O, Fe) tak tersebar ke medium antarbintang, sehingga bintang berlogam & planet berbatu tidak terbentuk.",
    source: "Karlsson, Bromm & Bland-Hawthorn, RMP 85:809 (2013); Heger & Woosley (2002)",
    scientificStatus: "mapan",
    hasVirtualTimeline: true,
  },
  {
    id: "scenario-weak-density-Q",
    title: "Jika amplitudo fluktuasi kerapatan (Q) terlalu kecil",
    category: "kosmologis",
    description:
      "Q ≈ 10⁻⁵ adalah benih semua struktur kosmik. Bila jauh lebih kecil, gravitasi tak pernah cukup meruntuhkan gas menjadi galaksi dan bintang.",
    forcedFailureNodeIds: ["a-first-galaxies"],
    reason:
      "Dengan Q terlalu kecil, kontras kerapatan tak memicu keruntuhan gravitasi — alam semesta tetap gas difus tanpa galaksi berstruktur.",
    source: "Rees, Just Six Numbers (1999); Barnes, arXiv:1112.4647 (2012)",
    scientificStatus: "mapan",
    hasVirtualTimeline: true,
  },
  {
    id: "scenario-large-lambda",
    title: "Jika konstanta kosmologis (Λ) jauh lebih besar",
    category: "kosmologis",
    description:
      "Energi gelap yang jauh lebih besar mempercepat ekspansi begitu dini sehingga gas tak sempat mengerut menjadi galaksi.",
    forcedFailureNodeIds: ["a-first-galaxies"],
    reason:
      "Λ beberapa ratus kali lebih besar merobek materi lewat ekspansi percepatan sebelum gravitasi merakit galaksi (batas antropik Weinberg).",
    source: "Weinberg, PRL 59:2607 (1987); Barnes (2012)",
    scientificStatus: "mapan",
    hasVirtualTimeline: false,
  },
  {
    id: "scenario-shifted-hoyle-resonance",
    title: "Jika resonansi karbon Hoyle bergeser",
    category: "kosmologis",
    description:
      "Karbon terbentuk di bintang lewat resonansi 'keadaan Hoyle' pada ¹²C. Pergeseran kecilnya mengubah drastis ketersediaan karbon bagi kimia kehidupan.",
    forcedFailureNodeIds: ["a-abiogenesis"],
    reason:
      "Tanpa penyetelan resonansi Hoyle, produksi karbon anjlok sehingga kimia organik tak subur. CATATAN: status fine-tuning ini diperdebatkan — simulasi bintang terbaru melonggarkan batasnya, dan framing antropiknya dikritik (Kragh 2010).",
    source: "Oberhummer et al., Science 289:88 (2000); Meißner et al. (2020); Kragh (2010) utk sanggahan",
    scientificStatus: "diperdebatkan",
    hasVirtualTimeline: false,
  },
  {
    id: "scenario-strong-gravity",
    title: "Jika gravitasi jauh lebih kuat relatif terhadap elektromagnetisme",
    category: "kosmologis",
    description:
      "Rasio gravitasi/EM (N ≈ 10³⁶) menentukan massa dan umur bintang. Gravitasi yang jauh lebih kuat membuat bintang kecil, panas, dan berumur sangat pendek.",
    forcedFailureNodeIds: ["a-first-stars"],
    reason:
      "Bintang berumur pendek tak memberi miliaran tahun stabil yang dibutuhkan evolusi biologis, memutus rantai di 'bintang stabil berumur panjang'.",
    source: "Carr & Rees, Nature 278:605 (1979); Rees (1999)",
    scientificStatus: "mapan",
    hasVirtualTimeline: false,
  },

  // ================= BIOLOGIS =================
  {
    id: "scenario-no-chicxulub",
    title: "Jika asteroid Chicxulub tidak menghantam Bumi",
    category: "biologis",
    description:
      "Tanpa kepunahan K-Pg, dinosaurus non-avian kemungkinan tetap mendominasi relung tubuh-besar, dan radiasi mamalia besar tertunda atau tak mengambil jalur sama.",
    forcedFailureNodeIds: ["a-kpg-extinction"],
    reason:
      "Tanpa tumbukan, relung ekologis tubuh-besar tak kosong; mamalia tetap kecil/nokturnal, sehingga radiasi primata menuju manusia kemungkinan tak terpicu. (Peristiwa mapan; klaim kontingensi kuat interpretatif.)",
    source: "Alvarez et al. (1980); Schulte et al. (2010); Hull et al. (2020)",
    scientificStatus: "mapan",
    hasVirtualTimeline: true,
  },
  {
    id: "scenario-no-eukaryogenesis",
    title: "Jika endosimbiosis mitokondria tidak pernah terjadi",
    category: "biologis",
    description:
      "Penggabungan arkea–bakteri yang melahirkan mitokondria diduga membuka kapasitas energi untuk sel kompleks. Tanpanya, kehidupan mungkin tetap prokariotik.",
    forcedFailureNodeIds: ["a-eukaryogenesis"],
    reason:
      "Tanpa mitokondria, tak ada sel eukariota kompleks maupun multiselularitas hewan. CATATAN: mekanisme 'keharusan energetik' (Lane–Martin) diperdebatkan (Lynch & Marinov).",
    source: "Lane & Martin, Nature 467:929 (2010); Lynch & Marinov, PNAS (2015) utk sanggahan",
    scientificStatus: "diperdebatkan",
    hasVirtualTimeline: true,
  },
  {
    id: "scenario-no-goe",
    title: "Jika fotosintesis oksigenik (Great Oxidation Event) tidak muncul",
    category: "biologis",
    description:
      "Fotosintesis oksigenik adalah satu-satunya sumber O₂ skala planet. Tanpa GOE tak ada ozon maupun respirasi aerobik berdaya tinggi bagi hewan besar.",
    forcedFailureNodeIds: ["a-goe-oxygenation"],
    reason:
      "Tanpa oksigen atmosfer, 'plafon energi' anaerobik membatasi kompleksitas — hewan besar aktif tak terbentuk. CATATAN: timing kausal oksigen→kompleksitas diperdebatkan.",
    source: "Fischer, Hemp & Johnson, AREPS (2016); Sánchez-Baracaldo & Cardona (2020)",
    scientificStatus: "diperdebatkan",
    hasVirtualTimeline: true,
  },
  {
    id: "scenario-no-cambrian-chordate",
    title: "Jika chordata awal Kambrium tidak selamat",
    category: "biologis",
    description:
      "Gould berargumen penyaringan rancang-tubuh Kambrium sangat kontingen: seandainya chordata awal (mis. Pikaia) tak lolos, vertebrata mungkin tak pernah ada.",
    forcedFailureNodeIds: ["a-cambrian-explosion"],
    reason:
      "Tanpa kelangsungan chordata awal, garis vertebrata menuju manusia terputus. CATATAN: klaim kontingensi kuat ini ditentang kubu konvergensi (Conway Morris; Blount/Lenski/Losos 2018).",
    source: "Gould, Wonderful Life (1989); Conway Morris (2003) utk tandingan",
    scientificStatus: "diperdebatkan",
    hasVirtualTimeline: false,
  },
  {
    id: "scenario-no-tetrapod-transition",
    title: "Jika transisi ikan ke tetrapoda tidak terjadi",
    category: "biologis",
    description:
      "Anggota badan berjari, paru-paru, dan leher yang muncul pada peralihan air→darat adalah prasyarat semua vertebrata darat.",
    forcedFailureNodeIds: ["a-tetrapod-transition"],
    reason:
      "Tanpa kolonisasi daratan oleh vertebrata, garis menuju amfibi–amniota–mamalia–manusia tak terbentuk lewat jalur sama. CATATAN: status kontingen vs konvergen diperdebatkan.",
    source: "Shubin et al. (2006); Clack (2012)",
    scientificStatus: "diperdebatkan",
    hasVirtualTimeline: false,
  },

  // ================= SEJARAH =================
  {
    id: "scenario-no-neolithic",
    title: "Jika Revolusi Pertanian Neolitik tidak terjadi",
    category: "sejarah",
    description:
      "Pertanian menetap adalah prasyarat surplus, kota, negara, dan tulisan. Ia muncul independen di beberapa pusat, sehingga tergolong prasyarat struktural.",
    forcedFailureNodeIds: ["h-neolitik"],
    reason:
      "Tanpa transisi ke pertanian, struktur populasi besar & peradaban tertulis kemungkinan tak berkembang dalam bentuk sama. Ini prasyarat struktural (deep-time), bukan pilihan sezaman.",
    source: "Diamond, Guns, Germs, and Steel (1997)",
    scientificStatus: "mapan",
    hasVirtualTimeline: false,
  },
  {
    id: "scenario-no-writing",
    title: "Jika tulisan tidak pernah ditemukan",
    category: "sejarah",
    description:
      "Tulisan tidak menciptakan pewarisan maklumat sabiqah (tradisi lisan sudah), melainkan meningkatkan bandwidth, fidelitas, dan daya tahannya lintas generasi.",
    forcedFailureNodeIds: ["h-tulisan"],
    reason:
      "Tanpa tulisan, akumulasi pengetahuan lintas generasi jauh lebih lambat/rapuh — bukan lenyap. Ditemukan independen ≥3×, jadi robust. Terhubung tematik ke maklumat sabiqah (Jalur E).",
    source: "Schmandt-Besserat, Before Writing; Goody & Watt (1963)",
    scientificStatus: "mapan",
    hasVirtualTimeline: false,
  },
  {
    id: "scenario-persian-win-salamis",
    title: "Jika Yunani kalah di Pertempuran Salamis (480 SM)",
    category: "sejarah",
    description:
      "Kekalahan angkatan laut Yunani kemungkinan berarti penaklukan Persia atas poleis daratan — mengubah wadah politik budaya Yunani klasik.",
    forcedFailureNodeIds: ["h-salamis"],
    reason:
      "Alternatif ini benar-benar dipertimbangkan sezaman (lolos syarat Ferguson). CATATAN: tesis 'Salamis menyelamatkan Peradaban Barat' dikritik teleologis/Eurosentris — signifikansinya diperdebatkan.",
    source: "Herodotus; Strauss, The Battle of Salamis (2004)",
    scientificStatus: "diperdebatkan",
    hasVirtualTimeline: false,
  },
  {
    id: "scenario-mongol-continue-1242",
    title: "Jika bangsa Mongol tidak menarik diri dari Eropa (1242)",
    category: "sejarah",
    description:
      "Setelah menghancurkan pasukan Hungaria/Polandia, Mongol mundur pada 1242. Orang sezaman (Matthew Paris) benar-benar mengira penaklukan Kristendom di ambang.",
    forcedFailureNodeIds: ["h-mongol-1242"],
    reason:
      "Kelanjutan kampanye Mongol berarti disrupsi politik-demografis Eropa Tengah (bukan 'akhir Eropa'). Kasus model Ferguson. CATATAN: sebab mundurnya diperdebatkan (kematian Ögedei vs jeda strategis vs iklim).",
    source: "Jackson, The Mongols and the West (2005); Matthew Paris, Chronica Majora",
    scientificStatus: "diperdebatkan",
    hasVirtualTimeline: true,
  },
  {
    id: "scenario-no-black-death",
    title: "Jika Maut Hitam (1347–1351) tidak melanda Eropa",
    category: "sejarah",
    description:
      "Wabah menewaskan ~sepertiga populasi Eropa; kelangkaan buruh menaikkan upah dan (menurut Allen) memberi insentif teknologi hemat-tenaga menuju Revolusi Industri.",
    forcedFailureNodeIds: ["h-black-death"],
    reason:
      "Sebagai guncangan eksogen (bukan pilihan sezaman) ia gagal syarat Ferguson ketat. CATATAN: rantai Maut-Hitam→Revolusi-Industri diperdebatkan.",
    source: "McNeill, Plagues and Peoples (1976); Allen (2009)",
    scientificStatus: "diperdebatkan",
    hasVirtualTimeline: false,
  },
];
