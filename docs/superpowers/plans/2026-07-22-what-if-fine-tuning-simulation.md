# What-If Fine-Tuning Simulation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the isolated Fine-Tuning panel into a live simulation that propagates the impact of changing physics constants across all timeline nodes (survives / altered / fails + "chain break point"), plus add a sourced node↔node correlation layer spanning branches and eras.

**Architecture:** A pure, React-free engine (`simulation.ts`) computes per-node outcomes from slider values, using two new sourced data files (`fine-tuning-impact.ts`, `chain-correlations.ts`). A thin Zustand store slice holds the slider values and a correlation-toggle flag; results are derived via `useMemo` in the canvas and panel. The canvas colors nodes and draws correlation edges; the panel shows a cascade summary.

**Tech Stack:** Next.js 16, React 19, TypeScript, Zustand, @xyflow/react (React Flow), Bun (`bun test` for unit tests), Tailwind + shadcn.

## Global Constraints

- All new user-facing copy is in **Indonesian**, matching existing components.
- Data claims follow the repo convention: each sensitivity/correlation carries a physical `reason` and a `source`/`citation` (Rees 1999, Barnes 2012 arXiv:1112.4647, Tegmark 1997, Adams 2008, Weinberg 1987, Penrose 2004).
- Direction convention (matches `chain-edges.ts`): `source` = effect (akibat), `target` = cause (sebab). "source depends on target."
- Constant ids are exactly: `"alpha" | "G" | "Lambda" | "me-mp" | "Q" | "dimensions"`.
- `bun test` is the test runner; test files end in `.test.ts` under `tests/`.
- Do NOT modify Prisma/DB, traversal/tour/reflection modes, or add new constants.
- Only `dependency`-kind correlations propagate failure (refinement of spec §4b: keeps the cascade graph acyclic; `shared-cause` nodes are already caught by their own direct sensitivities).

---

## File Structure

- `src/data/fine-tuning-impact.ts` (CREATE) — `ConstantId` type + `nodeSensitivities` map.
- `src/data/chain-correlations.ts` (CREATE) — `ChainCorrelation` type + `chainCorrelations` array.
- `src/lib/flow/simulation.ts` (CREATE) — pure `simulate(values)` engine.
- `tests/simulation.test.ts` (CREATE) — engine + data-integrity tests.
- `src/store/flow-store.ts` (MODIFY) — add `simValues`, `setSimValue`, `resetSim`, `showCorrelations`, `toggleCorrelations`.
- `src/components/flow/FineTuningMode.tsx` (MODIFY) — read/write store values, render cascade summary + correlation toggle.
- `src/components/flow/CustomNode.tsx` (MODIFY) — render simulation status tint/badge.
- `src/components/flow/ChainFlowCanvas.tsx` (MODIFY) — inject sim status into `decoratedNodes`; render correlation edges.

---

### Task 1: Node sensitivity data (`fine-tuning-impact.ts`)

**Files:**
- Create: `src/data/fine-tuning-impact.ts`
- Test: `tests/simulation.test.ts` (create with the data-integrity tests below)

**Interfaces:**
- Produces: `type ConstantId = "alpha" | "G" | "Lambda" | "me-mp" | "Q" | "dimensions"`; `interface NodeSensitivity { constantId: ConstantId; role: "critical" | "contributing"; effect: string; source: string }`; `const nodeSensitivities: Record<string, NodeSensitivity[]>`.

- [ ] **Step 1: Write the failing test**

Create `tests/simulation.test.ts`:

```ts
import { describe, it, expect } from "bun:test";
import { nodeSensitivities, type ConstantId } from "../src/data/fine-tuning-impact";
import { chainNodes } from "../src/data/chain-nodes";
import { fineTuningConstants } from "../src/data/fine-tuning-constants";

const VALID_CONSTANTS: ConstantId[] = ["alpha", "G", "Lambda", "me-mp", "Q", "dimensions"];

describe("nodeSensitivities data integrity", () => {
  it("references only existing node ids", () => {
    const nodeIds = new Set(chainNodes.map((n) => n.id));
    for (const id of Object.keys(nodeSensitivities)) {
      expect(nodeIds.has(id)).toBe(true);
    }
  });

  it("references only valid constant ids present in fineTuningConstants", () => {
    const constIds = new Set(fineTuningConstants.map((c) => c.id));
    for (const list of Object.values(nodeSensitivities)) {
      for (const s of list) {
        expect(VALID_CONSTANTS).toContain(s.constantId);
        expect(constIds.has(s.constantId)).toBe(true);
      }
    }
  });

  it("every sensitivity has a non-empty effect and source", () => {
    for (const list of Object.values(nodeSensitivities)) {
      for (const s of list) {
        expect(s.effect.length).toBeGreaterThan(0);
        expect(s.source.length).toBeGreaterThan(0);
        expect(["critical", "contributing"]).toContain(s.role);
      }
    }
  });

  it("covers the key cosmological-era nodes", () => {
    for (const id of ["a-nucleosynthesis", "a-recombination", "a-first-stars", "a-abiogenesis"]) {
      expect(nodeSensitivities[id]?.length ?? 0).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/simulation.test.ts`
Expected: FAIL — cannot resolve `../src/data/fine-tuning-impact`.

- [ ] **Step 3: Write minimal implementation**

Create `src/data/fine-tuning-impact.ts`:

```ts
/**
 * fine-tuning-impact.ts
 *
 * Sensitivitas node timeline terhadap konstanta fisika fundamental.
 * Dipakai mesin simulasi "What If?" untuk menentukan node mana yang gagal
 * terbentuk / berubah ketika konstanta digeser keluar rentang habitable.
 *
 * Konvensi:
 * - role "critical"     : node TIDAK bisa terbentuk jika konstanta keluar rentang habitable
 * - role "contributing" : node berubah sifat, tapi tak otomatis gagal
 *
 * Sumber (verifikasi silang min. 2 sesuai konvensi chain-nodes.ts):
 * - Rees, M. Just Six Numbers (1999)
 * - Barnes, L. arXiv:1112.4647 (2012)
 * - Tegmark, M. "On the dimensionality of spacetime" (1997)
 * - Adams, F. "Stars in Other Universes" (2008, arXiv:0807.3697)
 * - Weinberg, S. "Anthropic bound on the cosmological constant" (1987)
 */

export type ConstantId = "alpha" | "G" | "Lambda" | "me-mp" | "Q" | "dimensions";

export interface NodeSensitivity {
  constantId: ConstantId;
  role: "critical" | "contributing";
  /** Apa yang berubah/rusak SPESIFIK di node ini */
  effect: string;
  source: string;
}

/**
 * nodeId -> daftar sensitivitas.
 * Catatan desain: a-big-bang & a-planck-epoch sengaja TANPA sensitivitas langsung
 * (mereka substrat asal; konstanta baru bermakna sesudahnya) agar rantai putus di
 * era hilir yang spesifik, bukan "selalu gagal total".
 */
export const nodeSensitivities: Record<string, NodeSensitivity[]> = {
  "a-nucleosynthesis": [
    {
      constantId: "G",
      role: "critical",
      effect:
        "Laju ekspansi vs. laju reaksi nuklir menentukan rasio H/He; G di luar rentang membuat nukleosintesis Big Bang gagal menghasilkan campuran unsur ringan yang benar.",
      source: "Rees (1999); Barnes (2012) §4.2",
    },
    {
      constantId: "alpha",
      role: "critical",
      effect:
        "α mengatur barrier Coulomb & kekuatan efektif ikatan inti ringan; di luar rentang, deuterium tak stabil dan rantai fusi BBN terputus.",
      source: "Barnes (2012) §4.4",
    },
  ],
  "a-recombination": [
    {
      constantId: "alpha",
      role: "critical",
      effect:
        "Energi ikat elektron sebanding α²; α meleset membuat atom netral tak terbentuk sebagaimana mestinya — tidak ada CMB & tidak ada kimia.",
      source: "Barnes (2012); Rees (1999)",
    },
  ],
  "a-first-stars": [
    {
      constantId: "G",
      role: "critical",
      effect:
        "Runtuh gravitasi awan gas menyalakan fusi; G terlalu kecil → awan tak runtuh, G terlalu besar → bintang membakar bahan bakar terlalu cepat.",
      source: "Rees (1999); Adams (2008)",
    },
    {
      constantId: "alpha",
      role: "contributing",
      effect:
        "α menggeser kesetimbangan tekanan radiasi vs. gravitasi, mengubah rentang massa bintang yang bisa menyala.",
      source: "Adams (2008)",
    },
  ],
  "a-first-galaxies": [
    {
      constantId: "Q",
      role: "critical",
      effect:
        "Amplitudo fluktuasi Q adalah benih struktur; di luar 10⁻⁶–10⁻⁴ hanya lubang hitam atau gas seragam — tak ada galaksi berstruktur.",
      source: "Rees (1999)",
    },
    {
      constantId: "Lambda",
      role: "critical",
      effect:
        "Λ terlalu besar mempercepat ekspansi sehingga gravitasi tak sempat merakit galaksi.",
      source: "Weinberg (1987)",
    },
  ],
  "a-solar-system": [
    {
      constantId: "G",
      role: "contributing",
      effect:
        "G mengubah skala & stabilitas pembentukan cakram protoplanet dan orbit.",
      source: "Rees (1999)",
    },
  ],
  "a-earth-formation": [
    {
      constantId: "dimensions",
      role: "critical",
      effect:
        "Orbit planet hanya stabil secara matematis di D=3; D≠3 membuat orbit tak stabil (spiral masuk/keluar).",
      source: "Tegmark (1997)",
    },
  ],
  "a-abiogenesis": [
    {
      constantId: "alpha",
      role: "critical",
      effect:
        "Kimia kovalen bergantung α; di luar rentang tidak ada ikatan kimia stabil untuk kehidupan.",
      source: "Barnes (2012)",
    },
    {
      constantId: "me-mp",
      role: "critical",
      effect:
        "Rasio massa menentukan ukuran orbital & kestabilan molekul organik; meleset → DNA/protein mustahil.",
      source: "Barnes (2012)",
    },
    {
      constantId: "dimensions",
      role: "critical",
      effect:
        "Kestabilan atom (dan karenanya molekul) juga menuntut D=3.",
      source: "Tegmark (1997)",
    },
  ],
  "a-homo-sapiens": [
    {
      constantId: "me-mp",
      role: "contributing",
      effect:
        "Biokimia kompleks otak bergantung pada kestabilan molekul yang ditentukan rasio massa.",
      source: "Barnes (2012)",
    },
  ],
  "c-fusion": [
    {
      constantId: "alpha",
      role: "critical",
      effect:
        "Rantai proton-proton di inti Matahari sensitif α; di luar rentang fusi tak menyala.",
      source: "Adams (2008)",
    },
    {
      constantId: "G",
      role: "contributing",
      effect: "G menentukan tekanan inti yang memicu dan menjaga fusi.",
      source: "Adams (2008)",
    },
  ],
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/simulation.test.ts`
Expected: PASS (4 tests in the `nodeSensitivities data integrity` block).

- [ ] **Step 5: Commit**

```bash
git add src/data/fine-tuning-impact.ts tests/simulation.test.ts
git commit -m "feat: add sourced node sensitivity data for fine-tuning simulation"
```

---

### Task 2: Node correlation data (`chain-correlations.ts`)

**Files:**
- Create: `src/data/chain-correlations.ts`
- Test: `tests/simulation.test.ts` (append a `describe` block)

**Interfaces:**
- Produces: `type CorrelationKind = "dependency" | "shared-cause" | "analogy" | "thematic"`; `interface ChainCorrelation { id: string; source: string; target: string; kind: CorrelationKind; label: string; reason: string; citation?: string; propagatesFailure: boolean }`; `const chainCorrelations: ChainCorrelation[]`.

- [ ] **Step 1: Write the failing test**

Append to `tests/simulation.test.ts`:

```ts
import { chainCorrelations } from "../src/data/chain-correlations";

describe("chainCorrelations data integrity", () => {
  it("references only existing node ids", () => {
    const nodeIds = new Set(chainNodes.map((n) => n.id));
    for (const c of chainCorrelations) {
      expect(nodeIds.has(c.source)).toBe(true);
      expect(nodeIds.has(c.target)).toBe(true);
    }
  });

  it("has unique ids", () => {
    const ids = chainCorrelations.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only dependency-kind correlations propagate failure", () => {
    for (const c of chainCorrelations) {
      expect(c.propagatesFailure).toBe(c.kind === "dependency");
    }
  });

  it("spans multiple branches (cross-branch links exist)", () => {
    const byId = new Map(chainNodes.map((n) => [n.id, n]));
    const crossBranch = chainCorrelations.filter(
      (c) => byId.get(c.source)?.branch !== byId.get(c.target)?.branch
    );
    expect(crossBranch.length).toBeGreaterThan(0);
  });

  it("has between 10 and 15 correlations", () => {
    expect(chainCorrelations.length).toBeGreaterThanOrEqual(10);
    expect(chainCorrelations.length).toBeLessThanOrEqual(15);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/simulation.test.ts`
Expected: FAIL — cannot resolve `../src/data/chain-correlations`.

- [ ] **Step 3: Write minimal implementation**

Create `src/data/chain-correlations.ts`:

```ts
/**
 * chain-correlations.ts
 *
 * Layer korelasi node↔node DI LUAR edge kausal parent-child (chain-edges.ts).
 * Menghubungkan node lintas-cabang & lintas-era untuk memperkaya simulasi
 * fine-tuning dan menampilkan keterkaitan yang tak tampak di rantai kausal linear.
 *
 * Konvensi arah (sama dengan chain-edges.ts): source = akibat, target = sebab.
 * "source bergantung pada target."
 *
 * kind:
 * - dependency   : source butuh target sebagai prasyarat fisik → MERAMBATKAN kegagalan
 * - shared-cause : keduanya bergantung sebab kosmik yang sama (tidak merambat;
 *                  masing-masing sudah dijaga sensitivitas langsungnya)
 * - analogy      : proses fisik serupa (tidak merambat)
 * - thematic     : kaitan argumentatif/tema (tidak merambat)
 */

export type CorrelationKind = "dependency" | "shared-cause" | "analogy" | "thematic";

export interface ChainCorrelation {
  id: string;
  source: string;
  target: string;
  kind: CorrelationKind;
  /** label singkat untuk edge di canvas */
  label: string;
  /** justifikasi fisis/logis */
  reason: string;
  citation?: string;
  /** hanya true untuk kind "dependency" */
  propagatesFailure: boolean;
}

export const chainCorrelations: ChainCorrelation[] = [
  {
    id: "corr-earth-stars",
    source: "a-earth-formation",
    target: "a-first-stars",
    kind: "dependency",
    label: "butuh unsur berat dari",
    reason:
      "Planet berbatu tersusun dari C, O, Si, Fe yang ditempa di inti & supernova bintang generasi awal.",
    citation: "Rees (1999)",
    propagatesFailure: true,
  },
  {
    id: "corr-solar-stars",
    source: "a-solar-system",
    target: "a-first-stars",
    kind: "dependency",
    label: "menyemai logam dari",
    reason:
      "Matahari & cakram protoplanetnya kaya logam hasil daur ulang bintang generasi sebelumnya.",
    citation: "Rees (1999)",
    propagatesFailure: true,
  },
  {
    id: "corr-stars-recomb",
    source: "a-first-stars",
    target: "a-recombination",
    kind: "dependency",
    label: "awannya runtuh setelah",
    reason:
      "Setelah rekombinasi, gas menjadi netral dan bisa mendingin lalu runtuh gravitasi menjadi bintang pertama.",
    citation: "Rees (1999)",
    propagatesFailure: true,
  },
  {
    id: "corr-sunlight-solar",
    source: "c-sunlight",
    target: "a-solar-system",
    kind: "dependency",
    label: "bersumber dari Matahari di",
    reason: "Cahaya Matahari mensyaratkan terbentuknya Matahari dalam Tata Surya.",
    citation: "NASA",
    propagatesFailure: true,
  },
  {
    id: "corr-evap-earth",
    source: "c-evaporation",
    target: "a-earth-formation",
    kind: "dependency",
    label: "butuh planet berair dari",
    reason: "Penguapan air permukaan mensyaratkan planet berbatu dengan air cair.",
    citation: "NASA",
    propagatesFailure: true,
  },
  {
    id: "corr-hominids-abio",
    source: "b-early-hominids",
    target: "a-abiogenesis",
    kind: "dependency",
    label: "garis hidup berakar pada",
    reason: "Silsilah biologis manusia berakar pada peristiwa asal-usul kehidupan pertama.",
    citation: "UC Berkeley Understanding Evolution",
    propagatesFailure: true,
  },
  {
    id: "corr-homo-abio",
    source: "a-homo-sapiens",
    target: "a-abiogenesis",
    kind: "dependency",
    label: "keturunan jauh dari",
    reason: "Homo sapiens adalah cabang jauh dari pohon kehidupan yang bermula di abiogenesis.",
    citation: "Smithsonian Human Origins",
    propagatesFailure: true,
  },
  {
    id: "corr-fusion-nucleo",
    source: "c-fusion",
    target: "a-nucleosynthesis",
    kind: "analogy",
    label: "fisika fusi serupa dengan",
    reason:
      "Fusi di inti Matahari dan nukleosintesis Big Bang sama-sama fusi nuklir ringan (meski kondisi berbeda).",
    citation: "NASA",
    propagatesFailure: false,
  },
  {
    id: "corr-galaxies-nucleo",
    source: "a-first-galaxies",
    target: "a-nucleosynthesis",
    kind: "shared-cause",
    label: "sama-sama peka konstanta dengan",
    reason:
      "Galaksi & nukleosintesis sama-sama sensitif terhadap keseimbangan G (dan Q) di alam yang sama.",
    citation: "Rees (1999)",
    propagatesFailure: false,
  },
  {
    id: "corr-homo-maklumat",
    source: "a-homo-sapiens",
    target: "b-maklumat-asabiqah",
    kind: "thematic",
    label: "kapasitas berpikirnya adalah",
    reason:
      "Kemunculan kapasitas kognitif Homo sapiens berkaitan tematik dengan syarat berpikir (maklumat asabiqah).",
    citation: "An-Nabhani, Nizham al-Islam",
    propagatesFailure: false,
  },
  {
    id: "corr-physics-firstcause",
    source: "d-physics",
    target: "a-first-cause",
    kind: "thematic",
    label: "sebagai mumkin al-wujud menuju",
    reason:
      "Hukum fisika sendiri bersifat mumkin al-wujud sehingga menuntut Wajib al-Wujud sebagai muara.",
    citation: "Ibnu Sina, al-Isyarat",
    propagatesFailure: false,
  },
  {
    id: "corr-bigbang-ghazali",
    source: "a-big-bang",
    target: "a-first-cause-al-ghazali",
    kind: "thematic",
    label: "huduts-nya menuntut",
    reason:
      "Permulaan alam (huduts) pada Big Bang menuntut muhdits — inti bantahan tasalsul Al-Ghazali.",
    citation: "Al-Ghazali, Tahafut al-Falasifah",
    propagatesFailure: false,
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/simulation.test.ts`
Expected: PASS (both `describe` blocks; correlations count = 12).

- [ ] **Step 5: Commit**

```bash
git add src/data/chain-correlations.ts tests/simulation.test.ts
git commit -m "feat: add cross-branch node correlation layer data"
```

---

### Task 3: Simulation engine (`simulation.ts`)

**Files:**
- Create: `src/lib/flow/simulation.ts`
- Test: `tests/simulation.test.ts` (append)

**Interfaces:**
- Consumes: `nodeSensitivities`, `ConstantId` (Task 1); `chainCorrelations` (Task 2); `chainNodes`, `chainEdges`, `fineTuningConstants` (existing).
- Produces: `type NodeStatus = "survives" | "altered" | "fails"`; `interface NodeOutcome { status: NodeStatus; reason: string; dueToConstant?: ConstantId; viaCascade?: boolean }`; `interface SimulationResult { outcomes: Map<string, NodeOutcome>; firstFailure: { nodeId: string; timeValue: number } | null; failedInOrder: string[]; counts: { survives: number; altered: number; fails: number }; anyChange: boolean }`; `function simulate(values: Record<ConstantId, number>): SimulationResult`; `function nominalValues(): Record<ConstantId, number>`.

- [ ] **Step 1: Write the failing test**

Append to `tests/simulation.test.ts`:

```ts
import { simulate, nominalValues } from "../src/lib/flow/simulation";

describe("simulate engine", () => {
  it("all-nominal → every node survives and anyChange is false", () => {
    const res = simulate(nominalValues());
    expect(res.anyChange).toBe(false);
    for (const [, o] of res.outcomes) expect(o.status).toBe("survives");
    expect(res.counts.fails).toBe(0);
    expect(res.counts.altered).toBe(0);
    expect(res.firstFailure).toBeNull();
  });

  it("alpha out of range → nucleosynthesis fails directly", () => {
    const v = nominalValues();
    v.alpha = 0.02; // > habitableMax 0.009
    const res = simulate(v);
    const nucleo = res.outcomes.get("a-nucleosynthesis")!;
    expect(nucleo.status).toBe("fails");
    expect(nucleo.dueToConstant).toBe("alpha");
    expect(nucleo.viaCascade).toBeFalsy();
    expect(res.anyChange).toBe(true);
  });

  it("cascade flows old→young: failing nucleosynthesis kills the present", () => {
    const v = nominalValues();
    v.G = 6.674e-9; // > habitableMax 6.674e-10
    const res = simulate(v);
    // a-now has NO direct sensitivity — it can only fail via cascade
    const now = res.outcomes.get("a-now")!;
    expect(now.status).toBe("fails");
    expect(now.viaCascade).toBe(true);
    // the direct hit is upstream (older)
    expect(res.outcomes.get("a-nucleosynthesis")!.viaCascade).toBeFalsy();
  });

  it("firstFailure is the oldest (smallest timeValue) direct hit", () => {
    const v = nominalValues();
    v.alpha = 0.02;
    const res = simulate(v);
    expect(res.firstFailure).not.toBeNull();
    expect(res.firstFailure!.nodeId).toBe("a-nucleosynthesis");
  });

  it("off-nominal but in-range → sensitive node is altered, not failed", () => {
    const v = nominalValues();
    v.alpha = 0.0085; // in [0.006, 0.009] but != nominal 0.00729735
    const res = simulate(v);
    expect(res.outcomes.get("a-recombination")!.status).toBe("altered");
    expect(res.counts.fails).toBe(0);
  });

  it("analogy/thematic correlations do not propagate failure", () => {
    const v = nominalValues();
    v.alpha = 0.02; // kills nucleosynthesis; c-fusion links to it via ANALOGY only
    const res = simulate(v);
    // c-fusion has its OWN alpha-critical sensitivity, so it fails directly — assert
    // that a purely thematic target is unaffected instead:
    // a-first-cause is linked from d-physics via thematic; nothing should force it to fail
    expect(res.outcomes.get("a-first-cause")!.status).toBe("survives");
  });

  it("failedInOrder is sorted by ascending timeValue", () => {
    const v = nominalValues();
    v.alpha = 0.02;
    const res = simulate(v);
    const times = res.failedInOrder.map(
      (id) => res.outcomes.get(id) && id
    );
    // verify monotonic non-decreasing timeValue
    const { chainNodes: nodes } = require("../src/data/chain-nodes");
    const tv = new Map(nodes.map((n: any) => [n.id, n.timeValue]));
    for (let i = 1; i < res.failedInOrder.length; i++) {
      expect(tv.get(res.failedInOrder[i])).toBeGreaterThanOrEqual(
        tv.get(res.failedInOrder[i - 1])
      );
    }
    expect(times.length).toBe(res.failedInOrder.length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/simulation.test.ts`
Expected: FAIL — cannot resolve `../src/lib/flow/simulation`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/flow/simulation.ts`:

```ts
/**
 * simulation.ts — mesin murni "What If?" fine-tuning.
 *
 * Menghitung dampak perubahan konstanta fisika ke seluruh node timeline:
 * status per node (survives/altered/fails) + perambatan (cascade) kegagalan
 * lewat edge kausal + korelasi dependency, plus "titik rantai putus".
 *
 * Bebas React — dapat diuji unit dengan `bun test`.
 *
 * Arah: edge/korelasi "source → target" berarti source (akibat) BERGANTUNG pada
 * target (sebab). Jika target gagal, source ikut gagal (cascade). Karena target
 * selalu lebih tua (waktu lebih kecil), kegagalan merambat dari tua → muda.
 */

import { chainNodes } from "@/data/chain-nodes";
import { chainEdges } from "@/data/chain-edges";
import { fineTuningConstants } from "@/data/fine-tuning-constants";
import { nodeSensitivities, type ConstantId } from "@/data/fine-tuning-impact";
import { chainCorrelations } from "@/data/chain-correlations";

export type NodeStatus = "survives" | "altered" | "fails";

export interface NodeOutcome {
  status: NodeStatus;
  reason: string;
  dueToConstant?: ConstantId;
  /** true jika node gagal karena hulunya gagal (bukan hit langsung) */
  viaCascade?: boolean;
}

export interface SimulationResult {
  outcomes: Map<string, NodeOutcome>;
  firstFailure: { nodeId: string; timeValue: number } | null;
  failedInOrder: string[];
  counts: { survives: number; altered: number; fails: number };
  anyChange: boolean;
}

const CONSTANTS = new Map(fineTuningConstants.map((c) => [c.id as ConstantId, c]));

export function nominalValues(): Record<ConstantId, number> {
  const v = {} as Record<ConstantId, number>;
  for (const c of fineTuningConstants) v[c.id as ConstantId] = c.nominalValue;
  return v;
}

function isOutOfRange(id: ConstantId, value: number): boolean {
  const c = CONSTANTS.get(id);
  if (!c) return false;
  return value < c.habitableMin || value > c.habitableMax;
}

function isOffNominal(id: ConstantId, value: number): boolean {
  const c = CONSTANTS.get(id);
  if (!c) return false;
  // toleransi relatif kecil supaya slider "di nominal" tidak dianggap berubah
  return Math.abs(value - c.nominalValue) / (Math.abs(c.nominalValue) || 1) > 1e-6;
}

export function simulate(values: Record<ConstantId, number>): SimulationResult {
  const anyChange = (Object.keys(values) as ConstantId[]).some((id) =>
    isOffNominal(id, values[id])
  );

  const outcomes = new Map<string, NodeOutcome>();

  // --- Fase 1: direct hit per node ---
  for (const node of chainNodes) {
    const sens = nodeSensitivities[node.id] ?? [];
    let outcome: NodeOutcome = { status: "survives", reason: "Tidak terdampak langsung." };

    // critical + out-of-range → fails
    for (const s of sens) {
      if (s.role === "critical" && isOutOfRange(s.constantId, values[s.constantId])) {
        outcome = {
          status: "fails",
          reason: s.effect,
          dueToConstant: s.constantId,
        };
        break;
      }
    }

    // kalau belum fails, cek altered
    if (outcome.status !== "fails") {
      for (const s of sens) {
        const out = isOutOfRange(s.constantId, values[s.constantId]);
        const off = isOffNominal(s.constantId, values[s.constantId]);
        // contributing yang keluar rentang → berubah (bukan gagal);
        // konstanta apa pun yang off-nominal tapi masih dalam rentang → berubah
        if ((s.role === "contributing" && out) || (off && !out)) {
          outcome = {
            status: "altered",
            reason: s.effect,
            dueToConstant: s.constantId,
          };
          break;
        }
      }
    }

    outcomes.set(node.id, outcome);
  }

  // --- Fase 2: cascade kegagalan (tua → muda) ---
  // Bangun peta prereq: dependent(source) -> daftar prereq(target).
  const prereqs = new Map<string, string[]>();
  const addDep = (source: string, target: string) => {
    if (!prereqs.has(source)) prereqs.set(source, []);
    prereqs.get(source)!.push(target);
  };
  for (const e of chainEdges) addDep(e.source, e.target);
  for (const c of chainCorrelations) if (c.propagatesFailure) addDep(c.source, c.target);

  // Iterasi sampai stabil: node gagal bila salah satu prereq-nya gagal.
  let changed = true;
  while (changed) {
    changed = false;
    for (const [dependent, deps] of prereqs) {
      const cur = outcomes.get(dependent);
      if (!cur || cur.status === "fails") continue;
      const failedDep = deps.find((d) => outcomes.get(d)?.status === "fails");
      if (failedDep) {
        outcomes.set(dependent, {
          status: "fails",
          reason: `Gagal karena prasyaratnya tidak terbentuk: ${failedDep}.`,
          viaCascade: true,
        });
        changed = true;
      }
    }
  }

  // --- Fase 3: ringkasan ---
  const timeById = new Map(chainNodes.map((n) => [n.id, n.timeValue]));
  const failed = chainNodes.filter((n) => outcomes.get(n.id)?.status === "fails");
  const failedInOrder = [...failed]
    .sort((a, b) => a.timeValue - b.timeValue)
    .map((n) => n.id);

  // firstFailure = direct hit paling tua (viaCascade falsy)
  const directFails = failed
    .filter((n) => !outcomes.get(n.id)?.viaCascade)
    .sort((a, b) => a.timeValue - b.timeValue);
  const firstFailure = directFails.length
    ? { nodeId: directFails[0].id, timeValue: directFails[0].timeValue }
    : null;

  const counts = { survives: 0, altered: 0, fails: 0 };
  for (const [, o] of outcomes) counts[o.status]++;

  void timeById;
  return { outcomes, firstFailure, failedInOrder, counts, anyChange };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/simulation.test.ts`
Expected: PASS (all `describe` blocks). If the cascade-direction test fails, verify `addDep(e.source, e.target)` (NOT reversed) — source depends on target.

- [ ] **Step 5: Commit**

```bash
git add src/lib/flow/simulation.ts tests/simulation.test.ts
git commit -m "feat: pure fine-tuning simulation engine with cascade propagation"
```

---

### Task 4: Store slice for simulation state

**Files:**
- Modify: `src/store/flow-store.ts`

**Interfaces:**
- Consumes: `ConstantId` (Task 1); `nominalValues` (Task 3).
- Produces (added to `FlowState`): `simValues: Record<ConstantId, number>`; `setSimValue: (id: ConstantId, v: number) => void`; `resetSim: () => void`; `showCorrelations: boolean`; `toggleCorrelations: () => void`.

- [ ] **Step 1: Add imports** (top of `src/store/flow-store.ts`, after existing imports)

```ts
import type { ConstantId } from "@/data/fine-tuning-impact";
import { nominalValues } from "@/lib/flow/simulation";
```

- [ ] **Step 2: Extend the `FlowState` interface** — add these fields inside `interface FlowState { ... }` (place after `focusNodeId: string | null;`):

```ts
  // Fine-tuning simulation
  simValues: Record<ConstantId, number>;
  showCorrelations: boolean;
  // Actions
  setSimValue: (id: ConstantId, v: number) => void;
  resetSim: () => void;
  toggleCorrelations: () => void;
```

- [ ] **Step 3: Add initial state + actions** in the `create<FlowState>((set) => ({ ... }))` body (place after `focusNodeId: null,` and its actions):

```ts
  simValues: nominalValues(),
  showCorrelations: false,

  setSimValue: (id, v) =>
    set((s) => ({ simValues: { ...s.simValues, [id]: v } })),
  resetSim: () => set({ simValues: nominalValues() }),
  toggleCorrelations: () =>
    set((s) => ({ showCorrelations: !s.showCorrelations })),
```

- [ ] **Step 4: Verify typecheck**

Run: `bunx tsc --noEmit`
Expected: no new errors referencing `flow-store.ts`.

- [ ] **Step 5: Commit**

```bash
git add src/store/flow-store.ts
git commit -m "feat: add simulation slice (simValues, showCorrelations) to flow store"
```

---

### Task 5: Wire FineTuningMode to store + cascade summary

**Files:**
- Modify: `src/components/flow/FineTuningMode.tsx`

**Interfaces:**
- Consumes: `simValues`, `setSimValue`, `resetSim`, `showCorrelations`, `toggleCorrelations` (Task 4); `simulate` (Task 3); `chainNodes` for labels.

- [ ] **Step 1: Replace local slider state with store**

In `FineTuningMode.tsx`, delete the `const [values, setValues] = useState(...)` block and the local `reset` function. Replace the store selectors block (lines with `panelMode`/`setPanelMode`) with:

```tsx
  const panelMode = useFlowStore((s) => s.panelMode);
  const setPanelMode = useFlowStore((s) => s.setPanelMode);
  const values = useFlowStore((s) => s.simValues);
  const setSimValue = useFlowStore((s) => s.setSimValue);
  const resetSim = useFlowStore((s) => s.resetSim);
  const showCorrelations = useFlowStore((s) => s.showCorrelations);
  const toggleCorrelations = useFlowStore((s) => s.toggleCorrelations);
```

- [ ] **Step 2: Compute the simulation result**

Add imports at top:

```tsx
import { simulate } from "@/lib/flow/simulation";
import { chainNodes } from "@/data/chain-nodes";
import type { ConstantId } from "@/data/fine-tuning-impact";
import { GitCompareArrows } from "lucide-react";
```

Replace the `overallStatus` `useMemo` with:

```tsx
  const sim = useMemo(() => simulate(values), [values]);
  const overallStatus = sim.counts.fails === 0 && sim.counts.altered === 0;
  const nodeLabel = useMemo(() => {
    const m = new Map(chainNodes.map((n) => [n.id, n.label]));
    return (id: string) => m.get(id) ?? id;
  }, []);
```

- [ ] **Step 3: Update slider `onChange` and `reset` usages**

Change the `<ConstantSlider ... onChange={(v) => setValues(...)} />` prop to:

```tsx
              onChange={(v) => setSimValue(c.id as ConstantId, v)}
```

Change the header Reset button `onClick={reset}` to `onClick={resetSim}`.

- [ ] **Step 4: Add the cascade summary + correlation toggle block**

Immediately after the status banner `</div>` (before `{/* Body — sliders + cards */}`), insert:

```tsx
      {/* Ringkasan cascade simulasi */}
      {sim.anyChange && (
        <div className="p-3 border-b space-y-2 bg-muted/30">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Dampak pada Rantai Peristiwa
            </h4>
            <button
              onClick={toggleCorrelations}
              className={cn(
                "text-[10px] px-2 py-1 rounded border flex items-center gap-1",
                showCorrelations ? "bg-foreground text-background" : "hover:bg-muted"
              )}
              aria-pressed={showCorrelations}
            >
              <GitCompareArrows className="w-3 h-3" />
              Garis Korelasi
            </button>
          </div>
          <div className="flex gap-2 text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              Bertahan: <strong>{sim.counts.survives}</strong>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300">
              Berubah: <strong>{sim.counts.altered}</strong>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300">
              Tak terbentuk: <strong>{sim.counts.fails}</strong>
            </span>
          </div>
          {sim.firstFailure && (
            <p className="text-[11px] leading-relaxed">
              <strong className="text-rose-700 dark:text-rose-300">Titik rantai putus:</strong>{" "}
              {nodeLabel(sim.firstFailure.nodeId)} — semua peristiwa sesudahnya tidak akan terbentuk.
            </p>
          )}
          {sim.failedInOrder.length > 0 && (
            <ol className="text-[10px] space-y-0.5 max-h-32 overflow-y-auto list-decimal list-inside">
              {sim.failedInOrder.map((id) => (
                <li key={id} className="text-rose-700/90 dark:text-rose-300/90">
                  {nodeLabel(id)}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
```

- [ ] **Step 5: Verify typecheck + manual smoke**

Run: `bunx tsc --noEmit`
Expected: no new errors. Then `bun run dev`, open the app, open Fine-Tuning panel, drag `α` fully right → the summary block appears with a non-zero "Tak terbentuk" count and a "Titik rantai putus" line naming Nukleosintesis.

- [ ] **Step 6: Commit**

```bash
git add src/components/flow/FineTuningMode.tsx
git commit -m "feat: wire FineTuningMode to store + cascade impact summary"
```

---

### Task 6: Node simulation status on the canvas

**Files:**
- Modify: `src/components/flow/CustomNode.tsx`
- Modify: `src/components/flow/ChainFlowCanvas.tsx`

**Interfaces:**
- Consumes: `simulate` (Task 3), `simValues`/`panelMode` from store; `ChainNodeData` gains `simStatus?: "survives" | "altered" | "fails"`.

- [ ] **Step 1: Extend `ChainNodeData`** in `CustomNode.tsx`:

```tsx
export interface ChainNodeData extends Record<string, unknown> {
  node: ChainNode;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
  isTraversalActive?: boolean;
  simStatus?: "survives" | "altered" | "fails";
}
```

- [ ] **Step 2: Read `simStatus` and apply styling** in `CustomNodeImpl`. After `const color = CATEGORY_COLORS[node.category];` add:

```tsx
  const simStatus = chainData.simStatus;
  const simClass =
    simStatus === "fails"
      ? "ring-2 ring-rose-500 saturate-50 opacity-60"
      : simStatus === "altered"
      ? "ring-2 ring-amber-500"
      : "";
```

Add `simClass` to the outer `div`'s `cn(...)` (append as a new argument at the end), and add a status badge next to the F/B badges block (inside the `flex items-center gap-1 flex-shrink-0` div):

```tsx
          {simStatus === "fails" && (
            <span className="text-[10px] font-bold bg-rose-500 text-white rounded px-1 py-0.5">
              ✕
            </span>
          )}
          {simStatus === "altered" && (
            <span className="text-[10px] font-bold bg-amber-400 text-amber-950 rounded px-1 py-0.5">
              ≈
            </span>
          )}
```

- [ ] **Step 3: Compute sim status in `ChainFlowCanvas`** — add imports:

```tsx
import { simulate } from "@/lib/flow/simulation";
import { chainCorrelations } from "@/data/chain-correlations";
```

Add store selectors alongside the others in `FlowInner`:

```tsx
  const simValues = useFlowStore((s) => s.simValues);
  const panelMode = useFlowStore((s) => s.panelMode);
  const showCorrelations = useFlowStore((s) => s.showCorrelations);
```

- [ ] **Step 4: Feed status into `decoratedNodes`.** Above the `decoratedNodes` useMemo add:

```tsx
  const simEnabled = panelMode === "finetuning";
  const sim = useMemo(() => simulate(simValues), [simValues]);
```

Inside the `decoratedNodes` `.map(...)` return object, add one field:

```tsx
        simStatus: simEnabled && sim.anyChange ? sim.outcomes.get(n.id)?.status : undefined,
```

Add `sim`, `simEnabled` to that `useMemo` dependency array.

- [ ] **Step 5: Pass `simStatus` through to node data.** In the `rfNodes` useMemo, change the `data` mapping to carry it:

```tsx
      data: { node: n, simStatus: n.simStatus } as unknown as ChainNodeData,
```

- [ ] **Step 6: Verify typecheck + manual smoke**

Run: `bunx tsc --noEmit`
Expected: no new errors. `bun run dev`: open Fine-Tuning, push `G` fully right → downstream nodes on the canvas show rose ring + ✕ badge and dim; nodes with only `contributing`/in-range changes show amber ≈. Close the panel → styling disappears.

- [ ] **Step 7: Commit**

```bash
git add src/components/flow/CustomNode.tsx src/components/flow/ChainFlowCanvas.tsx
git commit -m "feat: show simulation status (fails/altered) on canvas nodes"
```

---

### Task 7: Correlation edges on the canvas

**Files:**
- Modify: `src/components/flow/ChainFlowCanvas.tsx`

**Interfaces:**
- Consumes: `chainCorrelations` (Task 2, imported in Task 6), `showCorrelations`, `filteredNodes`.

- [ ] **Step 1: Build correlation edges** — after the `rfEdges` useMemo, add a new useMemo:

```tsx
  const CORRELATION_STYLE: Record<string, string> = {
    dependency: "#8b5cf6",   // violet
    "shared-cause": "#0ea5e9", // sky
    analogy: "#14b8a6",      // teal
    thematic: "#f59e0b",     // amber
  };

  const correlationEdges: Edge[] = useMemo(() => {
    if (!showCorrelations) return [];
    const visibleIds = new Set(filteredNodes.map((n) => n.id));
    return chainCorrelations
      .filter((c) => visibleIds.has(c.source) && visibleIds.has(c.target))
      .map((c) => ({
        id: c.id,
        source: c.source,
        target: c.target,
        label: c.label,
        type: "smoothstep",
        animated: false,
        markerEnd: { type: MarkerType.Arrow, width: 14, height: 14 },
        style: {
          stroke: CORRELATION_STYLE[c.kind] ?? "#8b5cf6",
          strokeWidth: 1.5,
          strokeDasharray: "5 4",
          opacity: 0.85,
        },
        labelStyle: { fontSize: 9, fill: CORRELATION_STYLE[c.kind] ?? "#8b5cf6" },
        labelBgStyle: { fill: "var(--background)", opacity: 0.85 },
        zIndex: 0,
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCorrelations, filteredNodes]);
```

- [ ] **Step 2: Merge correlation edges into the layout input.** Change the `getLayoutedElements(rfNodes, rfEdges, ...)` call to concatenate — but keep correlations OUT of dagre layout (they are cross-cutting and would distort the vertical layout). Instead merge AFTER layout. Replace the `[nodes, setNodes, ...]`/effect region so the effect appends correlation edges:

Change the layout effect:

```tsx
  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges([...layoutedEdges, ...correlationEdges]);
  }, [layoutedNodes, layoutedEdges, correlationEdges, setNodes, setEdges]);
```

- [ ] **Step 3: Add a legend Panel** — inside the `<ReactFlow>` children, after `<Controls .../>`, add:

```tsx
      {showCorrelations && (
        <Panel position="top-left" className="!m-2">
          <div className="rounded-md border bg-background/90 backdrop-blur p-2 text-[9px] space-y-1 shadow-sm">
            <p className="font-bold uppercase tracking-wide text-muted-foreground">Korelasi</p>
            <div className="flex items-center gap-1"><span className="inline-block w-4 border-t-2 border-dashed" style={{ borderColor: "#8b5cf6" }} /> Dependensi</div>
            <div className="flex items-center gap-1"><span className="inline-block w-4 border-t-2 border-dashed" style={{ borderColor: "#0ea5e9" }} /> Sebab bersama</div>
            <div className="flex items-center gap-1"><span className="inline-block w-4 border-t-2 border-dashed" style={{ borderColor: "#14b8a6" }} /> Analogi</div>
            <div className="flex items-center gap-1"><span className="inline-block w-4 border-t-2 border-dashed" style={{ borderColor: "#f59e0b" }} /> Tematik</div>
          </div>
        </Panel>
      )}
```

- [ ] **Step 4: Verify typecheck + manual smoke**

Run: `bunx tsc --noEmit`
Expected: no new errors. `bun run dev`: open Fine-Tuning, click "Garis Korelasi" → dashed colored edges appear (e.g. `a-earth-formation` → `a-first-stars`) with a legend top-left; toggle off → they disappear. Confirm the vertical causal layout is unchanged.

- [ ] **Step 5: Run the full test suite + lint**

Run: `bun test && bun run lint`
Expected: all tests PASS; lint clean (fix any new warnings in touched files).

- [ ] **Step 6: Commit**

```bash
git add src/components/flow/ChainFlowCanvas.tsx
git commit -m "feat: toggleable node correlation edges with kind legend"
```

---

## Self-Review Notes

- **Spec coverage:** §4a→Task 1; §4b→Task 2; §5 engine→Task 3 (+cascade-direction test); §6 store→Task 4; §7 panel summary→Task 5, canvas nodes→Task 6, correlation edges→Task 7; §8 tests→Tasks 1-3 & Task 7 step 5.
- **Placeholder scan:** none — all code shown in full.
- **Type consistency:** `ConstantId`, `NodeSensitivity`, `ChainCorrelation`, `SimulationResult`, `NodeOutcome`, and `simStatus` field names are identical across tasks.
- **Refinement vs spec:** only `dependency` correlations propagate failure (documented in Global Constraints and Task 2 test) — prevents cascade cycles; `shared-cause` nodes remain covered by their own direct sensitivities.
