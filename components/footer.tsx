import Link from "next/link"
import { Instagram, Facebook, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#2D5016] text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold">
              Prachin<span className="text-[#A8D5BA]"> Ayurved</span>
            </div>
            <p className="mt-2 text-[#A8D5BA] max-w-xs">
              Ancient Ayurveda, Modern Care - Natural wellness for your daily life.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#A8D5BA] hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-[#A8D5BA] hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#A8D5BA] hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#A8D5BA] hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="#" className="bg-[#4A7C59] p-2 rounded-full hover:bg-[#3A6B47] transition">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="bg-[#4A7C59] p-2 rounded-full hover:bg-[#3A6B47] transition">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="bg-[#4A7C59] p-2 rounded-full hover:bg-[#3A6B47] transition">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#4A7C59] mt-8 pt-6 text-center text-[#A8D5BA] text-sm">
          <p>&copy; {new Date().getFullYear()} Prachin Ayurved. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
