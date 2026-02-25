"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const languages = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "ur", name: "اردو", dir: "rtl" },
] as const

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleLanguageChange = (langCode: string) => {
    // Set cookie for language preference
    document.cookie = `NEXT_LOCALE=${langCode};path=/;max-age=31536000`
    // Change language using i18n
    i18n.changeLanguage(langCode)
    // Update document direction for RTL support
    const lang = languages.find((l) => l.code === langCode)
    if (lang) {
      document.documentElement.dir = lang.dir
      document.documentElement.lang = langCode
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={i18n.language === lang.code ? "bg-accent" : ""}
          >
            <span className={lang.dir === "rtl" ? "font-urdu" : ""}>
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
