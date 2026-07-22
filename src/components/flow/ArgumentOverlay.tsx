"use client";

/**
 * ArgumentOverlay.tsx — Overlay ringkasan argumen kosmologis dalam kerangka falsafi Islam.
 *
 * Kerangka utama (urutan sajian):
 *  1. Al-Kindi  — dalil al-khair al-mahd (argumen dari kebaikan mutlak / One Truth)
 *  2. Ibnu Sina — wajib al-wujud vs mumkin al-wujud
 *  3. Al-Ghazali — silsilah hawadith & bantahan terhadap tasalsul (regresi tak terhingga)
 *  4. Muara: tauhid (kesatuan Wajib al-Wujud)
 *
 * Rujukan komparatif (diposisikan sebagai bacaan tambahan, bukan kerangka utama):
 *  - Aquinas (Second Way, per se causation)
 *  - Leibniz (Principle of Sufficient Reason)
 *  - Craig (rumusan modern Kalam yang berakar pada Al-Ghazali)
 *
 * Rujukan Qur'ani disertakan dengan format QS <Surah>:<Ayat> + parafrase makna —
 * bukan kutipan teks Arab, untuk menjaga keterbacaan UI dan hemat layar.
 */

import { useFlowStore } from "@/store/flow-store";
import { X, BookOpen, Sparkles, Compass, Moon, Scroll, Beaker } from "lucide-react";

interface ArgSection {
  icon: React.ReactNode;
  accent: string;
  title: string;
  badge?: string;
  body: React.ReactNode;
}

export function ArgumentOverlay() {
  const show = useFlowStore((s) => s.showArgumentOverlay);
  const toggle = useFlowStore((s) => s.toggleArgumentOverlay);

  if (!show) return null;

  const sections: ArgSection[] = [
    {
      icon: <Beaker className="w-4 h-4" />,
      accent: "text-emerald-600 dark:text-emerald-400",
      title: "1. Al-Kindi — Dalil Al-Khair Al-Mahd (~ abad ke-9 M)",
      badge: "Tradisi Islam awal",
      body: (
        <div className="space-y-2 text-[11px] leading-relaxed">
          <p>
            Al-Kindi, filsuf Arab pertama yang sistematis, berargumen bahwa segala sesuatu di alam
            ini bersifat <em>kaun</em> (menjadi / terjadi) — ia tidak ada dengan sendirinya, melainkan
            mendapatkan keberadaannya dari sumber lain yang tidak terbatas. Karena deret pemberi-keberadaan
            tidak boleh tak terhingga aktual (ia sebut <em>tasalsul</em>), harus ada satu{" "}
            <strong>al-khair al-mahd</strong> — Kebaikan Mutlak, Yang Benar Murni (al-haqq al-mahd) —
            yang keberadaannya bersumber dari diri-Nya sendiri.
          </p>
          <p className="text-muted-foreground">
            Argumen Al-Kindi berbeda dari Ibnu Sina dan Al-Ghazali dalam terminologi, tetapi konvergen
            pada satu titik: keberadaan dunia ini menuntut Penjelas Tunggal yang tidak berada dalam
            kategori "menjadi".
          </p>
        </div>
      ),
    },
    {
      icon: <Compass className="w-4 h-4" />,
      accent: "text-violet-600 dark:text-violet-400",
      title: "2. Ibnu Sina — Wajib vs Mumkin al-Wujud (~ 1000 M)",
      badge: "Kerangka konseptual utama",
      body: (
        <div className="space-y-2 text-[11px] leading-relaxed">
          <p>
            Ibnu Sina memperkenalkan distingsi paling tajam dalam tradisi falsafi Islam:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              <strong>Wajib al-wujud</strong> (keberadaan yang wajib dengan sendirinya): keberadaannya
              tidak bergantung pada sebab apa pun. Esensinya tidak lain kecuali keberadaan itu sendiri.
            </li>
            <li>
              <strong>Mumkin al-wujud</strong> (keberadaan yang mungkin ada dan mungkin tidak): butuh
              sebab luar untuk mendorongnya dari ketidakadaan ke keberadaan, karena esensinya netral
              terhadap ada/tidak-ada.
            </li>
          </ul>
          <p>
            Alam semesta — totalitas segala sesuatu yang berubah dan tersusun dari bagian — jelas
            bersifat mumkin al-wujud. Ia bisa saja berbeda (fisika bisa lain, konstanta bisa lain),
            dan setiap bagian di dalamnya bergantung pada bagian lain. Maka keberadaannya menuntut{" "}
            <em>penjelas luar</em>: satu Wajib al-Wujud yang tidak tersusun, tidak berubah, dan
            tidak berada di dalam ruang-waktu.
          </p>
          <p className="text-muted-foreground">
            Inilah pondasi argumen kontingensi dalam Islam — tidak bergantung pada apakah alam semesta
            "mulai" atau "selalu ada". Ia bekerja bahkan jika alam semesta tanpa awal temporal, karena
            mumkin tetap mumkin.
          </p>
        </div>
      ),
    },
    {
      icon: <Scroll className="w-4 h-4" />,
      accent: "text-amber-600 dark:text-amber-400",
      title: "3. Al-Ghazali — Silsilah Hawadith & Bantahan Tasalsul",
      badge: "Argumen temporal utama",
      body: (
        <div className="space-y-2 text-[11px] leading-relaxed">
          <p>
            Al-Ghazali dalam <em>Tahafut al-Falasifa</em> mengasah argumen dari sisi temporal:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-2">
            <li>Setiap kejadian baru (<em>hadits</em>) memiliki sebab yang mendahuluinya.</li>
            <li>
              Deret kejadian-kejadian baru (<em>silsilah hawadith</em>) tidak dapat berjalan tak
              terhingga ke belakang — ini disebut <em>bantahan tasalsul</em>.
            </li>
            <li>
              Maka deret harus berhenti pada satu <strong>Sebab Pertama</strong> yang bukan kejadian
              baru — Ia qadim (tiada permulaan), wajib al-wujud.
            </li>
          </ol>
          <p>
            Mengapa tasalsul mustahil? Al-Ghazali memakai argumen kuantitas: jika deretan peristiwa
            yang tak terhingga itu telah dilalui untuk sampai ke hari ini, berarti tak terhingga itu
            "habis" dilalui — padahal tak terhingga tidak bisa habis. Argumen paralel:{" "}
            <em>Hilbert&apos;s Hotel</em> modern (Craig) menunjukkan kontradiksi serupa dalam bentuk
            hotel dengan kamar tak terhingga.
          </p>
          <p className="text-muted-foreground">
            Catatan: Ibnu Rusyd kemudian mengkritik Al-Ghazali — ia berargumen bahwa kekekalan alam
            (tanpa permulaan) tidak bertentangan dengan keberadaan Allah. Perdebatan ini masih
            hidup dalam tradisi falsafi Islam hingga hari ini.
          </p>
        </div>
      ),
    },
    {
      icon: <Moon className="w-4 h-4" />,
      accent: "text-yellow-600 dark:text-yellow-400",
      title: "4. Muara: Tauhid Wujud",
      badge: "Konklusi argumentatif",
      body: (
        <div className="space-y-2 text-[11px] leading-relaxed">
          <p>
            Konklusi tiga tradisi di atas konvergen pada satu titik: keberadaan dunia memerlukan{" "}
            <strong>Wajib al-Wujud</strong> yang:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Esa tanpa majemuk — karena sesuatu yang tersusun dari bagian butuh penyusun, dan
              itu menempatkannya kembali sebagai mumkin al-wujud.</li>
            <li>Di luar ruang dan waktu — karena ia sumber keduanya, bukan di dalamnya.</li>
            <li>Tidak berubah — karena perubahan menandakan transisi dari potensi ke aktual,
              yang hanya berlaku bagi yang mumkin.</li>
            <li>Bersifat <em>ahad</em>, bukan <em>wahid</em> — Yang Tunggal Mutlak, bukan satu
              dalam arti hitungan.</li>
          </ul>
          <p>
            Inilah muara argumen: <strong>tauhid wujud</strong> — pengakuan bahwa hanya ada satu
            Wajib al-Wujud, dan segala selain-Nya adalah mumkin yang keberadaannya bergantung
            kepada-Nya. Dalam bahasa Qur'ani: <em>Qul Huwa Allahu Ahad</em> (Katakanlah, Dialah
            Allah Yang Maha Esa).
          </p>
        </div>
      ),
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      accent: "text-cyan-600 dark:text-cyan-400",
      title: "5. Rujukan Komparatif (Bacaan Tambahan)",
      badge: "Tradisi non-Islam",
      body: (
        <div className="space-y-2 text-[11px] leading-relaxed text-muted-foreground">
          <p>
            Tradisi lain tiba pada kerangka serupa lewat jalan berbeda:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              <strong>Aquinas — Second Way</strong> (~1265 M): berargumen dari sebab hierarkis-simultan
              (<em>per se</em>), bukan dari deret temporal (<em>per accidens</em>). Aquinas mengakui
              deret temporal bisa saja tanpa awal, tetapi deret per se harus berakhir pada sebab
              suprem ontologis.
            </li>
            <li>
              <strong>Leibniz — Prinsip Alasan Cukup</strong> (~1714 M): tidak peduli apakah alam
              mulai atau selalu ada — ia kontingen, maka butuh alasan cukup di luar dirinya. Konvergen
              dengan Ibnu Sina.
            </li>
            <li>
              <strong>Craig — Kalam modern</strong> (~1979 M): merumus ulang argumen Al-Ghazali dalam
              bentuk silogisme formal (P1: segala yang mulai ada memiliki sebab; P2: alam semesta
              mulai ada; K: alam semesta memiliki sebab). Populer di literatur apologetika kontemporer.
            </li>
          </ul>
        </div>
      ),
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      accent: "text-yellow-600 dark:text-yellow-400",
      title: "6. Rujukan Qur'ani (Parafrase Makna)",
      badge: "QS rujukan",
      body: (
        <div className="space-y-2 text-[11px] leading-relaxed">
          <ul className="space-y-1.5">
            <li>
              <strong>QS Al-Fatihah:2</strong> — Segala puji bagi Allah, Rabb seluruh alam.{" "}
              <em>(Alam ini milik Yang Mengurusnya.)</em>
            </li>
            <li>
              <strong>QS Al-Ikhlas:1-4</strong> — Katakanlah: Dialah Allah Yang Maha Esa. Allah tempat
              meminta. Tidak beranak dan tidak diperanakkan, dan tidak ada yang setara dengan-Nya.{" "}
              <em>(Tauhid wujud: Yang Wajib al-Wujud itu ahad.)</em>
            </li>
            <li>
              <strong>QS Al-Anbiya:30</strong> — Langit dan bumi dahulu menyatu, lalu Kami pisahkan;
              dan dari air Kami jadikan segala sesuatu yang hidup.{" "}
              <em>(Tahap-tahap penciptaan alam.)</em>
            </li>
            <li>
              <strong>QS Adh-Dhariyat:47</strong> — Dan langit, Kami bangun dengan kekuasaan, dan
              sesungguhnya Kami benar-benar meluaskannya.{" "}
              <em>(Ekspansi ruang, sejalan dengan Big Bang.)</em>
            </li>
            <li>
              <strong>QS Yasin:82-83</strong> — Sungguh, keadaan-Nya apabila Ia menghendaki sesuatu
              hanyalah berkata &lsquo;Jadilah!&rsquo; maka jadilah ia. Maha Suci (Allah) yang
              menguasai segala sesuatu.{" "}
              <em>(Yang Maha Sebab di luar sebab-akibat dalam alam.)</em>
            </li>
            <li>
              <strong>QS Al-Araf:54</strong> — Sungguh, Tuhanmu Allah yang menciptakan langit dan bumi
              dalam enam masa, lalu Dia bersemayam di atas &lsquo;Arsy.{" "}
              <em>(Penciptaan bertahap, bukan instan.)</em>
            </li>
          </ul>
          <p className="text-[10px] text-muted-foreground italic mt-2">
            Catatan: parafrase makna disusun ringkas untuk keterbacaan UI. Untuk teks Arab dan
            terjemahan resmi, rujuk mushaf Al-Qur'an dan tafsir otoritatif (Ibnu Katsir, Al-Azhar
            karya Hamka, dll).
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="absolute inset-y-0 left-0 z-20 w-full sm:w-[460px] bg-background/95 backdrop-blur border-r shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Scroll className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Mode Argumen — Kerangka Falsafi Islam
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Al-Kindi · Ibnu Sina · Al-Ghazali — bermuara ke tauhid wujud
          </p>
        </div>
        <button
          onClick={toggle}
          className="p-1.5 rounded hover:bg-muted"
          aria-label="Tutup overlay"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-4">
          <div className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3 text-[11px] leading-relaxed">
            <strong className="text-emerald-900 dark:text-emerald-100">Catatan kerangka:</strong>{" "}
            Sajian utama situs ini berakar pada tradisi <em>falsafi Islam</em>. Node berlabel{" "}
            <span className="font-mono bg-yellow-200 dark:bg-yellow-800 px-1 rounded">F</span> di
            kanvas menandai konklusi argumentatif — bukan klaim empiris. Untuk keberatan terhadap
            argumen ini, lihat <strong>Mode Perspektif Lain</strong> (bacaan tambahan opsional).
          </div>

          {sections.map((s, i) => (
            <section key={i} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className={s.accent + " text-xs font-bold flex items-center gap-2 leading-tight"}>
                  {s.icon}
                  {s.title}
                </h4>
              </div>
              {s.badge && (
                <span className="text-[9px] uppercase tracking-wide bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                  {s.badge}
                </span>
              )}
              <div className="pl-6">{s.body}</div>
              {i < sections.length - 1 && <hr className="border-muted" />}
            </section>
          ))}

          <div className="rounded-md bg-foreground text-background p-3 text-[11px] leading-relaxed">
            <strong className="text-background">Sintesis:</strong> Tiga tradisi Islam (Al-Kindi,
            Ibnu Sina, Al-Ghazali) berbeda dalam jalan masuk — kebaikan mutlak, kontingensi,
            dan rentetan kejadian — tetapi konvergen pada satu konklusi: keberadaan dunia menuntut{" "}
            <em>Wajib al-Wujud</em> yang ahad, di luar ruang-waktu, dan tidak bergantung pada apa
            pun. Inilah tauhid wujud — fondasi dari seluruh bangunan argumen kosmologis dalam
            tradisi Islam.
          </div>
        </div>
      </div>
    </div>
  );
}
