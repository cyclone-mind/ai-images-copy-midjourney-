"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { EmblaCarouselType } from "embla-carousel";
import { ZoomIn } from "lucide-react";

interface ImagePreviewProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImagePreview({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
}: ImagePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const apiRef = useRef<EmblaCarouselType | undefined>(undefined);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (newOpen) {
        setCurrentIndex(initialIndex);
        apiRef.current?.scrollTo(initialIndex);
      }
      onOpenChange(newOpen);
    },
    [initialIndex, onOpenChange]
  );

  useEffect(() => {
    if (open && apiRef.current) {
      apiRef.current.scrollTo(initialIndex);
      setCurrentIndex(initialIndex);
    }
  }, [open, initialIndex]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/90 border-none shadow-2xl overflow-hidden">
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          <Carousel
            className="w-full"
            opts={{
              startIndex: initialIndex,
              loop: true,
            }}
            setApi={(api) => {
              apiRef.current = api;
              if (api) {
                api.on("select", () => {
                  setCurrentIndex(api.selectedScrollSnap());
                });
              }
            }}
          >
            <CarouselContent className="w-full">
              {images.map((src, index) => (
                <CarouselItem key={index} className="flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={src}
                      alt={`Image ${index + 1}`}
                      width={1200}
                      height={800}
                      className="object-contain max-h-[85vh] w-auto h-auto"
                      priority={index === initialIndex}
                      unoptimized
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const handleImageClick = useCallback((index: number) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  }, []);

  return (
    <>
      <div className={className}>
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className="relative group overflow-hidden rounded-md cursor-pointer"
          >
            <Image
              src={src}
              alt={`Image ${index + 1}`}
              width={600}
              height={400}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        ))}
      </div>
      <ImagePreview
        images={images}
        initialIndex={previewIndex}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </>
  );
}
