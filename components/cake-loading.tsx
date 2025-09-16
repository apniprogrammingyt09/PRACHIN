"use client"

import { motion } from "framer-motion"

interface CakeLoadingProps {
  size?: "sm" | "md" | "lg"
  message?: string
}

export function CakeLoading({ size = "md", message = "Loading..." }: CakeLoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  const containerSizes = {
    sm: "p-4",
    md: "p-8",
    lg: "p-12",
  }

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
      <motion.div
        className={`${sizeClasses[size]} relative mb-4`}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
      >
        {/* Cake Base */}
        <motion.div
          className="absolute bottom-0 w-full h-3/5 bg-gradient-to-t from-[#D4915D] to-[#E8B17A] rounded-b-full"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Cake Top Layer */}
        <motion.div
          className="absolute bottom-1/3 w-4/5 h-2/5 bg-gradient-to-t from-[#F4E4BC] to-[#FFF9F0] rounded-full left-1/2 transform -translate-x-1/2"
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
        />

        {/* Cherry on Top */}
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"
          animate={{
            y: [0, -2, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Candle */}
        <motion.div
          className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-yellow-200"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Flame */}
        <motion.div
          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>

      <motion.p
        className="text-[#A67C52] text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
      >
        {message}
      </motion.p>
    </div>
  )
}
