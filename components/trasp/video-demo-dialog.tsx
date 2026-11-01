"use client";

import { IconVideo, IconPlayerPlay } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VideoDemoDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function VideoDemoDialog({ trigger, open, onOpenChange }: VideoDemoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-xl p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-sm font-semibold flex items-center gap-2">
            <IconVideo className="h-4 w-4" />
            <span>Video Live</span>
          </DialogTitle>
        </DialogHeader>

        <div className="pt-2">
          <div className="relative aspect-video w-full bg-slate-950 border border-border flex items-center justify-center">
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary hover:scale-105 transition-transform cursor-pointer"
            >
              <IconPlayerPlay className="w-5 h-5 ml-0.5 fill-primary text-primary" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
