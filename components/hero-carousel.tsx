"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const cakeImages = [
  {
    src: "https://pngmax.com/_next/image?url=https%3A%2F%2Fpng-max.s3.ap-south-1.amazonaws.com%2Foriginal%2Fd5e8ae69-1b69-45a1-bdaf-7caaa27cd86e.png&w=256&q=75",
    alt: "Chocolate Drip Cake",
    title: "Premium Chocolate Cake",
  },
  {
    src: "https://static.vecteezy.com/system/resources/previews/048/040/929/non_2x/a-strawberry-cake-with-cream-and-strawberries-on-top-free-png.png",
    alt: "Strawberry Cake",
    title: "Fresh Strawberry Delight",
  },
  {
    src: "https://png.pngtree.com/png-clipart/20241129/original/pngtree-vanilla-cake-png-image_17407914.png",
    alt: "Vanilla Cake",
    title: "Classic Vanilla Dream",
  },
  {
    src: "https://static.vecteezy.com/system/resources/thumbnails/050/575/261/small_2x/red-velvet-cake-with-cream-cheese-frosting-on-white-plate-png.png",
    alt: "Red Velvet Cake",
    title: "Rich Red Velvet",
  },
]

const transitionVariants = [
  // Fade and scale
  {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
  },
  // Slide from right
  {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  // Slide from bottom
  {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  // Rotate and fade
  {
    initial: { opacity: 0, rotate: 15 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: -15 },
  },
]

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cakeImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(timer)
  }, [])

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const currentVariant = transitionVariants[currentIndex % transitionVariants.length]

  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto">
      {/* Animated background rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#D4915D]/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border border-[#8B4513]/15"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Pulsing background gradient */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4915D]/20 to-[#8B4513]/20 blur-xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Main carousel container */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-[#FFF9F0] to-[#FEEBD7] shadow-2xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={currentVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              type: "tween",
            }}
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            <motion.div
              className="relative w-full h-full"
              whileHover={{
                scale: 1.05,
                rotate: [0, -2, 2, 0],
                transition: { duration: 0.6 },
              }}
            >
              <Image
                src={cakeImages[currentIndex].src || "/placeholder.svg"}
                alt={cakeImages[currentIndex].alt}
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />

              {/* Sparkle effects */}
              <motion.div
                className="absolute top-1/4 right-1/4 w-1 h-1 bg-yellow-300 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
              <motion.div
                className="absolute top-3/4 left-1/4 w-1.5 h-1.5 bg-yellow-200 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, -180, -360],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
              <motion.div
                className="absolute top-1/2 right-1/3 w-0.5 h-0.5 bg-yellow-400 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-4 right-4 w-3 h-3 bg-[#D4915D] rounded-full opacity-60"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-6 left-6 w-2 h-2 bg-[#8B4513] rounded-full opacity-40"
          animate={{
            y: [0, -12, 0],
            scale: [1, 1.4, 1],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/3 left-4 w-1.5 h-1.5 bg-[#D4915D] rounded-full opacity-50"
          animate={{
            y: [0, -8, 0],
            x: [0, 8, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      {/* Enhanced indicator dots */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {cakeImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`relative overflow-hidden rounded-full transition-all duration-500 ${
              index === currentIndex ? "bg-[#8B4513] w-8 h-3" : "bg-[#D4915D]/40 hover:bg-[#D4915D]/60 w-3 h-3"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {index === currentIndex && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#D4915D] to-[#8B4513]"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Enhanced cake title overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.8 }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            type: "spring",
            stiffness: 100,
          }}
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
        >
          <motion.p
            className="text-sm font-medium text-[#8B4513] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-[#D4915D]/20"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(139, 69, 19, 0.2)",
            }}
          >
            {cakeImages[currentIndex].title}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Progress ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="#D4915D" strokeWidth="0.5" opacity="0.3" />
        <motion.circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="#8B4513"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="301.59"
          initial={{ strokeDashoffset: 301.59 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: 5,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
          key={currentIndex}
        />
      </svg>
    </div>
  )
}
