"use client"

import type React from "react"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, Upload, Plus, X, Save, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories } from "@/lib/models/Product"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import Image from "next/image"

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<Array<{ id: string; data: string; preview: string; isMain: boolean }>>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    featured: false,
    weight: "",
    ingredients: [""],
    allergens: [] as string[],
    tags: [""],
    stockQuantity: "",
    benefits: [""],
    usage: "",
    skinType: [] as string[],
    volume: "",
  })

  const allergenOptions = ["Sesame", "Nuts", "Dairy", "Soy", "Sulfites"]
  const skinTypeOptions = ["Oily", "Dry", "Combination", "Sensitive", "Normal", "Acne-Prone"]

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const product = await api.products.getById(id)

      const productImages = product.images || []
      if (productImages.length > 0) {
        const imageList = productImages.map((img: any, index: number) => ({
          id: `existing-${index}`,
          data: img.data || img,
          preview: img.data?.startsWith("data:") ? img.data : `data:image/jpeg;base64,${img.data || img}`,
          isMain: img.isMain || index === 0,
        }))
        setImages(imageList)
      } else if (product.image) {
        const imageUrl = product.image.startsWith("data:") ? product.image : `data:image/jpeg;base64,${product.image}`
        setImages([
          {
            id: "existing-0",
            data: product.image,
            preview: imageUrl,
            isMain: true,
          },
        ])
      }

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        category: product.category || "",
        featured: product.featured || false,
        weight: product.weight || "",
        ingredients: product.ingredients?.length > 0 ? product.ingredients : [""],
        allergens: product.allergens || [],
        tags: product.tags?.length > 0 ? product.tags : [""],
        stockQuantity: product.stockQuantity?.toString() || "",
        benefits: product.benefits?.length > 0 ? product.benefits : [""],
        usage: product.usage || "",
        skinType: product.skinType || [],
        volume: product.volume || "",
      })
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Failed to load product. Please try again.",
        variant: "destructive",
      })
      router.push("/admin/products")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }))
  }

  const handleAllergenChange = (allergen: string) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a) => a !== allergen)
        : [...prev.allergens, allergen],
    }))
  }

  const handleArrayItemChange = (field: "ingredients" | "tags" | "benefits", index: number, value: string) => {
    setFormData((prev) => {
      const newArray = [...prev[field]]
      newArray[index] = value
      return { ...prev, [field]: newArray }
    })
  }

  const addArrayItem = (field: "ingredients" | "tags" | "benefits") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayItem = (field: "ingredients" | "tags" | "benefits", index: number) => {
    setFormData((prev) => {
      const newArray = [...prev[field]]
      newArray.splice(index, 1)
      return { ...prev, [field]: newArray }
    })
  }

  const handleSkinTypeChange = (skinType: string) => {
    setFormData((prev) => ({
      ...prev,
      skinType: prev.skinType.includes(skinType)
        ? prev.skinType.filter((s) => s !== skinType)
        : [...prev.skinType, skinType],
    }))
  }

  const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = document.createElement("img")

      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxWidth) {
              width = (width * maxWidth) / height
              height = maxWidth
            }
          }

          canvas.width = width
          canvas.height = height

          // Draw and compress
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            const compressedDataUrl = canvas.toDataURL("image/jpeg", quality)
            resolve(compressedDataUrl)
          } else {
            reject(new Error("Could not get canvas context"))
          }
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error("Failed to load image"))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select images smaller than 10MB.",
            variant: "destructive",
          })
          continue
        }

        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: "Please select valid image files.",
            variant: "destructive",
          })
          continue
        }

        try {
          const compressedDataUrl = await compressImage(file, 800, 0.8)
          const base64Data = compressedDataUrl.split(",")[1]
          const imageId = Date.now().toString() + Math.random().toString(36).substr(2, 9)

          setImages((prev) => [
            ...prev,
            {
              id: imageId,
              data: base64Data,
              preview: compressedDataUrl,
              isMain: prev.length === 0,
            },
          ])
        } catch (error) {
          console.error("Error compressing image:", error)
          toast({
            title: "Error processing image",
            description: "Failed to process the image. Please try again.",
            variant: "destructive",
          })
        }
      }
    }
  }

  const removeImage = (imageId: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== imageId)
      if (filtered.length > 0 && !filtered.some((img) => img.isMain)) {
        filtered[0].isMain = true
      }
      return filtered
    })
  }

  const setMainImage = (imageId: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isMain: img.id === imageId,
      })),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stockQuantity: Number.parseInt(formData.stockQuantity) || 0,
        ingredients: formData.ingredients.filter((i) => i.trim() !== ""),
        tags: formData.tags.filter((t) => t.trim() !== ""),
        benefits: formData.benefits.filter((b) => b.trim() !== ""),
        images: images.map((img) => ({
          data: img.data,
          isMain: img.isMain,
        })),
        image: images.find((img) => img.isMain)?.data || images[0]?.data || "",
      }

      await api.products.update(id, productData)

      toast({
        title: "Success",
        description: "Product updated successfully!",
        variant: "default",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#4A7C59]">Loading product...</div>
      </div>
    )
  }

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-6 text-[#2D5016] hover:text-[#4A7C59] hover:bg-green-50"
        onClick={() => router.back()}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2D5016]">Edit Product</h1>
            <p className="text-[#4A7C59]">Update product information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#2D5016]">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-[#2D5016]">
                      Product Name*
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 border-green-200 focus-visible:ring-[#4A7C59]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-[#2D5016]">
                      Description*
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 border-green-200 focus-visible:ring-[#4A7C59]"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price" className="text-[#2D5016]">
                        Price (₹)*
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleNumberChange}
                        className="mt-1 border-green-200 focus-visible:ring-[#4A7C59]"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-[#2D5016]">
                        Category*
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="mt-1 border-green-200 focus:ring-[#D4915D]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="stockQuantity" className="text-[#2D5016]">
                        Stock Quantity*
                      </Label>
                      <Input
                        id="stockQuantity"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleNumberChange}
                        className="mt-1 border-green-200 focus-visible:ring-[#4A7C59]"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={handleCheckboxChange}
                      className="text-[#4A7C59] border-green-200"
                    />
                    <Label htmlFor="featured" className="text-[#2D5016] cursor-pointer">
                      Featured Product
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[#2D5016]">Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="weight" className="text-[#2D5016]">
                      Weight/Size
                    </Label>
                    <Input
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="e.g., 500g, 1kg"
                      className="mt-1 border-green-200 focus-visible:ring-[#4A7C59]"
                    />
                  </div>

                  <div>
                    <Label className="text-[#2D5016] mb-2 block">Ingredients</Label>
                    {formData.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <Input
                          value={ingredient}
                          onChange={(e) => handleArrayItemChange("ingredients", index, e.target.value)}
                          className="border-green-200 focus-visible:ring-[#4A7C59]"
                          placeholder={`Ayurvedic herb ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem("ingredients", index)}
                          disabled={formData.ingredients.length === 1}
                          className="text-[#4A7C59] hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("ingredients")}
                      className="mt-2 border-green-200 text-[#2D5016]"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Herb/Ingredient
                    </Button>
                  </div>

                  <div>
                    <Label className="text-[#2D5016] mb-2 block">Benefits</Label>
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <Input
                          value={benefit}
                          onChange={(e) => handleArrayItemChange("benefits", index, e.target.value)}
                          className="border-green-200 focus-visible:ring-[#4A7C59]"
                          placeholder={`Benefit ${index + 1} (e.g., Moisturizes skin, Reduces inflammation)`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem("benefits", index)}
                          disabled={formData.benefits.length === 1}
                          className="text-[#4A7C59] hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("benefits")}
                      className="mt-2 border-green-200 text-[#2D5016]"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Benefit
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="usage" className="text-[#2D5016]">
                      Usage Instructions
                    </Label>
                    <Textarea
                      id="usage"
                      name="usage"
                      value={formData.usage}
                      onChange={handleChange}
                      className="mt-1 border-green-200 focus-visible:ring-[#4A7C59]"
                      rows={3}
                      placeholder="How to use this product (e.g., Apply 2-3 drops on clean face, massage gently)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="volume" className="text-[#2D5016]">
                      Volume/Size
                    </Label>
                    <Input
                      id="volume"
                      name="volume"
                      value={formData.volume}
                      onChange={handleChange}
                      placeholder="e.g., 30ml, 100ml, 250ml"
                      className="mt-1 border-green-200 focus-visible:ring-[#4A7C59]"
                    />
                  </div>

                  <div>
                    <Label className="text-[#2D5016] mb-2 block">Suitable for Skin Types</Label>
                    <div className="flex flex-wrap gap-4">
                      {skinTypeOptions.map((skinType) => (
                        <div key={skinType} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skintype-${skinType}`}
                            checked={formData.skinType.includes(skinType)}
                            onCheckedChange={() => handleSkinTypeChange(skinType)}
                            className="text-[#4A7C59] border-green-200"
                          />
                          <Label htmlFor={`skintype-${skinType}`} className="text-[#2D5016] cursor-pointer">
                            {skinType}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#2D5016] mb-2 block">Allergens</Label>
                    <div className="flex flex-wrap gap-4">
                      {allergenOptions.map((allergen) => (
                        <div key={allergen} className="flex items-center space-x-2">
                          <Checkbox
                            id={`allergen-${allergen}`}
                            checked={formData.allergens.includes(allergen)}
                            onCheckedChange={() => handleAllergenChange(allergen)}
                            className="text-[#4A7C59] border-green-200"
                          />
                          <Label htmlFor={`allergen-${allergen}`} className="text-[#2D5016] cursor-pointer">
                            {allergen}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#2D5016] mb-2 block">Tags</Label>
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <Input
                          value={tag}
                          onChange={(e) => handleArrayItemChange("tags", index, e.target.value)}
                          className="border-green-200 focus-visible:ring-[#4A7C59]"
                          placeholder={`Wellness tag ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem("tags", index)}
                          disabled={formData.tags.length === 1}
                          className="text-[#4A7C59] hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("tags")}
                      className="mt-2 border-green-200 text-[#2D5016]"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Wellness Tag
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#2D5016]">Product Images</CardTitle>
                </CardHeader>
                <CardContent>
                  {images.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {images.map((image) => (
                          <div key={image.id} className="relative group">
                            <div className="relative aspect-square rounded-lg overflow-hidden border border-green-200">
                              <Image
                                src={image.preview || "/placeholder.svg"}
                                alt="Product preview"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                              {image.isMain && (
                                <div className="absolute top-2 left-2 bg-[#4A7C59] text-white px-2 py-1 rounded text-xs font-medium">
                                  Main
                                </div>
                              )}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeImage(image.id)}
                                  className="h-6 w-6 bg-white/90 border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            {!image.isMain && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setMainImage(image.id)}
                                className="w-full mt-1 border-green-200 text-[#2D5016] text-xs"
                              >
                                <Star className="h-3 w-3 mr-1" />
                                Set as Main
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-green-200 text-[#2D5016]"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add More Images
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-green-200 rounded-lg p-6 text-center cursor-pointer hover:border-[#4A7C59] transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="mb-4">
                        <Upload className="h-10 w-10 text-[#4A7C59] mx-auto" />
                      </div>
                      <p className="text-[#2D5016] font-medium mb-2">Click to upload images</p>
                      <p className="text-[#4A7C59] text-sm mb-4">
                        Supports: JPG, PNG, WEBP (Max 10MB each, auto-compressed)
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-[#4A7C59] text-[#4A7C59] bg-transparent"
                      >
                        Browse Files
                      </Button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[#2D5016]">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-[#4A7C59] hover:bg-[#2D5016] text-white"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Updating..." : "Update Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-green-200 text-[#2D5016] bg-transparent"
                    onClick={() => router.push("/admin/products")}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
