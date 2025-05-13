import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en", // Default language
    supportedLngs: ["en", "ar"], // Supported languages
    debug: true, // Set to false in production
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to translation files
    },
    detection: {
      order: ["localStorage", "cookie", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
