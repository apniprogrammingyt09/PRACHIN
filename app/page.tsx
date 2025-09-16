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
    "name": "Prachin Ayurveda",
    "description": "Premium Ayurvedic oils, natural shampoos & herbal wellness products",
    "url": "https://prachin-ayurveda.vercel.app",
    "telephone": "+91-98765-43210",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "openingHours": "Mo-Su 09:00-21:00",
    "priceRange": "₹₹",
    "servesCuisine": "Ayurvedic Products",
    "hasMenu": "https://prachin-ayurveda.vercel.app/menu"
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

      {/* Special Offers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-green-600 text-white hover:bg-green-700 transition-all duration-300">NEW</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-emerald-800">Special Wellness Offers</h2>
            <p className="text-lg text-emerald-700">
              Limited-time deals on our premium Ayurvedic products. Order now before they're gone!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-green-100 h-full transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="h-32 bg-white/50 rounded-lg mb-4 flex items-center justify-center transition-all duration-300 hover:bg-white/70">
                    <Droplets className="h-16 w-16 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-800">Buy 2 Get 1 on Face Oils</h3>
                  <p className="text-emerald-700 mb-4">
                    Purchase any two face oils and get the third one absolutely free!
                  </p>
                  <p className="text-lg font-bold text-green-600">From ₹399</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-green-100 h-full transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="h-32 bg-white/50 rounded-lg mb-4 flex items-center justify-center transition-all duration-300 hover:bg-white/70">
                    <Heart className="h-16 w-16 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-800">25% Off Wellness Bundles</h3>
                  <p className="text-emerald-700 mb-4">
                    Complete your wellness routine with our curated product bundles at a special price!
                  </p>
                  <p className="text-lg font-bold text-green-600">From ₹899</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-green-100 h-full transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="h-32 bg-white/50 rounded-lg mb-4 flex items-center justify-center transition-all duration-300 hover:bg-white/70">
                    <Leaf className="h-16 w-16 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-800">Hair Care Combo</h3>
                  <p className="text-emerald-700 mb-4">
                    Premium hair oil and shampoo combo for complete hair wellness.
                  </p>
                  <p className="text-lg font-bold text-green-600">Only ₹649</p>
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
            {products.map((item, index) => (
              <motion.div
                key={item._id}
                className="relative h-64 rounded-lg overflow-hidden shadow-md cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredGalleryItem(item._id)}
                onMouseLeave={() => setHoveredGalleryItem(null)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-emerald-800/90 to-transparent z-10 flex flex-col justify-end p-4 transition-opacity duration-300 ${
                    hoveredGalleryItem === item._id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                  <p className="text-white/90 font-medium">₹{(item.price || 0).toFixed(2)}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2 bg-white text-emerald-800 hover:bg-green-50 w-full transition-all duration-300 hover:shadow-md border border-transparent hover:border-emerald-800/20 flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" /> Quick View
                  </Button>
                </div>
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className={`object-cover transition-transform duration-500 ${
                    hoveredGalleryItem === item._id ? "scale-110" : "scale-100"
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-green-600/30 hover:translate-y-[-5px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4 transition-all duration-300 hover:shadow-md hover:scale-105">
                  <Image
                    src="/placeholder.svg?height=100&width=100&text=PK"
                    alt="Priya Kumari"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-emerald-800">Priya Kumari</h3>
              </div>
              <p className="text-emerald-700">
                The Mukh Kanti face oil has transformed my skin! It's so natural and effective. I can see the glow and
                my skin feels so much healthier. Highly recommend!
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-green-600/30 hover:translate-y-[-5px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4 transition-all duration-300 hover:shadow-md hover:scale-105">
                  <Image
                    src="/placeholder.svg?height=100&width=100&text=RS"
                    alt="Rajesh Sharma"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-emerald-800">Rajesh Sharma</h3>
              </div>
              <p className="text-emerald-700">
                The pain relief oil works wonders! My joint pain has reduced significantly after using it regularly.
                Fast delivery and authentic products.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-green-600/30 hover:translate-y-[-5px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4 transition-all duration-300 hover:shadow-md hover:scale-105">
                  <Image
                    src="/placeholder.svg?height=100&width=100&text=AM"
                    alt="Anita Mehta"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-emerald-800">Anita Mehta</h3>
              </div>
              <p className="text-emerald-700">
                I've been using their hair oil and shampoo for months now. My hair fall has reduced and my hair feels
                stronger and shinier. Pure Ayurvedic goodness!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

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
