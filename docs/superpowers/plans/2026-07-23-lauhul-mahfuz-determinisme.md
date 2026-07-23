# Layer "Lauhul Mahfuz vs Determinisme" + Jalur E Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a derived interpretive layer (contingency label + "read-as" panel) on top of the existing Fine-Tuning simulation, plus a new argumentative branch ("Jalur E — Determinisme & Ketetapan") that ties physical-constant contingency to the lauhul-mahfuz concept.

**Architecture:** Pure derived layer — no changes to `simulate()`. A new pure function `classifyDeterminacy()` reads the existing `nodeSensitivities` to label nodes "kontingen"/"netral". New Jalur E nodes/edges live in `determinism-nodes.ts` and are spread into the canonical `chainNodes`/`chainEdges` arrays so every consumer (canvas, simulation, detail panel) sees them. UI adds a contingency badge (Fine-Tuning mode only) and a "Baca sebagai apa?" comparison block.

**Tech Stack:** Next.js 16 / React 19, TypeScript, Zustand, @xyflow/react (React Flow) + dagre layout, Tailwind, lucide-react. Unit tests via `bun test` (`bun:test`).

## Global Constraints

- Node id prefix for Jalur E is `f-` (NOT `d-` — `d-` is already used by the biliar branch: `d-physics`, `d-intention`, etc. Using `d-` would collide).
- Internal branch id: `determinisme-ketetapan`. User-facing label/letter: **"E."** (app currently has only A–D; no gap left in the switcher).
- Correlation target for lauhul-mahfuz → First Cause is `a-first-cause` (the real node id; the design doc's `a-first-cause-wajib-al-wujud` does not exist).
- Edge/correlation direction convention (repo-wide): `source` = akibat/downstream, `target` = sebab/upstream. "source bergantung pada target." Layout is TB (top→bottom), so `source` renders above `target`.
- Qur'an references use `surah` + `ayat` + **parafrase makna** — never long Arabic quotations (per `chain-nodes.ts` header convention).
- lauhul-mahfuz copy frames foreknowledge as **catatan ilmu, bukan mesin pemaksa** (teacher-knows-exam-outcome analogy). Do NOT claim "ilmu bergantung pada perbuatan" (Augustinian direction) — only "mengetahui ≠ menyebabkan".
- Philosophical scope is limited to concepts (lauhul mahfuz, qadar muallaq, qadar mubram). Do NOT name theological schools (Jabariyah/Qadariyah/Asy'ariyah).
- The contingency badge appears ONLY when Fine-Tuning panel is open AND at least one slider is off-nominal (`sim.anyChange === true`) — never in normal explore/Telusur/Tour.
- No new simulation state; no DB/Prisma changes.
- Sourcing convention (min. 2 cross-checked sources per claim). Grounded references for this feature:
  - QS Al-An'am:59 — kunci ghaib & Kitab mubin/Lauh Mahfuz (Tafsir Kemenag; tafsirweb).
  - QS Al-Hadid:22 — "tertulis dalam kitab sebelum Kami menciptakannya" (Tafsir Al-Wajiz Wahbah az-Zuhaili; Tafsir Al-Madinah al-Munawwarah).
  - Qadar mubram (final: kelahiran, kematian) vs muallaq (bergantung ikhtiar/doa: kesehatan, rezeki) — NU Online; Detik Hikmah.
  - Foreknowledge ≠ causation; hard determinism vs compatibilism (Frankfurt) — SEP "Foreknowledge and Free Will"; Britannica "Free will and moral responsibility".

---

## File Structure

- `src/data/chain-nodes.ts` (MODIFY) — add `"determinisme-ketetapan"` to `ChainBranch`; import + spread `determinismNodes` into `chainNodes`.
- `src/data/chain-edges.ts` (MODIFY) — add `"determinisme-ketetapan"` to the `ChainEdge.branch` union; import + spread `determinismEdges` into `chainEdges`.
- `src/data/determinism-nodes.ts` (CREATE) — 8 Jalur E `ChainNode`s (`f-` prefix) + 7 internal `ChainEdge`s. Type-only imports (no runtime cycle).
- `src/data/chain-correlations.ts` (MODIFY) — add one `thematic` correlation `f-lauhul-mahfuz → a-first-cause`.
- `src/lib/flow/determinacy.ts` (CREATE) — pure `classifyDeterminacy()` + `shouldShowContingencyBadge()`. Reads `nodeSensitivities` only; never imports `simulation.ts`.
- `tests/determinacy.test.ts` (CREATE) — unit tests for the two pure functions.
- `src/components/flow/CustomNode.tsx` (MODIFY) — render a contingency badge when `data.showContingency`.
- `src/components/flow/ChainFlowCanvas.tsx` (MODIFY) — compute `showContingency` in `decoratedNodes`, pass into node data.
- `src/components/flow/FineTuningMode.tsx` (MODIFY) — add "Baca sebagai apa?" two-column block + "Lihat Jalur E" link.
- `src/components/flow/BranchSwitcher.tsx` (MODIFY) — add Jalur E option.

---

### Task 1: Jalur E data — branch union, nodes, internal edges, correlation

**Files:**
- Create: `src/data/determinism-nodes.ts`
- Modify: `src/data/chain-nodes.ts` (ChainBranch union ~line 40-44; end of `chainNodes` array)
- Modify: `src/data/chain-edges.ts` (`ChainEdge.branch` union ~line 26; end of `chainEdges` array)
- Modify: `src/data/chain-correlations.ts` (append one entry to `chainCorrelations`)
- Test: `tests/simulation.test.ts` (existing integrity suite already validates node-id references; add a focused block)

**Interfaces:**
- Consumes: `ChainNode`, `ChainBranch` (from `chain-nodes.ts`); `ChainEdge` (from `chain-edges.ts`).
- Produces: `determinismNodes: ChainNode[]`, `determinismEdges: ChainEdge[]` (from `determinism-nodes.ts`). Node ids: `f-pengalaman-memilih`, `f-pertanyaan-ilusi`, `f-konstanta-kontingen`, `f-presisi-butuh-penjelasan`, `f-determinisme-pra-tertulis`, `f-lauhul-mahfuz`, `f-qadar-muallaq`, `f-qadar-mubram`. New correlation id: `corr-f-lauhulmahfuz-sebabpertama`.

- [ ] **Step 1: Create the Jalur E data module**

Create `src/data/determinism-nodes.ts`:

```ts
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
```

- [ ] **Step 2: Add the branch to the `ChainBranch` union**

In `src/data/chain-nodes.ts`, extend the union (currently ends at `"contoh-biliar"`):

```ts
export type ChainBranch =
  | "silsilah-manusia"
  | "kosmologis-utama"
  | "contoh-hujan"
  | "contoh-biliar"
  | "determinisme-ketetapan";
```

- [ ] **Step 3: Spread `determinismNodes` into `chainNodes`**

In `src/data/chain-nodes.ts`, add the import at the top (after existing imports, before `export type ChainCategory` is fine — keep it with other imports if any; this file currently has no imports, so add at line 31 region just above the `ChainCategory` type is NOT allowed since imports must precede — place it as the very first line after the file's top doc comment):

```ts
import { determinismNodes } from "./determinism-nodes";
```

Then change the array declaration from `export const chainNodes: ChainNode[] = [ ... ];` so the closing is followed by the spread. The cleanest edit: rename the literal to a local and spread. Replace the closing `];` of the `chainNodes` array's last element region — instead, append after the array literal by converting the export:

Find the declaration line:
```ts
export const chainNodes: ChainNode[] = [
```
Change to:
```ts
const coreChainNodes: ChainNode[] = [
```
Then immediately AFTER the array's closing `];` (end of file region for the array), add:
```ts
export const chainNodes: ChainNode[] = [...coreChainNodes, ...determinismNodes];
```

- [ ] **Step 4: Add the branch to `ChainEdge.branch` and spread `determinismEdges`**

In `src/data/chain-edges.ts`, extend the `branch` union (line ~26):

```ts
  branch?: "silsilah-manusia" | "kosmologis-utama" | "contoh-hujan" | "contoh-biliar" | "determinisme-ketetapan" | "all";
```

Add import near the top (after `export type { Edge };`):
```ts
import { determinismEdges } from "./determinism-nodes";
```

Rename the array literal and spread, same pattern as nodes. Change:
```ts
export const chainEdges: ChainEdge[] = [
```
to:
```ts
const coreChainEdges: ChainEdge[] = [
```
Then after the array's closing `];`, add:
```ts
export const chainEdges: ChainEdge[] = [...coreChainEdges, ...determinismEdges];
```

- [ ] **Step 5: Add the thematic correlation**

In `src/data/chain-correlations.ts`, append this object as the last element of the `chainCorrelations` array (before the closing `];`, after the `corr-you-homo` entry — add a comma after the previous entry's closing brace):

```ts
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
```

- [ ] **Step 6: Add a focused data-integrity test block**

In `tests/determinism-data.test.ts` (CREATE — keep separate so the existing `simulation.test.ts` stays focused):

```ts
import { describe, it, expect } from "bun:test";
import { chainNodes } from "../src/data/chain-nodes";
import { chainEdges } from "../src/data/chain-edges";
import { chainCorrelations } from "../src/data/chain-correlations";

const EXPECTED_F_IDS = [
  "f-pengalaman-memilih",
  "f-pertanyaan-ilusi",
  "f-konstanta-kontingen",
  "f-presisi-butuh-penjelasan",
  "f-determinisme-pra-tertulis",
  "f-lauhul-mahfuz",
  "f-qadar-muallaq",
  "f-qadar-mubram",
];

describe("Jalur E (determinisme-ketetapan) data", () => {
  it("adds all 8 f- nodes on the determinisme-ketetapan branch", () => {
    const ids = new Set(chainNodes.map((n) => n.id));
    for (const id of EXPECTED_F_IDS) expect(ids.has(id)).toBe(true);
    const branchNodes = chainNodes.filter((n) => n.branch === "determinisme-ketetapan");
    expect(branchNodes.length).toBe(8);
  });

  it("does not collide with existing d- (biliar) ids", () => {
    // every f- id starts with "f-", and none of the biliar d- ids were overwritten
    expect(chainNodes.some((n) => n.id === "d-physics")).toBe(true);
    for (const id of EXPECTED_F_IDS) expect(id.startsWith("f-")).toBe(true);
  });

  it("keeps all node ids unique after the spread", () => {
    const ids = chainNodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("Jalur E edges reference only existing nodes and carry the branch", () => {
    const ids = new Set(chainNodes.map((n) => n.id));
    const eEdges = chainEdges.filter((e) => e.branch === "determinisme-ketetapan");
    expect(eEdges.length).toBe(7);
    for (const e of eEdges) {
      expect(ids.has(e.source)).toBe(true);
      expect(ids.has(e.target)).toBe(true);
    }
  });

  it("adds the lauhul-mahfuz → a-first-cause thematic correlation", () => {
    const corr = chainCorrelations.find((c) => c.id === "corr-f-lauhulmahfuz-sebabpertama");
    expect(corr).toBeDefined();
    expect(corr!.source).toBe("f-lauhul-mahfuz");
    expect(corr!.target).toBe("a-first-cause");
    expect(corr!.kind).toBe("thematic");
    expect(corr!.propagatesFailure).toBe(false);
  });
});
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `bun test tests/determinism-data.test.ts`
Expected: PASS (5 tests). Also run `bun test tests/simulation.test.ts` — the existing "has between 10 and 15 correlations" test now sees 13 (was 12) → still PASS; "references only existing node ids" for correlations → PASS.

- [ ] **Step 8: Verify the whole suite + lint still pass**

Run: `bun test`
Expected: all pass.
Run: `bun run lint`
Expected: no new errors.

- [ ] **Step 9: Commit**

```bash
git add src/data/determinism-nodes.ts src/data/chain-nodes.ts src/data/chain-edges.ts src/data/chain-correlations.ts tests/determinism-data.test.ts
git commit -m "feat: add Jalur E (determinisme-ketetapan) nodes, edges, and lauhul-mahfuz correlation"
```

---

### Task 2: `classifyDeterminacy()` + `shouldShowContingencyBadge()` pure functions

**Files:**
- Create: `src/lib/flow/determinacy.ts`
- Test: `tests/determinacy.test.ts`

**Interfaces:**
- Consumes: `ConstantId`, `NodeSensitivity` (type-only, from `@/data/fine-tuning-impact`).
- Produces:
  - `type DeterminacyLabel = "kontingen" | "netral"`
  - `interface DeterminacyResult { label: DeterminacyLabel; dependsOnConstants: ConstantId[] }`
  - `function classifyDeterminacy(nodeId: string, sensitivities: Record<string, NodeSensitivity[]>): DeterminacyResult`
  - `function shouldShowContingencyBadge(simEnabled: boolean, anyChange: boolean, label: DeterminacyLabel): boolean`

- [ ] **Step 1: Write the failing test**

Create `tests/determinacy.test.ts`:

```ts
import { describe, it, expect } from "bun:test";
import type { NodeSensitivity } from "../src/data/fine-tuning-impact";
import { nodeSensitivities } from "../src/data/fine-tuning-impact";
import {
  classifyDeterminacy,
  shouldShowContingencyBadge,
} from "../src/lib/flow/determinacy";

describe("classifyDeterminacy", () => {
  it("labels a node with >=1 sensitivity as 'kontingen' and lists its constants", () => {
    const res = classifyDeterminacy("a-nucleosynthesis", nodeSensitivities);
    expect(res.label).toBe("kontingen");
    // a-nucleosynthesis is sensitive to G and alpha
    expect(res.dependsOnConstants).toContain("G");
    expect(res.dependsOnConstants).toContain("alpha");
  });

  it("labels a node with no sensitivity entry as 'netral' with an empty list", () => {
    const res = classifyDeterminacy("a-now", nodeSensitivities);
    expect(res.label).toBe("netral");
    expect(res.dependsOnConstants).toEqual([]);
  });

  it("dedupes repeated constant ids", () => {
    const map: Record<string, NodeSensitivity[]> = {
      x: [
        { constantId: "G", role: "critical", effect: "e", source: "s" },
        { constantId: "G", role: "contributing", effect: "e2", source: "s2" },
      ],
    };
    const res = classifyDeterminacy("x", map);
    expect(res.dependsOnConstants).toEqual(["G"]);
    expect(res.label).toBe("kontingen");
  });

  it("reads ONLY the passed map, not the global nodeSensitivities (no recompute)", () => {
    const map: Record<string, NodeSensitivity[]> = {
      "custom-node": [{ constantId: "Q", role: "critical", effect: "e", source: "s" }],
    };
    // custom id present in passed map → kontingen
    expect(classifyDeterminacy("custom-node", map).label).toBe("kontingen");
    // a real id that IS in the global map but NOT in the passed map → netral,
    // proving the function does not fall back to the global data / simulate().
    expect(classifyDeterminacy("a-nucleosynthesis", map).label).toBe("netral");
  });
});

describe("shouldShowContingencyBadge", () => {
  it("shows only when sim is enabled, something changed, and label is kontingen", () => {
    expect(shouldShowContingencyBadge(true, true, "kontingen")).toBe(true);
  });
  it("hides when nothing changed (slider at nominal)", () => {
    expect(shouldShowContingencyBadge(true, false, "kontingen")).toBe(false);
  });
  it("hides when the fine-tuning panel is closed", () => {
    expect(shouldShowContingencyBadge(false, true, "kontingen")).toBe(false);
  });
  it("hides for netral nodes", () => {
    expect(shouldShowContingencyBadge(true, true, "netral")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/determinacy.test.ts`
Expected: FAIL — "Cannot find module '../src/lib/flow/determinacy'" (module not yet created).

- [ ] **Step 3: Write the implementation**

Create `src/lib/flow/determinacy.ts`:

```ts
/**
 * determinacy.ts — layer interpretasi murni di atas mesin Fine-Tuning.
 *
 * Menentukan apakah sebuah node "bergantung pada ketetapan konstanta"
 * (kontingen) atau tidak (netral), MURNI dengan membaca nodeSensitivities yang
 * sudah ada di fine-tuning-impact.ts. TIDAK memanggil simulate() dan TIDAK
 * menyimpan state — ini hanya membaca ulang data yang sudah dihitung.
 *
 * Lihat docs/desain-lauhul-mahfuz-determinisme.md §4a.
 */

import type { ConstantId, NodeSensitivity } from "@/data/fine-tuning-impact";

export type DeterminacyLabel = "kontingen" | "netral";

export interface DeterminacyResult {
  label: DeterminacyLabel;
  /** Konstanta fine-tuning yang menjadi sandaran node ini (kosong = netral). */
  dependsOnConstants: ConstantId[];
}

/**
 * Node "kontingen" bila punya >=1 sensitivitas (critical ATAU contributing)
 * terhadap konstanta fine-tuning; selain itu "netral".
 */
export function classifyDeterminacy(
  nodeId: string,
  sensitivities: Record<string, NodeSensitivity[]>
): DeterminacyResult {
  const list = sensitivities[nodeId] ?? [];
  const dependsOnConstants = [...new Set(list.map((s) => s.constantId))];
  return {
    label: dependsOnConstants.length > 0 ? "kontingen" : "netral",
    dependsOnConstants,
  };
}

/**
 * Gating badge kontingensi: hanya tampil saat panel Fine-Tuning terbuka
 * (simEnabled) DAN minimal satu slider off-nominal (anyChange) DAN node kontingen.
 */
export function shouldShowContingencyBadge(
  simEnabled: boolean,
  anyChange: boolean,
  label: DeterminacyLabel
): boolean {
  return simEnabled && anyChange && label === "kontingen";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/determinacy.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/flow/determinacy.ts tests/determinacy.test.ts
git commit -m "feat: add pure classifyDeterminacy + contingency-badge gating"
```

---

### Task 3: Contingency badge on nodes (Fine-Tuning mode only)

**Files:**
- Modify: `src/components/flow/CustomNode.tsx` (`ChainNodeData` interface ~line 22-29; badge cluster ~line 123-149)
- Modify: `src/components/flow/ChainFlowCanvas.tsx` (imports ~line 38-39; `decoratedNodes` ~line 153-189; `rfNodes` data ~line 192-199)

**Interfaces:**
- Consumes: `classifyDeterminacy`, `shouldShowContingencyBadge` (from `@/lib/flow/determinacy`); `nodeSensitivities` (from `@/data/fine-tuning-impact`); existing `simEnabled` and `sim` in the canvas.
- Produces: `ChainNodeData.showContingency?: boolean` consumed by `CustomNode`.

- [ ] **Step 1: Add `showContingency` to `ChainNodeData`**

In `src/components/flow/CustomNode.tsx`, extend the interface (currently ends with `simStatus?: ...`):

```ts
export interface ChainNodeData extends Record<string, unknown> {
  node: ChainNode;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
  isTraversalActive?: boolean;
  simStatus?: "survives" | "altered" | "fails";
  showContingency?: boolean;
}
```

- [ ] **Step 2: Render the badge**

In `src/components/flow/CustomNode.tsx`, inside the badge cluster `<div className="flex items-center gap-1 flex-shrink-0">`, add this as the LAST badge (after the `simStatus === "altered"` badge, before the closing `</div>`):

```tsx
          {chainData.showContingency && (
            <span
              title="Bergantung pada ketetapan konstanta"
              className="text-[10px] font-bold bg-violet-500 text-white rounded px-1 py-0.5"
            >
              ⚙
            </span>
          )}
```

(`chainData` is already defined at the top of `CustomNodeImpl` as `data as unknown as ChainNodeData`.)

- [ ] **Step 3: Import the determinacy helpers in the canvas**

In `src/components/flow/ChainFlowCanvas.tsx`, add after the existing `chainCorrelations` import (line ~39):

```ts
import { classifyDeterminacy, shouldShowContingencyBadge } from "@/lib/flow/determinacy";
import { nodeSensitivities } from "@/data/fine-tuning-impact";
```

- [ ] **Step 4: Compute `showContingency` in `decoratedNodes`**

In `src/components/flow/ChainFlowCanvas.tsx`, inside the `decoratedNodes` `useMemo`, replace the returned object (currently ending with `simStatus: simEnabled && sim.anyChange ? sim.outcomes.get(n.id)?.status : undefined,`) so it also computes contingency:

```ts
      const isTraversalActiveNode = traversalActive && traversalNodeId === n.id;

      const determinacy = classifyDeterminacy(n.id, nodeSensitivities);
      const showContingency = shouldShowContingencyBadge(
        simEnabled,
        sim.anyChange,
        determinacy.label
      );

      return {
        ...n,
        isDimmed: !matchesCategory || !matchesSearch,
        isHighlighted: timelineMatch || isTraversalActiveNode,
        isSelected: selectedNodeId === n.id,
        isTraversalActive: isTraversalActiveNode,
        simStatus: simEnabled && sim.anyChange ? sim.outcomes.get(n.id)?.status : undefined,
        showContingency,
      };
```

(No dependency-array change needed: `simEnabled` and `sim` are already listed; `nodeSensitivities` is a module constant.)

- [ ] **Step 5: Pass `showContingency` into React Flow node data**

In `src/components/flow/ChainFlowCanvas.tsx`, update the `rfNodes` mapping (currently `data: { node: n, simStatus: n.simStatus } as unknown as ChainNodeData,`):

```ts
      data: {
        node: n,
        simStatus: n.simStatus,
        showContingency: n.showContingency,
      } as unknown as ChainNodeData,
```

- [ ] **Step 6: Verify build + lint**

Run: `bun run lint`
Expected: no new errors.
Run: `bun test`
Expected: all pass (this task adds no tests; existing suites unaffected).

- [ ] **Step 7: Manual visual check**

Run `bun run dev` (port 3002). Open the app, open Mode Fine-Tuning, move any slider off-nominal. Confirm: nodes sensitive to constants (e.g. Nukleosintesis, Rekombinasi) show a small violet ⚙ badge; netral nodes show none; the badge disappears when you Reset (all sliders nominal) and when the panel is closed.

- [ ] **Step 8: Commit**

```bash
git add src/components/flow/CustomNode.tsx src/components/flow/ChainFlowCanvas.tsx
git commit -m "feat: contingency (kontingen) badge on nodes in Fine-Tuning mode"
```

---

### Task 4: "Baca sebagai apa?" comparison block in FineTuningMode

**Files:**
- Modify: `src/components/flow/FineTuningMode.tsx` (store selectors ~line 42-48; new block after the cascade summary ~line 174; imports ~line 29-39)

**Interfaces:**
- Consumes: `sim.anyChange` (already computed); `setBranch`, `setPanelMode` from the store.
- Produces: none (UI only).

- [ ] **Step 1: Add the store selectors + an icon import**

In `src/components/flow/FineTuningMode.tsx`, add inside the component (near the other `useFlowStore` selectors, ~line 42-48):

```ts
  const setBranch = useFlowStore((s) => s.setBranch);
```

Add `BookOpen` and `ArrowRight` to the existing `lucide-react` import list (line ~29-38):

```ts
import {
  X,
  SlidersHorizontal,
  FlaskConical,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  GitCompareArrows,
  BookOpen,
  ArrowRight,
} from "lucide-react";
```

- [ ] **Step 2: Add the "Baca sebagai apa?" block**

In `src/components/flow/FineTuningMode.tsx`, immediately AFTER the closing `)}` of the `{sim.anyChange && ( ... )}` cascade-summary block (right before `{/* Body — sliders + cards */}`), insert:

```tsx
      {/* Baca sebagai apa? — dua lensa filosofis atas output simulasi yang sama */}
      {sim.anyChange && (
        <div className="p-3 border-b space-y-2 bg-violet-50/40 dark:bg-violet-950/20">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <h4 className="text-[11px] font-bold uppercase tracking-wide text-violet-800 dark:text-violet-200">
              Baca sebagai apa?
            </h4>
          </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Fakta yang sama — konstanta yang bisa saja bernilai lain — dibaca dua cara:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="rounded-md border border-border bg-background/60 p-2 space-y-1">
              <p className="font-bold">Determinisme (pra-tertulis)</p>
              <p className="leading-relaxed">
                Nilai konstanta <em>brute fact</em> — begitu saja. Rantai berjalan otomatis dari
                kondisi awal, tanpa penulis. Presisinya: kebetulan atau multiverse.
              </p>
            </div>
            <div className="rounded-md border border-violet-300 dark:border-violet-800 bg-violet-100/40 dark:bg-violet-900/20 p-2 space-y-1">
              <p className="font-bold">Lauhul Mahfuz (telah tertulis)</p>
              <p className="leading-relaxed">
                Konstanta &amp; rantainya ditetapkan lebih dulu berdasarkan ilmu yang mendahului,
                agar rantai ini bisa berjalan.
              </p>
            </div>
          </div>
          <p className="text-[10px] leading-relaxed rounded p-1.5 bg-amber-100/50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100">
            <strong>Bukan paksaan:</strong> ilmu yang mendahului tidak sama dengan sebab yang
            memaksa — seperti guru yang sudah tahu seorang murid akan lulus atau gagal, tanpa
            pengetahuan itu menjadi penyebab hasil ujiannya.
          </p>
          <button
            onClick={() => {
              setBranch("determinisme-ketetapan");
              setPanelMode("none");
            }}
            className="text-[10px] px-2 py-1 rounded border hover:bg-muted flex items-center gap-1 font-medium"
          >
            Lihat Jalur E
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
```

- [ ] **Step 3: Verify build + lint**

Run: `bun run lint`
Expected: no new errors (all imported icons are used; `setBranch` is used).
Run: `bun run build`
Expected: compiles (no TS errors — `"determinisme-ketetapan"` is a valid `ActiveBranch` because `ChainBranch` was extended in Task 1).

- [ ] **Step 4: Manual visual check**

In the running app, open Mode Fine-Tuning, move a slider off-nominal → the "Baca sebagai apa?" block appears with the two columns + teacher analogy. Click "Lihat Jalur E" → panel closes and the canvas switches to the Jalur E branch. Reset sliders → block disappears.

- [ ] **Step 5: Commit**

```bash
git add src/components/flow/FineTuningMode.tsx
git commit -m "feat: 'Baca sebagai apa?' lauhul-mahfuz vs determinisme block in Fine-Tuning panel"
```

---

### Task 5: Jalur E option in BranchSwitcher

**Files:**
- Modify: `src/components/flow/BranchSwitcher.tsx` (`OPTIONS` array ~line 18-49; header doc comment ~line 4-6)

**Interfaces:**
- Consumes: `ActiveBranch` (already includes `"determinisme-ketetapan"` since `ChainBranch` was extended in Task 1).
- Produces: none (UI only).

- [ ] **Step 1: Add the Jalur E option**

In `src/components/flow/BranchSwitcher.tsx`, insert this object into `OPTIONS` immediately BEFORE the `value: "all"` entry:

```ts
  {
    value: "determinisme-ketetapan",
    label: "E. Determinisme & Ketetapan",
    short: "E",
    description: "Kontingensi konstanta → Lauhul Mahfuz vs determinisme → Sebab Pertama",
  },
```

- [ ] **Step 2: Update the header doc comment**

In `src/components/flow/BranchSwitcher.tsx`, update the comment (line ~4-6) to reflect the new option:

```ts
/**
 * BranchSwitcher.tsx — Tab/switcher untuk berpindah antar jalur.
 * Pilihan: A (Kosmologis), B (Silsilah), C (Hujan), D (Biliar),
 * E (Determinisme & Ketetapan), All (gabungan).
 */
```

- [ ] **Step 3: Verify build + lint**

Run: `bun run lint`
Expected: no new errors.
Run: `bun run build`
Expected: compiles.

- [ ] **Step 4: Manual visual check**

In the running app, the switcher now shows an "E" chip. Click it → canvas renders the 8 Jalur E nodes in a vertical dagre layout (f-pengalaman-memilih at top → branching into determinisme + lauhul-mahfuz → qadar muallaq/mubram). Toggle "Garis Korelasi" (in Fine-Tuning panel, with a slider moved) or view branch "all" → the thematic dashed edge from Lauhul Mahfuz to the First-Cause muara is visible.

- [ ] **Step 5: Commit**

```bash
git add src/components/flow/BranchSwitcher.tsx
git commit -m "feat: add Jalur E (Determinisme & Ketetapan) to BranchSwitcher"
```

---

## Self-Review

**Spec coverage (design doc §3–6):**
- §3 `determinism-nodes.ts` (new) → Task 1. ✓
- §3 `chain-correlations.ts` (+ thematic entry) → Task 1 Step 5. ✓
- §3 `determinacy.ts` (new) → Task 2. ✓
- §3 `CustomNode.tsx` (badge, FT-mode only) → Task 3. ✓
- §3 `FineTuningMode.tsx` ("Baca sebagai apa?") → Task 4. ✓
- §3 `BranchSwitcher.tsx` (new option) → Task 5. ✓
- §3 `tests/determinacy.test.ts` (new) → Task 2. ✓ (plus `tests/determinism-data.test.ts` for the data layer.)
- §4a `classifyDeterminacy` signature/label → Task 2 (label at node level is "kontingen"/"netral", not qadar terms — matches §4a note). ✓
- §4b 8 nodes + internal edges (1→2→3→4→(5,6)→(7,8)) → Task 1 Step 1. ✓
- §4c correlation entry → Task 1 Step 5 (target corrected to `a-first-cause`). ✓
- §5a badge gating (FT mode + anyChange only) → `shouldShowContingencyBadge` (Task 2) + Task 3. ✓
- §5b panel block on `anyChange`, two columns, teacher analogy, "Lihat Jalur" link → Task 4. ✓
- §5c switcher option → Task 5. ✓
- §6 tests: critical-sensitivity → kontingen ✓; no-entry → netral ✓; does-not-recompute (reads passed map only) ✓; badge hidden when `anyChange===false` ✓ — all in Task 2.
- §6 YAGNI: no `simulate()` change ✓; no school names ✓; no badge in explore/Tour ✓ (gated by `simEnabled`); no DB change ✓.

**Deviations from the design doc (intentional, per Global Constraints):**
1. Node prefix `f-` not `d-` (biliar collision).
2. Branch label "E." not "F." (no gap; user-confirmed).
3. Correlation target `a-first-cause` not `a-first-cause-wajib-al-wujud` (real id).

**Placeholder scan:** none — every code step contains complete content.

**Type consistency:** `showContingency` defined in `ChainNodeData` (Task 3 Step 1), produced in canvas `decoratedNodes` (Step 4) and passed in `rfNodes` (Step 5), consumed in `CustomNode` render (Step 2). `classifyDeterminacy`/`shouldShowContingencyBadge` signatures identical across Task 2 (def) and Task 3 (call). `determinismNodes`/`determinismEdges` exported in Task 1 Step 1, imported in Steps 3–4. Branch string `"determinisme-ketetapan"` identical across nodes, edges, `ChainBranch`, `ChainEdge.branch`, switcher, and the "Lihat Jalur E" link.
