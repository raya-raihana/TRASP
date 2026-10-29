"use client";

import { useState } from "react";
import { IconCopy, IconCheck, IconUsers } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TeamInfoDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TeamInfoDialog({ trigger, open, onOpenChange }: TeamInfoDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("MIT-010");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base font-serif font-bold flex items-center gap-2">
            <IconUsers className="h-4 w-4 text-muted-foreground" />
            Informasi Tim
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1 text-xs">
          {/* Kode Tim Box */}
          <div className="space-y-1.5">
            <label className="text-muted-foreground font-medium">Kode Tim:</label>
            <div className="flex items-center justify-between p-3 bg-muted/40 border border-border">
              <span className="font-mono text-base font-bold tracking-wider text-foreground">
                MIT-010
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="h-7 px-2.5 text-xs cursor-pointer flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <IconCopy className="h-3.5 w-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Kode tim dibutuhkan jika panitia memakai formulir cadangan.
            </p>
          </div>

          <div className="border-t border-border pt-3 space-y-3">
            <div>
              <span className="text-muted-foreground block text-[11px]">Nama Tim:</span>
              <span className="font-semibold text-foreground text-sm">Tiga Trio</span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px]">Institusi:</span>
              <span className="font-medium text-foreground">SMK Negeri 6 Balikpapan</span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px]">Ketua Tim:</span>
              <span className="font-medium text-foreground">Raya Raihana Yasmin</span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px]">Anggota:</span>
              <span className="font-medium text-foreground leading-relaxed">
                Raya Raihana Yasmin, Andi Rivelani Aurellah, Yelena Amanda
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
