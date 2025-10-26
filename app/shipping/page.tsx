import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy - Prachin Ayurved",
  description: "Shipping and Delivery Policy for Prachin Ayurved - International and domestic shipping information",
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-green-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-8 text-center">
            Shipping & Delivery Policy
          </h1>
          
          <p className="text-gray-600 mb-8 text-center">
            Last updated on Oct 26th 2025
          </p>

          <div className="prose prose-emerald max-w-none space-y-6 text-gray-700 leading-relaxed">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-emerald-800 mb-3 flex items-center">
                  🌍 International Shipping
                </h3>
                <p>
                  For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-emerald-800 mb-3 flex items-center">
                  🏠 Domestic Shipping
                </h3>
                <p>
                  For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-800 mb-3 flex items-center">
                ⏰ Delivery Timeline
              </h3>
              <p>
                Orders are shipped within <strong>9-15 days</strong> or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company/post office norms.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-800 mb-3 flex items-center">
                ⚠️ Important Notice
              </h3>
              <p>
                PRACHIN AYURVED is not liable for any delay in delivery by the courier company/postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 9-15 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-800 mb-3 flex items-center">
                📍 Delivery Address
              </h3>
              <p>
                Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-800 mb-3 flex items-center">
                📞 Customer Support
              </h3>
              <p>
                For any issues in utilizing our services you may contact our helpdesk:
              </p>
              <div className="mt-3 space-y-2">
                <p className="flex items-center">
                  <span className="font-medium">Phone:</span>
                  <a href="tel:8708718784" className="ml-2 text-emerald-600 hover:text-emerald-800">
                    87087-18784
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="font-medium">Phone 2:</span>
                  <a href="tel:7206907250" className="ml-2 text-emerald-600 hover:text-emerald-800">
                    72069-07250
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="font-medium">Email:</span>
                  <a href="mailto:prachinayurvedindia@gmail.com" className="ml-2 text-emerald-600 hover:text-emerald-800">
                    prachinayurvedindia@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> The above content is created at PRACHIN AYURVED's sole discretion. Razorpay shall not be liable for any content provided here and shall not be responsible for any claims and liability that may arise due to merchant's non-adherence to it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}