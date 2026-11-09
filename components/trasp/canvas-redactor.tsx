"use client";

import { useRef, useState, useEffect } from "react";
import { Shield, RotateCcw, CheckCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasRedactorProps {
  onImageReady?: (dataUrl: string) => void;
  onRedactedChange?: (count: number) => void;
  onSampleLoaded?: (text: string, url: string) => void;
}

interface RedactionBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

const DEFAULT_SAMPLE_TEXT =
  "Selamat siang, paket tertahan karena alamat tidak lengkap. Tolong install berkas resi resmi di bawah ini kak: [Berkas] LIHAT_FOTO_PAKET_JNT.apk (6.8 MB). Penerima: Ahmad Fauzi — No. Rek: 8820-192-331 (BCA). Jika tidak dipasang dalam 2 jam, paket dikembalikan ke gudang!";
const DEFAULT_SAMPLE_URL = "http://194.233.164.88/unduh/LIHAT_FOTO_PAKET_JNT.apk";

export function CanvasRedactor({
  onImageReady,
  onRedactedChange,
  onSampleLoaded,
}: CanvasRedactorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const customImgRef = useRef<HTMLImageElement | null>(null);

  const [imageMode, setImageMode] = useState<"mockup" | "custom">("mockup");
  const [customFileName, setCustomFileName] = useState<string>("");
  const [redactions, setRedactions] = useState<RedactionBox[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  // Draw initial sample mockup UI
  const renderMockup = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Background
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, width, height);

    // Mock Chat Header
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, 60);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("Kurir J&T Budi Santoso (+62 812-9988-7711)", 20, 36);

    // Chat Bubble (Scam Message)
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.roundRect(20, 80, 560, 220, 10);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px sans-serif";
    ctx.fillText("Selamat siang, paket tertahan karena alamat tidak lengkap.", 40, 115);
    ctx.fillText("Tolong install berkas resi resmi di bawah ini kak:", 40, 140);

    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 15px monospace";
    ctx.fillText("[Berkas] LIHAT_FOTO_PAKET_JNT.apk (6.8 MB)", 40, 180);

    ctx.fillStyle = "#ffffff";
    ctx.font = "13px sans-serif";
    ctx.fillText("Penerima: Ahmad Fauzi — No. Rek: 8820-192-331 (BCA)", 40, 220);
    ctx.fillText("Jika tidak dipasang dalam 2 jam, paket dikembalikan ke gudang!", 40, 255);
  };

  // Universal Canvas Painter: renders base image (custom or mockup) + redaction boxes
  const drawCanvas = (
    mode: "mockup" | "custom",
    boxes: RedactionBox[],
    activePreview?: RedactionBox | null
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (mode === "custom" && customImgRef.current) {
      const img = customImgRef.current;
      const targetWidth = 600;
      const targetHeight = Math.max(150, Math.round((img.height / img.width) * 600));
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    } else {
      const targetWidth = 600;
      const targetHeight = 340;
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
      renderMockup(ctx, targetWidth, targetHeight);
    }

    // Render committed censor boxes
    for (const box of boxes) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(box.x, box.y, box.w, box.h);

      if (box.w >= 40 && box.h >= 14) {
        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 10px monospace";
        ctx.fillText("[DISENSOR LOKAL]", box.x + 4, box.y + Math.min(12, box.h - 3));
      }
    }

    // Render active drag preview
    if (activePreview) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.fillRect(activePreview.x, activePreview.y, activePreview.w, activePreview.h);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(activePreview.x, activePreview.y, activePreview.w, activePreview.h);
      ctx.setLineDash([]);
    } else if (onImageReady) {
      onImageReady(canvas.toDataURL());
    }
  };

  useEffect(() => {
    drawCanvas("mockup", [], null);
    if (onSampleLoaded) {
      onSampleLoaded(DEFAULT_SAMPLE_TEXT, DEFAULT_SAMPLE_URL);
    }
  }, []);

  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.max(0, Math.min(canvas.width, (clientX - rect.left) * scaleX)),
      y: Math.max(0, Math.min(canvas.height, (clientY - rect.top) * scaleY)),
    };
  };

  const handlePointerDown = (clientX: number, clientY: number) => {
    const coords = getCanvasCoords(clientX, clientY);
    if (!coords) return;
    setIsDrawing(true);
    setStartPos(coords);
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDrawing || !startPos) return;
    const current = getCanvasCoords(clientX, clientY);
    if (!current) return;

    const previewBox: RedactionBox = {
      x: Math.min(startPos.x, current.x),
      y: Math.min(startPos.y, current.y),
      w: Math.abs(current.x - startPos.x),
      h: Math.abs(current.y - startPos.y),
    };

    drawCanvas(imageMode, redactions, previewBox);
  };

  const handlePointerUp = (clientX?: number, clientY?: number) => {
    if (!isDrawing || !startPos) return;

    let finalCoords: { x: number; y: number } | null = null;
    if (clientX !== undefined && clientY !== undefined) {
      finalCoords = getCanvasCoords(clientX, clientY);
    }

    setIsDrawing(false);
    const start = startPos;
    setStartPos(null);

    if (finalCoords) {
      const box: RedactionBox = {
        x: Math.min(start.x, finalCoords.x),
        y: Math.min(start.y, finalCoords.y),
        w: Math.abs(finalCoords.x - start.x),
        h: Math.abs(finalCoords.y - start.y),
      };

      if (box.w >= 8 && box.h >= 8) {
        const next = [...redactions, box];
        setRedactions(next);
        if (onRedactedChange) onRedactedChange(next.length);
        drawCanvas(imageMode, next, null);
        return;
      }
    }

    // Dismiss micro clicks or cancel
    drawCanvas(imageMode, redactions, null);
  };

  // Reset ONLY the sensor redactions, preserving the active image (custom or mockup)
  const handleResetSensor = () => {
    setRedactions([]);
    if (onRedactedChange) onRedactedChange(0);
    drawCanvas(imageMode, [], null);
  };

  // Revert back to the default sample mockup
  const handleResetToSample = () => {
    customImgRef.current = null;
    setCustomFileName("");
    setImageMode("mockup");
    setRedactions([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onRedactedChange) onRedactedChange(0);
    if (onSampleLoaded) {
      onSampleLoaded(DEFAULT_SAMPLE_TEXT, DEFAULT_SAMPLE_URL);
    }
    drawCanvas("mockup", [], null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        customImgRef.current = img;
        setCustomFileName(file.name);
        setImageMode("custom");
        setRedactions([]);
        if (onRedactedChange) onRedactedChange(0);
        if (onSampleLoaded) {
          onSampleLoaded(
            `[Tangkapan Layar Unggahan Pengguna: ${file.name}]`,
            ""
          );
        }
        drawCanvas("custom", [], null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Allow re-uploading the same file if needed
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 p-2.5 sm:p-3 rounded-none border border-border">
        <div className="flex items-center gap-1.5 min-w-0">
          <Shield className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-foreground truncate">
            Sensor Privasi
          </span>
          {imageMode === "custom" && customFileName && (
            <span
              className="text-[10px] text-muted-foreground truncate max-w-[130px] font-mono border border-border px-1.5 py-0.5 bg-background"
              title={customFileName}
            >
              {customFileName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {imageMode === "custom" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetToSample}
              className="text-xs h-8 rounded-none cursor-pointer text-muted-foreground hover:text-foreground"
              title="Kembali ke contoh kasus bawaan"
            >
              Ganti Contoh
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetSensor}
            className="text-xs h-8 rounded-none cursor-pointer"
            title="Hapus seluruh kotak sensor pada gambar ini (gambar tidak terhapus)"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Sensor
          </Button>
          <label className="cursor-pointer inline-flex items-center justify-center rounded-none text-xs font-medium border border-input bg-background hover:bg-accent px-3 h-8 transition-colors">
            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
            Upload Gambar
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      <div className="relative border border-dashed border-border rounded-none p-2 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={(e) => handlePointerUp(e.clientX, e.clientY)}
          onMouseLeave={() => {
            if (isDrawing) handlePointerUp();
          }}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches.length > 0) {
              handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchEnd={(e) => {
            if (e.changedTouches.length > 0) {
              handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            } else {
              handlePointerUp();
            }
          }}
          className="max-w-full h-auto rounded-none cursor-crosshair shadow-none touch-none select-none"
          style={{ maxHeight: "360px" }}
        />
        <div className="absolute bottom-4 right-4 bg-background/90 text-xs px-2.5 py-1 rounded-none text-foreground border border-border flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-primary" />
          {redactions.length > 0 ? `${redactions.length} Area Disensor` : "Siap Sensor"}
        </div>
      </div>
    </div>
  );
}
