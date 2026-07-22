"use client";

/**
 * ReflectionMode.tsx — Iterasi 3: Mode Refleksi / Kuis Pemahaman.
 *
 * 5 pertanyaan refleksi yang menguji pemahaman pembaca terhadap:
 *   - Konsep wajib vs mumkin al-wujud (Ibnu Sina)
 *   - Silsilah hawadith & bantahan tasalsul (Al-Ghazali)
 *   - Tauhid wujud sebagai muara argumen
 *   - Perbedaan jalur temporal (Al-Ghazali) vs jalur ontologis (Ibnu Sina)
 *   - Posisi sains vs filsafat (batas Era Planck)
 *
 * Setelah selesai, tampilkan skor + ringkasan singkat per pertanyaan.
 */

import { useFlowStore } from "@/store/flow-store";
import { useState } from "react";
import { X, Brain, Check, X as XIcon, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  prompt: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt:
      "Menurut Ibnu Sina, keberadaan alam semesta termasuk kategori apa — yang membuat ia menuntut penjelas luar?",
    options: [
      { id: "a", text: "Wajib al-wujud (keberadaannya wajib dengan sendirinya)" },
      { id: "b", text: "Mumkin al-wujud (keberadaannya mungkin ada mungkin tidak)" },
      { id: "c", text: "Mustahil al-wujud (keberadaannya mustahil)" },
      { id: "d", text: "Qadim murni (selalu ada tanpa sebab)" },
    ],
    correctId: "b",
    explanation:
      "Ibnu Sina: alam semesta bersifat mumkin al-wujud — esensinya netral terhadap ada/tidak-ada, sehingga butuh sebab luar untuk mendorongnya menjadi ada. Hanya Wajib al-wujud yang keberadaannya tidak butuh penjelas.",
  },
  {
    id: 2,
    prompt:
      "Apa yang dimaksud Al-Ghazali dengan 'tasalsul' dan mengapa ia menganggapnya mustahil?",
    options: [
      { id: "a", text: "Tasalsul adalah kejadian berulang; mustahil karena alam berputar" },
      { id: "b", text: "Tasalsul adalah deret sebab-akibat tak terhingga ke belakang; mustahil karena tak terhingga aktual tidak dapat 'habis' dilalui untuk sampai ke masa kini" },
      { id: "c", text: "Tasalsul adalah sebab diri sendiri; mustahil secara logis" },
      { id: "d", text: "Tasalsul adalah rantai partikel; mustahil secara fisika" },
    ],
    correctId: "b",
    explanation:
      "Al-Ghazali menyebut deret sebab-akibat tak terhingga ke belakang sebagai 'silsilah hawadith'. Ia menolak tasalsul karena tak terhingga aktual tidak dapat 'habis' dilalui — namun kita memang sudah sampai ke masa kini, jadi deret harus berhenti pada Sebab Pertama.",
  },
  {
    id: 3,
    prompt:
      "Mengapa muara argumen kosmologis dalam tradisi Islam konvergen pada konsep 'ahad' (esa mutlak), bukan 'wahid' (satu dalam hitungan)?",
    options: [
      { id: "a", text: "Karena Al-Qur'an menyebut 'ahad' di QS Al-Ikhlas" },
      { id: "b", text: "Karena Yang Wajib al-Wujud tidak tersusun dari bagian — jika Ia majemuk, Ia butuh penyusun, yang menempatkan-Nya kembali sebagai mumkin" },
      { id: "c", text: "Karena matematika Islam lebih suka angka satu" },
      { id: "d", text: "Karena tradisi Arab kuno menggunakan kata 'ahad'" },
    ],
    correctId: "b",
    explanation:
      "Argumen ontologis: sesuatu yang tersusun dari bagian membutuhkan penyusun — yang berarti ia bergantung pada sesuatu lain, sehingga ia mumkin. Maka Wajib al-Wujud harus sederhana (tidak majemuk) — bersifat ahad, esa mutlak. QS Al-Ikhlas:1 adalah konfirmasi wahyu atas konklusi rasional ini.",
  },
  {
    id: 4,
    prompt:
      "Perbedaan kunci antara argumen Al-Ghazali (silsilah hawadith) dan argumen Ibnu Sina (wajib vs mumkin al-wujud) adalah:",
    options: [
      { id: "a", text: "Al-Ghazali berargumen dari kontingensi; Ibnu Sina dari awal temporal" },
      { id: "b", text: "Al-Ghazali berargumen dari awal temporal alam; Ibnu Sina dari kontingensi ontologis — tidak bergantung pada apakah alam mulai atau selalu ada" },
      { id: "c", text: "Keduanya berargumen dari jalur yang sama" },
      { id: "d", text: "Ibnu Sina menolak konsep sebab pertama, Al-Ghazali menerimanya" },
    ],
    correctId: "b",
    explanation:
      "Al-Ghazali memakai jalur temporal (alam mulai ada → butuh sebab pertama). Ibnu Sina memakai jalur ontologis (alam mumkin → butuh penjelas, terlepas apakah ia mulai atau selalu ada). Keuntungan Ibnu Sina: argumennya tidak terpengaruh oleh model fisika apa pun tentang apakah alam berawal.",
  },
  {
    id: 5,
    prompt:
      "Mengapa batas Era Planck (10^-43 detik) penting untuk argumen kosmologis dalam situs ini?",
    options: [
      { id: "a", text: "Karena di situ fisika konvensional berhenti — klaim tentang 'sebelum' atau 'di luar' harus diperlakukan sebagai argumen filosofis, bukan kesimpulan empiris" },
      { id: "b", text: "Karena di situ alam semesta benar-benar tidak ada" },
      { id: "c", text: "Karena di situ Allah menciptakan segalanya secara instan" },
      { id: "d", text: "Karena relativitas umum tidak berlaku di sana" },
    ],
    correctId: "a",
    explanation:
      "Era Planck adalah batas jujur dari sains konvensional — relativitas umum dan mekanika kuantum belum disatukan. Klaim tentang 'apa yang terjadi pada t=0' bersifat spekulatif. Inilah mengapa node Big Bang ditandai sebagai 'batas sains' (boundary), dan node Sebab Pertama sebagai 'filosofis' (F) — sebuah konklusi argumentatif, bukan klaim empiris.",
  },
];

export function ReflectionMode() {
  const panelMode = useFlowStore((s) => s.panelMode);
  const setPanelMode = useFlowStore((s) => s.setPanelMode);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (panelMode !== "reflection") return null;

  const handleAnswer = (qid: number, optId: string) => {
    if (submitted) return;
    setAnswers({ ...answers, [qid]: optId });
  };

  const handleSubmit = () => setSubmitted(true);

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = QUESTIONS.filter((q) => answers[q.id] === q.correctId).length;
  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  return (
    <div className="absolute inset-y-0 right-0 z-30 w-full sm:w-[460px] bg-background/95 backdrop-blur border-l shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-yellow-50 to-emerald-50 dark:from-yellow-950/30 dark:to-emerald-950/30">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Brain className="w-4 h-4 text-yellow-600" />
            Mode Refleksi
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            5 pertanyaan · Uji pemahaman tentang wajib al-wujud & tauhid
          </p>
        </div>
        <button
          onClick={() => setPanelMode("none")}
          className="p-1.5 rounded hover:bg-muted"
          aria-label="Tutup refleksi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-5">
          {submitted && (
            <div className="rounded-md bg-foreground text-background p-4 text-center">
              <p className="text-2xl font-bold mb-1">
                {score} / {QUESTIONS.length}
              </p>
              <p className="text-xs opacity-80">
                {score === QUESTIONS.length
                  ? "MasyaAllah — pemahaman Anda kuat!"
                  : score >= 3
                  ? "Bagus — lanjutkan refleksi pada node yang masih meragukan."
                  : "Pelajari kembali Mode Argumen, lalu coba lagi."}
              </p>
            </div>
          )}

          {QUESTIONS.map((q, idx) => {
            const userAnswer = answers[q.id];
            const isCorrect = submitted && userAnswer === q.correctId;
            const isWrong = submitted && userAnswer && userAnswer !== q.correctId;

            return (
              <div key={q.id} className="space-y-2">
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center",
                      submitted
                        ? isCorrect
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {submitted ? (
                      isCorrect ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <XIcon className="w-3 h-3" />
                      )
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <p className="text-xs font-semibold leading-relaxed">{q.prompt}</p>
                </div>

                <div className="space-y-1.5 pl-7">
                  {q.options.map((opt) => {
                    const isSelected = userAnswer === opt.id;
                    const showCorrect = submitted && opt.id === q.correctId;
                    const showWrong = submitted && isSelected && opt.id !== q.correctId;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleAnswer(q.id, opt.id)}
                        disabled={submitted}
                        className={cn(
                          "w-full text-left text-[11px] px-3 py-2 rounded-md border transition-all flex items-start gap-2",
                          !submitted && "hover:bg-muted cursor-pointer",
                          showCorrect && "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700",
                          showWrong && "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700",
                          !showCorrect && !showWrong && isSelected && "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-700",
                          !isSelected && !showCorrect && !showWrong && "border-border bg-background"
                        )}
                      >
                        <span className="font-mono font-semibold text-[10px] flex-shrink-0 mt-0.5">
                          {opt.id.toUpperCase()}.
                        </span>
                        <span className="leading-relaxed">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="pl-7 mt-1">
                    <div className="rounded-md bg-muted p-2 text-[10px] leading-relaxed">
                      <strong className="text-foreground">Penjelasan:</strong>{" "}
                      <span className="text-muted-foreground">{q.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-3 flex items-center justify-between gap-2">
        {submitted ? (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Coba lagi
          </button>
        ) : (
          <>
            <span className="text-[10px] text-muted-foreground">
              {Object.keys(answers).length} / {QUESTIONS.length} terjawab
            </span>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={cn(
                "text-xs px-3 py-1.5 rounded-md transition-colors",
                allAnswered
                  ? "bg-foreground text-background hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Periksa jawaban
            </button>
          </>
        )}
      </div>
    </div>
  );
}
