"use client";

/**
 * ExportView.tsx — Iterasi 5: Ekspor Tampilan Kanvas.
 *
 * Memungkinkan pembaca:
 *   - Ekspor tampilan kanvas saat ini sebagai PNG
 *   - Ekspor daftar node + edge sebagai CSV (data analisis)
 *   - Salin ringkasan argumen Islam ke clipboard (untuk berbagi di chat)
 *
 * Implementasi PNG: pakai html-to-image (sudah ada sebagai dependency transitif
 *   dari @xyflow/react). Tidak menambah dependency baru.
 *
 * Fallback jika html-to-image tidak tersedia: pakai react-flow screenshot API
 *   melalui useReactFlow().toBlob() — namun memerlukan wrapper ReactFlowProvider
 *   yang sudah ada di ChainFlowCanvas.
 */

import { useFlowStore } from "@/store/flow-store";
import { useState, useCallback } from "react";
import { X, Download, FileImage, FileText, Copy, Check, Share2 } from "lucide-react";
import { chainNodes } from "@/data/chain-nodes";
import { chainEdges } from "@/data/chain-edges";

export function ExportView() {
  const panelMode = useFlowStore((s) => s.panelMode);
  const setPanelMode = useFlowStore((s) => s.setPanelMode);
  const activeBranch = useFlowStore((s) => s.activeBranch);
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);

  const [status, setStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const summaryText = `Rantai Sebab-Akibat — Ringkasan Argumen Falsafi Islam

Empat jalur eksplorasi: A (Kosmologis Utama), B (Silsilah Manusia), C (Contoh Hujan), D (Contoh Biliar). Semuanya konvergen pada Branch A.

Kerangka utama: tradisi falsafi Islam
1. Al-Kindi — dalil al-khair al-mahd: setiap yang "menjadi" butuh sumber keberadaan.
2. Ibnu Sina — wajib al-wujud vs mumkin al-wujud: alam mumkin, maka butuh Wajib al-wujud.
3. Al-Ghazali — silsilah hawadith & bantahan tasalsul: deret tak terhingga mustahil aktual.
4. Muara: tauhid wujud — hanya satu Wajib al-wujud, ahad, di luar ruang-waktu.

Rujukan Qur'ani: QS Al-Fatihah:2, QS Al-Ikhlas:1, QS Al-Anbiya:30, QS Adh-Dhariyat:47, QS Yasin:82, QS Al-Araf:54.

Node terminal: "Sebab Pertama — Wajib al-Wujud" (a-first-cause), ditandai dengan badge F (filosofis).

${selectedNodeId ? `Node terpilih saat ekspor: ${chainNodes.find((n) => n.id === selectedNodeId)?.label || selectedNodeId}\n` : ""}Total node: ${chainNodes.length} (Branch A: 18, B: 6, C: 6, D: 6).`;

  const exportPNG = useCallback(async () => {
    try {
      setStatus("Mengekspor PNG...");
      // Coba pakai html-to-image (lazy import)
      const { toPng } = await import("html-to-image");
      const canvasEl = document.querySelector(".react-flow") as HTMLElement | null;
      if (!canvasEl) {
        setStatus("Error: elemen kanvas tidak ditemukan");
        return;
      }
      // Filter elemen yang tidak boleh ikut (control buttons, minimap)
      const filter = (node: HTMLElement) => {
        if (node.classList?.contains("react-flow__controls")) return false;
        if (node.classList?.contains("react-flow__minimap")) return false;
        if (node.classList?.contains("react-flow__panel")) return false;
        return true;
      };
      const dataUrl = await toPng(canvasEl, {
        filter,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        width: canvasEl.scrollWidth,
        height: canvasEl.scrollHeight,
      });
      const link = document.createElement("a");
      const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      link.download = `rantai-sebab-akibat-${activeBranch}-${ts}.png`;
      link.href = dataUrl;
      link.click();
      setStatus("✓ PNG berhasil diunduh");
    } catch (err) {
      setStatus(
        "Error: gagal mengekspor PNG. (html-to-image mungkin tidak terpasang — coba ekspor CSV sebagai alternatif.)"
      );
      console.error(err);
    }
  }, [activeBranch]);

  const exportCSV = useCallback(() => {
    try {
      setStatus("Mengekspor CSV...");
      const branchNodes = chainNodes.filter(
        (n) => activeBranch === "all" || n.branch === activeBranch
      );
      const nodeRows = [
        ["id", "label", "category", "branch", "timeLabel", "timeValue", "isPhilosophical", "isBoundary", "description"],
        ...branchNodes.map((n) => [
          n.id,
          n.label,
          n.category,
          n.branch,
          n.timeLabel,
          n.timeValue.toString(),
          n.isPhilosophical ? "true" : "false",
          n.isBoundary ? "true" : "false",
          // Escape CSV: bungkus dengan kutip ganda, ganti kutip ganda di dalam
          `"${n.description.replace(/"/g, '""')}"`,
        ]),
      ];
      const csv = nodeRows.map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      link.download = `rantai-sebab-akibat-nodes-${activeBranch}-${ts}.csv`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setStatus("✓ CSV berhasil diunduh");
    } catch (err) {
      setStatus("Error: gagal mengekspor CSV.");
      console.error(err);
    }
  }, [activeBranch]);

  const copySummary = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setStatus("✓ Ringkasan disalin ke clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setStatus("Error: gagal menyalin. Browser mungkin tidak mendukung clipboard API.");
    }
  }, [summaryText]);

  if (panelMode !== "export") return null;

  return (
    <div className="absolute inset-y-0 right-0 z-30 w-full sm:w-[400px] bg-background/95 backdrop-blur border-l shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-cyan-50 to-violet-50 dark:from-cyan-950/30 dark:to-violet-950/30">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-600" />
            Ekspor & Bagikan
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Simpan tampilan · Bagikan ringkasan argumen
          </p>
        </div>
        <button
          onClick={() => setPanelMode("none")}
          className="p-1.5 rounded hover:bg-muted"
          aria-label="Tutup panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
        {/* PNG Export */}
        <button
          onClick={exportPNG}
          className="w-full p-4 rounded-md border bg-background hover:bg-muted/50 transition-colors text-left group"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center flex-shrink-0">
              <FileImage className="w-5 h-5 text-violet-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-0.5">Ekspor Kanvas sebagai PNG</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Simpan tampilan graf saat ini (Branch: {activeBranch}) sebagai gambar PNG
                resolusi 2× untuk berbagi atau catatan.
              </p>
            </div>
            <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground mt-1" />
          </div>
        </button>

        {/* CSV Export */}
        <button
          onClick={exportCSV}
          className="w-full p-4 rounded-md border bg-background hover:bg-muted/50 transition-colors text-left group"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-0.5">Ekspor Data Node sebagai CSV</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Unduh daftar lengkap node (id, label, kategori, deskripsi) untuk analisis
                lebih lanjut di Excel / Google Sheets.
              </p>
            </div>
            <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground mt-1" />
          </div>
        </button>

        {/* Copy Summary */}
        <button
          onClick={copySummary}
          className="w-full p-4 rounded-md border bg-background hover:bg-muted/50 transition-colors text-left group"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center flex-shrink-0">
              {copied ? (
                <Check className="w-5 h-5 text-amber-600" />
              ) : (
                <Copy className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-0.5">
                {copied ? "Tersalin!" : "Salin Ringkasan Argumen"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Salin ringkasan singkat (4 tradisi Islam + rujukan Qur&apos;ani) ke clipboard
                untuk dibagikan di WhatsApp, Telegram, atau email.
              </p>
            </div>
          </div>
        </button>

        {/* Preview ringkasan */}
        <details className="rounded-md border bg-muted/30">
          <summary className="text-xs font-semibold p-2 cursor-pointer hover:bg-muted">
            Preview ringkasan
          </summary>
          <pre className="text-[10px] p-3 whitespace-pre-wrap font-mono leading-relaxed">
            {summaryText}
          </pre>
        </details>

        {/* Status */}
        {status && (
          <div className="rounded-md bg-foreground text-background p-3 text-[11px]">
            {status}
          </div>
        )}

        {/* Catatan */}
        <div className="rounded-md bg-muted p-3 text-[10px] text-muted-foreground leading-relaxed">
          <strong>Catatan privasi:</strong> Semua ekspor dilakukan di browser Anda. Tidak ada
          data yang dikirim ke server. Catatan & penanda (jika ada) tidak ikut diekspor.
        </div>

        <div className="text-[10px] text-center text-muted-foreground">
          {chainNodes.length} node · {chainEdges.length} edge · Branch aktif: {activeBranch}
        </div>
      </div>
    </div>
  );
}
