'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = ['Launch', 'Build', 'Prove', 'Sell', 'Upgrade'];

export default function MorphText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, 2500); // Change word every 2.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{ display: 'inline-block', position: 'relative', minWidth: '280px', height: '1em' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'inline-block',
            color: '#f90',
            whiteSpace: 'nowrap',
          }}
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
