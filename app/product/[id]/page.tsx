"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Minus, Plus, ShoppingBag, Check, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { ProductCard } from "@/components/product-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ProductGallery } from "@/components/product-gallery"
import { useData } from "@/contexts/data-context"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { addItem } = useCart()
  const { toast } = useToast()
  const { products } = useData()
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find((p) => p._id === id)
      if (foundProduct) {
        setProduct(foundProduct)

        const related = products
          .filter((p) => p._id !== foundProduct._id && p.category === foundProduct.category)
          .slice(0, 4)

        if (related.length < 4) {
          const otherProducts = products
            .filter((p) => p._id !== foundProduct._id && p.category !== foundProduct.category)
            .slice(0, 4 - related.length)
          related.push(...otherProducts)
        }

        setRelatedProducts(related)
      } else {
        toast({
          title: "Error",
          description: "Product not found.",
          variant: "destructive",
        })
      }
    }
  }, [id, products, toast])

  if (!product && products.length > 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#8B4513]">Product not found</h1>
        <p className="mt-4 text-[#A67C52]">The product you are looking for does not exist.</p>
        <Button className="mt-6 bg-[#D4915D] hover:bg-[#C17A45] text-white" onClick={() => router.push("/menu")}>
          Back to Menu
        </Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-[#A67C52]">Loading...</div>
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (isAdding || isAdded) return

    setIsAdding(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }

    setIsAdding(false)
    setIsAdded(true)

    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    })

    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const getButtonState = () => {
    if (!product.inStock || product.stockQuantity === 0)
      return { bg: "bg-gray-400", text: "Out of Stock", icon: ShoppingBag }
    if (isAdding) return { bg: "bg-[#7A3A0D]", text: "Adding...", icon: RotateCw }
    if (isAdded) return { bg: "bg-green-600", text: "Added!", icon: Check }
    return { bg: "bg-[#8B4513] hover:bg-[#7A3A0D]", text: "Add to Cart", icon: ShoppingBag }
  }

  const buttonState = getButtonState()

  const productImages = []

  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const sortedImages = [...product.images].sort((a, b) => {
      if (a.isMain) return -1
      if (b.isMain) return 1
      return 0
    })

    sortedImages.forEach((img) => {
      const imageData = typeof img === "string" ? img : img.data
      if (imageData) {
        const imageUrl = imageData.startsWith("data:") ? imageData : `data:image/jpeg;base64,${imageData}`
        productImages.push(imageUrl)
      }
    })
  }

  if (productImages.length === 0 && product.image) {
    const imageUrl = product.image.startsWith("data:") ? product.image : `data:image/jpeg;base64,${product.image}`
    productImages.push(imageUrl)
  }

  if (productImages.length === 0) {
    productImages.push(`/placeholder.svg?height=600&width=600&text=${encodeURIComponent(product.name)}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6 text-[#8B4513] hover:text-[#D4915D] hover:bg-[#FFF9F0]"
        onClick={() => router.back()}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="flex flex-col lg:flex-row gap-8 mb-16">
        <motion.div
          className="lg:w-1/2"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProductGallery images={productImages} productName={product.name} />
        </motion.div>

        <motion.div
          className="lg:w-1/2"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block bg-[#FEEBD7] text-[#D4915D] px-3 py-1 rounded-full text-sm">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-[#8B4513] mt-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-[#D4915D] mt-2">₹{product.price.toFixed(2)}</p>

          <div className="mt-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                !product.inStock || product.stockQuantity === 0
                  ? "bg-red-100 text-red-600"
                  : product.stockQuantity < 10
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
              }`}
            >
              {!product.inStock || product.stockQuantity === 0 ? "Out of Stock" : `${product.stockQuantity} in stock`}
            </span>
          </div>

          <p className="text-[#A67C52] mt-4">{product.description}</p>

          {product.benefits && product.benefits.length > 0 && (
            <div className="mt-4">
              <p className="text-[#8B4513] font-medium">Benefits:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.benefits.map((benefit: string) => (
                  <span
                    key={benefit}
                    className="bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded-md text-sm"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.skinType && product.skinType.length > 0 && (
            <div className="mt-4">
              <p className="text-[#8B4513] font-medium">Suitable for:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.skinType.map((type: string) => (
                  <span
                    key={type}
                    className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-md text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.volume && <p className="text-[#A67C52] mt-2">Volume: {product.volume}</p>}

          {product.weight && <p className="text-[#A67C52] mt-2">Weight: {product.weight}</p>}

          {product.allergens && product.allergens.length > 0 && (
            <div className="mt-4">
              <p className="text-[#8B4513] font-medium">Allergens:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.allergens.map((allergen: string) => (
                  <span
                    key={allergen}
                    className="bg-[#FFF9F0] border border-[#E8DCCA] text-[#A67C52] px-2 py-1 rounded-md text-sm"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-[#E8DCCA] rounded-full overflow-hidden">
              <button
                className="px-4 py-2 text-[#8B4513] hover:bg-[#FFF9F0] transition-colors"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 text-[#8B4513] font-medium min-w-[3rem] text-center">{quantity}</span>
              <button
                className="px-4 py-2 text-[#8B4513] hover:bg-[#FFF9F0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={increaseQuantity}
                disabled={quantity >= product.stockQuantity}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {quantity > product.stockQuantity && (
              <p className="text-red-600 text-sm mt-2">Only {product.stockQuantity} items available in stock</p>
            )}

            <motion.button
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-all duration-300 ${
                !product.inStock || product.stockQuantity === 0 ? "bg-gray-400 cursor-not-allowed" : buttonState.bg
              }`}
              onClick={handleAddToCart}
              disabled={
                !product.inStock ||
                product.stockQuantity === 0 ||
                isAdding ||
                isAdded ||
                quantity > product.stockQuantity
              }
              whileTap={{ scale: 0.98 }}
              animate={{
                scale: isAdded ? [1, 1.05, 1] : 1,
              }}
              transition={{
                scale: { duration: 0.3, ease: "easeOut" },
              }}
            >
              <motion.div
                animate={{
                  rotate: isAdding ? 360 : isAdded ? -180 : 0,
                  scale: isAdded ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  rotate: {
                    duration: isAdding ? 1 : 0.3,
                    ease: "linear",
                    repeat: isAdding ? Number.POSITIVE_INFINITY : 0,
                  },
                  scale: { duration: 0.3, ease: "easeOut" },
                }}
              >
                <buttonState.icon className="h-5 w-5" />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.span
                  key={buttonState.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {buttonState.text}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </div>

      <Tabs defaultValue="details" className="mb-16">
        <TabsList className="bg-[#FFF9F0] border border-[#E8DCCA]">
          <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-[#8B4513]">
            Details
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="data-[state=active]:bg-white data-[state=active]:text-[#8B4513]">
            Ingredients
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="bg-white p-6 rounded-b-lg border border-t-0 border-[#E8DCCA]">
          <div className="space-y-4">
            <p className="text-[#A67C52]">{product.description}</p>

            {product.usage && (
              <div>
                <h4 className="font-medium text-[#8B4513] mb-2">How to Use:</h4>
                <p className="text-[#A67C52] whitespace-pre-line">{product.usage}</p>
              </div>
            )}

            {product.benefits && product.benefits.length > 0 && (
              <div>
                <h4 className="font-medium text-[#8B4513] mb-2">Benefits:</h4>
                <ul className="list-disc pl-5 space-y-1 text-[#A67C52]">
                  {product.benefits.map((benefit: string) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.skinType && product.skinType.length > 0 && (
              <div>
                <h4 className="font-medium text-[#8B4513] mb-2">Suitable for:</h4>
                <ul className="list-disc pl-5 space-y-1 text-[#A67C52]">
                  {product.skinType.map((type: string) => (
                    <li key={type}>{type}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.volume && (
              <p className="text-[#A67C52]">
                <span className="font-medium text-[#8B4513]">Volume:</span> {product.volume}
              </p>
            )}

            {product.weight && (
              <p className="text-[#A67C52]">
                <span className="font-medium text-[#8B4513]">Weight:</span> {product.weight}
              </p>
            )}
            {product.allergens && product.allergens.length > 0 && (
              <p className="text-[#A67C52]">
                <span className="font-medium text-[#8B4513]">Allergens:</span> {product.allergens.join(", ")}
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="ingredients" className="bg-white p-6 rounded-b-lg border border-t-0 border-[#E8DCCA]">
          {product.ingredients && product.ingredients.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-[#A67C52]">
              {product.ingredients.map((ingredient: string) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[#A67C52]">Ingredient information not available.</p>
          )}
        </TabsContent>
      </Tabs>

      {relatedProducts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#8B4513] mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={product.image}
                title={product.name}
                price={product.price}
                category={product.category}
                stockQuantity={product.stockQuantity || 0}
                inStock={product.inStock !== false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
