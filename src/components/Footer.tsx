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
      className="bg-[#ede8e0] border-t border-[#e0d8d0] py-8 px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link href="/" className="flex items-center space-x-2.5">
            <img
              src="/images/adyapan-logo-bg.png"
              alt="Adyapan Logo"
              className="h-8 w-auto"
            />
          </Link>
        </motion.div>
        <p className="text-gray-400 text-sm">
          © 2024 Adyapan. Transforming India's talent landscape.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
