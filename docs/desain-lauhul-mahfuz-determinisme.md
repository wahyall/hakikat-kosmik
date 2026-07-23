# Desain: Layer "Lauhul Mahfuz vs Determinisme" + Jalur F (Kehendak & Ketetapan)

**Tanggal:** 2026-07-23
**Status:** Draf brainstorm → siap direview jadi spec
**Ruang lingkup:** Menambahkan lapisan interpretasi filosofis di atas mesin
simulasi Fine-Tuning yang sudah ada (bukan mesin baru), plus satu cabang graf
argumentatif baru (Jalur F) yang menyatukan konsep kontingensi konstanta fisika
dengan konsep lauhul mahfuz.

---

## 1. Latar & Argumen Inti

Mesin `simulate()` yang sudah ada (lihat desain Fine-Tuning) sudah membuktikan
secara literal bahwa konstanta fisika (α, G, Λ, dst) adalah **parameter
kontingen** — bukan hasil dari rantai sebab-akibat di dalam alam semesta, tapi
**prasyarat** yang menentukan rantai sebab-akibat mana pun yang mungkin
terjadi. Geser sedikit saja, seluruh pohon (Jalur A–E) runtuh via cascade.

Fitur ini **tidak membangun mesin baru** — ia membaca ulang output
`SimulationResult` yang sudah ada dengan dua lensa filosofis yang bersaing:

| | Determinisme murni (pra-tertulis) | Lauhul Mahfuz (telah tertulis) |
|---|---|---|
| Status konstanta | *Brute fact* — begitu saja nilainya, tak ada yang perlu dijelaskan lebih jauh | Ditetapkan oleh Yang Mengetahui sebelum rantai sebab-akibat dimulai |
| Kenapa presisi (fine-tuned)? | Kebetulan, atau perlu multiverse (kita di alam yang "kena jackpot") | Karena memang ditetapkan agar rantai ini bisa berjalan |
| Rantai sebab-akibat | Berjalan otomatis begitu kondisi awal ada | Berjalan sesuai catatan (qadar) yang sudah ditulis lebih dulu |
| Perlu "Penulis"? | Tidak (tidak ada agen di baliknya) | Ya (ada ilmu yang mendahului) |

**Pembeda penting yang harus eksplisit di UI** (agar tidak jatuh ke framing
keliru "lauhul mahfuz = manusia dipaksa seperti robot"): ilmu yang mendahului
**bukan** sebab yang memaksa. Analogi yang dipakai konsisten di seluruh
copy teks: seorang guru yang sudah tahu murid akan lulus atau gagal ujian,
tanpa pengetahuan itu sendiri menjadi *penyebab* hasil ujiannya. Lauhul
mahfuz dibingkai sebagai **catatan ilmu**, bukan **mesin pemaksa**.

Skope filosofis **dibatasi sengaja** ke level konsep (lauhul mahfuz, qadar
muallaq/qadar mubram) — tidak membahas nama-nama mazhab teologis
(Jabariyah/Qadariyah/Asy'ariyah) agar tetap ringan dipahami orang awam dan
tidak terkesan membahas perpecahan sektarian.

## 2. Keputusan Desain (dari brainstorming)

| Aspek | Keputusan |
|---|---|
| Bentuk fitur | Kombinasi: (1) perluasan interpretatif di atas Fine-Tuning yang ada, (2) Jalur F baru |
| Cakupan istilah | Hanya konsep: lauhul mahfuz, qadar muallaq, qadar mubram — skip nama mazhab |
| Badge kontingensi konstanta | **Hanya tampil saat mode Fine-Tuning aktif**, konsisten dengan badge `fails`/`altered` yang sudah ada |
| Jalur F | Rantai argumentatif pendek: kontingensi konstanta → presisi alam → dua bacaan (tabel di atas) → tersambung ke "Sebab Pertama — Wajib al-Wujud" |
| Rigor data | Bersumber — tafsir kredibel untuk rujukan tematik ayat, plus catatan pembanding singkat filsafat Barat (determinisme/kompatibilisme) di akhir, bukan bagian utama |
| Arsitektur | Derived/computed layer di atas engine yang sudah ada — **tidak** menambah state simulasi baru |

## 3. Arsitektur

Menyambung struktur repo yang sudah ada: `data/ → lib/ → store/ → components/`.
Tidak ada perubahan pada `lib/flow/simulation.ts` (engine inti tetap murni dan
tidak tahu apa-apa soal framing filosofis — pemisahan yang sudah baik,
dipertahankan).

```
src/data/determinism-nodes.ts        (BARU)  node & edge Jalur F
src/data/chain-correlations.ts       (EDIT)  + entri thematic ke Jalur F
src/lib/flow/determinacy.ts          (BARU)  classifyDeterminacy(): derive label dari SimulationResult
src/components/flow/CustomNode.tsx   (EDIT)  render badge kontingensi (mode Fine-Tuning saja)
src/components/flow/FineTuningMode.tsx (EDIT) blok baru "Baca sebagai apa?" (2 kolom)
src/components/flow/BranchSwitcher.tsx (EDIT) tambah opsi Jalur F
tests/determinacy.test.ts            (BARU)  unit test classifyDeterminacy (bun test)
```

**Prinsip:** `determinacy.ts` adalah fungsi murni yang **mengonsumsi**
`SimulationResult` (output `simulate()` yang sudah ada) dan `nodeSensitivities`
(sudah ada dari `fine-tuning-impact.ts`) — tidak menyimpan state sendiri, tidak
mengubah engine simulasi. Ini murni layer interpretasi di atas data yang sudah
dihitung.

## 4. Model Data

### 4a. Klasifikasi kontingensi (`lib/flow/determinacy.ts`)

```ts
export type DeterminacyLabel = "kontingen" | "netral";

export interface DeterminacyResult {
  label: DeterminacyLabel;
  /** true jika node punya >=1 sensitivitas critical/contributing */
  dependsOnConstants: ConstantId[];
}

/**
 * Menentukan apakah sebuah node "bergantung pada ketetapan konstanta"
 * (punya sensitivitas terhadap >=1 konstanta fine-tuning) atau netral.
 * TIDAK menghitung ulang simulasi — murni membaca nodeSensitivities yang
 * sudah ada di fine-tuning-impact.ts.
 */
export function classifyDeterminacy(
  nodeId: string,
  sensitivities: Record<string, NodeSensitivity[]>
): DeterminacyResult;
```

Catatan: label sengaja **bukan** "qadar mubram"/"qadar muallaq" di level
badge node individual — istilah itu terlalu berat dipasang per-node kecil.
Badge node cukup ikon netral ("bergantung pada ketetapan konstanta"); istilah
qadar muallaq/mubram dan narasi lauhul mahfuz-vs-determinisme dijelaskan di
**panel ringkasan** (bagian 5), bukan di label badge itu sendiri.

### 4b. Node & edge Jalur F (`determinism-nodes.ts`)

Mengikuti skema `ChainNode`/`ChainEdge` yang sudah ada di `chain-nodes.ts`,
dengan `branch: "determinisme-ketetapan"` (tambahkan ke union type yang sudah
ada di `chain-nodes.ts`).

Node yang diusulkan (final ditetapkan saat implementasi):

1. `d-pengalaman-memilih` — Pengalaman sehari-hari merasa punya pilihan
   (mis. memilih makan siang)
2. `d-pertanyaan-ilusi` — Pertanyaan filosofis: jika segala sesuatu punya
   sebab (Jalur A) dan sudah diketahui sejak awal, apakah pilihan itu ilusi?
3. `d-konstanta-kontingen` — Fakta bahwa konstanta fisika bisa saja bernilai
   lain (dibuktikan lewat mesin Fine-Tuning) — node ini yang secara visual
   "menunjuk" ke hasil simulasi
4. `d-presisi-butuh-penjelasan` — Presisi konstanta yang menghasilkan alam
   layak-huni menuntut penjelasan: kebetulan murni, atau ditetapkan?
5. `d-determinisme-pra-tertulis` — Bacaan 1: rantai sebab-akibat berjalan
   otomatis dari kondisi awal, tanpa perlu agen/penulis (*brute fact*)
6. `d-lauhul-mahfuz` — Bacaan 2: konstanta & rantai sebab-akibatnya
   ditetapkan lebih dulu berdasarkan ilmu yang mendahului (bukan paksaan —
   sertakan analogi guru & hasil ujian). Rujuk tematik QS. Al-An'am: 59 dan
   QS. Al-Hadid: 22 (parafrase makna, tanpa kutip teks ayat panjang)
7. `d-qadar-muallaq` — sub-catatan: sebagian ketetapan masih terbuka lewat
   ikhtiar/doa
8. `d-qadar-mubram` — sub-catatan: sebagian ketetapan sudah final, di luar
   kendali (mis. nilai konstanta itu sendiri, yang tidak bisa diubah manusia)

Edge kausal internal Jalur F menghubungkan 1→2→3→4→(5 dan 6 sebagai cabang)→
(7,8 sebagai sub-node dari 6).

### 4c. Korelasi tambahan (`chain-correlations.ts`, tambahan entri)

```ts
{
  id: "corr-d-lauhulmahfuz-sebabpertama",
  source: "d-lauhul-mahfuz",
  target: "a-first-cause-wajib-al-wujud",
  kind: "thematic",
  label: "menuntut adanya Yang Mengetahui lebih dulu",
  reason: "ilmu yang mendahului rantai sebab-akibat mengandaikan Wujud yang tidak bergantung pada rantai itu sendiri",
  propagatesFailure: false,
}
```

Konsisten dengan pola korelasi `thematic` yang sudah ada (mis. entri #9, #12
di desain Fine-Tuning) — tidak merambatkan status `fails`, murni tautan
argumentatif.

## 5. Layer Visual

### 5a. Badge di canvas (mode Fine-Tuning aktif saja)

Perluas `decoratedNodes` yang sudah ada di `ChainFlowCanvas` (dari desain
Fine-Tuning): setelah status `survives`/`altered`/`fails` dihitung, tambahkan
satu badge kecil tambahan **hanya jika** `classifyDeterminacy(nodeId).label
=== "kontingen"` — ikon gerigi/⌘ kecil di pojok node dengan label
"bergantung pada ketetapan konstanta". Tidak ada badge untuk node netral
(default, tanpa tambahan visual).

Badge ini **tidak pernah tampil** di mode eksplorasi biasa/Telusur/Tour —
sama seperti badge `fails`/`altered`, aktif hanya saat panel Fine-Tuning
terbuka.

### 5b. Panel "Baca sebagai apa?" (`FineTuningMode.tsx`)

Blok baru di ringkasan panel Fine-Tuning, muncul otomatis begitu
`anyChange === true` (user sudah menggeser minimal satu slider dari nominal):

- Tabel dua-kolom (persis bagian 1 dokumen ini): Determinisme (pra-tertulis)
  vs Lauhul Mahfuz (telah tertulis)
- Baris pembeda eksplisit: analogi guru & hasil ujian, untuk mencegah
  kesalahpahaman "lauhul mahfuz = paksaan"
- Tautan "Lihat Jalur F" yang memindahkan user ke cabang Jalur F untuk
  eksplorasi lebih dalam

### 5c. Jalur F di `BranchSwitcher`

Tambahkan sebagai opsi ke-6 di switcher yang sudah ada (setelah Jalur E).
Layout otomatis (dagre/elkjs) sama seperti jalur lain — tidak perlu
penanganan khusus karena skema data identik.

## 6. Pengujian & Ruang Lingkup

**Unit test** (`tests/determinacy.test.ts`, `bun test`):
- Node dengan sensitivitas `critical` terhadap ≥1 konstanta ⇒
  `label: "kontingen"`
- Node tanpa entri di `nodeSensitivities` ⇒ `label: "netral"`
- `classifyDeterminacy` tidak memanggil `simulate()` ulang — murni baca
  `nodeSensitivities` (test dengan spy/mock untuk memastikan tidak ada
  pemanggilan silang ke `simulation.ts`)
- Badge tidak muncul saat `anyChange === false` (slider di posisi nominal)
  — mode Fine-Tuning aktif tapi belum ada perubahan

**Di luar lingkup (YAGNI):**
- Tidak menambah state simulasi baru atau mengubah `simulate()`.
- Tidak membahas nama mazhab teologis (Jabariyah/Qadariyah/Asy'ariyah).
- Tidak ada badge kontingensi di mode eksplorasi biasa/Telusur/Tour.
- Tidak ada perubahan DB/Prisma, tidak ada persistensi state baru.

## 7. Riset sumber (dilakukan saat menulis data 4b)

Grounding konsep: qadar muallaq vs qadar mubram, lauhul mahfuz sebagai
catatan ilmu (bukan mesin pemaksa) — verifikasi rujukan tematik QS. Al-An'am:
59 dan QS. Al-Hadid: 22 dari tafsir kredibel (mis. Tafsir Ibnu Katsir, Tafsir
Al-Misbah). Pembanding filsafat Barat: hard determinism, compatibilism
(Frankfurt), sebagai catatan singkat non-utama — sumber: Britannica "Free
will and moral responsibility", taksonomi determinisme/libertarianisme/
kompatibilisme standar. Verifikasi silang minimum sesuai konvensi header
`chain-nodes.ts` yang sudah berjalan di app.
