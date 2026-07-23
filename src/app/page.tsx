"use client";

/**
 * page.tsx — Halaman utama "Rantai Sebab-Akibat (Cosmological Chain Explorer)".
 *
 * Single-page dengan 2 mode tampilan:
 * 1. Intro (default saat load) — kerangka falsafi Islam sebagai pengantar
 * 2. Explorer (klik tombol "Mulai Eksplorasi")
 *
 * Pada Explorer:
 * - Toolbar atas: BranchSwitcher + Search + 7 toggle/fitur
 *   a. Mode Argumen (default ON — kerangka falsafi Islam)
 *   b. Perspektif Lain (default OFF — bacaan tambahan opsional)
 *   c. Tur Berpandu (Iterasi 1)
 *   d. Rujukan Qur'ani (Iterasi 2)
 *   e. Mode Refleksi (Iterasi 3)
 *   f. Penanda & Catatan (Iterasi 4)
 *   g. Ekspor & Bagikan (Iterasi 5)
 * - TimelineScrubber
 * - Canvas React Flow + DetailPanel
 * - ArgumentOverlay (kiri, default ON) & 6 panel overlay lainnya
 */

import { useState, useRef, useEffect } from "react";
import { ChainFlowCanvas } from "@/components/flow/ChainFlowCanvas";
import { DetailPanel } from "@/components/flow/DetailPanel";
import { TimelineScrubber } from "@/components/flow/TimelineScrubber";
import { BranchSwitcher } from "@/components/flow/BranchSwitcher";
import { ArgumentOverlay } from "@/components/flow/ArgumentOverlay";
import { PerspectivePanel } from "@/components/flow/PerspectivePanel";
import { GuidedTour } from "@/components/flow/GuidedTour";
import { QuranReferencePanel } from "@/components/flow/QuranReferencePanel";
import { ReflectionMode } from "@/components/flow/ReflectionMode";
import { BookmarksPanel } from "@/components/flow/BookmarksPanel";
import { ExportView } from "@/components/flow/ExportView";
import { GlossaryPanel } from "@/components/flow/GlossaryPanel";
import { FineTuningMode } from "@/components/flow/FineTuningMode";
import { useFlowStore } from "@/store/flow-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ScrollText,
  Compass,
  Search,
  ArrowLeft,
  Github,
  Sparkles,
  MapPin,
  BookOpen,
  Brain,
  Bookmark,
  Share2,
  Play,
  Square,
  BookMarked,
  SlidersHorizontal,
  MoreHorizontal,
  X,
  GitCompareArrows,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [view, setView] = useState<"intro" | "explore">("intro");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {view === "intro" ? (
        <IntroView onExplore={() => setView("explore")} />
      ) : (
        <ExplorerView onBack={() => setView("intro")} />
      )}
    </div>
  );
}

// ====================================================================
// INTRO VIEW
// ====================================================================

function IntroView({ onExplore }: { onExplore: () => void }) {
  return (
    <>
      <header className="border-b bg-gradient-to-b from-emerald-50/60 via-amber-50/40 to-background dark:from-emerald-950/20 dark:via-amber-950/10">
        <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>
              Cosmological Chain Explorer · v2.0 · Kerangka Falsafi Islam
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
            Rantai Sebab-Akibat
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
            Telusuri rangkaian kausal dari{" "}
            <strong className="text-foreground">momen ini</strong> mundur ke{" "}
            <strong className="text-foreground">
              detik pertama alam semesta
            </strong>
            , lalu temukan titik di mana sains menemui batas dan argumen
            filosofis mulai — bermuara pada{" "}
            <strong className="text-foreground">Wajib al-Wujud</strong> sebagai
            Sebab Pertama, dalam kerangka falsafi Islam.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={onExplore} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Mulai Eksplorasi
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="#penjelasan"
                className="gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("penjelasan")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Pelajari dulu
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-12">
        {/* Apa ini */}
        <section id="penjelasan" className="space-y-3 scroll-mt-4">
          <h2 className="text-2xl font-bold">Apa ini?</h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            Situs ini memvisualisasikan empat rantai sebab-akibat yang berbeda
            skala — dari tetesan hujan di atap, ke putaran bola biliar, ke
            silsilah keluarga Anda, hingga rentang waktu{" "}
            <strong className="text-foreground">13,8 miliar tahun</strong>{" "}
            sejarah kosmik. Keempatnya pada akhirnya bersatu di rantai
            kosmologis utama, yang berakhir di pertanyaan:{" "}
            <em>
              apakah ada Sebab Pertama yang tidak disebabkan oleh apa pun?
            </em>
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            Kerangka utama situs ini adalah{" "}
            <strong className="text-foreground">tradisi falsafi Islam</strong>:
            Al-Kindi (dalil al-khair al-mahd), Ibnu Sina (wajib al-wujud vs
            mumkin al-wujud), dan Al-Ghazali (silsilah hawadith &amp; bantahan
            tasalsul). Tradisi non-Islam (Aquinas per se, Leibniz PSR, Craig
            Kalam modern) disajikan sebagai rujukan komparatif. Keberatan dari
            fisika dan filsafat waktu (Hawking-Hartle, B-theory, kausalitas
            kuantum) tersedia sebagai <strong>bacaan tambahan opsional</strong>{" "}
            — pembaca bebas menilai sendiri.
          </p>
        </section>

        {/* Tiga pilar falsafi Islam */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Empat pilar falsafi Islam</h2>
          <p className="text-[11px] text-muted-foreground italic">
            Tiga pilar klasik (Al-Kindi, Ibnu Sina, Al-Ghazali) dirumuskan
            secara paralel di kanvas sebagai tiga node terminal filosofis yang
            berkonvergensi ke satu Muara (Tauhid Wujud). Pilar keempat
            (an-Nabhani) menyentuh sisi epistemologi: bagaimana kita bisa
            menalar sebab-akibat sama sekali?
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                letter: "①",
                name: "Al-Kindi (~801–873 M)",
                title: "Dalil Al-Khair Al-Mahd",
                desc: "Setiap yang menjadi (kaun) butuh sumber keberadaan. Deret pemberi-keberadaan harus berhenti pada Yang Benar Murni (al-haqq al-mahd).",
                color:
                  "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20",
              },
              {
                letter: "②",
                name: "Ibnu Sina (~980–1037 M)",
                title: "Wajib vs Mumkin al-Wujud",
                desc: "Alam bersifat mumkin al-wujud — keberadaannya mungkin ada mungkin tidak, esensinya netral. Maka ia butuh Wajib al-Wujud sebagai penjelas luar.",
                color:
                  "border-violet-300 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/20",
              },
              {
                letter: "③",
                name: "Al-Ghazali (~1058–1111 M)",
                title: "Silsilah Hawadith & Tasalsul",
                desc: "Setiap kejadian baru (hadits) butuh sebab. Deret tak terhingga ke belakang (tasalsul) mustahil aktual. Maka deret berhenti pada Sebab Pertama.",
                color:
                  "border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20",
              },
              {
                letter: "④",
                name: "An-Nabhani (w. 1977 M)",
                title: "Maklumat Asabiqah & Nabi Adam",
                desc: "Empat syarat berpikir: otak, indra, obyek, dan maklumat asabiqah (informasi prior). Tanpa syarat keempat, manusia hanya menginderai seperti hewan. Selaras dengan QS Al-Baqarah:31 — Allah mengajarkan Adam nama-nama.",
                color:
                  "border-cyan-300 bg-cyan-50/50 dark:border-cyan-800 dark:bg-cyan-950/20",
              },
            ].map((p) => (
              <div
                key={p.letter}
                className={cn("border rounded-lg p-4", p.color)}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-2xl font-bold text-foreground/70">
                    {p.letter}
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm">{p.name}</h3>
                    <p className="text-[11px] text-muted-foreground italic">
                      {p.title}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground italic">
            Tiga pilar pertama konvergen pada satu muara:{" "}
            <strong>tauhid wujud</strong> — hanya satu Wajib al-Wujud yang ahad
            (esa mutlak, tidak majemuk), di luar ruang-waktu, dan segala
            selain-Nya adalah mumkin yang keberadaannya bergantung kepada-Nya.
            Pilar keempat (an-Nabhani) menjelaskan mengapa kita bisa menalar hal
            itu: kapasitas berpikir sendiri merupakan karunia.
          </p>
        </section>

        {/* Empat jalur */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Empat jalur eksplorasi</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                letter: "A",
                title: "Kosmologis Utama",
                desc: "25 node dari masa kini mundur ke Era Planck, Big Bang, lalu TIGA node terminal filosofis paralel (Al-Kindi · Ibnu Sina · Al-Ghazali) yang berkonvergensi ke Muara: Tauhid Wujud. Skala waktu logaritmik. Sub-node terperinci: Hadron (proton → neutron), Inflasi (start → plateau → reheating), GUT (grav-split → strong-EW split).",
                color: "bg-violet-500",
              },
              {
                letter: "B",
                title: "Silsilah Manusia",
                desc: "Anda → Ortu → Kakek → Buyut → leluhur ribuan generasi → hominini awal → Maklumat Asabiqah (an-Nabhani & penciptaan Adam) → Homo sapiens. Total 7 node.",
                color: "bg-emerald-500",
              },
              {
                letter: "C",
                title: "Contoh Hujan",
                desc: "Tetesan hujan → kondensasi → penguapan → cahaya Matahari → fusi nuklir → hidrogen dari Big Bang.",
                color: "bg-amber-500",
              },
              {
                letter: "D",
                title: "Contoh Biliar",
                desc: "Bola bergerak → tumbukan → tongkat → tangan → niat otak → hukum fisika. Skala sehari-hari.",
                color: "bg-cyan-500",
              },
            ].map((p) => (
              <div
                key={p.letter}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-md text-white font-bold flex items-center justify-center text-sm",
                      p.color,
                    )}
                  >
                    {p.letter}
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{p.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fitur */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Fitur</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-foreground">•</span> Canvas pan/zoom dengan
              minimap &amp; auto-layout hierarkis VERTIKAL (dagre) — alur akibat
              (atas) → sebab (bawah)
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span>{" "}
              <strong>Animasi Telusur</strong> — mode presentasi: klik tombol,
              lalu node di-highlight satu-per-satu dari masa kini mundur ke
              Sebab Pertama dengan delay ~1 detik, otomatis pan/zoom ke node
              aktif
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span> Timeline scrubber skala
              logaritmik — geser dari 10⁻⁴³ detik ke 10¹⁷·⁶ detik
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span> Klik node → detail
              panel dengan deskripsi, sumber verifikasi, dan rujukan
              Qur&apos;ani
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span> Search box untuk
              mencari node berdasarkan nama
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span>{" "}
              <strong>Mode Argumen</strong> (default ON) — overlay tiga pilar
              falsafi Islam + rujukan Qur&apos;ani
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span>{" "}
              <strong>Perspektif Lain</strong> (opsional) — keberatan dari
              fisika &amp; filsafat waktu + tanggapan Islam
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span>{" "}
              <strong>Tur Berpandu</strong> — 10 langkah dengan narrasi Islam
              dari Masa Kini hingga Wajib al-Wujud
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span>{" "}
              <strong>Panel Rujukan Qur&apos;ani</strong> — kumpulan QS
              surah:ayat + parafrase makna, filter per surah
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span>{" "}
              <strong>Mode Refleksi</strong> — 5 pertanyaan uji pemahaman wajib
              vs mumkin al-wujud &amp; tauhid
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span>{" "}
              <strong>Penanda &amp; Catatan</strong> — bookmark node + catatan
              pribadi (tersimpan di localStorage)
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span>{" "}
              <strong>Ekspor &amp; Bagikan</strong> — simpan kanvas sebagai PNG,
              ekspor node ke CSV, atau salin ringkasan argumen
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span>{" "}
              <strong>Kamus Istilah</strong> — glossary 40+ istilah: Arab
              falsafi (wajib/mumkin/mumtani&apos; al-wujud, ahad, tasalsul),
              epistemologi (maklumat asabiqah, tafkir, al-asma&apos;), kosmologi
              (inflasi, GUT, CMB), &amp; logika modal (□p, ◇p, ¬◇p)
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span>{" "}
              <strong>Mode &ldquo;What If?&rdquo;</strong> — slider 6 konstanta
              fisika (α, G, Λ, mₑ/mₚ, Q, D); geser &rarr; lihat dampak dramatis
              pada habitability. Termasuk angka Penrose 1/10^(10¹²³) &amp; 3
              respons (multiverse / theism / necessity)
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span> Legenda warna per
              kategori: personal, biologis, geologis, astronomis, partikel,
              filosofis
            </li>
          </ul>
        </section>

        {/* Riset */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Tentang riset</h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            Data kosmologis diverifikasi silang dari minimal dua sumber kredibel
            per klaim — termasuk NASA, ESA Planck, Harvard CfA, Stanford KIPAC,
            Yale Astronomy, UC Berkeley, serta Wikipedia cross-checked dengan
            sumber primer. Angka-angka yang masih diperdebatkan ilmiah ditandai
            dengan rentang dan dijelaskan ketidakpastiannya di deskripsi node.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            Sisi filosofis Islam dirujuk dari karya asli Al-Kindi, Ibnu Sina
            (Kitab al-Syifa&apos;), Al-Ghazali (Tahafut al-Falasifa), serta
            diskusi kontemporer dalam{" "}
            <em>Stanford Encyclopedia of Philosophy</em>. Rujukan Qur&apos;ani
            disertakan dalam bentuk parafrase makna (bukan teks Arab) — untuk
            teks resmi rujuk mushaf dan tafsir otoritatif (Ibnu Katsir, Al-Azhar
            karya Hamka, dll).
          </p>
        </section>

        <div className="pt-4">
          <Button
            size="lg"
            onClick={onExplore}
            className="gap-2 w-full sm:w-auto"
          >
            <Sparkles className="w-4 h-4" />
            Masuk ke Canvas
          </Button>
        </div>
      </main>

      {/* Footer — wraps on mobile */}
      <footer className="border-t mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="leading-relaxed">
            Dibangun dengan Next.js, React Flow v12, dagre, Zustand, Tailwind
            CSS, shadcn/ui, dan html-to-image. Kerangka falsafi: Al-Kindi · Ibnu
            Sina · Al-Ghazali.
          </span>
          <Github className="w-4 h-4 flex-shrink-0" />
        </div>
      </footer>
    </>
  );
}

// ====================================================================
// EXPLORER VIEW
// ====================================================================

function ExplorerView({ onBack }: { onBack: () => void }) {
  const searchQuery = useFlowStore((s) => s.searchQuery);
  const setSearchQuery = useFlowStore((s) => s.setSearchQuery);
  const showArgumentOverlay = useFlowStore((s) => s.showArgumentOverlay);
  const showPerspectivePanel = useFlowStore((s) => s.showPerspectivePanel);
  const toggleArgumentOverlay = useFlowStore((s) => s.toggleArgumentOverlay);
  const togglePerspectivePanel = useFlowStore((s) => s.togglePerspectivePanel);
  const showCorrelations = useFlowStore((s) => s.showCorrelations);
  const toggleCorrelations = useFlowStore((s) => s.toggleCorrelations);

  const panelMode = useFlowStore((s) => s.panelMode);
  const setPanelMode = useFlowStore((s) => s.setPanelMode);

  // Animasi Telusur state
  const traversalActive = useFlowStore((s) => s.traversalActive);
  const startTraversal = useFlowStore((s) => s.startTraversal);
  const stopTraversal = useFlowStore((s) => s.stopTraversal);

  // Mobile "More" dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileMenuOpen]);

  const toolbarBtn = (
    mode: typeof panelMode,
    icon: React.ReactNode,
    label: string,
  ) => ({
    active: panelMode === mode,
    onClick: () => {
      setPanelMode(mode);
      setMobileMenuOpen(false);
    },
    icon,
    label,
  });

  const featureBtns = [
    toolbarBtn("tour", <MapPin className="w-3.5 h-3.5" />, "Tur Berpandu"),
    toolbarBtn("quran", <BookOpen className="w-3.5 h-3.5" />, "Rujukan Qur'an"),
    toolbarBtn("reflection", <Brain className="w-3.5 h-3.5" />, "Mode Refleksi"),
    toolbarBtn("bookmarks", <Bookmark className="w-3.5 h-3.5" />, "Penanda"),
    toolbarBtn("export", <Share2 className="w-3.5 h-3.5" />, "Ekspor"),
    toolbarBtn("glossary", <BookMarked className="w-3.5 h-3.5" />, "Kamus Istilah"),
    toolbarBtn("finetuning", <SlidersHorizontal className="w-3.5 h-3.5" />, "What If?"),
  ];

  const hasActiveFeature = featureBtns.some((b) => b.active);

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar atas */}
      <header className="border-b bg-background flex-shrink-0">
        <div className="px-3 py-2 flex items-center gap-2">
          {/* Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1 flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Beranda</span>
          </Button>

          <div className="text-sm font-semibold hidden md:block flex-shrink-0">
            Rantai Sebab-Akibat
          </div>

          <div className="flex-1 min-w-0" />

          {/* Search — shrinks on mobile */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari node..."
              className="pl-7 h-8 w-28 sm:w-44 md:w-56 text-xs"
            />
          </div>

          {/* Animasi Telusur — icon-only on mobile */}
          <button
            onClick={() =>
              traversalActive ? stopTraversal() : startTraversal()
            }
            title={
              traversalActive
                ? "Hentikan Animasi Telusur"
                : "Mulai Animasi Telusur (mode presentasi)"
            }
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[11px] font-medium transition-colors",
              traversalActive
                ? "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 animate-pulse"
                : "bg-background hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300",
            )}
          >
            {traversalActive ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Telusur</span>
              </>
            )}
          </button>

          {/* ── Desktop: toggles + feature buttons (≥ sm) ── */}
          <div className="hidden sm:flex items-center gap-2 flex-wrap justify-end">
            {/* Toggle: Mode Argumen */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border bg-background">
              <ScrollText
                className={cn(
                  "w-3.5 h-3.5",
                  showArgumentOverlay ? "text-emerald-600" : "text-muted-foreground",
                )}
              />
              <span className="text-[11px] hidden md:inline">Argumen Islam</span>
              <Switch
                checked={showArgumentOverlay}
                onCheckedChange={toggleArgumentOverlay}
                className="scale-75"
              />
            </div>

            {/* Toggle: Perspektif Lain */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border bg-background">
              <Compass
                className={cn(
                  "w-3.5 h-3.5",
                  showPerspectivePanel ? "text-cyan-600" : "text-muted-foreground",
                )}
              />
              <span className="text-[11px] hidden md:inline">Perspektif</span>
              <Switch
                checked={showPerspectivePanel}
                onCheckedChange={togglePerspectivePanel}
                className="scale-75"
              />
            </div>

            {/* Toggle: Garis Korelasi */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border bg-background">
              <GitCompareArrows
                className={cn(
                  "w-3.5 h-3.5",
                  showCorrelations ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground",
                )}
              />
              <span className="text-[11px] hidden md:inline">Garis Korelasi</span>
              <Switch
                checked={showCorrelations}
                onCheckedChange={toggleCorrelations}
                className="scale-75"
              />
            </div>

            {/* Feature buttons — icon-only on sm, text on lg */}
            {featureBtns.map((b, i) => (
              <button
                key={i}
                onClick={b.onClick}
                title={b.label}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 rounded-md border text-[11px] transition-colors",
                  b.active
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background hover:bg-muted border-border text-foreground/80",
                )}
              >
                {b.icon}
                <span className="hidden lg:inline">{b.label}</span>
              </button>
            ))}
          </div>

          {/* ── Mobile: "More" dropdown (< sm) ── */}
          <div className="sm:hidden relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              title="Fitur lainnya"
              className={cn(
                "flex items-center gap-1 px-2 py-1.5 rounded-md border text-[11px] transition-colors",
                mobileMenuOpen || hasActiveFeature || showArgumentOverlay || showPerspectivePanel || showCorrelations
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background hover:bg-muted border-border text-foreground/80",
              )}
            >
              {mobileMenuOpen
                ? <X className="w-3.5 h-3.5" />
                : <MoreHorizontal className="w-3.5 h-3.5" />}
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 w-64 bg-background border border-border rounded-lg shadow-xl p-3 space-y-3">
                {/* Toggles section */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Tampilkan</p>
                  <button
                    onClick={() => { toggleArgumentOverlay(); setMobileMenuOpen(false); }}
                    className={cn(
                      "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md border text-xs transition-colors",
                      showArgumentOverlay
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "bg-background border-border text-foreground/80",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <ScrollText className="w-3.5 h-3.5" />
                      Argumen Islam
                    </span>
                    <Switch checked={showArgumentOverlay} onCheckedChange={() => { toggleArgumentOverlay(); setMobileMenuOpen(false); }} className="scale-75 pointer-events-none" />
                  </button>
                  <button
                    onClick={() => { togglePerspectivePanel(); setMobileMenuOpen(false); }}
                    className={cn(
                      "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md border text-xs transition-colors",
                      showPerspectivePanel
                        ? "bg-cyan-50 border-cyan-300 text-cyan-800"
                        : "bg-background border-border text-foreground/80",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5" />
                      Perspektif Lain
                    </span>
                    <Switch checked={showPerspectivePanel} onCheckedChange={() => { togglePerspectivePanel(); setMobileMenuOpen(false); }} className="scale-75 pointer-events-none" />
                  </button>
                  <button
                    onClick={() => { toggleCorrelations(); setMobileMenuOpen(false); }}
                    className={cn(
                      "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md border text-xs transition-colors",
                      showCorrelations
                        ? "bg-violet-50 border-violet-300 text-violet-800"
                        : "bg-background border-border text-foreground/80",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <GitCompareArrows className="w-3.5 h-3.5" />
                      Garis Korelasi
                    </span>
                    <Switch checked={showCorrelations} onCheckedChange={() => { toggleCorrelations(); setMobileMenuOpen(false); }} className="scale-75 pointer-events-none" />
                  </button>
                </div>

                <div className="border-t" />

                {/* Feature buttons grid */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Fitur</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {featureBtns.map((b, i) => (
                      <button
                        key={i}
                        onClick={b.onClick}
                        className={cn(
                          "flex items-center text-left gap-2 px-2.5 py-2 rounded-md border text-xs transition-colors",
                          b.active
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background hover:bg-muted border-border text-foreground/80",
                        )}
                      >
                        {b.icon}
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Branch switcher — horizontally scrollable on mobile */}
        <div className="px-3 pb-2 overflow-x-auto">
          <BranchSwitcher />
        </div>
      </header>

      {/* Timeline scrubber */}
      <div className="flex-shrink-0">
        <TimelineScrubber />
      </div>

      {/* Main area: Canvas + DetailPanel, dengan overlay */}
      <div className="flex-1 relative overflow-hidden flex min-h-0">
        {/* Overlay panels (absolute, tidak mengubah layout canvas) */}
        <ArgumentOverlay />
        <PerspectivePanel />
        <GuidedTour />
        <QuranReferencePanel />
        <ReflectionMode />
        <BookmarksPanel />
        <ExportView />
        <GlossaryPanel />
        <FineTuningMode />

        {/* Canvas (flex-1) + DetailPanel */}
        <div className="flex-1 flex min-w-0 min-h-0">
          <div className="flex-1 relative min-w-0 min-h-0">
            <ChainFlowCanvas />
          </div>
          <div className="w-[280px] sm:w-[320px] flex-shrink-0 hidden md:block min-h-0 h-full overflow-hidden">
            <DetailPanel />
          </div>
        </div>
      </div>

      {/* Mobile detail: bottom sheet */}
      <MobileDetailDrawer />
    </div>
  );
}

// ====================================================================
// MOBILE DETAIL DRAWER (untuk layar kecil tanpa side panel)
// ====================================================================

function MobileDetailDrawer() {
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);
  const setSelectedNode = useFlowStore((s) => s.setSelectedNode);

  if (!selectedNodeId) return null;

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 max-h-[66.5vh] flex flex-col bg-background border-t shadow-2xl rounded-t-xl">
      {/* Drag handle visual */}
      <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
      </div>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <DetailPanel />
      </div>
    </div>
  );
}
