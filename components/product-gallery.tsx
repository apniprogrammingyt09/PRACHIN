"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ZoomIn, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const galleryImages =
    images.length > 0 ? images : ["/placeholder.svg?height=600&width=600&text=" + encodeURIComponent(productName)]

  useEffect(() => {
    if (isAutoPlaying && galleryImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying, galleryImages.length])

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const getImageUrl = (image: string) => {
    if (!image) return "/placeholder.svg?height=600&width=600&text=" + encodeURIComponent(productName)
    if (image.startsWith("data:")) return image
    return `data:image/jpeg;base64,${image}`
  }

  return (
    <>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-8 shadow-lg">
          <div className="relative w-full h-[400px] select-none rounded-xl overflow-hidden bg-white shadow-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative w-full h-full"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500
                  if (swipe && galleryImages.length > 1) {
                    if (offset.x > 0) {
                      prevImage()
                    } else {
                      nextImage()
                    }
                  }
                }}
              >
                <Image
                  src={getImageUrl(galleryImages[currentIndex]) || "/placeholder.svg"}
                  alt={`${productName} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain p-4"
                  unoptimized={galleryImages[currentIndex]?.startsWith("data:") || false}
                  priority={currentIndex === 0}
                />
              </motion.div>
            </AnimatePresence>

            {galleryImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-green-600 shadow-lg rounded-full border border-green-100"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-green-600 shadow-lg rounded-full border border-green-100"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            <div className="absolute top-3 right-3 flex gap-2">
              {galleryImages.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/90 hover:bg-white text-green-600 shadow-lg rounded-full h-9 w-9 border border-green-100"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                >
                  {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/90 hover:bg-white text-green-600 shadow-lg rounded-full h-9 w-9 border border-green-100"
                onClick={() => setIsFullscreen(true)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {galleryImages.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-white/90 text-green-700 px-3 py-1 rounded-full text-sm font-medium shadow-lg border border-green-100">
                {currentIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex justify-center space-x-3 mt-6">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-green-600 scale-125 shadow-lg"
                      : "bg-green-300 hover:bg-green-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {galleryImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-green-600 ring-2 ring-green-600/30"
                    : "border-gray-200 hover:border-green-400"
                }`}
                onClick={() => goToImage(index)}
              >
                <Image
                  src={getImageUrl(image) || "/placeholder.svg"}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-contain"
                  unoptimized={image?.startsWith("data:") || false}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white z-10"
                onClick={() => setIsFullscreen(false)}
              >
                <X className="h-6 w-6" />
              </Button>

              <Image
                src={getImageUrl(galleryImages[currentIndex]) || "/placeholder.svg"}
                alt={`${productName} - Image ${currentIndex + 1}`}
                width={800}
                height={800}
                className="object-contain max-w-full max-h-full"
                unoptimized={galleryImages[currentIndex]?.startsWith("data:") || false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}