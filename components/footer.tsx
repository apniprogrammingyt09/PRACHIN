import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, MessageCircle, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-green-50 text-gray-800 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Image src="/logo2.png" alt="Prachin Ayurved" width={32} height={32} className="object-contain" style={{width: 'auto', height: '32px'}} />
              <div className="text-2xl font-bold">
                Prachin<span className="text-emerald-600"> Ayurved</span>
              </div>
            </div>
            <p className="mt-2 text-gray-600 max-w-xs">
              Ancient Ayurveda, Modern Care - Natural wellness for your daily life.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-emerald-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-600 hover:text-emerald-600 transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-emerald-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-emerald-600 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3">Contact Info</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span className="text-sm">87087-18784, 72069-07250</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Taraori, Haryana-132116</span>
              </div>
            </div>
            <h4 className="font-semibold mb-2">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-3">
              <Link href="https://instagram.com/bharatshastra" className="bg-emerald-600 p-2 rounded-full hover:bg-emerald-700 transition">
                <Instagram className="h-4 w-4 text-white" />
              </Link>
              <Link href="https://instagram.com/prachinayurvedindia" className="bg-emerald-600 p-2 rounded-full hover:bg-emerald-700 transition">
                <Instagram className="h-4 w-4 text-white" />
              </Link>
              <Link href="https://facebook.com/yog.ayurved.2025/" className="bg-emerald-600 p-2 rounded-full hover:bg-emerald-700 transition">
                <Facebook className="h-4 w-4 text-white" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-200 mt-8 pt-6 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Prachin Ayurved. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
