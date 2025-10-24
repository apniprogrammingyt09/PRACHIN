import type { Metadata } from "next"
import AboutClient from "./about-client"

export const metadata: Metadata = {
  title: "About Us - Prachin Ayurved | Authentic Ayurvedic Products Since 2010",
  description: "Learn about Prachin Ayurved's journey in providing authentic Ayurvedic oils, natural wellness products, and traditional herbal formulations from Taraori, Haryana.",
  keywords: "Prachin Ayurved about, Ayurvedic company history, natural wellness products, traditional herbal oils, Ayurvedic manufacturer Haryana",
  openGraph: {
    title: "About Prachin Ayurved - Authentic Ayurvedic Wellness Since 2010",
    description: "Discover our commitment to traditional Ayurvedic wisdom and natural wellness solutions.",
    url: "https://prachinayurved.in/about",
    siteName: "Prachin Ayurved",
    images: [{
      url: "https://prachinayurved.in/logo2.png",
      width: 1200,
      height: 630,
      alt: "Prachin Ayurved - Authentic Ayurvedic Products"
    }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "About Prachin Ayurved - Authentic Ayurvedic Wellness",
    description: "Learn about our journey in providing traditional Ayurvedic products and natural wellness solutions."
  },
  alternates: {
    canonical: "https://prachinayurved.in/about"
  }
}

export default function AboutPage() {
  return <AboutClient />
}

