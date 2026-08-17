"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE, MOTION, REVEAL_VIEWPORT } from "@/lib/motion";

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

interface RevealProps {
  children: React.ReactNode;
  /** Desktop travel distance in px (mobile is clamped to 12px for calmer motion) */
  y?: number;
  delay?: number;
  className?: string;
}

/**
 * Reusable scroll reveal — fades content in with a quiet upward rise.
 * Fires once, respects prefers-reduced-motion via the global MotionConfig.
 */
export function Reveal({ children, y = 24, delay = 0, className }: RevealProps) {
  const isMobile = useIsMobile();
  const distance = isMobile ? Math.min(y, 12) : y;

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: MOTION.reveal, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}