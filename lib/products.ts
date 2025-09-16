export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  featured?: boolean
  benefits?: string[]
  ingredients?: string[]
  usage?: string
  skinType?: string[]
  volume?: string
  tags?: string[]
}

// Export the products array for components that still need it
export const products: Product[] = []

// Sample base64 images for seeding (these are small placeholder images)
const sampleImages = {
  faceOil: "/images/mukh-kanti-face-oil.jpg",
  hairOil: "/images/14-herbs-hair-oil.jpg",
  painRelief: "/images/pain-relief-oil.jpg",
  facePack: "/images/ubtan-face-pack.jpg",
  shampoo: "/images/ayurvedic-shampoo.jpg",
}

export const seedProducts: Omit<Product, "id">[] = [
  {
    name: "Mukh Kanti Face Oil",
    description:
      "Natural face oil for glowing skin with traditional Ayurvedic herbs. Reduces dark spots and promotes healthy skin texture.",
    price: 450,
    category: "Face Oils",
    image: sampleImages.faceOil, // Using actual product image
    featured: true,
    benefits: ["Reduces dark spots", "Promotes glowing skin", "Anti-aging properties", "Natural moisturizer"],
    ingredients: ["Sesame oil", "Turmeric", "Neem", "Rose petals", "Sandalwood"],
    usage: "Apply 2-3 drops on clean face, massage gently in circular motions. Use twice daily for best results.",
    skinType: ["All skin types", "Dry skin", "Mature skin"],
    volume: "100ml",
    tags: ["natural", "ayurvedic", "face care", "anti-aging"],
  },
  {
    name: "14 Herbs Hair Oil",
    description:
      "Powerful blend of 14 traditional herbs for strong, healthy hair. Prevents hair fall and promotes natural growth.",
    price: 350,
    category: "Hair Oils",
    image: sampleImages.hairOil, // Using actual product image
    featured: true,
    benefits: ["Reduces hair fall", "Promotes hair growth", "Strengthens roots", "Adds natural shine"],
    ingredients: [
      "Coconut oil",
      "Bhringraj",
      "Amla",
      "Fenugreek",
      "Curry leaves",
      "Hibiscus",
      "Brahmi",
      "Neem",
      "Rosemary",
      "Jatamansi",
      "Methi",
      "Onion extract",
      "Aloe vera",
      "Castor oil",
    ],
    usage:
      "Apply to scalp and hair, massage for 5-10 minutes. Leave for 2 hours or overnight, then wash with mild shampoo.",
    volume: "200ml",
    tags: ["hair care", "natural", "herbal", "hair growth"],
  },
  {
    name: "Pain Relief Oil",
    description:
      "Ayurvedic pain relief oil for joint and muscle pain. Provides quick relief from body aches and stiffness.",
    price: 280,
    category: "Pain Relief Oils",
    image: sampleImages.painRelief, // Using actual product image
    benefits: ["Quick pain relief", "Reduces inflammation", "Improves blood circulation", "Soothes muscles"],
    ingredients: ["Mustard oil", "Eucalyptus", "Wintergreen", "Camphor", "Clove oil", "Ginger extract"],
    usage: "Apply on affected area and massage gently. Use 2-3 times daily or as needed.",
    volume: "200ml",
    tags: ["pain relief", "therapeutic", "muscle care"],
  },
  {
    name: "Ubtan Face Pack",
    description:
      "Traditional ubtan face pack for natural skin cleansing and brightening. Made with pure herbs and natural ingredients.",
    price: 220,
    category: "Face Packs",
    image: sampleImages.facePack, // Using actual product image
    featured: true,
    benefits: ["Deep cleansing", "Skin brightening", "Removes dead skin", "Natural exfoliation"],
    ingredients: ["Chickpea flour", "Turmeric", "Sandalwood powder", "Rose petals", "Neem powder", "Multani mitti"],
    usage:
      "Mix with rose water or milk to make paste. Apply on face, leave for 15-20 minutes, then rinse with lukewarm water.",
    skinType: ["All skin types", "Oily skin", "Acne-prone skin"],
    volume: "100gm",
    tags: ["face pack", "natural", "brightening", "cleansing"],
  },
  {
    name: "Ayurvedic Shampoo",
    description:
      "Gentle herbal shampoo for all hair types. Cleanses without stripping natural oils and promotes healthy scalp.",
    price: 180,
    category: "Shampoos",
    image: sampleImages.shampoo, // Using actual product image
    benefits: ["Gentle cleansing", "Maintains natural oils", "Promotes scalp health", "Suitable for daily use"],
    ingredients: ["Shikakai", "Aritha", "Bhringraj", "Amla", "Neem", "Aloe vera"],
    usage:
      "Apply to wet hair, massage gently to create lather. Rinse thoroughly with water. Follow with conditioner if needed.",
    volume: "200ml",
    tags: ["shampoo", "herbal", "gentle", "natural"],
  },
]

export const categories = ["All", "Face Oils", "Hair Oils", "Pain Relief Oils", "Face Packs", "Shampoos", "Body Care"]
