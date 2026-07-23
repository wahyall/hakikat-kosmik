# Perluasan Jalur E — Jembatan Determinisme ↔ Lauhul Mahfuz — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Grow Branch E ("determinisme-ketetapan") from 8 to 18 nodes so it explicitly bridges determinism and lauhul mahfuz via a mechanism layer (marâtib al-qadar + mahw/itsbat), a Western-parallel column, and a synthesis node — and ties the fine-tuned constants to "qadha' mubram yang tertulis". Pure data/interpretation layer; the simulation engine is untouched.

**Architecture:** Add nodes/edges to `determinism-nodes.ts` (spread into `chainNodes`/`chainEdges` already wired), add/repoint correlations in `chain-correlations.ts`, one copy line in `FineTuningMode.tsx`, and update two test files. No changes to `simulate()`, `determinacy.ts`, `CustomNode.tsx`, `ChainFlowCanvas.tsx`, `flow-store.ts`, or `BranchSwitcher.tsx` (badge + correlation edges are data-driven and cover new data automatically).

**Tech Stack:** Next.js 16 / React 19, TypeScript, @xyflow/react + dagre, Tailwind, lucide-react. Tests via `bun test` (`bun:test`).

## Global Constraints

- Node id prefix stays `f-` (never `d-`; `d-` is the biliar branch). Branch id string is exactly `determinisme-ketetapan`. All new nodes: `category: "filosofis"`, `branch: "determinisme-ketetapan"`, `isPhilosophical: true`, `timeValue: -1`.
- Direction convention (repo-wide): `source` = akibat/hilir (renders above in TB layout), `target` = sebab/hulu (below). "source bergantung pada target."
- Final counts after this feature: **18 Jalur E nodes**, **19 Jalur E edges**, **17 total correlations** (repoint 1, add 4).
- Qur'an refs use `quranRefs` with surah + ayat + parafrase makna ONLY — no long Arabic text.
- Framing (WAJIB): lauhul mahfuz = catatan ilmu, BUKAN mesin pemaksa (teacher-knows-exam analogy). Do NOT claim "ilmu bergantung pada perbuatan" (Augustinian). Marâtib al-qadar & mahw/itsbat presented as mainstream Ahlussunnah concepts; kasb (Al-Asy'ari) & ikhtiyâr (Al-Maturidi) named proportionally without sectarian polemic; Western positions (Boethius, Molinisme, kompatibilisme) as comparison, not primary authority.
- New correlations are `analogy`/`thematic` with `propagatesFailure: false` — never `dependency` (must not propagate cascade failure).
- Do NOT modify `simulate()` / engine logic, add simulation state, or touch DB/Prisma.

---

## File Structure

- `src/data/determinism-nodes.ts` (MODIFY) — add 10 nodes; expand `f-qadar-mubram` copy; rewire `determinismEdges` from 7 to 19 (remove 2 old `f-lauhul-mahfuz → qadar-*` edges, route them via `f-mahw-itsbat`; add mechanism/Barat/konvergensi edges).
- `src/data/chain-correlations.ts` (MODIFY) — repoint+rename 1 correlation to `f-sintesis → a-first-cause`; add 4 (`f-qadar-mubram → a-big-bang` thematic; 3 analogy cross-column).
- `tests/determinism-data.test.ts` (MODIFY) — expected node count 8→18 (+10 ids), edge count 7→19, updated correlation assertions.
- `tests/simulation.test.ts` (MODIFY) — correlation count bound `[10,15]` → `[10,20]`.
- `src/components/flow/FineTuningMode.tsx` (MODIFY) — one `<p>` in the Lauhul Mahfuz column of the "Baca sebagai apa?" block.

---

### Task 1: Expand Branch E nodes + rewire edges

**Files:**
- Modify: `src/data/determinism-nodes.ts` (`determinismNodes` array end; `f-qadar-mubram` description; `determinismEdges` array)
- Test: `tests/determinism-data.test.ts` (node/edge count + id list)

**Interfaces:**
- Consumes: `ChainNode`, `ChainEdge` (type-only, already imported in the file).
- Produces (node ids later tasks rely on): `f-maratib-ilm`, `f-maratib-kitabah`, `f-maratib-masyiah`, `f-maratib-khalq`, `f-kasb`, `f-mahw-itsbat`, `f-barat-boethius`, `f-barat-molinisme`, `f-barat-kompatibilisme`, `f-sintesis`.

- [ ] **Step 1: Update the data-integrity test to expect the enlarged branch (RED)**

In `tests/determinism-data.test.ts`, replace the `EXPECTED_F_IDS` array and the two count assertions. Change `EXPECTED_F_IDS` to:

```ts
const EXPECTED_F_IDS = [
  "f-pengalaman-memilih",
  "f-pertanyaan-ilusi",
  "f-konstanta-kontingen",
  "f-presisi-butuh-penjelasan",
  "f-determinisme-pra-tertulis",
  "f-lauhul-mahfuz",
  "f-qadar-muallaq",
  "f-qadar-mubram",
  "f-maratib-ilm",
  "f-maratib-kitabah",
  "f-maratib-masyiah",
  "f-maratib-khalq",
  "f-kasb",
  "f-mahw-itsbat",
  "f-barat-boethius",
  "f-barat-molinisme",
  "f-barat-kompatibilisme",
  "f-sintesis",
];
```

Change the node-count test title + assertion:

```ts
  it("adds all 18 f- nodes on the determinisme-ketetapan branch", () => {
    const ids = new Set(chainNodes.map((n) => n.id));
    for (const id of EXPECTED_F_IDS) expect(ids.has(id)).toBe(true);
    const branchNodes = chainNodes.filter((n) => n.branch === "determinisme-ketetapan");
    expect(branchNodes.length).toBe(18);
  });
```

Change the edge-count assertion (in the "Jalur E edges reference only existing nodes" test):

```ts
    expect(eEdges.length).toBe(19);
```

- [ ] **Step 2: Run the test to verify it fails (RED)**

Run: `bun test tests/determinism-data.test.ts`
Expected: FAIL — branch node count is 8 (expected 18) and edge count is 7 (expected 19); several `EXPECTED_F_IDS` not found.

- [ ] **Step 3: Add the 10 new nodes**

In `src/data/determinism-nodes.ts`, insert these 10 objects into the `determinismNodes` array immediately AFTER the existing `f-qadar-mubram` object (before the array's closing `];`). Add a comma after the `f-qadar-mubram` closing brace.

```ts
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
```

- [ ] **Step 3b: Refresh the file header comment to match the expanded scope**

In `src/data/determinism-nodes.ts`, the header doc comment currently claims "Skope istilah: … TANPA nama mazhab teologis" and describes only the original 8-node arc — now inaccurate. Update the "Prinsip framing" and "Sumber" sections of the header comment so they reflect the expansion: keep the lauhul-mahfuz = catatan-ilmu (bukan pemaksa) principle and the teacher-exam analogy; replace the "TANPA nama mazhab" line with a note that this bridge layer intentionally names positions (kasb — Al-Asy'ari; ikhtiyâr — Al-Maturidi) and Western parallels (Boethius, Molinisme, kompatibilisme) as comparison, framed as concept not sectarian polemic; add the new sources (Almanhaj marâtib al-qadar; hadis Muslim 50.000 tahun; QS Ar-Ra'd:39; SEP Foreknowledge/Compatibilism). Keep it concise — a few lines, matching the existing comment style.

- [ ] **Step 4: Expand the `f-qadar-mubram` description (fine-tuning tie-in)**

In `src/data/determinism-nodes.ts`, replace the `f-qadar-mubram` object's `description` string with:

```ts
    description:
      "Sebagian ketetapan bersifat mubram — final dan di luar kendali manusia. Nilai konstanta fisika itu sendiri adalah contoh mubram par excellence: tak ada ikhtiar atau doa yang mengubah α atau G. Justru di sinilah simulasi Fine-Tuning bertemu konsep qadar: konstanta yang Anda geser di simulasi = qadha' mubram yang tertulis. Simulasi membuktikan konstanta BISA bernilai lain (kontingen), maka nilai yang teraktual adalah ketetapan yang ditulis — bisa direnungi, tidak bisa digeser manusia.",
```

- [ ] **Step 5: Rewire `determinismEdges` to 19 edges**

In `src/data/determinism-nodes.ts`, replace the ENTIRE `determinismEdges` array (currently 7 edges) with the following 19-edge array. Note: the two old `f-lauhul-mahfuz → f-qadar-muallaq` / `→ f-qadar-mubram` edges are removed and re-routed via `f-mahw-itsbat`.

```ts
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
  {
    id: "e-f-presisi-to-boethius",
    source: "f-presisi-butuh-penjelasan",
    target: "f-barat-boethius",
    causalLabel: "pembanding Barat",
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
    causalLabel: "bertemu di",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-kasb-to-sintesis",
    source: "f-kasb",
    target: "f-sintesis",
    causalLabel: "bertemu di",
    branch: "determinisme-ketetapan",
  },
  {
    id: "e-f-kompatibilisme-to-sintesis",
    source: "f-barat-kompatibilisme",
    target: "f-sintesis",
    causalLabel: "bertemu di",
    branch: "determinisme-ketetapan",
  },
];
```

- [ ] **Step 6: Run the test to verify it passes (GREEN)**

Run: `bun test tests/determinism-data.test.ts`
Expected: PASS — branch node count 18, edge count 19, all ids present. (The correlation test still checks the OLD `corr-f-lauhulmahfuz-sebabpertama` and still passes — it is untouched until Task 2.)

- [ ] **Step 7: Run full suite + lint**

Run: `bun test`
Expected: all pass. NOTE: `tests/simulation.test.ts` "has between 10 and 15 correlations" still passes (correlations unchanged this task; still 13).
Run: `bun run lint`
Expected: no new errors (pre-existing: 2 in BookmarksPanel, 1 unused-eslint-disable warning in ChainFlowCanvas).

- [ ] **Step 8: Commit**

```bash
git add src/data/determinism-nodes.ts tests/determinism-data.test.ts
git commit -m "feat: expand Jalur E to 18 nodes (maratib al-qadar, Western parallels, synthesis)"
```

---

### Task 2: Correlations — repoint synthesis link + add bridge correlations

**Files:**
- Modify: `src/data/chain-correlations.ts` (rename+repoint `corr-f-lauhulmahfuz-sebabpertama`; append 4 correlations)
- Test: `tests/determinism-data.test.ts` (correlation assertion block); `tests/simulation.test.ts` (count bound)

**Interfaces:**
- Consumes: node ids from Task 1 (`f-sintesis`, `f-qadar-mubram`, `f-maratib-ilm`, `f-maratib-kitabah`, `f-kasb`, `f-barat-*`) and existing `a-first-cause`, `a-big-bang`.
- Produces: correlation ids `corr-f-sintesis-sebabpertama`, `corr-f-mubram-bigbang`, `corr-f-boethius-ilm`, `corr-f-molinisme-kitabah`, `corr-f-kompatibilisme-kasb`.

- [ ] **Step 1: Update the correlation tests (RED)**

In `tests/determinism-data.test.ts`, replace the last test (`"adds the lauhul-mahfuz → a-first-cause thematic correlation"`) with:

```ts
  it("repoints the Sebab Pertama link to the synthesis node", () => {
    const corr = chainCorrelations.find((c) => c.id === "corr-f-sintesis-sebabpertama");
    expect(corr).toBeDefined();
    expect(corr!.source).toBe("f-sintesis");
    expect(corr!.target).toBe("a-first-cause");
    expect(corr!.kind).toBe("thematic");
    expect(corr!.propagatesFailure).toBe(false);
    // old id is gone
    expect(chainCorrelations.find((c) => c.id === "corr-f-lauhulmahfuz-sebabpertama")).toBeUndefined();
  });

  it("adds the fine-tuning tie-in and cross-column parallel correlations", () => {
    const byId = new Map(chainCorrelations.map((c) => [c.id, c]));
    const mubram = byId.get("corr-f-mubram-bigbang");
    expect(mubram).toBeDefined();
    expect(mubram!.source).toBe("f-qadar-mubram");
    expect(mubram!.target).toBe("a-big-bang");
    expect(mubram!.kind).toBe("thematic");

    for (const [id, src, tgt] of [
      ["corr-f-boethius-ilm", "f-barat-boethius", "f-maratib-ilm"],
      ["corr-f-molinisme-kitabah", "f-barat-molinisme", "f-maratib-kitabah"],
      ["corr-f-kompatibilisme-kasb", "f-barat-kompatibilisme", "f-kasb"],
    ] as const) {
      const c = byId.get(id);
      expect(c).toBeDefined();
      expect(c!.source).toBe(src);
      expect(c!.target).toBe(tgt);
      expect(c!.kind).toBe("analogy");
      expect(c!.propagatesFailure).toBe(false);
    }
  });
```

In `tests/simulation.test.ts`, update the correlation-count bound:

```ts
  it("has between 10 and 20 correlations", () => {
    expect(chainCorrelations.length).toBeGreaterThanOrEqual(10);
    expect(chainCorrelations.length).toBeLessThanOrEqual(20);
  });
```

- [ ] **Step 2: Run tests to verify they fail (RED)**

Run: `bun test tests/determinism-data.test.ts`
Expected: FAIL — `corr-f-sintesis-sebabpertama` and the 4 new correlations not found.

- [ ] **Step 3: Repoint + rename the existing correlation**

In `src/data/chain-correlations.ts`, replace the existing `corr-f-lauhulmahfuz-sebabpertama` object with:

```ts
  {
    id: "corr-f-sintesis-sebabpertama",
    source: "f-sintesis",
    target: "a-first-cause",
    kind: "thematic",
    label: "titik pisahnya menyambung ke",
    reason:
      "Pertanyaan 'perlukah Penulis Yang Mengetahui' pada titik sintesis menyambung langsung ke argumen Sebab Pertama (Wajib al-Wujud).",
    citation: "Ibnu Sina, al-Isyarat; SEP: Foreknowledge and Free Will",
    propagatesFailure: false,
  },
```

- [ ] **Step 4: Append the 4 new correlations**

In `src/data/chain-correlations.ts`, add these 4 objects immediately AFTER the repointed `corr-f-sintesis-sebabpertama` object (still inside the `chainCorrelations` array, before the closing `];`):

```ts
  {
    id: "corr-f-mubram-bigbang",
    source: "f-qadar-mubram",
    target: "a-big-bang",
    kind: "thematic",
    label: "konstanta tersetel = qadha' mubram yang tertulis",
    reason:
      "Nilai konstanta fisika yang berlaku sejak awal alam adalah ketetapan mubram yang tertulis; simulasi Fine-Tuning membuktikan konstanta bisa bernilai lain, sehingga nilai yang teraktual adalah qadha' yang ditetapkan.",
    citation: "Rees, Just Six Numbers (1999); QS Al-Qamar:49",
    propagatesFailure: false,
  },
  {
    id: "corr-f-boethius-ilm",
    source: "f-barat-boethius",
    target: "f-maratib-ilm",
    kind: "analogy",
    label: "paralel: ilmu di luar waktu",
    reason:
      "Solusi 'kekinian abadi' Boethius sejajar dengan al-'Ilm: pengetahuan ilahi tidak mendahului secara temporal sehingga tidak memaksa.",
    citation: "SEP: Foreknowledge and Free Will",
    propagatesFailure: false,
  },
  {
    id: "corr-f-molinisme-kitabah",
    source: "f-barat-molinisme",
    target: "f-maratib-kitabah",
    kind: "analogy",
    label: "paralel: tahu pilihan bebas lalu menetapkan",
    reason:
      "Scientia media (tahu pilihan bebas lalu menetapkan dunia) sejajar dengan al-Kitâbah yang didasarkan pada al-'Ilm.",
    citation: "SEP: Foreknowledge and Free Will (middle knowledge)",
    propagatesFailure: false,
  },
  {
    id: "corr-f-kompatibilisme-kasb",
    source: "f-barat-kompatibilisme",
    target: "f-kasb",
    kind: "analogy",
    label: "paralel: bebas + determinisme kompatibel",
    reason:
      "Kompatibilisme (bebas = bertindak sesuai kehendak sendiri tanpa paksaan) sejajar dengan kasb: ketetapan tidak meniadakan tanggung jawab.",
    citation: "SEP: Compatibilism",
    propagatesFailure: false,
  },
```

- [ ] **Step 5: Run tests to verify they pass (GREEN)**

Run: `bun test tests/determinism-data.test.ts tests/simulation.test.ts`
Expected: PASS. `chainCorrelations.length` is now 17 (within [10,20]); simulation.test's "references only existing node ids" for correlations passes (all endpoints exist); "only dependency-kind correlations propagate failure" passes (all new ones are analogy/thematic with `propagatesFailure: false`).

- [ ] **Step 6: Run full suite + lint**

Run: `bun test`
Expected: all pass (including the "all-nominal → every node survives" and cascade tests — new nodes have no sensitivities so they always survive; new correlations don't propagate).
Run: `bun run lint`
Expected: no new errors.

- [ ] **Step 7: Commit**

```bash
git add src/data/chain-correlations.ts tests/determinism-data.test.ts tests/simulation.test.ts
git commit -m "feat: repoint Sebab Pertama link to synthesis + add bridge/fine-tuning correlations"
```

---

### Task 3: Fine-tuning panel line (qadha' mubram)

**Files:**
- Modify: `src/components/flow/FineTuningMode.tsx` (the Lauhul Mahfuz column inside the "Baca sebagai apa?" block)

**Interfaces:**
- Consumes: existing "Baca sebagai apa?" block (gated on `sim.anyChange`). No new imports, no store changes.

- [ ] **Step 1: Add the qadha' mubram line**

In `src/components/flow/FineTuningMode.tsx`, find the Lauhul Mahfuz column in the "Baca sebagai apa?" block — the `<div>` containing `<p className="font-bold">Lauhul Mahfuz (telah tertulis)</p>` followed by a paragraph ending "…agar rantai ini bisa berjalan." Immediately AFTER that paragraph's closing `</p>` and BEFORE the column `</div>`, insert:

```tsx
              <p className="leading-relaxed font-medium text-violet-800 dark:text-violet-200">
                Konstanta yang Anda geser = qadha&apos; mubram yang tertulis.
              </p>
```

Match the surrounding indentation exactly.

- [ ] **Step 2: Verify build + lint**

Run: `bun run lint`
Expected: no new errors.
Run: `bunx tsc --noEmit`
Expected: no NEW errors in `FineTuningMode.tsx` (there are ~6 pre-existing unrelated tsc errors; the project's next.config has `ignoreBuildErrors: true`, so tsc is the real type gate).

- [ ] **Step 3: Manual visual check**

Run `bun run dev` (port 3002). Open Mode Fine-Tuning, move a slider off-nominal → the "Baca sebagai apa?" block shows the new line "Konstanta yang Anda geser = qadha' mubram yang tertulis." in the Lauhul Mahfuz column. Switch to Branch E → the three columns (determinisme / mekanisme Islam / pembanding Barat) converge at "Titik Temu & Titik Pisah". Toggle Korelasi → dashed analogy lines link Boethius↔al-'Ilm, Molinisme↔al-Kitâbah, Kompatibilisme↔Kasb, plus the fine-tuning tie-in line (f-qadar-mubram → a-big-bang) and synthesis → Sebab Pertama.

- [ ] **Step 4: Commit**

```bash
git add src/components/flow/FineTuningMode.tsx
git commit -m "feat: tie fine-tuning constants to qadha' mubram in 'Baca sebagai apa?' panel"
```

---

## Self-Review

**Spec coverage (design doc §3–6):**
- §3 topology: 18 nodes, 19 edges, 3-column convergence → Task 1 (nodes + rewired edges). ✓
- §4 node content + sources (marâtib ×4, kasb, mahw/itsbat, Boethius, Molinisme, kompatibilisme, sintesis) → Task 1 Step 3. ✓
- §5a fine-tuning tie-in: `f-qadar-mubram` copy (Task 1 Step 4) + `corr-f-mubram-bigbang` (Task 2 Step 4) + panel line (Task 3). ✓
- §5b cross-column analogy correlations ×3 → Task 2 Step 4. ✓
- §5c repoint Sebab Pertama link to `f-sintesis` → Task 2 Step 3. ✓
- §6 test changes: node 18 / edge 19 (Task 1 Step 1), correlation assertions + count bound [10,20] (Task 2 Step 1). ✓
- §6 engine untouched: no task edits `simulation.ts`/`determinacy.ts`; new nodes have no sensitivities (always survive); new correlations `analogy`/`thematic` (no propagation). ✓
- §7 framing: copy uses teacher analogy, no "ilmu bergantung pada perbuatan"; concepts not sectarian polemic; Western as comparison. ✓

**Placeholder scan:** none — every step contains complete content.

**Type/name consistency:** node ids identical across Task 1 (definitions), Task 2 (correlation endpoints), and tests. Edge count 19 = 3 spine + 3 branch + 5 marâtib chain + 3 mahw sub-branch + 2 Barat + 3 konvergensi. Correlation count 13 → 17 (repoint keeps count; +4). `corr-f-sintesis-sebabpertama` replaces `corr-f-lauhulmahfuz-sebabpertama` (old id asserted absent in Task 2 test). Branch string `determinisme-ketetapan` uniform.

**Deviation note:** the determinism-nodes.ts file header comment still says "TANPA nama mazhab teologis" and describes only the original 8-node arc. This is now inaccurate (kasb names Al-Asy'ari/Al-Maturidi; Western positions added). Task 1 should also update that header comment to reflect the expanded scope (bridge layer + named positions) — fold into Task 1 Step 3 as a small doc-comment refresh so the file's contract matches its content.
