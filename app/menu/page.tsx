"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Search, X, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product-card"
import { useData } from "@/contexts/data-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { categories } from "@/lib/models/Product"

export default function MenuPage() {
  const searchParams = useSearchParams()
  const { products, isProductsCached, refreshProducts } = useData()
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingProducts, setIsLoadingProducts] = useState(!isProductsCached)

  const [maxPrice, setMaxPrice] = useState(2000)
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  const [skinTypeFilters, setSkinTypeFilters] = useState({
    oily: false,
    dry: false,
    sensitive: false,
    combination: false,
  })

  useEffect(() => {
    const searchFromUrl = searchParams.get("search")
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(products)

      const prices = products.map((p: any) => p.price || 0)
      const highestPrice = Math.max(...prices)
      const roundedMax = Math.ceil(highestPrice / 500) * 500
      setMaxPrice(Math.min(roundedMax, 2000))
    }
  }, [products])

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

  useEffect(() => {
    let filtered = [...products]

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      )
    }

    filtered = filtered.filter((product) => (product.price || 0) <= maxPrice)

    if (skinTypeFilters.oily) {
      filtered = filtered.filter(
        (product) => product.skinType && product.skinType.some((type: string) => type.toLowerCase().includes("oily")),
      )
    }
    if (skinTypeFilters.dry) {
      filtered = filtered.filter(
        (product) => product.skinType && product.skinType.some((type: string) => type.toLowerCase().includes("dry")),
      )
    }
    if (skinTypeFilters.sensitive) {
      filtered = filtered.filter(
        (product) =>
          product.skinType && product.skinType.some((type: string) => type.toLowerCase().includes("sensitive")),
      )
    }
    if (skinTypeFilters.combination) {
      filtered = filtered.filter(
        (product) =>
          product.skinType && product.skinType.some((type: string) => type.toLowerCase().includes("combination")),
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low-high":
          return (a.price || 0) - (b.price || 0)
        case "price-high-low":
          return (b.price || 0) - (a.price || 0)
        case "name":
          return (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase())
        case "featured":
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchQuery, maxPrice, sortBy, skinTypeFilters])

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSortBy("featured")
    setSkinTypeFilters({
      oily: false,
      dry: false,
      sensitive: false,
      combination: false,
    })
    setMaxPrice(2000)
  }

  const handleSkinTypeChange = (skinType: keyof typeof skinTypeFilters) => {
    setSkinTypeFilters((prev) => ({
      ...prev,
      [skinType]: !prev[skinType],
    }))
  }

  return (
    <div className="bg-green-50 min-h-screen">
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-800">Our Products</h1>
            <p className="mt-4 text-lg text-green-700">Discover our authentic Ayurvedic oils and wellness products</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5" />
                <Input
                  placeholder="Search for oils, face packs, shampoos, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 py-3 text-lg border-green-200 focus-visible:ring-green-600 bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-green-200 text-green-800 hover:bg-green-50 px-6 lg:hidden bg-transparent"
                  >
                    <SlidersHorizontal className="h-5 w-5 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="text-green-800">Filter Products</SheetTitle>
                    <SheetDescription>Refine your search with these filters</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <FilterContent
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      maxPrice={maxPrice}
                      setMaxPrice={setMaxPrice}
                      skinTypeFilters={skinTypeFilters}
                      handleSkinTypeChange={handleSkinTypeChange}
                      clearAllFilters={clearAllFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-green-200 focus:ring-green-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-8">
              <div className="hidden lg:block w-80 flex-shrink-0">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-green-200 sticky top-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filter Products
                    </h3>
                    <Button variant="ghost" onClick={clearAllFilters} className="text-green-600 hover:text-green-800">
                      Clear All
                    </Button>
                  </div>
                  <FilterContent
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    skinTypeFilters={skinTypeFilters}
                    handleSkinTypeChange={handleSkinTypeChange}
                    clearAllFilters={clearAllFilters}
                    isDesktop={true}
                  />
                </div>
              </div>

              <div className="flex-1">
                {isLoadingProducts ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
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
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-white rounded-xl p-8 max-w-md mx-auto shadow-md">
                      <h3 className="text-xl font-semibold text-green-800 mb-2">No products found</h3>
                      <p className="text-green-700 mb-4">
                        {searchQuery
                          ? `No products match "${searchQuery}". Try adjusting your filters.`
                          : `No products available with current filters.`}
                      </p>
                      <Button onClick={clearAllFilters} className="bg-green-600 hover:bg-green-700 text-white">
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        id={product._id}
                        image={product.image}
                        title={product.name}
                        price={product.price || 0}
                        category={product.category}
                        stockQuantity={product.stockQuantity || 0}
                        inStock={product.inStock !== false}
                      />
                    ))}
                  </motion.div>
                )}

                {!isLoadingProducts && filteredProducts.length > 0 && (
                  <div className="text-center mt-8">
                    <p className="text-green-700">
                      Showing {filteredProducts.length} of {products.length} products
                      {selectedCategory !== "All" && ` in ${selectedCategory}`}
                      {searchQuery && ` matching "${searchQuery}"`}
                      {maxPrice < 2000 && ` under ₹${maxPrice}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FilterContent({
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  skinTypeFilters,
  handleSkinTypeChange,
  clearAllFilters,
  isDesktop = false,
}: {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  maxPrice: number
  setMaxPrice: (price: number) => void
  skinTypeFilters: any
  handleSkinTypeChange: (skinType: string) => void
  clearAllFilters: () => void
  isDesktop?: boolean
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-green-800 mb-3">Category</h4>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={
                selectedCategory === category
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-green-200 text-green-800 hover:bg-green-50"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-green-800 mb-3">Maximum Price</h4>
        <div className="px-2">
          <Slider
            value={[maxPrice]}
            onValueChange={(value) => setMaxPrice(value[0])}
            max={2000}
            min={100}
            step={50}
            className="w-full mb-3"
          />
          <div className="flex justify-between text-green-600 text-sm">
            <span>₹100</span>
            <span className="font-medium text-green-800">₹{maxPrice}</span>
            <span>₹2000</span>
          </div>
          <p className="text-xs text-green-600 mt-1 text-center">Show items up to ₹{maxPrice}</p>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-green-800 mb-3">Skin Type</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="oily"
              checked={skinTypeFilters.oily}
              onCheckedChange={() => handleSkinTypeChange("oily")}
              className="border-green-600 data-[state=checked]:bg-green-600"
            />
            <label htmlFor="oily" className="text-green-700 cursor-pointer">
              Oily Skin
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dry"
              checked={skinTypeFilters.dry}
              onCheckedChange={() => handleSkinTypeChange("dry")}
              className="border-green-600 data-[state=checked]:bg-green-600"
            />
            <label htmlFor="dry" className="text-green-700 cursor-pointer">
              Dry Skin
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sensitive"
              checked={skinTypeFilters.sensitive}
              onCheckedChange={() => handleSkinTypeChange("sensitive")}
              className="border-green-600 data-[state=checked]:bg-green-600"
            />
            <label htmlFor="sensitive" className="text-green-700 cursor-pointer">
              Sensitive Skin
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="combination"
              checked={skinTypeFilters.combination}
              onCheckedChange={() => handleSkinTypeChange("combination")}
              className="border-green-600 data-[state=checked]:bg-green-600"
            />
            <label htmlFor="combination" className="text-green-700 cursor-pointer">
              Combination Skin
            </label>
          </div>
        </div>
      </div>

      {!isDesktop && (
        <Button onClick={clearAllFilters} className="w-full bg-green-800 hover:bg-green-900 text-white">
          Apply Filters
        </Button>
      )}
    </div>
  )
}
