"use client";

import { useRef, useState, useEffect, MouseEvent } from "react";
import { Shield, RotateCcw, CheckCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasRedactorProps {
  onImageReady?: (dataUrl: string) => void;
}

export function CanvasRedactor({ onImageReady }: CanvasRedactorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const [redactedCount, setRedactedCount] = useState(0);

  // Draw initial sample mockup canvas
  const drawSampleMockup = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 340;

    // Background
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Mock Chat Header
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, 60);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("Kurir J&T Budi Santoso (+62 812-9988-7711)", 20, 36);

    // Chat Bubble (Scam Message)
    ctx.fillStyle = "#0284c7";
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

    setHasImage(true);
    setRedactedCount(0);
    if (onImageReady) onImageReady(canvas.toDataURL());
  };

  useEffect(() => {
    drawSampleMockup();
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!hasImage || e.touches.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
    setIsDrawing(true);
    setStartPos({ x, y });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos || e.changedTouches.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const currentX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const currentY = (touch.clientY - rect.top) * (canvas.height / rect.height);

    const width = currentX - startPos.x;
    const height = currentY - startPos.y;

    ctx.fillStyle = "#000000";
    ctx.fillRect(startPos.x, startPos.y, width, height);

    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 10px monospace";
    ctx.fillText("[DISENSOR LOKAL]", startPos.x + 4, startPos.y + 12);

    setIsDrawing(false);
    setStartPos(null);
    setRedactedCount((prev) => prev + 1);

    if (onImageReady) onImageReady(canvas.toDataURL());
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!hasImage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    setIsDrawing(true);
    setStartPos({ x, y });
  };

  const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const currentY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const width = currentX - startPos.x;
    const height = currentY - startPos.y;

    // Draw permanent black censor block
    ctx.fillStyle = "#000000";
    ctx.fillRect(startPos.x, startPos.y, width, height);

    // Optional sensor label text
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 10px monospace";
    ctx.fillText("[DISENSOR LOKAL]", startPos.x + 4, startPos.y + 12);

    setIsDrawing(false);
    setStartPos(null);
    setRedactedCount((prev) => prev + 1);

    if (onImageReady) onImageReady(canvas.toDataURL());
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 600;
        canvas.height = (img.height / img.width) * 600;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHasImage(true);
        setRedactedCount(0);
        if (onImageReady) onImageReady(canvas.toDataURL());
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 p-3 rounded-none border border-border">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-foreground">
            On-Device Privacy Scrubber: Tarik kotak hitam di atas nama/nomor HP untuk menyensor data sebelum analisis.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={drawSampleMockup}
            className="text-xs h-8 rounded-none"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Sampel
          </Button>
          <label className="cursor-pointer inline-flex items-center justify-center rounded-none text-xs font-medium border border-input bg-background hover:bg-accent px-3 h-8 transition-colors">
            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
            Upload Tangkapan Layar
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      <div className="relative border border-dashed border-border rounded-none p-2 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="max-w-full h-auto rounded-none cursor-crosshair shadow-none touch-none"
          style={{ maxHeight: "360px" }}
        />
        <div className="absolute bottom-4 right-4 bg-background/90 text-xs px-2.5 py-1 rounded-none text-foreground border border-border flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-primary" />
          {redactedCount > 0 ? `${redactedCount} Bagian Disensor` : "Siap Sensor: Seret Mouse / Sentuh"}
        </div>
      </div>
    </div>
  );
}
