import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = [
  "House Cleaners",
  "Painters",
  "Tutors",
  "Event Assistants",
  "Photographers",
  "Web Developers",
  "Graphic Designers",
];

export function RotatingWords() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block h-[1.1em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="block"
          style={{ color: "var(--brand)" }}
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
