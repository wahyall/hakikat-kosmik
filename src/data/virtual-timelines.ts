/**
 * virtual-timelines.ts — rangkaian virtual node counterfactual per skenario.
 *
 * Hanya untuk skenario yang lolos kurasi manual (hasVirtualTimeline: true).
 * Virtual node bergaya visual berbeda (Plan 2B) & jelas ditandai hipotetis.
 * Framing filsafat: tiap cabang = satu 'mumkin' (kemungkinan) yang tak
 * diaktualkan (okasionalisme Al-Ghazali) — lihat docs/riset §4.
 */

export interface VirtualNode {
  id: string; // prefix "virtual-"
  label: string;
  description: string;
  source: string;
  order: number; // urutan dalam mini-cabang (0,1,2,...)
}

export interface VirtualTimeline {
  scenarioId: string;
  branchFromNodeId: string; // node asli tempat cabang menyempal
  nodes: VirtualNode[]; // minimal 2, berurutan
}

export const virtualTimelines: VirtualTimeline[] = [
  {
    scenarioId: "scenario-no-pop3-supernova",
    branchFromNodeId: "a-first-stars",
    nodes: [
      {
        id: "virtual-no-pop3-1",
        label: "Alam semesta tetap H/He murni",
        description:
          "Tanpa supernova Populasi III, medium antarbintang tak diperkaya unsur berat — komposisi tetap didominasi hidrogen & helium seperti sesaat setelah nukleosintesis Big Bang.",
        source: "Karlsson et al., RMP 85:809 (2013)",
        order: 0,
      },
      {
        id: "virtual-no-pop3-2",
        label: "Tak ada planet berbatu",
        description:
          "Tanpa logam untuk mendinginkan awan gas dan membentuk debu, cakram protoplanet tak menghasilkan planet berbatu — hanya raksasa gas atau tak ada planet sama sekali.",
        source: "Bromm & Larson, ARA&A (2004)",
        order: 1,
      },
      {
        id: "virtual-no-pop3-3",
        label: "Tak ada biokimia berbasis karbon",
        description:
          "Tanpa karbon, oksigen, dan besi yang tersebar, kimia kompleks yang menjadi dasar kehidupan tak punya bahan baku — rantai menuju kehidupan terputus di akarnya.",
        source: "Rees, Just Six Numbers (1999)",
        order: 2,
      },
    ],
  },
  {
    scenarioId: "scenario-weak-density-Q",
    branchFromNodeId: "a-first-galaxies",
    nodes: [
      {
        id: "virtual-weak-Q-1",
        label: "Gas tetap difus, tak meruntuh",
        description:
          "Dengan amplitudo fluktuasi terlalu kecil, kontras kerapatan tak pernah tumbuh cukup bagi gravitasi untuk meruntuhkan gas menjadi struktur terikat.",
        source: "Rees, Just Six Numbers (1999)",
        order: 0,
      },
      {
        id: "virtual-weak-Q-2",
        label: "Tak ada galaksi maupun bintang",
        description:
          "Tanpa keruntuhan, tak terbentuk galaksi atau bintang — tak ada tungku nukleosintesis, sehingga alam semesta tetap gelap dan steril.",
        source: "Barnes, arXiv:1112.4647 (2012)",
        order: 1,
      },
    ],
  },
  {
    scenarioId: "scenario-no-chicxulub",
    branchFromNodeId: "a-kpg-extinction",
    nodes: [
      {
        id: "virtual-no-chicxulub-1",
        label: "Dinosaurus non-avian bertahan",
        description:
          "Tanpa tumbukan, dinosaurus non-avian kemungkinan tetap menjadi vertebrata darat tubuh-besar yang dominan sepanjang Kenozoikum.",
        source: "Longrich et al., J. Evol. Biol. (2016)",
        order: 0,
      },
      {
        id: "virtual-no-chicxulub-2",
        label: "Mamalia tetap kecil & nokturnal",
        description:
          "Dengan relung tubuh-besar terus terisi, mamalia kemungkinan tetap kecil dan nokturnal seperti sepanjang Mesozoikum, tanpa radiasi mamalia besar.",
        source: "Schulte et al., Science (2010)",
        order: 1,
      },
      {
        id: "virtual-no-chicxulub-3",
        label: "Garis primata menuju manusia tak terpicu",
        description:
          "Tanpa kekosongan relung yang memicu radiasi primata, jalur evolusi menuju hominin — dan manusia — kemungkinan tak pernah terbentuk, atau menempuh jalur sangat berbeda.",
        source: "Gould, Wonderful Life (1989); Powell, 'Contingency and Convergence'",
        order: 2,
      },
    ],
  },
  {
    scenarioId: "scenario-no-eukaryogenesis",
    branchFromNodeId: "a-eukaryogenesis",
    nodes: [
      {
        id: "virtual-no-eukaryo-1",
        label: "Kehidupan tetap prokariotik",
        description:
          "Tanpa endosimbiosis mitokondria, kehidupan kemungkinan tetap berupa sel prokariotik sederhana — persis seperti ~2 miliar tahun pertama sejarah kehidupan.",
        source: "Lane & Martin, Nature 467:929 (2010)",
        order: 0,
      },
      {
        id: "virtual-no-eukaryo-2",
        label: "Tak ada multiselularitas kompleks",
        description:
          "Tanpa sel eukariota berdaya tinggi, tak ada organisme multiseluler kompleks — tak ada hewan, tumbuhan, maupun jamur. (Mekanisme energetiknya diperdebatkan.)",
        source: "Lynch & Marinov, PNAS (2015) — sanggahan mekanisme",
        order: 1,
      },
    ],
  },
  {
    scenarioId: "scenario-no-goe",
    branchFromNodeId: "a-goe-oxygenation",
    nodes: [
      {
        id: "virtual-no-goe-1",
        label: "Atmosfer tetap miskin oksigen",
        description:
          "Tanpa fotosintesis oksigenik, oksigen bebas tak pernah menumpuk; atmosfer tetap anoksik/mikro-aerob seperti sebelum Great Oxidation Event.",
        source: "Fischer, Hemp & Johnson, AREPS (2016)",
        order: 0,
      },
      {
        id: "virtual-no-goe-2",
        label: "Tak ada ozon maupun respirasi berdaya tinggi",
        description:
          "Tanpa O₂, tak terbentuk lapisan ozon pelindung dan tak ada metabolisme aerobik berdaya tinggi — sebuah 'plafon energi' membatasi ukuran dan aktivitas organisme.",
        source: "Sánchez-Baracaldo & Cardona, New Phytologist (2020)",
        order: 1,
      },
      {
        id: "virtual-no-goe-3",
        label: "Hewan besar aktif tak muncul",
        description:
          "Terkurung di bawah plafon energi anaerobik, kehidupan kemungkinan tetap mikrobial — hewan besar dan aktif tak terbentuk. (Timing kausal oksigen→kompleksitas diperdebatkan.)",
        source: "Fischer, Hemp & Johnson, AREPS (2016)",
        order: 2,
      },
    ],
  },
  {
    scenarioId: "scenario-mongol-continue-1242",
    branchFromNodeId: "h-mongol-1242",
    nodes: [
      {
        id: "virtual-mongol-1",
        label: "Kampanye Mongol berlanjut ke Eropa Barat",
        description:
          "Alih-alih mundur, tentara Mongol melanjutkan tekanan ke jantung Eropa Latin — sesuatu yang benar-benar ditakuti orang sezaman (Matthew Paris).",
        source: "Jackson, The Mongols and the West (2005)",
        order: 0,
      },
      {
        id: "virtual-mongol-2",
        label: "Disrupsi politik-demografis Eropa Tengah",
        description:
          "Konsekuensi yang masuk akal adalah disrupsi regional politik & demografis yang berat — bukan 'akhir Eropa', melainkan lintasan yang terganggu (framing konservatif Ferguson).",
        source: "Ferguson (ed.), Virtual History (1997)",
        order: 1,
      },
    ],
  },
];
