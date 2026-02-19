"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

import { PDFDocument, rgb, StandardFonts, LineCapStyle } from "pdf-lib";

interface PathModification {
  id: string;
  type: "path";
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

interface TextModification {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface ImageModification {
  id: string;
  type: "image";
  dataUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

type Modification = PathModification | TextModification | ImageModification;

type Tool = "move" | "draw" | "erase" | "text" | "image" | "select";

export default function PDFEditorClient() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  // Removed unused pdfDoc state
  const [pages, setPages] = useState<pdfjsLib.PDFPageProxy[]>([]); // PDFPageProxy[]
  const [scale] = useState(2); // Fixed scale for now
  const [tool, setTool] = useState<Tool>("move");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [textSize, setTextSize] = useState(16);
  const [modifications, setModifications] = useState<Record<number, Modification[]>>({});
  const [history, setHistory] = useState<Record<number, Modification[]>[]>([]);
  const [historyStep, setHistoryStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Refs for drawing state
  const isDrawing = useRef(false);
  const currentPath = useRef<{ x: number; y: number }[]>([]);
  const overlayRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Refs for dragging/resizing
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const elementStart = useRef<{ x: number; y: number; w?: number; h?: number } | null>(null);
  const resizingHandle = useRef<string | null>(null);

  // Load PDF
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const doc = await loadingTask.promise;
      setPdfFile(file);

      const loadedPages = [];
      for (let i = 1; i <= doc.numPages; i++) {
        loadedPages.push(await doc.getPage(i));
      }
      setPages(loadedPages);
      setModifications({});
      setHistory([{}]);
      setHistoryStep(0);
    } catch (err) {
      console.error("Error loading PDF:", err);
      alert("Error loading PDF. Please try another file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const drawModifications = useCallback((pageIndex: number) => {
    const overlay = overlayRefs.current[pageIndex];
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    // Clear overlay
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const pageMods = modifications[pageIndex] || [];
    pageMods.forEach((mod) => {
      if (mod.type === "path") {
        ctx.beginPath();
        if (mod.color === "erase") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.strokeStyle = "rgba(0,0,0,1)";
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = mod.color;
        }
        ctx.lineWidth = mod.width * scale; // Scale width
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        if (mod.points.length > 0) {
          ctx.moveTo(mod.points[0].x * scale, mod.points[0].y * scale);
          for (let i = 1; i < mod.points.length; i++) {
            ctx.lineTo(mod.points[i].x * scale, mod.points[i].y * scale);
          }
        }
        ctx.stroke();
        // Reset composite operation
        ctx.globalCompositeOperation = "source-over";
      }
    });
  }, [modifications, scale]);

  // Render pages
  useEffect(() => {
    if (!pages.length) return;

    pages.forEach((page, index) => {
      const viewport = page.getViewport({ scale });
      const canvas = document.getElementById(`pdf-render-${index}`) as HTMLCanvasElement;
      const context = canvas?.getContext("2d");
      
      if (canvas && context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvasRef.current, // Add the canvas element here
        };
        page.render(renderContext);
      }

      // Resize overlay canvas matches render canvas
      const overlay = overlayRefs.current[index];
      if (overlay) {
        overlay.height = viewport.height;
        overlay.width = viewport.width;
        drawModifications(index);
      }
    });
  }, [pages, scale, drawModifications]);

  // Redraw modifications when they change
  useEffect(() => {
    Object.keys(modifications).forEach((key) => {
      drawModifications(parseInt(key));
    });
  }, [modifications, scale, drawModifications]);

  const addModification = (pageIndex: number, mod: Modification) => {
    const newMods = { ...modifications };
    if (!newMods[pageIndex]) newMods[pageIndex] = [];
    newMods[pageIndex] = [...newMods[pageIndex], mod];
    
    // Update history
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newMods);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    
    setModifications(newMods);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const prevMods = history[historyStep - 1];
      setModifications(prevMods);
      setHistoryStep(historyStep - 1);
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all changes?")) {
        const emptyMods = {};
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(emptyMods);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
        setModifications(emptyMods);
    }
  };

  // Mouse Handlers
  const getCoords = (e: React.MouseEvent, pageIndex: number) => {
    const overlay = overlayRefs.current[pageIndex];
    if (!overlay) return { x: 0, y: 0 };
    const rect = overlay.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const handleMouseDown = (e: React.MouseEvent, pageIndex: number) => {
    if (tool === "draw" || tool === "erase") {
      isDrawing.current = true;
      const { x, y } = getCoords(e, pageIndex);
      currentPath.current = [{ x, y }];
      
      const overlay = overlayRefs.current[pageIndex];
      const ctx = overlay?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        if (tool === "erase") {
          ctx.globalCompositeOperation = "destination-out";
          ctx.strokeStyle = "rgba(0,0,0,1)"; // color doesn't matter for erase
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = color;
        }
        ctx.lineWidth = brushSize * scale;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(x * scale, y * scale);
        ctx.stroke();
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent, pageIndex: number) => {
    if (!isDrawing.current) return;
    if (tool !== "draw" && tool !== "erase") return;

    const { x, y } = getCoords(e, pageIndex);
    currentPath.current.push({ x, y });

    // Live preview
    const overlay = overlayRefs.current[pageIndex];
    const ctx = overlay?.getContext("2d");
    if (ctx) {
      if (tool === "erase") {
         ctx.globalCompositeOperation = "destination-out";
         ctx.strokeStyle = "rgba(0,0,0,1)";
      } else {
         ctx.globalCompositeOperation = "source-over";
         ctx.strokeStyle = color;
      }
      ctx.lineWidth = brushSize * scale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const len = currentPath.current.length;
      if (len >= 2) {
        const p1 = currentPath.current[len - 2];
        const p2 = currentPath.current[len - 1];
        ctx.beginPath();
        ctx.moveTo(p1.x * scale, p1.y * scale);
        ctx.lineTo(p2.x * scale, p2.y * scale);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent, pageIndex: number) => {
    if (isDrawing.current && (tool === "draw" || tool === "erase")) {
      isDrawing.current = false;
      addModification(pageIndex, {
        id: Math.random().toString(36).substr(2, 9),
        type: "path",
        points: [...currentPath.current],
        color: tool === "erase" ? "erase" : color,
        width: brushSize,
      });
      currentPath.current = [];
      
      // Reset composite operation
      const overlay = overlayRefs.current[pageIndex];
      const ctx = overlay?.getContext("2d");
      if (ctx) {
        ctx.globalCompositeOperation = "source-over";
      }
    }
  };

  const handleClick = async (e: React.MouseEvent, pageIndex: number) => {
    if (tool === "text") {
      const { x, y } = getCoords(e, pageIndex);
      const text = prompt("Enter text:");
      if (text) {
        addModification(pageIndex, {
          id: Math.random().toString(36).substr(2, 9),
          type: "text",
          text,
          x,
          y,
          size: textSize,
          color: color,
        });
      }
    } else if (tool === "image") {
      // Trigger file input
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (ev) => {
        const file = (ev.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (readerEvent) => {
            const dataUrl = readerEvent.target?.result as string;
            const img = new Image();
            img.onload = () => {
                // Default width 100, maintain aspect ratio
                const width = 100;
                const height = (img.height / img.width) * width;
                const { x, y } = getCoords(e, pageIndex);
                addModification(pageIndex, {
                    id: Math.random().toString(36).substr(2, 9),
                    type: "image",
                    dataUrl,
                    x,
                    y,
                    width,
                    height,
                });
            };
            img.src = dataUrl;
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  // Dragging handlers
  const handleElementMouseDown = (e: React.MouseEvent, pageIndex: number, modId: string, handle?: string) => {
    e.stopPropagation();
    if (tool !== "move") return;

    setSelectedId(modId);
    dragStart.current = { x: e.clientX, y: e.clientY };
    resizingHandle.current = handle || null;
    
    const mod = modifications[pageIndex]?.find(m => m.id === modId);
    if (mod) {
        if (mod.type === "text") {
             elementStart.current = { x: mod.x, y: mod.y, w: mod.size };
        } else if (mod.type === "image") {
             elementStart.current = { x: mod.x, y: mod.y, w: mod.width, h: mod.height };
        }
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!dragStart.current || !elementStart.current || !selectedId) return;
        
        const dx = (e.clientX - dragStart.current.x) / scale;
        const dy = (e.clientY - dragStart.current.y) / scale;
        
        const startX = elementStart.current.x;
        const startY = elementStart.current.y;
        const startW = elementStart.current.w || 0;
        const startH = elementStart.current.h || 0;
        const isResizing = resizingHandle.current;

        setModifications(prevMods => {
             // Find mod in prevMods
            let pageIndex = -1;
            let modIndex = -1;
            for (const [pIdx, mods] of Object.entries(prevMods)) {
                const idx = mods.findIndex(m => m.id === selectedId);
                if (idx !== -1) {
                    pageIndex = parseInt(pIdx);
                    modIndex = idx;
                    break;
                }
            }
            if (pageIndex === -1) return prevMods;

            const newPageMods = [...prevMods[pageIndex]];
            const mod = newPageMods[modIndex];

            if (isResizing) {
                 if (mod.type === "image") {
                     const newWidth = Math.max(20, startW + dx);
                     const ratio = startW / startH;
                     const newHeight = newWidth / ratio;
                     (mod as ImageModification).width = newWidth;
                     (mod as ImageModification).height = newHeight;
                 } else if (mod.type === "text") {
                     const newSize = Math.max(8, startW + dx);
                     (mod as TextModification).size = newSize;
                 }
            } else {
                if (mod.type === "text" || mod.type === "image") {
                    (mod as TextModification | ImageModification).x = startX + dx;
                    (mod as TextModification | ImageModification).y = startY + dy;
                }
            }
            
            newPageMods[modIndex] = mod;
            return { ...prevMods, [pageIndex]: newPageMods };
        });
    };

    const handleGlobalMouseUp = () => {
        if (dragStart.current) {
            dragStart.current = null;
            elementStart.current = null;
            resizingHandle.current = null;
        }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [scale, selectedId]);

  // Export
  const handleDownload = async () => {
    if (!pdfFile) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      const pages = pdfDoc.getPages();
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { height } = page.getSize();
        const pageMods = modifications[i] || [];
        // Draw text/images first, then paths (to match UI layers)
        const textImageMods = pageMods.filter(m => m.type === "text" || m.type === "image");
        const pathMods = pageMods.filter(m => m.type === "path");
        const orderedMods = [...textImageMods, ...pathMods];

        for (const mod of orderedMods) {
          if (mod.type === "path") {
            const pathData = mod.points.map(p => ({ x: p.x, y: height - p.y })); // PDF coordinates are bottom-left origin
            // Draw lines
            if (pathData.length > 1) {
                for (let j = 0; j < pathData.length - 1; j++) {
                    page.drawLine({
                        start: pathData[j],
                        end: pathData[j+1],
                        thickness: mod.width,
                        color: hexToRgb(mod.color),
                        opacity: 1,
                        lineCap: LineCapStyle.Round,
                    });
                }
            }
          } else if (mod.type === "text") {
            page.drawText(mod.text, {
                x: mod.x,
                y: height - mod.y - mod.size, // Adjust for top-left anchor simulation
                size: mod.size,
                font: helveticaFont,
                color: hexToRgb(mod.color),
            });
          } else if (mod.type === "image") {
            // Embed image
            let image;
            if (mod.dataUrl.startsWith("data:image/png")) {
                image = await pdfDoc.embedPng(mod.dataUrl);
            } else {
                image = await pdfDoc.embedJpg(mod.dataUrl);
            }
            page.drawImage(image, {
                x: mod.x,
                y: height - mod.y - mod.height, // Invert Y and adjust for anchor (top-left vs bottom-left)
                width: mod.width,
                height: mod.height,
            });
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "edited-document.pdf";
      link.click();
    } catch (err) {
        console.error("Export error:", err);
        alert("Failed to export PDF.");
    } finally {
        setIsProcessing(false);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? rgb(
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255
        )
      : rgb(0, 0, 0);
  };

  if (!pdfFile) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Upload a PDF</h3>
          <p className="mt-1 text-sm text-neutral-500">Drag and drop or click to select</p>
          <div className="mt-6">
            <label className="cursor-pointer rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Select File
              <input type="file" className="sr-only" accept="application/pdf" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-[80vh]">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm rounded-t-xl">
        <div className="flex items-center gap-2 border-r border-neutral-300 dark:border-neutral-700 pr-4">
            <button
                onClick={() => setTool("move")}
                className={`p-2 rounded ${tool === "move" ? "bg-blue-100 dark:bg-blue-900 text-blue-600" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
                title="Move / Scroll"
            >
                ✋
            </button>
            <button
                onClick={() => setTool("draw")}
                className={`p-2 rounded ${tool === "draw" ? "bg-blue-100 dark:bg-blue-900 text-blue-600" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
                title="Draw"
            >
                ✏️
            </button>
            <button
                onClick={() => setTool("erase")}
                className={`p-2 rounded ${tool === "erase" ? "bg-blue-100 dark:bg-blue-900 text-blue-600" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
                title="Erase"
            >
                🧹
            </button>
            <button
                onClick={() => setTool("text")}
                className={`p-2 rounded ${tool === "text" ? "bg-blue-100 dark:bg-blue-900 text-blue-600" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
                title="Add Text"
            >
                T
            </button>
            <button
                onClick={() => setTool("image")}
                className={`p-2 rounded ${tool === "image" ? "bg-blue-100 dark:bg-blue-900 text-blue-600" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
                title="Add Image"
            >
                🖼️
            </button>
        </div>

        <div className="flex items-center gap-2 border-r border-neutral-300 dark:border-neutral-700 pr-4">
            <input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer"
                title="Color"
            />
            {tool === "text" ? (
                <select 
                    value={textSize} 
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    className="p-1 rounded border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
                >
                    <option value={12}>12px</option>
                    <option value={16}>16px</option>
                    <option value={20}>20px</option>
                    <option value={24}>24px</option>
                    <option value={32}>32px</option>
                </select>
            ) : (
                <select 
                    value={brushSize} 
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="p-1 rounded border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
                >
                    <option value={2}>Thin</option>
                    <option value={5}>Medium</option>
                    <option value={10}>Thick</option>
                    <option value={20}>Marker</option>
                </select>
            )}
        </div>

        <div className="flex items-center gap-2">
            <button
                onClick={handleUndo}
                disabled={historyStep <= 0}
                className="px-3 py-1 text-sm rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
            >
                Undo
            </button>
            <button
                onClick={handleClear}
                className="px-3 py-1 text-sm rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-red-600"
            >
                Clear
            </button>
            <button
                onClick={handleDownload}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
                {isProcessing ? "Processing..." : "Download PDF"}
            </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-950 p-4 sm:p-8">
        <div className="flex flex-col items-center gap-4">
            {pages.map((page, index) => (
                <div key={index} className="relative shadow-lg">
                    {/* Background PDF Render */}
                    <canvas 
                        id={`pdf-render-${index}`} 
                        className="block bg-white"
                        ref={canvasRef}
                    />
                    {/* Objects Overlay */}
                    <div className="absolute top-0 left-0 z-10 w-full h-full pointer-events-none">
                         {modifications[index]?.map((mod) => {
                             if (mod.type === "path") return null;
                             const isSelected = selectedId === mod.id;
                             
                             return (
                                 <div
                                     key={mod.id}
                                     onMouseDown={(e) => handleElementMouseDown(e, index, mod.id)}
                                     className={`absolute group ${tool === "move" ? "pointer-events-auto cursor-move" : ""} ${isSelected ? "ring-2 ring-blue-500 border border-blue-500" : ""}`}
                                     style={{
                                         left: mod.x * scale,
                                         top: mod.y * scale,
                                         width: mod.type === "image" ? mod.width * scale : "auto",
                                         height: mod.type === "image" ? mod.height * scale : "auto",
                                     }}
                                 >
                                     {mod.type === "text" && (
                                         <div 
                                             style={{ 
                                                 fontSize: mod.size * scale, 
                                                 color: mod.color,
                                                 lineHeight: 1,
                                                 whiteSpace: "pre",
                                                 userSelect: "none"
                                             }}
                                         >
                                             {mod.text}
                                         </div>
                                     )}
                                     {mod.type === "image" && (
                                         <img 
                                             src={mod.dataUrl} 
                                             alt="" 
                                             className={`w-full h-full object-contain ${tool === "move" ? "cursor-grab" : ""}`} 
                                             draggable={false}
                                         />
                                     )}
                                     
                                     {/* Controls (only when selected and in move mode) */}
                                     {isSelected && tool === "move" && (
                                         <>
                                            {/* Delete Button */}
                                            <button
                                                 className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-sm z-50 pointer-events-auto"
                                                 onMouseDown={(e) => {
                                                     e.stopPropagation();
                                                     const newMods = {...modifications};
                                                     newMods[index] = newMods[index].filter(m => m.id !== mod.id);
                                                     setModifications(newMods);
                                                     setSelectedId(null);
                                                 }}
                                                 title="Delete"
                                             >
                                                 ×
                                             </button>
                                             
                                             {/* Resize Handle (Bottom Right) */}
                                             <div 
                                                 className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize pointer-events-auto z-50 shadow-sm"
                                                 onMouseDown={(e) => handleElementMouseDown(e, index, mod.id, "se")}
                                             />
                                         </>
                                     )}
                                 </div>
                             );
                         })}
                    </div>

                    {/* Drawing Overlay */}
                    <canvas
                        ref={(el) => { overlayRefs.current[index] = el; }}
                        className={`absolute top-0 left-0 z-20 ${tool === "move" ? "pointer-events-none" : "cursor-crosshair"}`}
                        onMouseDown={(e) => handleMouseDown(e, index)}
                        onMouseMove={(e) => handleMouseMove(e, index)}
                        onMouseUp={(e) => handleMouseUp(e, index)}
                        onMouseLeave={(e) => handleMouseUp(e, index)}
                        onClick={(e) => handleClick(e, index)}
                    />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
