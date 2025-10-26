import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Prachin Ayurved",
  description: "Privacy Policy for Prachin Ayurved - How we protect and use your personal information",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-green-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-8 text-center">
            Privacy Policy
          </h1>
          
          <p className="text-gray-600 mb-8 text-center">
            Last updated on Oct 26th 2025
          </p>

          <div className="prose prose-emerald max-w-none space-y-6 text-gray-700 leading-relaxed">
            <p>
              This privacy policy sets out how <strong>PRACHIN AYURVED</strong> uses and protects any information that you give PRACHIN AYURVED when you visit their website and/or agree to purchase from them.
            </p>

            <p>
              PRACHIN AYURVED is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, and then you can be assured that it will only be used in accordance with this privacy statement.
            </p>

            <p>
              PRACHIN AYURVED may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">Information We Collect</h3>
              <p className="mb-3">We may collect the following information:</p>
              <ul className="space-y-2 list-disc pl-6">
                <li>Name</li>
                <li>Contact information including email address</li>
                <li>Demographic information such as postcode, preferences and interests, if required</li>
                <li>Other information relevant to customer surveys and/or offers</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">How We Use Your Information</h3>
              <p className="mb-3">We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
              <ul className="space-y-2 list-disc pl-6">
                <li>Internal record keeping.</li>
                <li>We may use the information to improve our products and services.</li>
                <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</li>
                <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">Information Security</h3>
              <p>
                We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">How We Use Cookies</h3>
              <p className="mb-3">
                A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
              </p>
              <p className="mb-3">
                We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
              </p>
              <p>
                Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.
              </p>
              <p>
                You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">Controlling Your Personal Information</h3>
              <p className="mb-3">You may choose to restrict the collection or use of your personal information in the following ways:</p>
              <ul className="space-y-2 list-disc pl-6">
                <li>whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
                <li>if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us</li>
              </ul>
              <p className="mt-3">
                We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
              </p>
              <p className="mt-3">
                If you believe that any information we are holding on you is incorrect or incomplete, please write to 18A, RURAL PART 47, KATJU NAGAR, WARD NO. 1, Taraori, Karnal, Haryana, 132116 Uchana HARYANA 132116 or contact us as soon as possible. We will promptly correct any information found to be incorrect.
              </p>
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