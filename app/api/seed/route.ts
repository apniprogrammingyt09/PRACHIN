import { NextResponse } from "next/server"
import { ensureAdminExists } from "@/lib/services/userService"
import { productService } from "@/lib/services/productService"

const seedProducts = [
  {
    name: "PRACHIN NUSKHE AYURVEDIC SHAMPOO",
    description: "AYURVEDIC CARE THAT STRENGTHENS, SOFTENS, AND BEAUTIFIES NATURALLY. FOR TIMELESS SECRETS FOR SHINY HAIR",
    price: 399,
    category: "Shampoos",
    image: "/images/shampoo.webp",
    stockQuantity: 50,
    inStock: true,
    featured: true,
    ingredients: ["Amla", "Reetha", "Shikakai", "Methi Dana", "Harsingar", "Aloevera", "Curry Leaves", "Neem Alsi", "Brahmi", "Bhringraj"],
    benefits: ["Helps reduce hair fall & breakage", "Controls dandruff for a clean, healthy scalp", "Promotes thicker, denser, and stronger hair growth", "Makes hair soft, smooth, shiny & frizz-free", "Gently detangles for easy styling & manageability"],
    usage: "STEP 1: Wet your hair thoroughly with clean water. STEP 2: Take a small vessel of water STEP 3: Add the shampoo, mix gently to create foam. STEP 4: Apply the foam evenly on scalp & hair. STEP 5: Massage gently with fingertips for 2-3 minutes. STEP 6: Rinse well with water for best results.",
    weight: "200 ml",
    warnings: "For external use only. Avoid direct contact with eyes. Rinse thoroughly if contact occurs. Discontinue use if irritation or rash occurs."
  },
  {
    name: "14 HERBS HAIR OIL",
    description: "STRONG ROOTS, HEALTHY HAIR. POWERED BY 14 HERBS FOR NATURALLY THICK, SHINY, HEALTHY HAIR.",
    price: 649,
    category: "Hair Oils",
    image: "/images/hairoil.webp",
    stockQuantity: 30,
    inStock: true,
    featured: true,
    ingredients: ["Coconut Oil", "Spikenard", "Indian Gooseberry", "Soapnut", "Shikakai", "Fenugreek Seeds", "Black Seed", "Alkanet Root", "Night Jasmine", "Aloe Vera", "Curry Leaves", "Holy Basil", "Hibiscus Flower", "Neem", "Hibiscus Leaves"],
    benefits: ["Promotes faster hair growth", "Nourishes scalp & strengthens roots", "Adds natural shine & smoothness", "Repairs dry & damaged hair", "100% natural & chemical-free"],
    usage: "Gently massage the oil onto your scalp and hair roots using circular motions. Leave it on for 4-5 hours during the day or overnight for better nourishment. Wash with Prachin Ayurved Shampoo. For best results, use twice a week regularly for 2-3 months.",
    weight: "200 ml",
    warnings: "For external use only. Apply only on hair and scalp. Discontinue use if irritation or rash occurs."
  },
  {
    name: "PRACHIN NUSKHE PAIN RELIEF OIL",
    description: "WHERE TRADITION MEETS EFFECTIVE RELIEF. ANCIENT HEALING, MODERN RELIEF. PRACHIN NUSKHE RESTORES MOBILITY",
    price: 399,
    category: "Pain Relief Oils",
    image: "/images/painoil.webp",
    stockQuantity: 40,
    inStock: true,
    featured: true,
    ingredients: ["Mustard Oil (Cold-Pressed)", "Camphor", "Fenugreek Seeds", "Garlic", "Cloves", "Night Jasmine (Harsingar) Extract", "Carom Seeds"],
    benefits: ["Relieves neck & back pain", "Reduces joint & body aches", "Improves flexibility & mobility", "Eases stiff muscles & joints", "Balances Vata naturally"],
    usage: "STEP 1: Warm a few drops of oil and apply to the affected area. STEP 2: Gently massage with light pressure for 10-15 minutes. STEP 3: Cover the area and leave for 10-15 minutes for optimal results.",
    weight: "200 ml",
    warnings: "For external use only. Avoid contact with eyes and mucous membranes. Keep out of reach of children. Discontinue use if irritation or rash occurs."
  },
  {
    name: "MUKH KANTI FACE OIL",
    description: "REDUCES DARK SPOTS & PIGMENTATION. LIGHTENS BLEMISHES, SCARS, UNEVEN SKIN TONE OVER TIME.",
    price: 449,
    category: "Face Oils",
    image: "/images/faceoil.webp",
    stockQuantity: 25,
    inStock: true,
    featured: true,
    ingredients: ["Coconut Oil", "Almond Oil", "Kesar", "Mulethi Nagkesar", "Manjistha Kamal", "Gulab", "Neem", "Chandan", "Pahadi Namak", "Lodh"],
    benefits: ["Skin brightening", "Treats acne & moles", "Reduce skin pigmentation", "Improves blood circulation", "Boosts natural glow"],
    usage: "STEP 1: Wash your face thoroughly with water. STEP 2: After washing, apply 4-5 drops of Prachin Ayurved oil. STEP 3: Massage gently all over your face till it absorbs.",
    weight: "60 ml",
    warnings: "For external use only. Store in a cool, dry place. Perform a patch test before first use. Discontinue if irritation or redness occurs."
  },
  {
    name: "UBTAN FACE PACK",
    description: "Revives natural glow. Improves skin texture. Natural cleansing.",
    price: 349,
    category: "Face Packs",
    image: "/images/facepack.webp",
    stockQuantity: 35,
    inStock: true,
    featured: false,
    ingredients: ["Kesar", "Gulab", "Kamal Pushp", "Neem Powder", "Multani Mitti", "Besan", "Haldi", "Mulethi Chandan"],
    benefits: ["Revives natural glow", "Improves skin texture", "Natural cleansing"],
    usage: "STEP 1: Take 1/2 tbs of pack & mix with it water/milk/curd. STEP 2: Apply on your face 10-15 min. STEP 3: Wash your face with water. STEP 4: Follow it up with Prachin Ayurved Face Oil.",
    weight: "100 gm",
    warnings: "For external use only. Store in a cool, dry place. Perform a patch test before first use. Discontinue if irritation or redness occurs."
  }
]

export async function GET() {
  try {
    // Ensure admin user exists
    await ensureAdminExists()

    const existingProducts = await productService.getAllProducts()

    if (existingProducts.length === 0) {
      for (const productData of seedProducts) {
        await productService.createProduct(productData)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with Prachin Ayurved products",
      productsCount: existingProducts.length > 0 ? existingProducts.length : seedProducts.length,
    })
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}

export async function POST() {
  return GET()
}
