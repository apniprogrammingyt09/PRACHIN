import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions - Prachin Ayurved",
  description: "Terms and Conditions for Prachin Ayurved - Authentic Ayurvedic products from Taraori, Haryana",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-green-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-8 text-center">
            Terms & Conditions
          </h1>
          
          <p className="text-gray-600 mb-8 text-center">
            Last updated on Oct 26th 2025
          </p>

          <div className="prose prose-emerald max-w-none space-y-6 text-gray-700 leading-relaxed">
            <p>
              For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean <strong>PRACHIN AYURVED</strong>, whose registered/operational office is 18A, RURAL PART 47, KATJU NAGAR, WARD NO. 1, Taraori, Karnal, Haryana, 132116 Uchana HARYANA 132116. "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
            </p>

            <p>
              Your use of the website and/or purchase from us are governed by following Terms and Conditions:
            </p>

            <ul className="space-y-4 list-disc pl-6">
              <li>
                The content of the pages of this website is subject to change without notice.
              </li>

              <li>
                Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
              </li>

              <li>
                Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.
              </li>

              <li>
                Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
              </li>

              <li>
                All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.
              </li>

              <li>
                Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.
              </li>

              <li>
                From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.
              </li>

              <li>
                You may not create a link to our website from another website or document without PRACHIN AYURVED's prior written consent.
              </li>

              <li>
                Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.
              </li>

              <li>
                We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
              </li>
            </ul>

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