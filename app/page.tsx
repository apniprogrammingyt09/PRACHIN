"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { Badge } from "@/components/ui/badge"
import { HeroCarousel } from "@/components/hero-carousel"
import { TestimonialSlider } from "@/components/testimonial-slider"
import { Star, ChevronRight, Leaf, Droplets, Heart, Truck, Shield, Eye } from "lucide-react"
import { useData } from "@/contexts/data-context"

export default function HomePage() {
  const { products, isProductsCached, refreshProducts } = useData()
  const [hoveredGalleryItem, setHoveredGalleryItem] = useState<number | null>(null)
  const [isLoadingProducts, setIsLoadingProducts] = useState(!isProductsCached)

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Prachin Ayurved",
    "description": "Authentic Ayurvedic oils, natural wellness products & traditional herbal formulations from Taraori, Haryana",
    "url": "https://prachinayurved.in",
    "telephone": ["+91-87087-18784", "+91-72069-07250"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Taraori",
      "addressRegion": "Haryana",
      "postalCode": "132116",
      "addressCountry": "IN"
    },
    "openingHours": "Mo-Su 09:00-21:00",
    "priceRange": "₹₹",
    "hasMenu": "https://prachinayurved.in/menu",
    "sameAs": [
      "https://instagram.com/bharatshastra",
      "https://instagram.com/prachinayurved108"
    ],
    "foundingDate": "2010",
    "keywords": "Ayurvedic oils, natural wellness, herbal products, face oils, hair oils, pain relief oil, Ayurvedic shampoo"
  }

  const featuredProducts = products.filter((product) => product.featured).slice(0, 4)

  useEffect(() => {
    const loadProducts = async () => {
      if (!isProductsCached) {
        setIsLoadingProducts(true)
        await refreshProducts()
        setIsLoadingProducts(false)
      } else {
        setIsLoadingProducts(false)
      }
    }

    loadProducts()
  }, [isProductsCached, refreshProducts])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-green-50 pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-emerald-300/20 rounded-full blur-xl"></div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-emerald-800">
                  Natural Wellness{" "}
                  <motion.span
                    className="inline-block"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <Leaf className="inline-block h-12 w-12 text-green-600" />
                  </motion.span>
                </h1>
              </motion.div>

              <motion.p
                className="text-lg md:text-xl text-emerald-700 mb-6 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Experience the power of ancient Ayurveda with our premium oils and wellness products. Each formula is
                crafted with pure, natural ingredients for holistic health.
              </motion.p>

              <motion.div
                className="flex items-center gap-2 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 + star * 0.1 }}
                    >
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                <span className="font-semibold text-emerald-800">4.9</span>
                <span className="text-emerald-700">(500+ Reviews)</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Link href="/menu">Shop Products</Link>
                </Button>
              </motion.div>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <div className="bg-green-600 text-white px-4 py-2 rounded-full inline-block transform transition-all duration-300 hover:scale-105 hover:bg-green-700 hover:shadow-md">
                  <span className="text-sm font-medium">Ancient Wisdom Since 1995</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                <HeroCarousel />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Treats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-emerald-800">Featured Wellness Products</h2>
            <p className="text-lg text-emerald-700">Discover our most popular and effective Ayurvedic formulations</p>
          </motion.div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                    <div className="h-48 bg-green-100 rounded-lg mb-4"></div>
                    <div className="h-4 bg-green-100 rounded mb-2"></div>
                    <div className="h-4 bg-green-100 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-green-100 rounded w-1/2"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard
                    id={product._id}
                    image={product.image}
                    title={product.name}
                    price={product.price || 0}
                    category={product.category}
                    stockQuantity={product.stockQuantity || 0}
                    inStock={product.inStock !== false}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-green-50 rounded-xl p-8 max-w-md mx-auto">
                <Leaf className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-emerald-800 mb-2">No Featured Products</h3>
                <p className="text-emerald-700 mb-4">
                  Featured wellness products will appear here once they are added to our collection.
                </p>
              </div>
            </div>
          )}

          <div className="text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-green-600 text-green-600 hover:bg-green-50 rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-md bg-transparent"
            >
              <Link href="/menu">
                View All Products
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* We Deliver Anywhere */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-emerald-800">Wellness Delivered Everywhere</h2>
            <p className="text-lg text-emerald-700">
              Bringing the power of Ayurveda to your doorstep, wherever you are in the city.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white shadow-md h-full text-center transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-green-600 group">
                    <Leaf className="h-8 w-8 text-green-600 transition-all duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-800">100% Natural</h3>
                  <p className="text-emerald-700">
                    Made with pure, organic ingredients sourced directly from nature for maximum potency.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white shadow-md h-full text-center transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-green-600 group">
                    <Truck className="h-8 w-8 text-green-600 transition-all duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-800">Fast Delivery</h3>
                  <p className="text-emerald-700">
                    Quick and secure delivery of your wellness products right to your doorstep.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white shadow-md h-full text-center transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-green-600 group">
                    <Droplets className="h-8 w-8 text-green-600 transition-all duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-800">Custom Blends</h3>
                  <p className="text-emerald-700">
                    Personalized oil formulations tailored to your specific wellness needs and concerns.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white shadow-md h-full text-center transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-green-600 group">
                    <Shield className="h-8 w-8 text-green-600 transition-all duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-800">Secure Payments</h3>
                  <p className="text-emerald-700">Safe and convenient payment options for hassle-free ordering.</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Food Gallery */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-emerald-800">Product</span> <span className="text-green-600">Gallery</span>
            </h2>
            <p className="text-lg text-emerald-700 max-w-2xl mx-auto">
              Explore our premium Ayurvedic products crafted with ancient wisdom and modern care.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Poster Images */}
            {[
              { id: 'poster1', src: '/images/poster1.webp', title: 'Ayurvedic Hair Care', description: 'Natural hair wellness solutions' },
              { id: 'poster2', src: '/images/poster2.webp', title: 'Radiant Skin Care', description: 'Pure face oils & treatments' },
              { id: 'poster3', src: '/images/poster3.webp', title: 'Pain Relief Therapy', description: 'Therapeutic oil blends' },
              { id: 'poster4', src: '/images/poster4.webp', title: 'Complete Wellness', description: 'Holistic health solutions' },
              { id: 'poster5', src: '/images/poster5.webp', title: 'Premium Quality', description: 'Traditional herbal formulations' },
              { id: 'poster', src: '/images/poster.png', title: 'Special Collection', description: 'Exclusive Ayurvedic products' },
              { id: 'poster1-png', src: '/images/poster1.png', title: 'Hair Care PNG', description: 'High quality hair care solutions' },
              { id: 'poster2-png', src: '/images/poster2.png', title: 'Skin Care PNG', description: 'Premium skin wellness products' },
            ].map((poster, index) => (
              <motion.div
                key={poster.id}
                className="relative h-64 rounded-lg overflow-hidden shadow-md cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredGalleryItem(index)}
                onMouseLeave={() => setHoveredGalleryItem(null)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-emerald-800/90 to-transparent z-10 flex flex-col justify-end p-4 transition-opacity duration-300 ${
                    hoveredGalleryItem === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <h3 className="text-white font-semibold text-lg">{poster.title}</h3>
                  <p className="text-white/90 text-sm">{poster.description}</p>
                  <Link href="/menu">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-2 bg-white text-emerald-800 hover:bg-green-50 w-full transition-all duration-300 hover:shadow-md border border-transparent hover:border-emerald-800/20 flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" /> View Details
                    </Button>
                  </Link>
                </div>
                <Image
                  src={poster.src}
                  alt={poster.title}
                  fill
                  className={`object-cover transition-transform duration-500 ${
                    hoveredGalleryItem === index ? "scale-110" : "scale-100"
                  }`}
                />
              </motion.div>
            ))}


          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <TestimonialSlider />

      {/* CTA Section */}
      <section className="py-16 bg-emerald-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Start Your Wellness Journey?</h2>
            <p className="text-xl mb-8 text-green-100">
              Explore our complete range of Ayurvedic products and place your order for natural wellness!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-white text-emerald-800 hover:bg-green-50 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Link href="/menu">Browse Products</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Link href="/contact">Order Now</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  )
}
