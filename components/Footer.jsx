"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
            <Link href="/about" className="hover:underline text-gray-300">
  About Us
</Link>

              <li>
                <Link href="/contact" className="hover:underline text-gray-300">
                  Contact
                </Link>
              </li>
              {/* <li>
                <Link href="/careers" className="hover:underline text-gray-300">
                  Careers
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:underline text-gray-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-cancellation"
                  className="hover:underline text-gray-300"
                >
                  Refund-cancellation
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:underline text-gray-300"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-delivery"
                  className="hover:underline text-gray-300"
                >
                  shipping-delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:underline text-gray-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:underline text-gray-300"
                >
                  Support
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/blog"
                  className="hover:underline text-gray-300"
                >
                  Blog
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Social or Branding */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-gray-300"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-gray-300"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-gray-300"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
