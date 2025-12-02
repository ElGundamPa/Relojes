"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedItemProps {
  children: ReactNode;
  index?: number;
  className?: string;
}

export function AnimatedItem({ children, index = 0, className = "" }: AnimatedItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


