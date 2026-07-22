# Desain: Simulasi "What If?" Fine-Tuning + Layer Korelasi Node

**Tanggal:** 2026-07-22
**Status:** Disetujui (menunggu review spec)
**Ruang lingkup:** Membuat mode Fine-Tuning yang saat ini terisolasi menjadi
simulasi hidup yang merambatkan dampak perubahan konstanta fisika ke seluruh
node timeline, plus menambahkan layer korelasi antar-node (lintas-cabang &
lintas-era) di luar edge kausal parent-child.

---

## 1. Latar & Masalah

`FineTuningMode.tsx` saat ini **terisolasi total**: menggeser slider konstanta
hanya memperbarui state lokal `values` dan menampilkan teks konsekuensi
(`consequenceIfLarger` / `consequenceIfSmaller`). Ia tidak pernah menyentuh graf,
tidak menyorot node, tidak merambat ke timeline.

Permintaan pengguna terurai jadi dua:

1. **Mesin simulasi** — menggeser konstanta merambatkan dampak ke node timeline:
   peristiwa mana yang **bertahan / berubah / tak terbentuk**, dan di mana rantai
   "putus" pertama kali.
2. **Layer korelasi lebih luas** — hubungan node↔node di luar edge kausal
   parent-child, lintas-cabang dan lintas-era, agar dampak dapat merambat luas.

## 2. Keputusan Desain (dari brainstorming)

| Aspek | Keputusan |
|---|---|
| Mekanik simulasi | Per-node sensitivity + **cascade** (status merambat lewat edge kausal + korelasi) |
| Tiga status node | `survives` (bertahan) / `altered` (berubah) / `fails` (tak terbentuk) |
| Tampilan dampak | (a) Graf utama, (b) Ringkasan panel Fine-Tuning, (c) Garis korelasi baru yang dapat di-toggle |
| Rigor data | **Bersumber** — tiap sensitivitas & korelasi diberi alasan fisis + sitasi (konsisten dgn seluruh app) |
| Luas korelasi | **Sedang & terfokus** — ~10–15 korelasi lintas-cabang/era |
| Arsitektur | Pure engine + data files terpisah + slice store tipis (Approach A) |

## 3. Arsitektur

Mengikuti pemisahan repo yang sudah ada: `data/ → lib/ → store/ → components/`.

```
src/data/fine-tuning-impact.ts   (BARU)  sensitivitas konstanta→node (bersumber)
src/data/chain-correlations.ts   (BARU)  korelasi node↔node lintas-cabang/era
src/lib/flow/simulation.ts       (BARU)  mesin murni: simulate(values) → hasil
src/store/flow-store.ts          (EDIT)  slice: simValues, showCorrelations, dst.
src/components/flow/ChainFlowCanvas.tsx  (EDIT) warnai node + render edge korelasi
src/components/flow/CustomNode.tsx       (EDIT) badge/tint status simulasi
src/components/flow/FineTuningMode.tsx   (EDIT) angkat values→store + ringkasan cascade
tests/simulation.test.ts         (BARU)  unit test engine (bun test)
```

**Prinsip:** logika fisika hidup di modul murni tanpa React (dapat diuji unit).
Store hanya menyimpan input (`simValues`) & flag UI. Hasil simulasi **diturunkan**
(derived via `useMemo`), tidak disimpan di store — menghindari duplikasi basi.

## 4. Model Data

### 4a. Sensitivitas node (`fine-tuning-impact.ts`)

Sidecar map keyed by node id (menghindari membengkakkan `chain-nodes.ts`):

```ts
export type ConstantId = "alpha" | "G" | "Lambda" | "me-mp" | "Q" | "dimensions";

export interface NodeSensitivity {
  constantId: ConstantId;
  /** critical = node tak bisa terbentuk jika konstanta keluar rentang habitable */
  /** contributing = node berubah sifat tapi tak selalu gagal */
  role: "critical" | "contributing";
  /** apa yg berubah/rusak SPESIFIK di node ini */
  effect: string;
  /** sitasi (Rees 1999, Barnes 2012, Tegmark 1997, Adams 2008, dll) */
  source: string;
}

/** nodeId -> daftar sensitivitas */
export const nodeSensitivities: Record<string, NodeSensitivity[]> = { ... };
```

Cakupan awal (era → konstanta kritis), akan diperkuat sumber saat implementasi:

- `a-planck-epoch`, `a-big-bang` — fondasi (semua konstanta relevan)
- `a-nucleosynthesis` — **G** (laju ekspansi vs. laju fusi), **alpha** (barrier Coulomb) — Barnes 2012 §4
- `a-recombination` — **alpha** (pembentukan atom netral)
- `a-first-stars`, `a-first-galaxies` — **G**, **Q** (benih struktur), **Lambda** (ekspansi)
- `a-solar-system`, `a-earth-formation` — **G**, ketergantungan unsur berat dari bintang
- `a-abiogenesis`, `a-homo-sapiens` — **alpha**, **me-mp** (kestabilan molekul/kimia organik)
- node contoh (`c-fusion`, `c-sunlight`, dll) — **alpha**, **G** sesuai fisika fusi
- `dimensions` (D≠3) — kestabilan orbit/atom (Tegmark 1997) → memukul node astronomis & kimia

### 4b. Korelasi node↔node (`chain-correlations.ts`)

```ts
export type CorrelationKind =
  | "dependency"    // A butuh B sebagai prasyarat fisik (merambatkan kegagalan)
  | "shared-cause"  // A & B sama-sama bergantung sebab yg sama (merambatkan)
  | "analogy"       // proses fisik serupa (TIDAK merambatkan kegagalan)
  | "thematic";     // kaitan argumentatif/tema (TIDAK merambatkan)

export interface ChainCorrelation {
  id: string;
  source: string;            // node id (cabang/era mana pun)
  target: string;            // node id
  kind: CorrelationKind;
  label: string;             // mis. "memasok unsur berat untuk"
  reason: string;            // justifikasi fisis/logis
  citation?: string;
  /** hanya dependency & shared-cause = true */
  propagatesFailure: boolean;
}

export const chainCorrelations: ChainCorrelation[] = [ ... ]; // ~10–15
```

Contoh set awal (final ditetapkan saat implementasi, tetap ~10–15):

1. `a-first-stars → a-earth-formation` — dependency — "menempa unsur berat (C,O,Fe) untuk" (Rees 1999)
2. `a-first-stars → a-solar-system` — dependency — "generasi bintang sebelumnya menyemai" 
3. `a-nucleosynthesis ↔ c-fusion` — analogy — "fisika fusi nuklir yang sama"
4. `a-nucleosynthesis → c-hydrogen-source` — shared-cause — "sumber hidrogen kosmik"
5. `a-recombination → a-first-stars` — dependency — "atom netral memungkinkan awan runtuh"
6. `a-solar-system ↔ c-sunlight` — shared-cause — "Matahari yang sama"
7. `a-abiogenesis ↔ b-early-hominids` — dependency — "rantai kehidupan biologis"
8. `a-homo-sapiens ↔ b-maklumat-asabiqah` — thematic — "kapasitas kognitif untuk berpikir"
9. `d-physics ↔ a-first-cause` — thematic — "hukum fisika sbagai mumkin al-wujud"
10. `a-earth-formation ↔ c-evaporation` — dependency — "air permukaan butuh planet berbatu"
11. `a-first-galaxies ↔ a-nucleosynthesis` — shared-cause — "sama-sama sensitif Q & G"
12. `a-big-bang ↔ a-first-cause-al-ghazali` — thematic — "huduts alam menuntut muhdits"
13. (cadangan) `a-quark-epoch → a-nucleosynthesis` — dependency — "proton-neutron bahan baku"

## 5. Mesin Simulasi (`lib/flow/simulation.ts`, murni)

Input: `values: Record<ConstantId, number>` (posisi slider saat ini).

```ts
export type NodeStatus = "survives" | "altered" | "fails";

export interface NodeOutcome {
  status: NodeStatus;
  reason: string;
  dueToConstant?: ConstantId;   // penyebab langsung
  viaCascade?: boolean;         // gagal krn hulu gagal, bukan hit langsung
}

export interface SimulationResult {
  outcomes: Map<string, NodeOutcome>;
  firstFailure: { nodeId: string; timeValue: number } | null;
  failedInOrder: string[];      // node gagal terurut waktu (tua→muda)
  counts: { survives: number; altered: number; fails: number };
  anyChange: boolean;           // ada slider != nominal?
}

export function simulate(values: Record<ConstantId, number>): SimulationResult;
```

Algoritma:

1. **Direct hit** — untuk tiap node dgn sensitivitas:
   - Jika ada konstanta `critical` **di luar** `[habitableMin, habitableMax]` → `fails`
     (`dueToConstant` = konstanta itu).
   - Else jika ada konstanta (critical/contributing) **off-nominal tapi masih dalam
     rentang** → `altered`.
   - Else `survives`.
   - Node tanpa sensitivitas: `survives` (kecuali kena cascade).
2. **Cascade kegagalan** — rambatkan `fails` ke hilir waktu:
   - Edge kausal `A→B` berarti "A disebabkan oleh B"; jika **B gagal**, semua **A**
     (efek) ikut gagal. Jadi telusuri dari node gagal ke semua node yang memiliki
     edge menuju node gagal tsb (target == gagal ⇒ source ikut gagal), transitif.
   - Tambah korelasi dgn `propagatesFailure=true` (dependency/shared-cause) sebagai
     jalur rambat tambahan.
   - Node yang gagal via cascade: `viaCascade=true`.
3. **First failure** — node **direct-hit** dgn `timeValue` terkecil (sebab paling
   awal yang putus → mematikan semua sesudahnya). Ini "titik rantai putus".
4. **Output** — `outcomes`, `failedInOrder` (urut `timeValue` naik), `counts`,
   `anyChange`.

**Titik rawan bug = arah cascade.** Edge menunjuk efek→sebab, waktu berjalan mundur
di sepanjang edge, sehingga rambat kegagalan harus mengikuti edge **secara terbalik**
(dari sebab yg gagal ke efek-efeknya). Ini di-TDD eksplisit.

## 6. Store & Aliran State (`flow-store.ts`)

Tambah:

```ts
simValues: Record<ConstantId, number>;   // init = nominalValue tiap konstanta
setSimValue: (id: ConstantId, v: number) => void;
resetSim: () => void;
showCorrelations: boolean;               // default false
toggleCorrelations: () => void;
```

`FineTuningMode` membaca/menulis `simValues` (bukan state lokal lagi) sehingga canvas
& panel berbagi satu sumber kebenaran. Hasil `simulate()` dihitung via `useMemo` di
konsumen. Simulasi "aktif" secara visual bila `anyChange === true`.

## 7. Layer Visual

- **Node canvas** (`CustomNode` + `decoratedNodes` di `ChainFlowCanvas`): perluas jalur
  dekorasi yang sudah ada. `fails` = tint merah + badge "✕ tak terbentuk" + dim;
  `altered` = tint amber + badge "≈ berubah"; `survives` = normal. **Hanya** aktif saat
  panel Fine-Tuning terbuka, agar penjelajahan biasa tak terganggu.
- **Edge korelasi**: saat `showCorrelations` on, render `chainCorrelations` sbg edge
  bergaya beda (dashed, warna per `kind`) di atas edge kausal, plus legenda kecil.
- **Ringkasan panel** (`FineTuningMode`): blok baru — "Titik rantai putus: {label}
  (~era)", daftar peristiwa gagal terurut waktu, dan hitungan bertahan/berubah/gagal.
  Plus toggle layer korelasi.

## 8. Pengujian & Ruang Lingkup

**Unit test** (`tests/simulation.test.ts`, dijalankan `bun test`):
- Semua nominal ⇒ semua `survives`, `anyChange=false`.
- `alpha` keluar rentang ⇒ `a-nucleosynthesis` `fails` (direct) dan semua hilir
  (`a-first-stars`, `a-earth-formation`, `a-abiogenesis`, `a-now`) `fails` via cascade.
- Arah cascade benar: node **lebih tua** yang gagal mematikan node **lebih muda**,
  bukan sebaliknya.
- `firstFailure` = node direct-hit paling tua.
- Konstanta off-nominal tapi dalam rentang ⇒ node sensitif `altered`, bukan `fails`.
- Korelasi `analogy`/`thematic` **tidak** merambatkan kegagalan.

**Di luar lingkup (YAGNI):**
- Tidak ada perubahan DB/Prisma.
- Tidak ada persistensi skenario / share URL.
- Tidak menambah konstanta baru.
- Tidak mengubah mode Telusur/Tour/Reflection.

## 9. Riset sumber (dilakukan saat menulis data 4a/4b)

Grounding tiap mapping pada literatur yang sudah menjadi jangkar app:
Rees *Just Six Numbers* (1999), Barnes arXiv:1112.4647 (2012), Tegmark (1997, dimensi),
Adams "Stars in Other Universes" (2008), Penrose *Road to Reality* (2004). Verifikasi
silang minimum sesuai konvensi header `chain-nodes.ts`.
