import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Leaf, Heart } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-primary mb-4">404</div>
          <div className="text-6xl mb-4">🌿</div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 text-balance">Oops! Path Not Found</h1>
          <p className="text-muted-foreground text-lg mb-2 text-pretty">
            It seems this healing path has wandered off the ancient route!
          </p>
          <p className="text-muted-foreground text-pretty">
            The page you're seeking doesn't exist or has been moved to a new location.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Home className="h-4 w-4 mr-2" />
              Return to Wellness Home
            </Button>
          </Link>

          <div className="flex gap-2">
            <Link href="/products" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                <Leaf className="h-4 w-4 mr-2" />
                Explore Oils
              </Button>
            </Link>

            <Link href="/about" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                <Heart className="h-4 w-4 mr-2" />
                Our Story
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Seeking natural wellness?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/products" className="text-primary hover:text-primary/80 hover:underline">
              Ayurvedic Oils
            </Link>
            <Link href="/track" className="text-primary hover:text-primary/80 hover:underline">
              Track Order
            </Link>
            <Link href="/cart" className="text-primary hover:text-primary/80 hover:underline">
              View Cart
            </Link>
            <Link href="/contact" className="text-primary hover:text-primary/80 hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
