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
