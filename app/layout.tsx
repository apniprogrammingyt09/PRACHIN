import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Prachin - Premium Ayurvedic Oils & Natural Shampoos | Ancient Wellness Solutions",
  description: "Discover authentic Ayurvedic oils, natural shampoos & herbal wellness products at Prachin. Premium quality traditional formulations for hair care, skin care & holistic health. Free delivery on orders ₹500+",
  keywords: "ayurvedic oils, natural shampoo, herbal products, hair oil, skin care, wellness, traditional medicine, organic products, natural beauty, holistic health, ayurveda, herbal remedies",
  authors: [{ name: "Prachin Ayurveda" }],
  creator: "Prachin Ayurveda",
  publisher: "Prachin Ayurveda",
  metadataBase: new URL('https://prachin-ayurveda.vercel.app'),
  openGraph: {
    title: "Prachin - Premium Ayurvedic Oils & Natural Products",
    description: "Authentic Ayurvedic oils, natural shampoos & herbal wellness products. Traditional formulations for modern wellness needs.",
    url: 'https://prachin-ayurveda.vercel.app',
    siteName: 'Prachin Ayurveda',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Prachin Ayurvedic Products',
    }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Prachin - Premium Ayurvedic Oils & Natural Products",
    description: "Authentic Ayurvedic oils, natural shampoos & herbal wellness products for holistic health.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}

import ClientLayout from "./ClientLayout"
