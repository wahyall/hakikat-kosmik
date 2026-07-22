"use client";

/**
 * GuidedTour.tsx — Iterasi 1: Tur berpandu step-by-step.
 *
 * Membawa pembaca melewati rantai kausal kosmologis dengan narrasi Islam:
 *   Step 0: Intro
 *   Step 1: Masa kini (a-now)
 *   Step 2: Kehidupan & Bumi (a-abiogenesis, a-earth-formation)
 *   Step 3: Tata Surya & bintang pertama
 *   Step 4: Rekombinasi (CMB)
 *   Step 5: Nukleosintesis
 *   Step 6: Era partikel — quark, hadron, lepton
 *   Step 7: Era Planck — batas sains
 *   Step 8: Big Bang sebagai akibat
 *   Step 9: Sebab Pertama — Wajib al-Wujud (konklusi tauhid)
 *
 * Membaca narrasi, klik "Lanjut" untuk maju. Klik "Lompat ke node" untuk
 *   menggerakkan canvas ke node tertentu (memakai setSelectedNode).
 */

import { useFlowStore } from "@/store/flow-store";
import { chainNodes } from "@/data/chain-nodes";
import { X, ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourStep {
  title: string;
  nodeId?: string;
  narration: string;
  hadithOrQuranRef?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Selamat datang — Mari menelusuri rantai sebab-akibat",
    narration:
      "Anda akan diajak berjalan mundur dari momen ini hingga ke pertanyaan paling fundamental: dari mana semua ini bermula? Tur ini berakar pada kerangka falsafi Islam — Al-Kindi, Ibnu Sina, dan Al-Ghazali — yang menelusuri rantai kausal hingga bermuara pada Yang Wajib al-Wujud. Tekan 'Lanjut' untuk memulai perjalanan.",
  },
  {
    title: "Langkah 1 — Masa Kini",
    nodeId: "a-now",
    narration:
      "Anda membaca kalimat ini pada momen tertentu dalam sejarah kosmik. Setiap peristiwa yang Anda alami hari ini dapat ditelusuri kembali, langkah demi langkah, hingga ke peristiwa-peristiwa pada detik pertama alam semesta. Inilah titik awal rantai kausal kita — sebuah kejadian baru (hadits) yang menuntut sebab.",
    hadithOrQuranRef:
      "QS Al-An'am:59 — Tidak sehelai daun pun gugur melainkan Ia mengetahui. Setiap kejadian kecil pun berada dalam jaringan sebab-akibat yang Ia ketahui.",
  },
  {
    title: "Langkah 2 — Kehidupan Pertama & Bumi",
    nodeId: "a-abiogenesis",
    narration:
      "Bumi terbentuk 4,54 miliar tahun lalu. Bukti kehidupan tertua berusia 3,48 miliar tahun. Dari material abiogenik menjadi makhluk hidup — sebuah transisi yang mekanismenya masih diperdebatkan. Setiap langkah evolusi adalah akibat dari kondisi sebelumnya, yang juga akibat dari kondisi sebelumnya lagi.",
    hadithOrQuranRef:
      "QS Al-Anbiya:30 — Dari air Kami jadikan segala sesuatu yang hidup. Mengapa mereka tidak beriman?",
  },
  {
    title: "Langkah 3 — Bintang Pertama Membentuk Unsur Berat",
    nodeId: "a-first-stars",
    narration:
      "Bintang-bintang Populasi III menyala ~100 juta tahun setelah Big Bang. Mereka membakar hidrogen menjadi helium, lalu menjadi karbon, oksigen, besi — semua unsur yang membentuk Bumi dan tubuh Anda. Tanpa bintang generasi sebelumnya, tidak ada karbon dalam DNA Anda. Tanpa supernova, tidak ada besi dalam darah Anda.",
  },
  {
    title: "Langkah 4 — Rekombinasi: Foton Pertama Bebas",
    nodeId: "a-recombination",
    narration:
      "380.000 tahun setelah Big Bang, alam semesta mendingin cukup sehingga elektron bergabung dengan inti atom. Foton dapat bergerak bebas untuk pertama kalinya. Radiasi yang dilepaskan saat inilah yang kita deteksi hari ini sebagai Cosmic Microwave Background — 'foto bayi' tertua alam semesta.",
  },
  {
    title: "Langkah 5 — Nukleosintesis: Unsur Pertama",
    nodeId: "a-nucleosynthesis",
    narration:
      "Pada menit ke-3 hingga ke-20, hidrogen dan helium terbentuk. 75% hidrogen, 25% helium — rasio yang teramati di alam semesta hari ini sebagai prediksi terkuat model Big Bang. Unsur-unsur berat belum ada. Mereka akan disintesa di inti bintang, jauh di masa depan.",
  },
  {
    title: "Langkah 6 — Era Partikel: Quark, Hadron, Lepton",
    nodeId: "a-quark-epoch",
    narration:
      "Pada mikrodetik pertama, alam semesta adalah 'quark-gluon plasma' — sup kuantum yang sangat panas. Quark kemudian terkonfinasi menjadi proton dan neutron. Pada detik pertama, lepton (elektron) mendominasi. Setiap tahap adalah akibat dari pendinginan yang membawa alam melewati ambang energi yang berbeda.",
  },
  {
    title: "Langkah 7 — Era Planck: Batas Fisika Konvensional",
    nodeId: "a-planck-epoch",
    narration:
      "Pada 10^-43 detik pertama — waktu Planck — gravitasi diperkirakan sebanding dengan tiga gaya fundamental lainnya. Fisika saat ini tidak dapat menjelaskan apa yang terjadi di sini: relativitas umum dan mekanika kuantum belum berhasil disatukan. Klaim tentang 'apa yang terjadi pada t=0' bersifat spekulatif. Inilah batas penjelasan ilmiah — sebuah batas yang diakui jujur.",
  },
  {
    title: "Langkah 8 — Big Bang sebagai Akibat",
    nodeId: "a-big-bang",
    narration:
      "Big Bang bukan 'ledakan di ruang', melainkan ekspansi ruang itu sendiri. Ia terikat pada struktur waktu. Karena itu, secara logis Big Bang bukanlah 'sebab pertama' yang tidak bergantung pada apa pun — ia justru adalah akibat yang membutuhkan penjelasan. Di titik inilah sains berhenti dan filsafat harus mengambil alih.",
    hadithOrQuranRef:
      "QS Al-Anbiya:30 — Langit dan bumi dahulu menyatu, lalu Kami pisahkan. QS Adh-Dhariyat:47 — Sesungguhnya Kami benar-benar meluaskannya.",
  },
  {
    title: "Langkah 9 — Sebab Pertama: Wajib al-Wujud",
    nodeId: "a-first-cause",
    narration:
      "Konklusi argumentatif: deret sebab-akibat tidak dapat berjalan tak terhingga ke belakang (tasalsul). Harus berakhir pada Yang Wajib al-Wujud — keberadaan-Nya wajib dengan sendirinya, bukan mungkin ada mungkin tidak. Karena Ia bukan materi, bukan di ruang, bukan di waktu, dan tidak tersusun, Ia bersifat ahad — esa tanpa majemuk. Inilah muara tauhid: hanya satu Wajib al-Wujud, dan segala selain-Nya adalah mumkin yang keberadaannya bergantung kepada-Nya.",
    hadithOrQuranRef:
      "QS Al-Ikhlas:1 — Qul Huwa Allahu Ahad. Katakanlah: Dialah Allah Yang Maha Esa. QS Yasin:82 — Kun fayakun. Jadilah, maka jadilah ia.",
  },
];

export function GuidedTour() {
  const panelMode = useFlowStore((s) => s.panelMode);
  const setPanelMode = useFlowStore((s) => s.setPanelMode);
  const tourStep = useFlowStore((s) => s.tourStep);
  const setTourStep = useFlowStore((s) => s.setTourStep);
  const setSelectedNode = useFlowStore((s) => s.setSelectedNode);
  const setBranch = useFlowStore((s) => s.setBranch);

  if (panelMode !== "tour") return null;

  const step = TOUR_STEPS[tourStep];
  const isLast = tourStep === TOUR_STEPS.length - 1;
  const total = TOUR_STEPS.length;

  const goToNode = (nodeId?: string) => {
    if (!nodeId) return;
    const node = chainNodes.find((n) => n.id === nodeId);
    if (!node) return;
    // Pastikan branch cocok
    if (node.branch !== "kosmologis-utama") setBranch("kosmologis-utama");
    setSelectedNode(nodeId);
  };

  const handleNext = () => {
    if (isLast) {
      setPanelMode("none");
      return;
    }
    const nextStep = tourStep + 1;
    setTourStep(nextStep);
    goToNode(TOUR_STEPS[nextStep].nodeId);
  };

  const handlePrev = () => {
    if (tourStep === 0) return;
    const prevStep = tourStep - 1;
    setTourStep(prevStep);
    goToNode(TOUR_STEPS[prevStep].nodeId);
  };

  const handleStart = () => {
    setTourStep(0);
    goToNode(TOUR_STEPS[0].nodeId);
  };

  return (
    <div className="absolute inset-y-0 right-0 z-30 w-full sm:w-[440px] bg-background/95 backdrop-blur border-l shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-violet-50 to-emerald-50 dark:from-violet-950/30 dark:to-emerald-950/30">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-violet-600" />
            Tur Berpandu
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Langkah {tourStep + 1} dari {total} · Kerangka falsafi Islam
          </p>
        </div>
        <button
          onClick={() => setPanelMode("none")}
          className="p-1.5 rounded hover:bg-muted"
          aria-label="Tutup tur"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-3">
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 transition-all"
            style={{ width: `${((tourStep + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-4">
          <h4 className="text-base font-bold leading-tight">{step.title}</h4>

          <p className="text-sm leading-relaxed">{step.narration}</p>

          {step.hadithOrQuranRef && (
            <div className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 mb-1">
                    Rujukan
                  </p>
                  <p className="text-[11px] leading-relaxed text-emerald-900 dark:text-emerald-100">
                    {step.hadithOrQuranRef}
                  </p>
                </div>
              </div>
            </div>
          )}

          {step.nodeId && (
            <button
              onClick={() => goToNode(step.nodeId)}
              className="w-full text-xs px-3 py-2 rounded-md border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-3 h-3" />
              Pusatkan kanvas ke node ini
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t p-3 flex items-center justify-between gap-2">
        <button
          onClick={handlePrev}
          disabled={tourStep === 0}
          className={cn(
            "flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border",
            tourStep === 0
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-muted"
          )}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Sebelumnya
        </button>

        <div className="flex gap-1">
          {TOUR_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setTourStep(i);
                goToNode(TOUR_STEPS[i].nodeId);
              }}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                i === tourStep
                  ? "bg-violet-500 w-4"
                  : i < tourStep
                  ? "bg-violet-300"
                  : "bg-muted-foreground/30"
              )}
              aria-label={`Lompat ke langkah ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-violet-600 text-white hover:bg-violet-700 transition-colors"
        >
          {isLast ? "Selesai" : "Lanjut"}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Skip / Restart */}
      {tourStep === 0 && (
        <div className="border-t px-3 py-2 text-center">
          <button
            onClick={handleStart}
            className="text-[10px] text-muted-foreground hover:text-foreground underline"
          >
            Mulai dari awal
          </button>
        </div>
      )}
    </div>
  );
}
