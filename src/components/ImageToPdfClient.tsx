"use client";
import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";

type PageSize = "A4" | "Letter" | "Fit";
type Orientation = "Portrait" | "Landscape" | "Auto";
type Margin = "None" | "Small" | "Medium";

type ImgItem = {
  id: string;
  file: File;
  preview: string;
};

function mmToPx(mm: number) {
  return (mm * 96) / 25.4;
}

const sizeMapMm: Record<Exclude<PageSize, "Fit">, { w: number; h: number }> = {
  A4: { w: 210, h: 297 },
  Letter: { w: 216, h: 279 },
};

const marginMapMm: Record<Margin, number> = {
  None: 0,
  Small: 5,
  Medium: 10,
};

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function toJPEGDataUrl(
  img: HTMLImageElement,
  quality: number,
  targetW?: number
): Promise<{ dataUrl: string; width: number; height: number }> {
  const naturalW = img.naturalWidth || img.width;
  const naturalH = img.naturalHeight || img.height;
  const w = targetW && targetW > 0 ? Math.min(targetW, naturalW) : naturalW;
  const h = Math.round((w / naturalW) * naturalH);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  ctx.drawImage(img, 0, 0, w, h);
  const dataUrl = canvas.toDataURL("image/jpeg", Math.min(Math.max(quality, 0.6), 1));
  return { dataUrl, width: w, height: h };
}

export default function ImageToPdfClient() {
  const [items, setItems] = useState<ImgItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("Fit");
  const [orientation, setOrientation] = useState<Orientation>("Auto");
  const [margin, setMargin] = useState<Margin>("Small");
  const [qualityPct, setQualityPct] = useState(95);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      items.forEach((i) => URL.revokeObjectURL(i.preview));
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [items, pdfUrl]);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const list: ImgItem[] = [];
    for (const f of Array.from(files)) {
      if (!/^image\/(jpeg|png|webp|jpg)$/i.test(f.type)) continue;
      const preview = URL.createObjectURL(f);
      list.push({ id: crypto.randomUUID(), file: f, preview });
    }
    setItems((prev) => [...prev, ...list]);
  };

  const onClearAll = () => {
    items.forEach((i) => URL.revokeObjectURL(i.preview));
    setItems([]);
    if (inputRef.current) inputRef.current.value = "";
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
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

  const generatePdf = async () => {
    if (items.length === 0 || generating) return;
    setGenerating(true);
    setProgress(0);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    try {
      let doc: jsPDF | null = null;
      const total = items.length;
      const marginPx = mmToPx(marginMapMm[margin]);
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const img = await loadImage(item.file);
        const autoLandscape = (img.naturalWidth || img.width) > (img.naturalHeight || img.height);
        const chosenOrientation =
          orientation === "Auto" ? (autoLandscape ? "l" : "p") : orientation === "Landscape" ? "l" : "p";

        let pageWpx: number;
        let pageHpx: number;
        if (pageSize === "Fit") {
          // Fit page to image size (preserve resolution); expand for margins
          const naturalW = img.naturalWidth || img.width;
          const naturalH = img.naturalHeight || img.height;
          pageWpx = naturalW + marginPx * 2;
          pageHpx = naturalH + marginPx * 2;
        } else {
          const s = sizeMapMm[pageSize];
          pageWpx = mmToPx(s.w);
          pageHpx = mmToPx(s.h);
          if (chosenOrientation === "l") {
            const t = pageWpx;
            pageWpx = pageHpx;
            pageHpx = t;
          }
        }

        const contentW = pageWpx - marginPx * 2;
        let dataUrl: string;
        let embedW: number;
        let embedH: number;
        if (pageSize === "Fit") {
          // Do not resize; embed at natural resolution
          const naturalW = img.naturalWidth || img.width;
          const naturalH = img.naturalHeight || img.height;
          const r = await toJPEGDataUrl(img, Math.max(qualityPct / 100, 0.92));
          dataUrl = r.dataUrl;
          embedW = naturalW;
          embedH = naturalH;
        } else {
          // Scale down to fit content width while preserving aspect; avoid upscaling
          const naturalW = img.naturalWidth || img.width;
          const naturalH = img.naturalHeight || img.height;
          const targetW = Math.min(contentW, naturalW);
          const r = await toJPEGDataUrl(img, Math.max(qualityPct / 100, 0.92), targetW);
          dataUrl = r.dataUrl;
          embedW = targetW;
          embedH = Math.round((targetW / naturalW) * naturalH);
        }

        if (!doc) {
          // For Fit, pass format with pixel dimensions and omit orientation to avoid swapping
          doc =
            pageSize === "Fit"
              ? new jsPDF({ unit: "px", format: [pageWpx, pageHpx] })
              : new jsPDF({ unit: "px", format: [pageWpx, pageHpx], orientation: chosenOrientation });
        } else {
          pageSize === "Fit"
            ? doc.addPage([pageWpx, pageHpx])
            : doc.addPage([pageWpx, pageHpx], chosenOrientation);
        }
        doc.addImage(dataUrl, "JPEG", marginPx, marginPx, embedW, embedH);
        setProgress(Math.round(((i + 1) / total) * 100));
        await new Promise((r) => setTimeout(r, 10));
      }
      if (!doc) throw new Error("No document created");
      const out = doc.output("blob");
      const url = URL.createObjectURL(out);
      setPdfUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

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

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium">Page size</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PageSize)}
              className="mt-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
              <option value="Fit">Fit to image</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Orientation</label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as Orientation)}
              className="mt-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
            >
              <option value="Portrait">Portrait</option>
              <option value="Landscape">Landscape</option>
              <option value="Auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Margin</label>
            <select
              value={margin}
              onChange={(e) => setMargin(e.target.value as Margin)}
              className="mt-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
            >
              <option value="None">None</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Image quality</label>
            <input
              type="range"
              min={60}
              max={100}
              value={qualityPct}
              onChange={(e) => setQualityPct(parseInt(e.target.value, 10))}
              className="mt-2 w-full"
            />
            <div className="text-xs mt-1">{qualityPct}% — Higher quality PDFs may be larger in size.</div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={generatePdf}
            disabled={items.length === 0 || generating}
            className={`rounded-lg px-5 py-3 font-medium ${items.length > 0 && !generating ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-neutral-200 text-neutral-500"}`}
          >
            {generating ? "Generating..." : "Generate PDF"}
          </button>
          {pdfUrl && (
            <a
              href={pdfUrl}
              download="images.pdf"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-3 font-medium"
            >
              Download PDF
            </a>
          )}
        </div>

        {generating && (
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

      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4"
              draggable
              onDragStart={() => onDragStart(index)}
              onDragOver={onDragOver}
              onDrop={() => onDrop(index)}
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800">
                <img src={item.preview} alt="preview" className="w-full h-full object-contain" />
              </div>
              <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                {item.file.name} — {(item.file.size / 1024).toFixed(1)} KB
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
