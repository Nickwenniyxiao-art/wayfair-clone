import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe size={20} className="text-gray-600" />
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-32 border-0 bg-transparent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">
            {t("common.english")}
          </SelectItem>
          <SelectItem value="zh">
            {t("common.chinese")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
