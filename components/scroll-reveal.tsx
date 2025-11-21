"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

type RevealType =
  | "fade"
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "scale"
  | "scaleRotate"
  | "rotate"
  | "slideUp"
  | "slideDown";

interface ScrollRevealProps {
  children: ReactNode;
  type?: RevealType;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  margin?: string;
}

const getVariants = (type: RevealType, distance: number = 50): Variants => {
  const baseHidden = { opacity: 0 };
  const baseVisible = {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  };

  switch (type) {
    case "fade":
      return {
        hidden: baseHidden,
        visible: baseVisible,
      };

    case "fadeUp":
      return {
        hidden: { ...baseHidden, y: distance },
        visible: { ...baseVisible, y: 0 },
      };

    case "fadeDown":
      return {
        hidden: { ...baseHidden, y: -distance },
        visible: { ...baseVisible, y: 0 },
      };

    case "fadeLeft":
      return {
        hidden: { ...baseHidden, x: distance },
        visible: { ...baseVisible, x: 0 },
      };

    case "fadeRight":
      return {
        hidden: { ...baseHidden, x: -distance },
        visible: { ...baseVisible, x: 0 },
      };

    case "scale":
      return {
        hidden: { ...baseHidden, scale: 0.8 },
        visible: { ...baseVisible, scale: 1 },
      };

    case "scaleRotate":
      return {
        hidden: { ...baseHidden, scale: 0.8, rotate: -10 },
        visible: { ...baseVisible, scale: 1, rotate: 0 },
      };

    case "rotate":
      return {
        hidden: { ...baseHidden, rotate: -10, scale: 0.95 },
        visible: { ...baseVisible, rotate: 0, scale: 1 },
      };

    case "slideUp":
      return {
        hidden: { ...baseHidden, y: distance },
        visible: { ...baseVisible, y: 0 },
      };

    case "slideDown":
      return {
        hidden: { ...baseHidden, y: -distance },
        visible: { ...baseVisible, y: 0 },
      };

    default:
      return {
        hidden: baseHidden,
        visible: baseVisible,
      };
  }
};

export function ScrollReveal({
  children,
  type = "fadeUp",
  delay = 0,
  duration = 0.6,
  distance = 50,
  once = true,
  className = "",
  margin = "-100px",
}: ScrollRevealProps) {
  const variants = getVariants(type, distance);

  // Apply custom duration to variants
  const customVariants: Variants = {
    hidden: variants.hidden,
    visible: {
      ...variants.visible,
      transition: {
        ...(typeof variants.visible === "object" &&
        "transition" in variants.visible
          ? variants.visible.transition
          : {}),
        duration,
        delay,
      },
    },
  };

  // Add overflow-hidden for horizontal animations to prevent layout issues
  const needsOverflowHidden = type === "fadeLeft" || type === "fadeRight";
  const finalClassName = needsOverflowHidden
    ? `${className} overflow-hidden`.trim()
    : className;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={customVariants}
      className={finalClassName}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}

// Container component for stagger animations
interface ScrollRevealContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  delay?: number;
  className?: string;
  margin?: string;
}

export function ScrollRevealContainer({
  children,
  staggerDelay = 0.1,
  delay = 0,
  className = "",
  margin = "-100px",
}: ScrollRevealContainerProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Item component to use inside container
interface ScrollRevealItemProps {
  children: ReactNode;
  type?: RevealType;
  duration?: number;
  distance?: number;
  className?: string;
}

export function ScrollRevealItem({
  children,
  type = "fadeUp",
  duration = 0.5,
  distance = 30,
  className = "",
}: ScrollRevealItemProps) {
  const variants = getVariants(type, distance);

  const itemVariants: Variants = {
    hidden: variants.hidden,
    visible: {
      ...variants.visible,
      transition: {
        ...(typeof variants.visible === "object" &&
        "transition" in variants.visible
          ? variants.visible.transition
          : {}),
        duration,
      },
    },
  };

  // Add overflow-hidden for horizontal animations to prevent layout issues
  const needsOverflowHidden = type === "fadeLeft" || type === "fadeRight";
  const finalClassName = needsOverflowHidden
    ? `${className} overflow-hidden`.trim()
    : className;

  return (
    <motion.div
      variants={itemVariants}
      className={finalClassName}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
