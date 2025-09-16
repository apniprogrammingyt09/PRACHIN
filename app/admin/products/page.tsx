"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, X, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { useData } from "@/contexts/data-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function AdminProductsPage() {
  const { products, refreshProducts, isProductsCached, updateProductCache } = useData()
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!isProductsCached) {
      refreshProducts()
    }
  }, [isProductsCached, refreshProducts])

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [products, searchQuery])

  const handleDeleteProduct = async (productId: string, productName: string) => {
    try {
      await api.products.delete(productId)
      toast({
        title: "Product Deleted",
        description: `${productName} has been deleted successfully.`,
      })
      refreshProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D5016]">Products</h1>
          <p className="text-[#4A7C59]">Manage your Ayurvedic wellness products</p>
        </div>
        <Button asChild className="bg-[#4A7C59] hover:bg-[#2D5016] text-white">
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A7C59] h-4 w-4" />
              <Input
                placeholder="Search products by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-10 border-green-200 focus-visible:ring-[#4A7C59]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A7C59] hover:text-[#2D5016]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <div className="sm:hidden">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full border-green-200 text-[#2D5016] bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="text-[#2D5016]">Filter Products</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <p className="text-[#4A7C59] text-sm">Additional filters can be added here.</p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              {products.length === 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-[#2D5016] mb-2">No products found</h3>
                  <p className="text-[#4A7C59] mb-4">Create your first product to get started.</p>
                  <Button asChild className="bg-[#4A7C59] hover:bg-[#2D5016] text-white">
                    <Link href="/admin/products/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Link>
                  </Button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-[#2D5016] mb-2">No products match your search</h3>
                  <p className="text-[#4A7C59] mb-4">Try adjusting your search terms.</p>
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                    className="border-green-200 text-[#2D5016]"
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const imageUrl =
              product.image && product.image.startsWith("data:")
                ? product.image
                : product.image
                  ? `data:image/jpeg;base64,${product.image}`
                  : "/placeholder.svg?height=200&width=200&text=" + encodeURIComponent(product.name)

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <div className="relative h-32 w-full rounded-md overflow-hidden mb-2">
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized={product.image ? true : false}
                      />
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg text-[#2D5016] line-clamp-1">
                          {product.name}
                        </CardTitle>
                        <p className="text-sm text-[#4A7C59] mt-1">₹{product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-1 ml-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-green-200 text-[#2D5016] p-2 bg-transparent"
                        >
                          <Link href={`/admin/products/${product._id}/edit`}>
                            <Edit className="h-3 w-3" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50 p-2 bg-transparent"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{product.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product._id, product.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <p className="text-sm text-[#4A7C59] line-clamp-2">{product.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <Badge
                          variant={product.stockQuantity > 0 ? "default" : "destructive"}
                          className={
                            product.stockQuantity > 0
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          Stock: {product.stockQuantity}
                        </Badge>
                        <Badge variant="outline" className="border-green-200 text-[#2D5016]">
                          {product.category}
                        </Badge>
                      </div>
                      {product.featured && (
                        <Badge className="bg-green-50 text-[#4A7C59] hover:bg-green-50">Featured</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Results Count */}
      {filteredProducts.length > 0 && (
        <div className="text-center text-[#4A7C59] text-sm">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      )}
    </div>
  )
}
