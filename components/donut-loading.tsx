"use client"

import { motion } from "framer-motion"

interface DonutLoadingProps {
  size?: "sm" | "md" | "lg"
  message?: string
}

export function DonutLoading({ size = "md", message }: DonutLoadingProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const holeSize = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full">
      <div className="relative flex items-center justify-center">
        {/* Donut base (golden brown) */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full relative`}
          style={{
            background: "linear-gradient(145deg, #D2691E, #CD853F, #DEB887)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3)",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {/* Pink frosting layer */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(145deg, #FF69B4, #FF1493, #DA70D6)",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)",
              transform: "scale(0.95)",
            }}
          />

          {/* Inner donut hole */}
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${holeSize[size]} rounded-full bg-[#FFF9F0]`}
            style={{
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
            }}
          />

          {/* Sprinkles */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30 + Math.random() * 15
            const distance = size === "sm" ? 6 : size === "md" ? 8 : 12
            const sprinkleSize = size === "sm" ? "2px" : size === "md" ? "3px" : "4px"

            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${Number.parseInt(sprinkleSize) * 2}px`,
                  height: sprinkleSize,
                  background: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FFA500" : "#FF8C00",
                  transform: `rotate(${angle}deg) translateY(-${distance}px) rotate(${Math.random() * 60 - 30}deg)`,
                  transformOrigin: "center",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                }}
                initial={false}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.1,
                }}
              />
            )
          })}
        </motion.div>
      </div>

      {message && (
        <motion.p
          className="text-[#8B4513] font-medium text-sm md:text-base text-center max-w-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

export default DonutLoading
