"use client";

/**
 * PerspectivePanel.tsx — Panel "Perspektif Lain" (Bacaan Tambahan Opsional).
 *
 * Posisinya dalam arsitektur situs: bacaan tambahan opsional, BUKAN bagian dari
 * alur utama. Kerangka utama situs adalah falsafi Islam (lihat Mode Argumen).
 *
 * Menampilkan keberatan dari tradisi non-Islam & sains modern terhadap argumen
 * kosmologis, disertai tanggapan dari sudut pandang falsafi Islam:
 *  1. Hawking-Hartle No-Boundary Proposal (fisika)
 *  2. B-Theory of Time / Eternalism (filsafat waktu)
 *  3. Kritik terhadap "infinite regress mustahil" (Ibnu Rusyd vs Al-Ghazali)
 *  4. Kausalitas kuantum & keberatan terhadap Premis 1
 *
 * Toggle terpisah — pembaca bebas membuka atau membiarkannya tertutup.
 */

import { useFlowStore } from "@/store/flow-store";
import { X, Atom, Clock, Infinity as InfinityIcon, Sparkles, BookMarked } from "lucide-react";

interface Counter {
  icon: React.ReactNode;
  title: string;
  source: string;
  body: React.ReactNode;
}

export function PerspectivePanel() {
  const show = useFlowStore((s) => s.showPerspectivePanel);
  const toggle = useFlowStore((s) => s.togglePerspectivePanel);
  const toggleArgument = useFlowStore((s) => s.toggleArgumentOverlay);

  if (!show) return null;

  const counters: Counter[] = [
    {
      icon: <Atom className="w-4 h-4" />,
      title: "1. Hawking-Hartle: No-Boundary Proposal",
      source: "Hartle & Hawking (1983); Wikipedia",
      body: (
        <p className="text-[11px] leading-relaxed">
          Dengan menggunakan <em>waktu imajiner</em> dalam persamaan relativitas umum kuantum, singularitas
          Big Bang dapat dihilangkan secara matematis. Alam semesta menjadi seperti permukaan bola: terbatas,
          tetapi tanpa tepi atau titik awal. &ldquo;Pertanyaan apa sebelum Big Bang&rdquo; menjadi
          tidak bermakna, karena struktur waktu itu sendiri baru muncul bersama Big Bang.
          <br />
          <span className="text-muted-foreground italic">
            <strong className="text-foreground">Tanggapan falsafi Islam:</strong> ini adalah model
            matematika, bukan deskripsi realitas. Argumen Ibnu Sina (wajib vs mumkin al-wujud) tidak
            bergantung pada apakah alam semesta memiliki awal temporal — ia hanya butuh kontingensi.
            Model Hawking-Hartle, jika benar, hanya menggeser argumen dari jalur temporal ke jalur
            ontologis, bukan membatalkannya.
          </span>
        </p>
      ),
    },
    {
      icon: <Clock className="w-4 h-4" />,
      title: "2. B-Theory of Time (Eternalism / Block Universe)",
      source: "McTaggart (1908); SEP: Time",
      body: (
        <p className="text-[11px] leading-relaxed">
          Jika waktu adalah blok 4-dimensi di mana masa lalu, sekarang, dan masa depan sama-sama nyata
          (B-theory), maka kalimat &ldquo;alam semesta mulai ada&rdquo; kehilangan makna jelasnya. Alam
          semesta tidak &ldquo;mulai&rdquo; — ia hanya <em>ada</em> tenselessly, seperti angka 4 ada di
          antara 3 dan 5. Premis 2 Kalam bergantung pada A-theory (presentism), yang merupakan posisi
          yang diperdebatkan dalam filsafat waktu.
          <br />
          <span className="text-muted-foreground italic">
            <strong className="text-foreground">Tanggapan:</strong> argumen Ibnu Sina dan Aquinas (per
            se) sama sekali tidak bergantung pada A-theory. Mereka berargumen dari kontingensi dan
            hierarki ontologis, bukan dari mulai-ada temporal. Bahkan jika B-theory benar, mumkin
            tetap mumkin.
          </span>
        </p>
      ),
    },
    {
      icon: <InfinityIcon className="w-4 h-4" />,
      title: "3. Kritik terhadap &ldquo;Infinite Regress Mustahil&rdquo;",
      source: "Ibnu Rusyd (Tahafut al-Tahafut); Edward Feser; SEP",
      body: (
        <p className="text-[11px] leading-relaxed">
          Dalam tradisi Islam sendiri, Ibnu Rusyd menulis <em>Tahafut al-Tahafut</em> sebagai bantahan
          terhadap Al-Ghazali. Ia berargumen bahwa kekekalan alam (tanpa permulaan temporal) tidak
          bertentangan dengan keberadaan Allah sebagai sebab ontologis. Tradisi modern: paradoks seperti
          Hilbert&apos;s Hotel dan Grim Reaper berusaha menunjukkan bahwa infinite series aktual
          menghasilkan kontradiksi. Tetapi kritik berargumen: (a) paradoks tersebut menunjukkan
          bahwa infinite series <em>secara fisik</em> bermasalah, bukan <em>secara logis</em> mustahil;
          (b) tidak jelas apakah deret waktu analog dengan deret benda fisik.
          <br />
          <span className="text-muted-foreground italic">
            <strong className="text-foreground">Catatan:</strong> perdebatan Ibnu Rusyd vs Al-Ghazali
            masih hidup dalam tradisi falsafi Islam. Yang penting: bahkan jika Al-Ghazali kalah di sini,
            argumen Ibnu Sina (kontingensi) tidak terpengaruh.
          </span>
        </p>
      ),
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      title: "4. Kausalitas Kuantum & Keberatan terhadap Premis 1",
      source: "Edward Feser; Philosophy SE",
      body: (
        <p className="text-[11px] leading-relaxed">
          Peluruhan radioaktif dan munculnya virtual partikel terlihat tak deterministik. Beberapa
          fisikawan dan filsuf berargumen bahwa ini menantang Premis 1 (&ldquo;segala yang mulai ada
          memiliki sebab&rdquo;). Jika partikel dapat muncul tanpa pemicu deterministik, mengapa alam
          semesta tidak bisa?
          <br />
          <span className="text-muted-foreground italic">
            <strong className="text-foreground">Tanggapan falsafi Islam:</strong> (a) indeterminisme ≠
            tanpa sebab — atom radioaktif <em>memiliki</em> sebab (keberadaannya sendiri, struktur
            intinya), hanya tidak ada pemicu spesifik untuk momen peluruhan; (b) quantum vacuum bukan
            &ldquo;nothingness&rdquo; filosofis — ia adalah ruang dengan struktur dan hukum. Argumen
            dari <em>al-&#39;adam al-mahd</em> (ketiadaan mutlak) berbeda dari argumen dari vacuum
            kuantum.
          </span>
        </p>
      ),
    },
  ];

  return (
    <div className="absolute inset-y-0 right-0 z-20 w-full sm:w-[420px] bg-background/95 backdrop-blur border-l shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-cyan-50 dark:bg-cyan-950/30">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-cyan-600" />
            Bacaan Tambahan — Perspektif Lain
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Opsional · Bukan bagian dari alur utama argumen
          </p>
        </div>
        <button
          onClick={toggle}
          className="p-1.5 rounded hover:bg-muted"
          aria-label="Tutup panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-4">
          <div className="rounded-md bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 p-3 text-[11px] leading-relaxed">
            <strong className="text-cyan-900 dark:text-cyan-100">Posisi panel ini:</strong>{" "}
            Situs ini menyajikan kerangka falsafi Islam (Al-Kindi, Ibnu Sina, Al-Ghazali) sebagai
            kerangka utama. Panel ini menyajikan keberatan dari tradisi non-Islam & sains modern
            seadil mungkin — lengkap dengan tanggapan dari sudut pandang Islam — sebagai{" "}
            <strong>bacaan tambahan opsional</strong>. Pembaca bebas menilai sendiri.
          </div>

          {counters.map((c, i) => (
            <section key={i} className="space-y-1.5">
              <h4 className="text-xs font-bold flex items-center gap-2 leading-tight">
                <span className="text-cyan-600 dark:text-cyan-400">{c.icon}</span>
                {c.title}
              </h4>
              <p className="text-[10px] text-muted-foreground pl-6">{c.source}</p>
              <div className="pl-6">{c.body}</div>
              {i < counters.length - 1 && <hr className="border-muted mt-3" />}
            </section>
          ))}

          <div className="rounded-md bg-muted p-3 text-[11px] leading-relaxed mt-4">
            <strong>Ingin membaca kerangka utama?</strong>{" "}
            <button
              onClick={() => {
                toggle();
                if (!useFlowStore.getState().showArgumentOverlay) toggleArgument();
              }}
              className="underline hover:no-underline font-medium"
            >
              Buka Mode Argumen — Falsafi Islam →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
