"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "hi"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.menu": "Menu",
    "nav.services": "Services",
    "nav.delivery": "Delivery",
    "nav.about": "About Us",
    "nav.contact": "Contact",
    "nav.order": "Order Now",
    "nav.search": "Search...",

    // Hero Section
    "hero.title": "Taste the Magic",
    "hero.subtitle":
      "Indulge in our handcrafted treats made with love and the finest ingredients. Each bite tells a story of passion.",
    "hero.button": "Explore Menu",
    "hero.reviews": "Reviews",

    // About Section
    "about.title": "Our Sweet Story",
    "about.p1":
      "Since 2010, our family-owned bakery has been crafting delicious moments for your special occasions. What started as a small passion project has grown into a beloved destination for cake lovers across the city.",
    "about.p2":
      "Every recipe is perfected through generations, using only the finest ingredients. Our commitment to quality and taste has earned us the trust and love of our community.",
    "about.button": "Read More About Us",

    // Services Section
    "services.title": "We Deliver Anywhere",
    "services.subtitle":
      "Our bakery is committed to bringing sweetness to your doorstep, no matter where you are in the city.",
    "services.fresh.title": "Fresh Baked",
    "services.fresh.desc": "Made fresh daily with premium ingredients for maximum flavor and quality.",
    "services.delivery.title": "24/7 Delivery",
    "services.delivery.desc": "Order anytime and get your favorite treats delivered to your doorstep.",
    "services.custom.title": "Custom Cakes",
    "services.custom.desc": "Personalized cakes designed for your special occasions and celebrations.",
    "services.payment.title": "Online Payments",
    "services.payment.desc": "Secure and convenient payment options for hassle-free ordering.",

    // Contact
    "contact.title": "Contact & Order",
    "contact.subtitle": "We're just a message away. Reach out to us for orders, inquiries, or just to say hi!",
    "contact.form.title": "Send us a message",
    "contact.form.name": "Name",
    "contact.form.phone": "Phone",
    "contact.form.address": "Address",
    "contact.form.message": "Message",
    "contact.form.button": "Send Message",
    "contact.find.title": "Find us",
    "contact.chat.title": "Quick Chat",
    "contact.chat.subtitle": "Get a quick response on WhatsApp",
    "contact.chat.button": "Chat on WhatsApp",

    // Menu
    "menu.title": "Our Menu",
    "menu.subtitle": "Explore our selection of handcrafted treats made with love and the finest ingredients.",
    "menu.cakes": "Cakes",
    "menu.pastries": "Pastries",
    "menu.cookies": "Cookies",
    "menu.sweets": "Indian Sweets",
    "menu.viewAll": "View Full Menu",

    // Products
    "product.addToCart": "Add to Cart",

    // Footer
    "footer.tagline": "Bringing sweetness to your life, one bite at a time.",
    "footer.links": "Quick Links",
    "footer.follow": "Follow Us",
    "footer.copyright": "All rights reserved.",

    // Language
    language: "भाषा: हिंदी",
  },
  hi: {
    // Navigation
    "nav.home": "होम",
    "nav.menu": "मेनू",
    "nav.services": "सेवाएं",
    "nav.delivery": "डिलीवरी",
    "nav.about": "हमारे बारे में",
    "nav.contact": "संपर्क",
    "nav.order": "अभी ऑर्डर करें",
    "nav.search": "खोजें...",

    // Hero Section
    "hero.title": "स्वाद का जादू",
    "hero.subtitle":
      "हमारे हाथों से बने व्यंजनों का आनंद लें, जिन्हें प्यार और सर्वोत्तम सामग्री के साथ बनाया गया है। हर निवाला एक कहानी कहता है।",
    "hero.button": "मेनू देखें",
    "hero.reviews": "समीक्षाएँ",

    // About Section
    "about.title": "हमारी मीठी कहानी",
    "about.p1":
      "2010 से, हमारी परिवार द्वारा संचालित बेकरी आपके विशेष अवसरों के लिए स्वादिष्ट पल बना रही है। जो एक छोटे से जुनून प्रोजेक्ट के रूप में शुरू हुआ, वह शहर भर में केक प्रेमियों के लिए एक प्रिय गंतव्य बन गया है।",
    "about.p2":
      "हर रेसिपी पीढ़ियों के माध्यम से परिपूर्ण की गई है, केवल सर्वोत्तम सामग्री का उपयोग करके। गुणवत्ता और स्वाद के प्रति हमारी प्रतिबद्धता ने हमें हमारे समुदाय का विश्वास और प्यार अर्जित किया है।",
    "about.button": "हमारे बारे में और पढ़ें",

    // Services Section
    "services.title": "हम कहीं भी डिलीवर करते हैं",
    "services.subtitle": "हमारी बेकरी आपके द्वार तक मिठास लाने के लिए प्रतिबद्ध है, चाहे आप शहर में कहीं भी हों।",
    "services.fresh.title": "ताज़ा बेक्ड",
    "services.fresh.desc": "अधिकतम स्वाद और गुणवत्ता के लिए प्रीमियम सामग्री के साथ रोजाना ताजा बनाया जाता है।",
    "services.delivery.title": "24/7 डिलीवरी",
    "services.delivery.desc": "कभी भी ऑर्डर करें और अपने पसंदीदा व्यंजनों को अपने घर तक पहुंचवाएं।",
    "services.custom.title": "कस्टम केक",
    "services.custom.desc": "आपके विशेष अवसरों और समारोहों के लिए डिज़ाइन की गई व्यक्तिगत केक।",
    "services.payment.title": "ऑनलाइन भुगतान",
    "services.payment.desc": "परेशानी मुक्त ऑर्डरिंग के लिए सुरक्षित और सुविधाजनक भुगतान विकल्प।",

    // Contact
    "contact.title": "संपर्क और ऑर्डर",
    "contact.subtitle": "हम बस एक संदेश दूर हैं। ऑर्डर, पूछताछ, या बस हैलो कहने के लिए हमसे संपर्क करें!",
    "contact.form.title": "हमें संदेश भेजें",
    "contact.form.name": "नाम",
    "contact.form.phone": "फोन",
    "contact.form.address": "पता",
    "contact.form.message": "संदेश",
    "contact.form.button": "संदेश भेजें",
    "contact.find.title": "हमें ढूंढें",
    "contact.chat.title": "क्विक चैट",
    "contact.chat.subtitle": "WhatsApp पर त्वरित प्रतिक्रिया प्राप्त करें",
    "contact.chat.button": "WhatsApp पर चैट करें",

    // Menu
    "menu.title": "हमारा मेनू",
    "menu.subtitle": "हमारे हाथों से बने व्यंजनों का पता लगाएं जिन्हें प्यार और सर्वोत्तम सामग्री के साथ बनाया गया है।",
    "menu.cakes": "केक",
    "menu.pastries": "पेस्ट्री",
    "menu.cookies": "कुकीज़",
    "menu.sweets": "मिठाई",
    "menu.viewAll": "पूरा मेनू देखें",

    // Products
    "product.addToCart": "कार्ट में जोड़ें",

    // Footer
    "footer.tagline": "आपके जीवन में मिठास लाना, एक निवाला एक बार में।",
    "footer.links": "क्विक लिंक्स",
    "footer.follow": "हमें फॉलो करें",
    "footer.copyright": "सर्वाधिकार सुरक्षित।",

    // Language
    language: "Language: English",
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
})

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en")

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "hi")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
