"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  initialX?: number;
  animateX?: number;
}

export function AnimatedSection({ 
  children, 
  className = "", 
  delay = 0,
  initialX,
  animateX 
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 20,
        ...(initialX !== undefined && { x: initialX })
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        ...(animateX !== undefined && { x: animateX })
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export { AnimatedItem } from "./animated-item";
export { AnimatedHero } from "./animated-hero";
