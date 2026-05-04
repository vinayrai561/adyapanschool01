'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-[#ede8e0] border-t border-[#e0d8d0] py-10 px-6"
    >
      <div className="max-w-7xl mx-auto">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center space-x-2.5 mb-3">
              <img src="/images/adyapan-logo-bg.png" alt="Adyapan Logo" className="h-8 w-auto" />
            </Link>
            <p className="text-gray-500 text-xs max-w-xs leading-relaxed">
              Transforming India's talent landscape through industry-relevant education and real-world experience.
            </p>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">

            <div>
              <p className="font-bold text-gray-700 mb-3 text-xs uppercase tracking-wider">Platform</p>
              <ul className="space-y-2">
                <li><Link href="/programs" className="text-gray-500 hover:text-orange-600 transition-colors">Programs</Link></li>
                <li><Link href="/about" className="text-gray-500 hover:text-orange-600 transition-colors">About Us</Link></li>
                <li><Link href="/gallery" className="text-gray-500 hover:text-orange-600 transition-colors">Gallery</Link></li>
                <li><Link href="/campus-ambassador" className="text-gray-500 hover:text-orange-600 transition-colors">Campus Ambassador</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-gray-700 mb-3 text-xs uppercase tracking-wider">Company</p>
              <ul className="space-y-2">
                <li><Link href="/company/hire-talent" className="text-gray-500 hover:text-orange-600 transition-colors">Hire Talent</Link></li>
                <li><Link href="/marketplace" className="text-gray-500 hover:text-orange-600 transition-colors">Marketplace</Link></li>
                <li><Link href="/contact" className="text-gray-500 hover:text-orange-600 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-gray-700 mb-3 text-xs uppercase tracking-wider">Legal</p>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-500 hover:text-orange-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-500 hover:text-orange-600 transition-colors">Terms of Service</Link></li>
                <li><Link href="/contact" className="text-gray-500 hover:text-orange-600 transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#d8d0c8] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Adyapan Edutech Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-orange-500 transition-colors">Support</Link>
            <span>·</span>
            <span>Made with ❤️ by <span className="font-semibold text-[#ffa800]">Rupesh</span></span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
