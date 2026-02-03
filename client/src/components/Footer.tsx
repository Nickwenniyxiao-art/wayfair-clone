import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">About Wayfair Clone</h3>
            <p className="text-sm text-gray-300">
              Your one-stop shop for home furnishings and décor. Discover millions
              of products from trusted sellers.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/products">
                  <button className="hover:text-white transition">
                    All Products
                  </button>
                </Link>
              </li>
              <li>
                <button className="hover:text-white transition">
                  Furniture
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">Decor</button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  Lighting
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">Sale</button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <button className="hover:text-white transition">
                  Contact Us
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  Shipping Info
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  Returns
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  Track Order
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">FAQ</button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <button className="hover:text-white transition">
                  About Us
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">Careers</button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  Terms of Service
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
            © 2024 Wayfair Clone. All rights reserved.
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
          <p className="text-sm text-gray-400 mb-3">We Accept</p>
          <div className="flex gap-4 flex-wrap">
            <span className="text-xs bg-slate-800 px-3 py-1 rounded">
              Visa
            </span>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded">
              Mastercard
            </span>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded">
              American Express
            </span>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded">
              PayPal
            </span>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded">
              Apple Pay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
