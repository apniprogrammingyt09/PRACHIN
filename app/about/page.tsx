"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Award, Users, Heart, Leaf } from "lucide-react"
import { useState } from "react"

export default function AboutPage() {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null)

  return (
    <div className="bg-green-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                <span className="text-green-800">Our Wellness</span> <span className="text-green-600">Journey</span>
              </h1>
              <p className="mt-6 text-lg text-green-700">
                Since 2010, Prachin Ayurved has been dedicated to bringing ancient Ayurvedic wisdom to modern wellness.
                What started as a passion for natural healing has grown into a trusted source for authentic Ayurvedic
                oils and wellness products.
              </p>
              <p className="mt-4 text-lg text-green-700">
                Every formulation is crafted using traditional methods passed down through generations, using only the
                purest natural ingredients. Our commitment to authenticity and quality has earned us the trust of
                wellness seekers everywhere.
              </p>
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="border-green-800 text-green-800 hover:bg-green-50/50 transition-all duration-300 hover:shadow-md hover:scale-105 bg-transparent"
                >
                  <Link href="/contact">Learn More About Our Mission</Link>
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              className="md:w-1/2 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              {[
                { src: "/images/poster3.png", alt: "Mukh Kanti Face Oil" },
                { src: "/images/poster5.png", alt: "14 Herbs Hair Oil" },
                { src: "/images/poster1.png", alt: "Pain Relief Oil" },
                { src: "/images/poster2.png", alt: "Ayurvedic Shampoo" },
              ].map((image, index) => (
                <div
                  key={index}
                  className="relative h-48 md:h-64 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
                  onMouseEnter={() => setHoveredImage(index)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                      hoveredImage === index ? "scale-110" : "scale-100"
                    }`}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-green-800">Our Principles</h2>
            <p className="mt-4 text-green-700 max-w-2xl mx-auto">
              These ancient Ayurvedic principles guide everything we do, from sourcing herbs to crafting our wellness
              products.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="bg-green-50 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 transition-all duration-300 hover:bg-green-600 group">
                <Award className="h-7 w-7 text-green-600 transition-all duration-300 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Purity</h3>
              <p className="text-green-700">
                We use only the finest natural ingredients, sourced ethically and processed with traditional methods for
                maximum potency.
              </p>
            </motion.div>

            <motion.div
              className="bg-green-50 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 transition-all duration-300 hover:bg-green-600 group">
                <Heart className="h-7 w-7 text-green-600 transition-all duration-300 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Wellness</h3>
              <p className="text-green-700">
                Our passion lies in promoting holistic wellness through time-tested Ayurvedic formulations that nurture
                body and mind.
              </p>
            </motion.div>

            <motion.div
              className="bg-green-50 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 transition-all duration-300 hover:bg-green-600 group">
                <Users className="h-7 w-7 text-green-600 transition-all duration-300 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Community</h3>
              <p className="text-green-700">
                We're committed to supporting our community's wellness journey, sharing knowledge and natural solutions
                for healthy living.
              </p>
            </motion.div>

            <motion.div
              className="bg-green-50 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 transition-all duration-300 hover:bg-green-600 group">
                <Leaf className="h-7 w-7 text-green-600 transition-all duration-300 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Tradition</h3>
              <p className="text-green-700">
                Our formulations honor ancient Ayurvedic wisdom while meeting modern quality standards for safe,
                effective wellness.
              </p>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="py-16 bg-green-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold">Ready to experience natural wellness?</h2>
              <p className="mt-2 text-green-100">Discover our authentic Ayurvedic oils and wellness products today.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/contact">
                <Button className="bg-white text-green-800 hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Contact Us
                </Button>
              </Link>
              <Link href="/menu">
                <Button className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Shop Now <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
