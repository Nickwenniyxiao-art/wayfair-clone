import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.aboutWayfair")}</h3>
            <p className="text-sm text-gray-300">
              {t("footer.description")}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.shop")}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/products">
                  <button className="hover:text-white transition">
                    {t("footer.allProducts")}
                  </button>
                </Link>
              </li>
              <li>
                <button className="hover:text-white transition">
                  {t("footer.furniture")}
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  {t("footer.decor")}
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  {t("footer.lighting")}
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  {t("footer.sale")}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.customerService")}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <button className="hover:text-white transition">
                  {t("footer.contactUs")}
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  {t("footer.shippingInfo")}
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  {t("footer.returns")}
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  {t("footer.trackOrder")}
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  {t("common.faq")}
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <button className="hover:text-white transition">
                  {t("footer.aboutUs")}
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  {t("footer.careers")}
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  {t("footer.privacyPolicy")}
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  {t("footer.termsOfService")}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            {t("footer.copyright")}
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              title="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              title="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              title="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              title="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <p className="text-sm text-gray-400 mb-3">{t("footer.weAccept")}</p>
          <div className="flex gap-4 flex-wrap">
            <span className="text-xs bg-slate-800 px-3 py-1 rounded">
              {t("footer.visa")}
            </span>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded">
              {t("footer.mastercard")}
            </span>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded">
              {t("footer.amex")}
            </span>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded">
              PayPal
            </span>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded">
              {t("footer.applePay")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
