import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageWrapper({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className={className}
    >
      {children}
    </motion.main>
  );
}
