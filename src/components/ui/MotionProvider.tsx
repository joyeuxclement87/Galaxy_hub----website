"use client";

import React from "react";
import { MotionConfig } from "framer-motion";

/**
 * Global motion config — when the user prefers reduced motion, transform-based
 * animations are disabled while necessary opacity transitions remain.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}