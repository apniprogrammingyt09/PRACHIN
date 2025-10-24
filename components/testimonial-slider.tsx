"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Priya Kumari",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvjxH-JLM-25g5WntMU8yCrIeYBVQwlm2nwF-hGm-kby-n_yIWVYDZWSouSrRBugDa_dc&usqp=CAU",
    rating: 5,
    testimonial: "The Mukh Kanti face oil has transformed my skin! It's so natural and effective. I can see the glow and my skin feels so much healthier. Highly recommend!",
    product: "Mukh Kanti Face Oil"
  },
  {
    id: 2,
    name: "Rajesh Sharma",
    avatar: "https://thumbs.dreamstime.com/b/handsome-indian-man-meditating-under-tree-27166536.jpg",
    rating: 5,
    testimonial: "The pain relief oil works wonders! My joint pain has reduced significantly after using it regularly. Fast delivery and authentic products.",
    product: "Pain Relief Oil"
  },
  {
    id: 3,
    name: "Anita Mehta",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNsPXabNdHiJrYqPT1BxEEFm1uwJKGbcsmoA&s",
    rating: 5,
    testimonial: "I've been using their hair oil and shampoo for months now. My hair fall has reduced and my hair feels stronger and shinier. Pure Ayurvedic goodness!",
    product: "Hair Care Combo"
  },
  {
    id: 4,
    name: "Suresh Patel",
    avatar: "https://static9.depositphotos.com/1093689/1373/i/450/depositphotos_13736731-stock-photo-close-up-photo-of-hopeful.jpg",
    rating: 5,
    testimonial: "Amazing quality products! The natural ingredients are clearly visible and the results are outstanding. My whole family now uses these products.",
    product: "Wellness Bundle"
  },
  {
    id: 5,
    name: "Kavita Singh",
    avatar: "https://i.pinimg.com/564x/1b/43/84/1b4384eea372705219b56ab0c32dc6d6.jpg",
    rating: 5,
    testimonial: "Best Ayurvedic products I've ever used! The face pack gives instant glow and the oils are so pure. Will definitely order again.",
    product: "Ubtan Face Pack"
  }
]

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-green-100 text-emerald-800 hover:bg-green-600 hover:text-white transition-all duration-300">
            TESTIMONIALS
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-emerald-800">What Our</span> <span className="text-green-600">Customers Say</span>
          </h2>
          <p className="text-lg text-emerald-700 max-w-2xl mx-auto">
            Don't just take our word for it. See what our happy customers have to say about our wellness products.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Testimonial Slider */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 md:p-12 shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-center"
                >
                  {/* Customer Avatar */}
                  <div className="mb-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto shadow-lg border-4 border-white">
                      <Image
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, index) => (
                      <Star key={index} className="h-5 w-5 fill-yellow-400 text-yellow-400 mx-0.5" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-lg md:text-xl text-emerald-700 mb-6 italic max-w-3xl mx-auto leading-relaxed">
                    "{testimonials[currentIndex].testimonial}"
                  </blockquote>

                  {/* Customer Info */}
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold text-emerald-800">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-green-600 font-medium">
                      Verified Purchase - {testimonials[currentIndex].product}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-green-600 scale-125 shadow-lg"
                      : "bg-green-300 hover:bg-green-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Auto-play indicator */}
            <div className="flex justify-center items-center mt-4">
              <div className="flex items-center space-x-2 text-sm text-emerald-600">
                <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-emerald-700 text-xs">
                  {isAutoPlaying ? 'Auto-playing testimonials' : 'Manual mode'}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-emerald-700 font-medium">Happy Customers</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">4.9★</div>
              <div className="text-emerald-700 font-medium">Average Rating</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-emerald-700 font-medium">Repeat Customers</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}