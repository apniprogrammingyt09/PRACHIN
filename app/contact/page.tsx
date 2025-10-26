"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Message Sent!",
          description: result.message,
          variant: "default",
        })
        setFormData({
          name: "",
          phone: "",
          email: "",
          address: "",
          message: "",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send message. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-green-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-800">
              Contact & Wellness Consultation
            </h1>
            <p className="mt-4 text-lg text-green-700">
              Connect with our Ayurvedic experts for personalized wellness guidance and product recommendations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <motion.div
              className="lg:w-2/3 bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-green-800 font-medium mb-2">
                        Name*
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="border-green-200 focus-visible:ring-green-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-green-800 font-medium mb-2">
                        Phone*
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="border-green-200 focus-visible:ring-green-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-green-800 font-medium mb-2">
                        Email*
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-green-200 focus-visible:ring-green-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-green-800 font-medium mb-2">
                        Address
                      </label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="border-green-200 focus-visible:ring-green-600"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-green-800 font-medium mb-2">
                      Message*
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="border-green-200 focus-visible:ring-green-600"
                    />
                  </div>
                  <Button type="submit" className="bg-green-800 hover:bg-green-900 text-white" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-green-800 mb-6">Find us</h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-800">Address</h3>
                        <p className="text-green-700">Taraori, Haryana-132116</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-800">Phone</h3>
                        <p className="text-green-700">87087-18784</p>
                        <p className="text-green-700">72069-07250</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <Mail className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-800">Email</h3>
                        <p className="text-green-700">prachinayurvedindia@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-800">Hours</h3>
                        <p className="text-green-700">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                        <p className="text-green-700">Sunday: 10:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-green-800 mb-2">Quick Chat</h2>
                  <p className="text-green-700 mb-4">Get wellness guidance on WhatsApp</p>
                  <Link href="https://wa.me/918708718784" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                      <MessageCircle className="mr-2 h-5 w-5" /> Chat on WhatsApp
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-green-800">Frequently Asked Questions</h2>
            <p className="mt-4 text-green-700 max-w-2xl mx-auto">
              Find answers to common questions about our Ayurvedic products and wellness services.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            <motion.div
              className="bg-green-50 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                How do I choose the right Ayurvedic oil for my needs?
              </h3>
              <p className="text-green-700">
                Our wellness experts can help you select the perfect oil based on your dosha, skin type, and specific
                concerns. Contact us for a personalized consultation or use our product guide on the website.
              </p>
            </motion.div>

            <motion.div
              className="bg-green-50 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-green-800 mb-2">Do you offer delivery services?</h3>
              <p className="text-green-700">
                Yes, we offer delivery across India for all our Ayurvedic products. Delivery charges depend on location.
                We offer free delivery for orders above ₹999 within major cities.
              </p>
            </motion.div>

            <motion.div
              className="bg-green-50 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Are your products suitable for sensitive skin?
              </h3>
              <p className="text-green-700">
                All our products are made with natural ingredients and are generally suitable for sensitive skin.
                However, we recommend doing a patch test before first use and consulting our experts for specific
                concerns.
              </p>
            </motion.div>

            <motion.div
              className="bg-green-50 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-green-800 mb-2">How long do your Ayurvedic products last?</h3>
              <p className="text-green-700">
                Our oils and wellness products have a shelf life of 12-18 months when stored properly in a cool, dry
                place. Face packs and herbal powders are best used within 6-12 months of opening for maximum potency.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
