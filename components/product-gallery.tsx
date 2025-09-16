"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Ensure we have at least one image
  const galleryImages =
    images.length > 0 ? images : ["/placeholder.svg?height=600&width=600&text=" + encodeURIComponent(productName)]

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
    setZoomLevel(1)
    setIsZoomed(false)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
    setZoomLevel(1)
    setIsZoomed(false)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
    setZoomLevel(1)
    setIsZoomed(false)
  }

  const toggleZoom = () => {
    if (isZoomed) {
      setZoomLevel(1)
      setIsZoomed(false)
    } else {
      setZoomLevel(2)
      setIsZoomed(true)
    }
  }

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3))
    setIsZoomed(true)
  }

  const zoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1)
    setZoomLevel(newZoom)
    if (newZoom === 1) {
      setIsZoomed(false)
    }
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
    setZoomLevel(1)
    setIsZoomed(false)
  }

  // Create proper image URL for base64 or fallback
  const getImageUrl = (image: string) => {
    if (!image) return "/placeholder.svg?height=600&width=600&text=" + encodeURIComponent(productName)
    if (image.startsWith("data:")) return image
    return `data:image/jpeg;base64,${image}`
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative bg-white rounded-xl overflow-hidden shadow-md">
          <div className="relative aspect-square cursor-pointer" onClick={openFullscreen}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={getImageUrl(galleryImages[currentIndex]) || "/placeholder.svg"}
                  alt={`${productName} - Image ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={galleryImages[currentIndex]?.startsWith("data:") || false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#8B4513] shadow-md"
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#8B4513] shadow-md"
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Zoom Indicator */}
            <div className="absolute top-2 right-2 bg-white/80 rounded-full p-2">
              <ZoomIn className="h-4 w-4 text-[#8B4513]" />
            </div>

            {/* Image Counter */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {galleryImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-[#D4915D] ring-2 ring-[#D4915D]/30"
                    : "border-gray-200 hover:border-[#D4915D]/50"
                }`}
                onClick={() => goToImage(index)}
              >
                <Image
                  src={getImageUrl(image) || "/placeholder.svg"}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={image?.startsWith("data:") || false}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white z-10"
                onClick={closeFullscreen}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Zoom Controls */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/10 hover:bg-white/20 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    zoomOut()
                  }}
                  disabled={zoomLevel <= 1}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/10 hover:bg-white/20 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    zoomIn()
                  }}
                  disabled={zoomLevel >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="bg-white/10 text-white px-3 py-2 rounded text-sm">{Math.round(zoomLevel * 100)}%</div>
              </div>

              {/* Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Main Image */}
              <motion.div
                className="relative max-w-full max-h-full cursor-pointer"
                style={{
                  transform: `scale(${zoomLevel})`,
                }}
                animate={{
                  scale: zoomLevel,
                }}
                transition={{ duration: 0.3 }}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleZoom()
                }}
              >
                <Image
                  src={getImageUrl(galleryImages[currentIndex]) || "/placeholder.svg"}
                  alt={`${productName} - Image ${currentIndex + 1}`}
                  width={800}
                  height={800}
                  className="object-contain max-w-full max-h-full"
                  unoptimized={galleryImages[currentIndex]?.startsWith("data:") || false}
                />
              </motion.div>

              {/* Image Counter */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded">
                  {currentIndex + 1} / {galleryImages.length}
                </div>
              )}

              {/* Thumbnail Strip */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      className={`relative flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                        index === currentIndex
                          ? "border-white ring-2 ring-white/50"
                          : "border-white/30 hover:border-white/70"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        goToImage(index)
                      }}
                    >
                      <Image
                        src={getImageUrl(image) || "/placeholder.svg"}
                        alt={`${productName} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={image?.startsWith("data:") || false}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
