"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
const galleryImages = [
  "/images/poster1.webp",
  "/images/poster2.webp", 
  "/images/poster3.webp",
  "/images/poster4.webp",
  "/images/poster5.webp",
  "/images/1.png",
]

export function GallerySlider() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % galleryImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % galleryImages.length)
  }

  const prevSlide = () => {
    setActive((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <div className="w-full max-w-[1300px] h-[700px] md:h-[400px] mx-auto relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 h-full flex transition-all duration-1000 ease-in-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {galleryImages.map((src, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 flex items-center justify-center">
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              width={1300}
              height={700}
              className="w-full h-full object-contain p-4"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  )
}