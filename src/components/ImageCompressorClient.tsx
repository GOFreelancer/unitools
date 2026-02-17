"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import JSZip from "jszip";

type OutputFormat = "original" | "image/jpeg" | "image/png" | "image/webp";

type Item = {
  id: string;
  file: File;
  preview: string;
};

type Result = {
  id: string;
  blob: Blob;
  url: string;
  originalSize: number;
  compressedSize: number;
  reducedPercent: number;
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function compressImage(
  file: File,
  qualityPct: number,
  format: OutputFormat,
  resizeWidth?: number
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const originalType = file.type as OutputFormat;
  const targetType = format === "original" ? originalType : format;
  const quality = Math.min(Math.max(qualityPct, 10), 100) / 100;

  const naturalW = img.naturalWidth || img.width;
  const naturalH = img.naturalHeight || img.height;
  const targetW =
    resizeWidth && resizeWidth > 0 ? Math.min(resizeWidth, naturalW) : naturalW;
  const targetH = Math.round((targetW / naturalW) * naturalH);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const supportsQuality = targetType === "image/jpeg" || targetType === "image/webp";

  return new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (b) => resolve(b || new Blob([], { type: targetType })),
      targetType,
      supportsQuality ? quality : undefined
    );
  });
}

export default function ImageCompressorClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>("original");
  const [resizeWidth, setResizeWidth] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      items.forEach((i) => URL.revokeObjectURL(i.preview));
      results.forEach((r) => URL.revokeObjectURL(r.url));
    };
  }, [items, results]);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const list: Item[] = [];
    for (const f of Array.from(files)) {
      if (!/^image\/(jpeg|png|webp|jpg)$/i.test(f.type)) continue;
      const preview = URL.createObjectURL(f);
      list.push({ id: crypto.randomUUID(), file: f, preview });
    }
    setItems((prev) => [...prev, ...list]);
  };

  const onClearAll = () => {
    setItems([]);
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const compressAll = async () => {
    const widthNum = resizeWidth ? parseInt(resizeWidth, 10) : undefined;
    const out: Result[] = [];
    for (const item of items) {
      const blob = await compressImage(item.file, quality, format, widthNum);
      const url = URL.createObjectURL(blob);
      const originalSize = item.file.size;
      const compressedSize = blob.size;
      const reducedPercent =
        originalSize > 0
          ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
          : 0;
      out.push({
        id: item.id,
        blob,
        url,
        originalSize,
        compressedSize,
        reducedPercent,
      });
    }
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults(out);
  };

  const downloadAllZip = async () => {
    if (results.length === 0) return;
    const zip = new JSZip();
    for (const r of results) {
      const ext =
        (r.blob.type || "image").split("/")[1]?.replace("jpeg", "jpg") || "png";
      const arrBuf = await r.blob.arrayBuffer();
      zip.file(`compressed-${r.id}.${ext}`, arrBuf);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compressed.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasItems = items.length > 0;
  const hasResults = results.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => onFiles(e.target.files)}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 outline-none"
            />
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              Files never leave your device.
            </p>
          </div>
          <button
            onClick={onClearAll}
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-3 font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Quality</label>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value, 10))}
              className="mt-2 w-full"
            />
            <div className="text-xs mt-1">{quality}%</div>
          </div>
          <div>
            <label className="block text-sm font-medium">Output format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as OutputFormat)}
              className="mt-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
            >
              <option value="original">Keep original</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WEBP</option>
            </select>
            <div className="text-xs mt-1 text-neutral-600 dark:text-neutral-400">
              Quality applies to JPG/WEBP.
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Resize width (px)</label>
            <input
              type="number"
              min={1}
              placeholder="Keep original"
              value={resizeWidth}
              onChange={(e) => setResizeWidth(e.target.value)}
              className="mt-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={compressAll}
            disabled={!hasItems}
            className={`rounded-lg px-5 py-3 font-medium ${hasItems ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-neutral-200 text-neutral-500"}`}
          >
            Compress All
          </button>
          <button
            onClick={downloadAllZip}
            disabled={!hasResults}
            className={`rounded-lg px-5 py-3 font-medium ${hasResults ? "border border-neutral-300 dark:border-neutral-700" : "bg-neutral-200 text-neutral-500"}`}
          >
            Download All (ZIP)
          </button>
        </div>
      </div>

      {hasItems && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const res = results.find((r) => r.id === item.id);
            return (
              <div
                key={item.id}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4"
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800">
                  <img
                    src={item.preview}
                    alt="preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-3 text-sm">
                  <div>Original: {formatBytes(item.file.size)}</div>
                  {res && (
                    <div className="mt-1">
                      <div>Compressed: {formatBytes(res.compressedSize)}</div>
                      <div>Reduced: {res.reducedPercent}%</div>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={async () => {
                      const widthNum = resizeWidth ? parseInt(resizeWidth, 10) : undefined;
                      const blob = await compressImage(item.file, quality, format, widthNum);
                      const url = URL.createObjectURL(blob);
                      const originalSize = item.file.size;
                      const compressedSize = blob.size;
                      const reducedPercent =
                        originalSize > 0
                          ? Math.max(
                              0,
                              Math.round(((originalSize - compressedSize) / originalSize) * 100)
                            )
                          : 0;
                      setResults((prev) => {
                        prev.forEach((p) => {
                          if (p.id === item.id) URL.revokeObjectURL(p.url);
                        });
                        const filtered = prev.filter((p) => p.id !== item.id);
                        return [
                          ...filtered,
                          { id: item.id, blob, url, originalSize, compressedSize, reducedPercent },
                        ];
                      });
                    }}
                    className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
                  >
                    Compress
                  </button>
                  {res && (
                    <a
                      href={res.url}
                      download={`compressed-${item.file.name}`}
                      className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
