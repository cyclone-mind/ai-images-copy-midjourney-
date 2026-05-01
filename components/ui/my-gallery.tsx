"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Calendar, ZoomIn } from "lucide-react";

interface HistoryItem {
  id: string;
  prompt: string;
  image_urls: string[];
  credits_used: number;
  created_at: string;
}

interface MyGalleryProps {
  history: HistoryItem[];
  isLoading?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function GalleryCard({
  item,
  onClick,
}: {
  item: HistoryItem;
  onClick: () => void;
}) {
  return (
    <Card
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-muted"
      onClick={onClick}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={item.image_urls[0]}
          alt={item.prompt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="eager"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-white text-xs font-medium">4 图</span>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {item.prompt}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(item.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>-{item.credits_used} 点</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ImagePreviewModal({
  images,
  prompt,
  open,
  onOpenChange,
}: {
  images: string[];
  prompt: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, images.length]);

  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/90 border-none shadow-2xl overflow-hidden" aria-describedby="image-preview-description">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
          aria-label="关闭"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <p id="image-preview-description" className="sr-only">图片预览，共 {images.length} 张图片</p>

        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="w-full bg-black/40 backdrop-blur-sm py-3 px-4">
            <p className="text-white text-sm line-clamp-2 text-center max-w-4xl mx-auto">{prompt}</p>
          </div>
          <div className="flex-1 flex items-center justify-center w-full px-16 py-4">
            <Image
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain max-h-[calc(100vh-200px)] w-auto h-auto"
              priority
              unoptimized
            />
          </div>
          <div className="w-full bg-black/40 backdrop-blur-sm py-3 px-4">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="text-white hover:text-primary transition-colors text-2xl font-bold"
                aria-label="上一张"
              >
                ←
              </button>
              <span className="text-white text-sm font-medium min-w-[60px] text-center">
                {currentIndex + 1} / {images.length}
              </span>
              <button
                onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                className="text-white hover:text-primary transition-colors text-2xl font-bold"
                aria-label="下一张"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[16/9] w-full" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4">
        <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">暂无图像</h3>
        <p className="text-sm text-muted-foreground text-center">
          您的图库为空，开始生成您的第一张图像吧
        </p>
      </CardContent>
    </Card>
  );
}

export function MyGallery({ history, isLoading }: MyGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const handleCardClick = useCallback((item: HistoryItem) => {
    setSelectedItem(item);
  }, []);

  const handleCloseModal = useCallback((open: boolean) => {
    if (!open) {
      setSelectedItem(null);
    }
  }, []);

  if (isLoading) {
    return <GallerySkeleton />;
  }

  if (history.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <GalleryCard
            key={item.id}
            item={item}
            onClick={() => handleCardClick(item)}
          />
        ))}
      </div>
      {selectedItem && (
        <ImagePreviewModal
          images={selectedItem.image_urls}
          prompt={selectedItem.prompt}
          open={selectedItem !== null}
          onOpenChange={handleCloseModal}
        />
      )}
    </>
  );
}