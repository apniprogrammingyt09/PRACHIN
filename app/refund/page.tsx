import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy - Prachin Ayurved",
  description: "Cancellation and Refund Policy for Prachin Ayurved - Liberal cancellation policy for customer satisfaction",
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-green-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-8 text-center">
            Cancellation & Refund Policy
          </h1>
          
          <p className="text-gray-600 mb-8 text-center">
            Last updated on Oct 26th 2025
          </p>

          <div className="prose prose-emerald max-w-none space-y-6 text-gray-700 leading-relaxed">
            <p>
              <strong>PRACHIN AYURVED</strong> believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
            </p>

            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-emerald-800 mb-3">Cancellation Policy</h3>
                <ul className="space-y-3 list-disc pl-6">
                  <li>
                    Cancellations will be considered only if the request is made within <strong>6-8 days</strong> of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
                  </li>
                  <li>
                    PRACHIN AYURVED does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-emerald-800 mb-3">Refund & Replacement Policy</h3>
                <ul className="space-y-3 list-disc pl-6">
                  <li>
                    In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within <strong>6-8 days</strong> of receipt of the products.
                  </li>
                  <li>
                    In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within <strong>6-8 days</strong> of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
                  </li>
                  <li>
                    In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-emerald-800 mb-3">Refund Processing Time</h3>
                <p>
                  In case of any Refunds approved by the PRACHIN AYURVED, it'll take <strong>9-15 days</strong> for the refund to be processed to the end customer.
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