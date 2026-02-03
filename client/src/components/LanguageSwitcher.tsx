import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { useState } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  const currentLanguage = i18n.language === "zh" ? "中文" : "English";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Globe size={20} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{currentLanguage}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
          <button
            onClick={() => handleLanguageChange("en")}
            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
              i18n.language === "en" ? "bg-blue-50 text-blue-600 font-medium" : ""
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange("zh")}
            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
              i18n.language === "zh" ? "bg-blue-50 text-blue-600 font-medium" : ""
            }`}
          >
            中文
          </button>
        </div>
      )}
    </div>
  );
}
