"use client"

import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// Import translation files
import enCommon from "../../public/locales/en/common.json"
import enHome from "../../public/locales/en/home.json"
import enForms from "../../public/locales/en/forms.json"
import enAbout from "../../public/locales/en/about.json"
import enAcademics from "../../public/locales/en/academics.json"
import enAdmissions from "../../public/locales/en/admissions.json"
import urCommon from "../../public/locales/ur/common.json"

export const supportedLanguages = ["en", "ur"] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    forms: enForms,
    about: enAbout,
    academics: enAcademics,
    admissions: enAdmissions,
  },
  ur: {
    common: urCommon,
  },
}

// Get initial language from cookie or default to 'en'
function getInitialLanguage(): SupportedLanguage {
  if (typeof window !== "undefined") {
    const cookieMatch = document.cookie.match(/NEXT_LOCALE=(\w+)/)
    if (cookieMatch && supportedLanguages.includes(cookieMatch[1] as SupportedLanguage)) {
      return cookieMatch[1] as SupportedLanguage
    }
  }
  return "en"
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  defaultNS: "common",
  ns: ["common", "home", "forms", "about", "academics", "admissions"],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

export default i18n
