"use client";
import { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

type Item = {
  id: string;
  file: File;
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export default function PDFMergeClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [merging, setMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    };
  }, [mergedUrl]);

  const validatePdf = (file: File) => {
    const typeOk = file.type === "application/pdf";
    const nameOk = /\.pdf$/i.test(file.name);
    return typeOk || nameOk;
  };

  const onFiles = (files: FileList | null) => {
    setError(null);
    if (!files) return;
    const list: Item[] = [];
    for (const f of Array.from(files)) {
      if (!validatePdf(f)) {
        setError(`Unsupported file: ${f.name}. Please upload PDF files only.`);
        continue;
      }
      list.push({ id: crypto.randomUUID(), file: f });
    }
    setItems((prev) => [...prev, ...list]);
  };

  const onClearAll = () => {
    setItems([]);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    if (mergedUrl) {
      URL.revokeObjectURL(mergedUrl);
      setMergedUrl(null);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setItems((prev) => {
      const arr = prev.slice();
      const t = arr[index - 1];
      arr[index - 1] = arr[index];
      arr[index] = t;
      return arr;
    });
  };

  const moveDown = (index: number) => {
    if (index >= items.length - 1) return;
    setItems((prev) => {
      const arr = prev.slice();
      const t = arr[index + 1];
      arr[index + 1] = arr[index];
      arr[index] = t;
      return arr;
    });
  };

  const onDragStart = (index: number) => {
    dragIndex.current = index;
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const onDrop = (index: number) => {
    if (dragIndex.current === null) return;
    const from = dragIndex.current;
    const to = index;
    if (from === to) return;
    setItems((prev) => {
      const arr = prev.slice();
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
    dragIndex.current = null;
  };

  const mergePdfs = async () => {
    setError(null);
    if (items.length === 0 || merging) return;
    setMerging(true);
    setProgress(0);
    if (mergedUrl) {
      URL.revokeObjectURL(mergedUrl);
      setMergedUrl(null);
    }
    try {
      const merged = await PDFDocument.create();
      const total = items.length;
      for (let i = 0; i < items.length; i++) {
        const file = items[i].file;
        const bytes = await file.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
        setProgress(Math.round(((i + 1) / total) * 100));
        await new Promise((r) => setTimeout(r, 10));
      }
      const out = await merged.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setMergedUrl(url);
    } catch (e: unknown) {
      setError("Failed to merge PDFs. Please check the files and try again.");
      console.error(e);
    } finally {
      setMerging(false);
    }
  };

  const hasItems = items.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="application/pdf"
              onChange={(e) => onFiles(e.target.files)}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 outline-none"
            />
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              Files never leave your device.
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          <button
            onClick={onClearAll}
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-3 font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="mt-6">
          {hasItems ? (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-900"
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(index)}
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.file.name}</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      {formatBytes(item.file.size)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveUp(index)}
                      className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-xs"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-xs"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-md bg-red-600 text-white px-2 py-1 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              No PDFs added yet.
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={mergePdfs}
            disabled={!hasItems || merging}
            className={`rounded-lg px-5 py-3 font-medium ${hasItems && !merging ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-neutral-200 text-neutral-500"}`}
          >
            {merging ? "Merging..." : "Merge PDFs"}
          </button>
          {mergedUrl && (
            <a
              href={mergedUrl}
              download="merged.pdf"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-3 font-medium"
            >
              Download Merged PDF
            </a>
          )}
        </div>

        {merging && (
          <div className="mt-4">
            <div className="h-2 w-full rounded bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{progress}%</div>
          </div>
        )}
      </div>
    </div>
  );
}
