"use client";

/**
 * BookmarksPanel.tsx — Iterasi 4: Penanda & Catatan Pribadi.
 *
 * Memungkinkan pembaca:
 *   - Menandai node favorit / penting (bookmark)
 *   - Menambah catatan pribadi per node
 *   - Lompat kembali ke node yang ditandai
 *
 * Persistensi: localStorage (key: "rsk-bookmarks", "rsk-notes")
 * Tidak ada backend — privat per perangkat.
 */

import { useFlowStore } from "@/store/flow-store";
import { chainNodes } from "@/data/chain-nodes";
import { useEffect, useState } from "react";
import { X, Bookmark, Trash2, ArrowUpRight, StickyNote, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const BM_KEY = "rsk-bookmarks";
const NOTE_KEY = "rsk-notes";

interface BookmarkState {
  bookmarks: Set<string>;
  notes: Record<string, string>;
}

function loadBookmarks(): Set<string> {
  try {
    const raw = localStorage.getItem(BM_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function loadNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(NOTE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveBookmarks(s: Set<string>) {
  localStorage.setItem(BM_KEY, JSON.stringify(Array.from(s)));
}

function saveNotes(n: Record<string, string>) {
  localStorage.setItem(NOTE_KEY, JSON.stringify(n));
}

export function BookmarksPanel() {
  const panelMode = useFlowStore((s) => s.panelMode);
  const setPanelMode = useFlowStore((s) => s.setPanelMode);
  const setSelectedNode = useFlowStore((s) => s.setSelectedNode);
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);

  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBookmarks(loadBookmarks());
    setNotes(loadNotes());
    setHydrated(true);
  }, []);

  // Update ketika selectedNode berubah — auto-buka editor note untuknya
  useEffect(() => {
    if (selectedNodeId && panelMode === "bookmarks") {
      setActiveNoteId(selectedNodeId);
      setNoteDraft(notes[selectedNodeId] || "");
    }
  }, [selectedNodeId, panelMode, notes]);

  if (panelMode !== "bookmarks") return null;

  const toggleBookmark = (nodeId: string) => {
    const next = new Set(bookmarks);
    if (next.has(nodeId)) {
      next.delete(nodeId);
    } else {
      next.add(nodeId);
      // Auto-pilih untuk catatan
      setActiveNoteId(nodeId);
      setNoteDraft(notes[nodeId] || "");
    }
    setBookmarks(next);
    saveBookmarks(next);
  };

  const saveNote = (nodeId: string) => {
    const next = { ...notes };
    if (noteDraft.trim()) {
      next[nodeId] = noteDraft.trim();
    } else {
      delete next[nodeId];
    }
    setNotes(next);
    saveNotes(next);
  };

  const deleteNote = (nodeId: string) => {
    const next = { ...notes };
    delete next[nodeId];
    setNotes(next);
    saveNotes(next);
    if (activeNoteId === nodeId) {
      setNoteDraft("");
    }
  };

  const handleJumpToNode = (nodeId: string) => {
    setSelectedNode(nodeId);
  };

  const bookmarkedList = chainNodes.filter((n) => bookmarks.has(n.id));
  const nodesWithNotes = chainNodes.filter((n) => notes[n.id]);

  if (!hydrated) return null;

  return (
    <div className="absolute inset-y-0 right-0 z-30 w-full sm:w-[440px] bg-background/95 backdrop-blur border-l shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-600" />
            Penanda & Catatan
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {bookmarkedList.length} ditandai · {nodesWithNotes.length} dengan catatan · Disimpan lokal
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

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-4">
          {/* Bookmark toggle untuk node terpilih */}
          {selectedNodeId && (
            <div className="rounded-md bg-muted p-3 space-y-2">
              <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
                Node terpilih
              </p>
              <p className="text-xs font-semibold">
                {chainNodes.find((n) => n.id === selectedNodeId)?.label || selectedNodeId}
              </p>
              <button
                onClick={() => toggleBookmark(selectedNodeId)}
                className={cn(
                  "w-full text-xs px-3 py-1.5 rounded-md border transition-colors flex items-center justify-center gap-1.5",
                  bookmarks.has(selectedNodeId)
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-background hover:bg-muted border-border"
                )}
              >
                <Bookmark className={cn("w-3.5 h-3.5", bookmarks.has(selectedNodeId) && "fill-current")} />
                {bookmarks.has(selectedNodeId) ? "Hapus tanda" : "Tandai node ini"}
              </button>
            </div>
          )}

          {/* Editor catatan untuk node aktif */}
          {activeNoteId && (
            <div className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] uppercase tracking-wide font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                  <StickyNote className="w-3 h-3" />
                  Catatan untuk: {chainNodes.find((n) => n.id === activeNoteId)?.label?.slice(0, 30) || activeNoteId}
                </p>
                {notes[activeNoteId] && (
                  <button
                    onClick={() => deleteNote(activeNoteId)}
                    className="text-[10px] text-muted-foreground hover:text-red-500 flex items-center gap-0.5"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                )}
              </div>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Tulis refleksi pribadi, pertanyaan, atau pengingat…"
                className="w-full min-h-[80px] text-xs p-2 rounded-md border bg-background resize-y focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <button
                onClick={() => saveNote(activeNoteId)}
                className="w-full text-xs px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan catatan
              </button>
            </div>
          )}

          {/* Daftar node yang ditandai */}
          <div>
            <h4 className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground mb-2">
              Ditandai ({bookmarkedList.length})
            </h4>
            {bookmarkedList.length === 0 ? (
              <p className="text-[11px] text-muted-foreground italic">
                Belum ada node yang ditandai. Klik node di kanvas, lalu "Tandai node ini".
              </p>
            ) : (
              <ul className="space-y-1">
                {bookmarkedList.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-center gap-2 text-xs p-2 rounded-md border hover:bg-muted/50 group"
                  >
                    <Bookmark className="w-3 h-3 fill-amber-400 text-amber-500 flex-shrink-0" />
                    <button
                      onClick={() => handleJumpToNode(n.id)}
                      className="flex-1 text-left hover:underline truncate"
                    >
                      {n.label}
                    </button>
                    {notes[n.id] && (
                      <StickyNote className="w-3 h-3 text-amber-600 flex-shrink-0" />
                    )}
                    <button
                      onClick={() => toggleBookmark(n.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500"
                      aria-label="Hapus tanda"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Daftar catatan */}
          <div>
            <h4 className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground mb-2">
              Catatan ({nodesWithNotes.length})
            </h4>
            {nodesWithNotes.length === 0 ? (
              <p className="text-[11px] text-muted-foreground italic">
                Belum ada catatan. Pilih node yang ditandai untuk menulis catatan.
              </p>
            ) : (
              <ul className="space-y-2">
                {nodesWithNotes.map((n) => (
                  <li
                    key={n.id}
                    className="text-xs p-2 rounded-md border bg-amber-50/50 dark:bg-amber-950/10"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <button
                        onClick={() => handleJumpToNode(n.id)}
                        className="font-semibold hover:underline truncate flex items-center gap-1"
                      >
                        {n.label}
                        <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic line-clamp-3">
                      {notes[n.id]}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Reset all */}
          {(bookmarkedList.length > 0 || nodesWithNotes.length > 0) && (
            <button
              onClick={() => {
                if (!confirm("Hapus semua penanda dan catatan?")) return;
                setBookmarks(new Set());
                setNotes({});
                saveBookmarks(new Set());
                saveNotes({});
                setActiveNoteId(null);
                setNoteDraft("");
              }}
              className="w-full text-[10px] text-muted-foreground hover:text-red-500 border-t pt-3"
            >
              Hapus semua penanda & catatan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
