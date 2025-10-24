import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Prachin Ayurved - Authentic Ayurvedic Oils & Natural Wellness Products | Taraori, Haryana",
  description: "Discover authentic Ayurvedic oils, natural wellness products & traditional herbal formulations at Prachin Ayurved. Premium quality products from Taraori, Haryana since 2010. Call 87087-18784",
  keywords: "Prachin Ayurved, ayurvedic oils Haryana, natural wellness products, herbal oils Taraori, face oil, hair oil, pain relief oil, ayurvedic shampoo, traditional medicine, organic products, natural beauty, holistic health, ayurveda India",
  authors: [{ name: "Prachin Ayurved" }],
  creator: "Prachin Ayurved",
  publisher: "Prachin Ayurved",
  metadataBase: new URL('https://prachinayurved.in'),
  openGraph: {
    title: "Prachin Ayurved - Authentic Ayurvedic Oils & Natural Wellness Products",
    description: "Authentic Ayurvedic oils, natural wellness products & traditional herbal formulations from Taraori, Haryana since 2010.",
    url: 'https://prachinayurved.in',
    siteName: 'Prachin Ayurved',
    images: [{
      url: '/logo2.png',
      width: 1200,
      height: 630,
      alt: 'Prachin Ayurved - Authentic Ayurvedic Products',
    }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Prachin Ayurved - Authentic Ayurvedic Oils & Natural Wellness Products",
    description: "Authentic Ayurvedic oils, natural wellness products & traditional herbal formulations from Taraori, Haryana.",
    images: ['/logo2.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://prachinayurved.in'
  },
  verification: {
    google: 'your-google-verification-code'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}

import ClientLayout from "./ClientLayout"
