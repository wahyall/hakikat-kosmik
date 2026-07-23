# Desain: Perluasan Jalur E — Jembatan Determinisme ↔ Lauhul Mahfuz

**Tanggal:** 2026-07-23
**Status:** Disetujui (brainstorm) → siap ke writing-plans
**Ruang lingkup:** Memperkaya cabang "Jalur E — Determinisme & Ketetapan" yang sudah ada
(8 node) menjadi ~18 node sehingga secara eksplisit **menjembatani** dua bacaan —
determinisme (pra-tertulis) vs lauhul mahfuz (telah tertulis) — melalui lapisan
mekanisme (marâtib al-qadar + mahw/itsbat), kolom pembanding filsafat Barat, dan
sebuah node sintesis. Menyambung simulasi Fine-Tuning: konstanta yang disetel =
qadha' mubram yang tertulis. **Tidak mengubah mesin `simulate()`.**

---

## 1. Latar & Tujuan

Jalur E versi awal melompat dari `f-presisi-butuh-penjelasan` langsung ke dua
bacaan yang berdiri sejajar (`f-determinisme-pra-tertulis`, `f-lauhul-mahfuz`),
tanpa menjelaskan **mekanisme** yang membuat "telah tertulis" tidak berarti
"dipaksa". Perluasan ini menambahkan mekanisme itu secara eksplisit, sehingga
kedua bacaan bertemu di titik yang sama dan berpisah hanya pada satu hal: apakah
ada **Penulis Yang Mengetahui**.

Keputusan brainstorming (dikonfirmasi user):
- **Bentuk jembatan:** keduanya — lapisan mekanisme di tengah **dan** node
  sintesis di ujung; plus koneksi ke Fine-Tuning ("fine-tuning seperti qadha'
  yang tertulis").
- **Kedalaman:** maksimal rigor akademis — marâtib al-qadar + mahw/itsbat +
  kasb + posisi teologis bernama; paralel Barat (Boethius, Molinisme,
  kompatibilisme) sebagai **node penuh**, bukan catatan kaki. Batasan lama
  "tanpa nama mazhab" **dilonggarkan** untuk fitur ini.
- **Struktur graf:** dua kolom konvergen (kolom mekanisme Islam + kolom
  pembanding Barat) yang bertemu di node sintesis, meniru pola Branch A (tiga
  tradisi konvergen ke Muara).

## 2. Arsitektur

Menyambung struktur repo: `data/ → lib/ → store/ → components/`. Murni layer
data + interpretasi.

- **Tidak ada** perubahan `src/lib/flow/simulation.ts` (mesin inti tetap murni).
- **Tidak ada** perubahan `src/lib/flow/determinacy.ts`, `CustomNode.tsx`,
  `ChainFlowCanvas.tsx`, `flow-store.ts`, `BranchSwitcher.tsx` — badge & edge
  korelasi bersifat data-driven sehingga node/edge baru otomatis ter-cover.
- `ChainBranch` union sudah memuat `determinisme-ketetapan` (dari fitur Jalur E
  sebelumnya) — tidak perlu diubah. `ChainEdge.branch` juga sudah memuat
  `determinisme-ketetapan`.

Node baru tanpa entri di `nodeSensitivities` → di `simulate()` selalu berstatus
`survives`. Korelasi baru berjenis `analogy`/`thematic` (`propagatesFailure:
false`) → tidak merambatkan kegagalan. Karena itu mesin simulasi tetap aman
tanpa perubahan.

## 3. Topologi Graf

Konvensi arah repo: `source` = akibat/hilir (atas), `target` = sebab/hulu
(bawah); "source bergantung pada target". Layout dagre TB (atas→bawah), narasi
mengalir dari pengalaman sehari-hari (atas) menuju Sebab Pertama (bawah).

**Tulang punggung (kepala, dipertahankan):**
```
f-pengalaman-memilih → f-pertanyaan-ilusi → f-konstanta-kontingen
  → f-presisi-butuh-penjelasan   (titik cabang)
```

**Titik cabang → tiga lensa:**

Kiri — Bacaan 1:
```
f-presisi-butuh-penjelasan → f-determinisme-pra-tertulis
```

Tengah — Bacaan 2 (kolom mekanisme Islam):
```
f-presisi-butuh-penjelasan → f-lauhul-mahfuz
f-lauhul-mahfuz → f-maratib-ilm → f-maratib-kitabah → f-maratib-masyiah
  → f-maratib-khalq → f-kasb
f-lauhul-mahfuz → f-mahw-itsbat            (cabang samping)
f-mahw-itsbat → f-qadar-muallaq
f-mahw-itsbat → f-qadar-mubram
```

Kanan — kolom pembanding Barat:
```
f-presisi-butuh-penjelasan → f-barat-boethius
f-barat-boethius → f-barat-molinisme → f-barat-kompatibilisme
```

**Konvergensi ke sintesis, lalu ke Sebab Pertama:**
```
f-determinisme-pra-tertulis → f-sintesis
f-kasb → f-sintesis
f-barat-kompatibilisme → f-sintesis
f-sintesis → a-first-cause              (korelasi tematik lintas-cabang)
```

Total edge kausal internal Jalur E: **19**
(spine 3 + branch-dari-presisi 3 + rantai Islam 5 + sub-cabang mahw/itsbat 3 +
rantai Barat 2 + konvergensi 3). Test mengunci angka pastinya.

**Inventaris node — 18 total:**
- Lama, dipertahankan (8): `f-pengalaman-memilih`, `f-pertanyaan-ilusi`,
  `f-konstanta-kontingen`, `f-presisi-butuh-penjelasan`,
  `f-determinisme-pra-tertulis`, `f-lauhul-mahfuz`, `f-qadar-muallaq`,
  `f-qadar-mubram`.
- Baru (10): `f-maratib-ilm`, `f-maratib-kitabah`, `f-maratib-masyiah`,
  `f-maratib-khalq`, `f-kasb`, `f-mahw-itsbat`, `f-barat-boethius`,
  `f-barat-molinisme`, `f-barat-kompatibilisme`, `f-sintesis`.

Semua node baru: `category: "filosofis"`, `branch: "determinisme-ketetapan"`,
`isPhilosophical: true`, `timeValue: -1`. Prefix id tetap `f-` (hindari bentrok
cabang biliar `d-`).

**Rewire node lama:** `f-qadar-muallaq` & `f-qadar-mubram` kini menggantung di
bawah `f-mahw-itsbat` (bukan langsung di bawah `f-lauhul-mahfuz` seperti versi
lama). Edge lama `f-lauhul-mahfuz → f-qadar-muallaq` dan
`f-lauhul-mahfuz → f-qadar-mubram` dihapus, diganti jalur via `f-mahw-itsbat`.

## 4. Isi & Sumber Node Baru

Parafrase ayat memakai `quranRefs` (surah + ayat + makna), tanpa teks Arab
panjang. Node jembatan inti = `f-maratib-kitabah`.

### 4a. Kolom mekanisme Islam (marâtib al-qadar)

- **`f-maratib-ilm`** — Tingkat 1, *al-'Ilm*. Ilmu Allah azali & meliputi
  segalanya, termasuk apa yang akan manusia pilih dan apa yang *seandainya*
  terjadi. Ilmu mendahului, tapi ilmu ≠ paksaan.
  Sumber: Almanhaj (maratib al-qadar); QS Saba':3; QS Al-Hajj:70.
- **`f-maratib-kitabah`** — Tingkat 2, *al-Kitâbah* (JEMBATAN INTI). Ditulis di
  Lauh Mahfuz **berdasarkan** ilmu itu, 50.000 tahun sebelum langit-bumi
  diciptakan, dengan al-qalam. Tulisan **mengikuti** pengetahuan atas pilihan,
  bukan memaksanya.
  Sumber: Hadis Muslim (50.000 tahun); QS Al-Hajj:70; Almanhaj.
- **`f-maratib-masyiah`** — Tingkat 3, *al-Mashî'ah*. Tak ada yang terjadi
  kecuali dengan kehendak Allah; kehendak manusia sendiri berada di dalam
  kehendak-Nya.
  Sumber: Almanhaj; QS At-Takwir:29.
- **`f-maratib-khalq`** — Tingkat 4, *al-Khalq*. Allah pencipta segala sesuatu,
  termasuk perbuatan hamba.
  Sumber: Almanhaj; QS Ash-Shaffat:96.
- **`f-kasb`** — *Kasb/ikhtisab*: perbuatan **dicipta** Allah tapi
  **diusahakan/diperoleh** (kasb) oleh manusia → tanggung jawab & pahala/dosa
  nyata. Rumusan Asy'ari; catatan singkat *ikhtiyâr* Maturidi.
  Sumber: QS Al-Baqarah:286; SEP (al-Ash'ari / Ash'arism).
- **`f-mahw-itsbat`** — *Mahw wa Itsbat* (QS Ar-Ra'd:39): Allah menghapus &
  menetapkan; Ummul-Kitab tak berubah (mubram) sementara catatan lain bisa
  berubah lewat doa/ikhtiar (muallaq).
  Sumber: QS Ar-Ra'd:39; Tafsir Ibnu Katsir; NU Online.

### 4b. Kolom pembanding Barat

- **`f-barat-boethius`** — Tuhan di *eternal present*: melihat semua waktu
  sekaligus, sehingga "fore-knowledge" tidak mendahului secara temporal → tidak
  memaksa. Paralel dengan *al-'Ilm*.
  Sumber: SEP "Foreknowledge and Free Will"; Boethius, Consolation Bk V.
- **`f-barat-molinisme`** — *Scientia media* (middle knowledge): Tuhan tahu apa
  yang **akan dipilih bebas** tiap makhluk di tiap situasi, lalu menetapkan
  dunia atas dasar itu. Paralel nyaris persis dengan *al-Kitâbah berdasar
  al-'Ilm*.
  Sumber: SEP "Foreknowledge and Free Will"; Molina (scientia media).
- **`f-barat-kompatibilisme`** — Kompatibilisme (Frankfurt): bebas & determinisme
  kompatibel; bebas = bertindak sesuai kehendak sendiri tanpa paksaan eksternal.
  Paralel dengan *kasb*.
  Sumber: SEP "Compatibilism"; Britannica "Free will and moral responsibility".

### 4c. Node sintesis

- **`f-sintesis`** — **Titik Temu & Titik Pisah**. Kedua bacaan sepakat rantai
  berjalan *pasti* dari kondisinya (konstanta + sebab-akibat). Beda **hanya
  satu**: apakah ada Penulis Yang Mengetahui. Determinisme = *tertulis tanpa
  penulis*; Lauhul Mahfuz = *tertulis oleh Yang Mengetahui, berdasarkan ilmu
  atas pilihan bebas*. Titik pisah inilah yang menyambung ke pertanyaan Sebab
  Pertama.

## 5. Koneksi Fine-Tuning & Korelasi

### 5a. Koneksi Fine-Tuning ("fine-tuning = qadha' yang tertulis")

1. Copy `f-qadar-mubram` diperluas: nilai konstanta yang digeser di simulasi =
   **qadha' mubram yang tertulis** — simulasi membuktikan konstanta bisa
   bernilai lain (kontingen), maka nilai yang teraktual adalah ketetapan yang
   ditulis, di luar kendali ikhtiar manusia.
2. Korelasi tematik baru `f-qadar-mubram → a-big-bang`, label "konstanta
   tersetel = qadha' mubram yang tertulis", `kind: "thematic"`,
   `propagatesFailure: false`.
3. Satu baris di panel "Baca sebagai apa?" (`FineTuningMode.tsx`), kolom Lauhul
   Mahfuz: "Konstanta yang Anda geser = qadha' mubram yang tertulis."

### 5b. Korelasi lintas-kolom (kind `analogy`, `propagatesFailure: false`)

- `f-barat-boethius → f-maratib-ilm` — "paralel: ilmu di luar waktu"
- `f-barat-molinisme → f-maratib-kitabah` — "paralel: tahu pilihan bebas lalu
  menetapkan"
- `f-barat-kompatibilisme → f-kasb` — "paralel: bebas + determinisme kompatibel"

### 5c. Korelasi ke Sebab Pertama (repoint)

Korelasi lama `corr-f-lauhulmahfuz-sebabpertama` di-**repoint**: `source`
diubah dari `f-lauhul-mahfuz` menjadi `f-sintesis` (id & sisanya tetap:
`target: a-first-cause`, `kind: "thematic"`, `propagatesFailure: false`, label
disesuaikan agar cocok dengan titik sintesis). Titik konvergensi kini yang
menyambung ke muara.

**Total korelasi:** 13 → **17** (repoint 1, tambah 4: 1 fine-tuning tematik + 3
analogi lintas-kolom).

## 6. Pengujian & Ruang Lingkup

**Berkas disentuh:**
```
src/data/determinism-nodes.ts       (EDIT) +10 node, rewire jadi 19 edge
src/data/chain-correlations.ts      (EDIT) repoint 1, +4 korelasi
src/components/flow/FineTuningMode.tsx (EDIT) 1 baris qadha' mubram di panel
tests/determinism-data.test.ts      (EDIT) node 8→18, edge 7→19, +assertion baru
tests/simulation.test.ts            (EDIT) batas korelasi [10,15] → [10,20]
```

**Test:**
- `tests/determinism-data.test.ts`: jumlah node Jalur E = 18; jumlah edge Jalur
  E = 14; semua id `f-` unik & tak bentrok dengan id `d-` biliar; semua edge &
  korelasi baru mereferensikan node yang ada; korelasi `corr-f-lauhulmahfuz-
  sebabpertama` kini `source: f-sintesis`.
- `tests/simulation.test.ts`: batas jumlah korelasi [10, 20]; assertion "hanya
  `dependency` yang propagate" tetap lolos (korelasi baru `analogy`/`thematic`);
  node Jalur E baru semua `survives` saat ada perubahan slider.
- `bun test` penuh + `bun run lint` hijau tanpa error baru.
- Verifikasi manual: Branch E menampilkan tiga kolom + konvergensi; toggle
  Korelasi menampilkan garis analogi lintas-kolom + tautan sintesis→Sebab
  Pertama; panel Fine-Tuning (slider off-nominal) menampilkan baris qadha'
  mubram + badge kontingensi di node.

**Di luar lingkup (YAGNI):**
- Tidak mengubah `simulate()`, `determinacy.ts`, atau menambah state simulasi.
- Tidak ada komponen/panel UI baru (hanya 1 baris copy di panel yang ada).
- Tidak ada perubahan DB/Prisma.
- Tidak menambah konstanta fine-tuning baru; koneksi ke fine-tuning murni
  interpretatif (copy + 1 korelasi tematik).

## 7. Catatan Framing (WAJIB dijaga di copy)

- Lauhul mahfuz = **catatan ilmu, bukan mesin pemaksa**. Analogi guru-tahu-hasil-
  ujian tetap dipakai. JANGAN mengklaim "ilmu bergantung pada perbuatan"
  (arah Augustinian) — cukup "mengetahui ≠ menyebabkan".
- Marâtib al-qadar & mahw/itsbat adalah aqidah mainstream Ahlussunnah — disajikan
  sebagai konsep, bukan polemik sektarian. Kasb (Asy'ari) & ikhtiyâr (Maturidi)
  disebut sebagai konsep bernama dengan proporsional, tanpa menjatuhkan pihak.
- Paralel Barat (Boethius, Molinisme, kompatibilisme) sebagai **pembanding**,
  bukan otoritas utama — kerangka utama tetap tradisi falsafi Islam.
