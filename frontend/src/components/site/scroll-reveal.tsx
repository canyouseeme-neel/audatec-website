"use client";

import { ReactNode, useEffect, useState } from "react";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
};

const defaultEase = [0.22, 1, 0.36, 1] as const;

/**
 * After the first paint completes, enable scroll-triggered animations.
 * Before that, `initial={false}` keeps content fully visible (no flash).
 */
function useMotionReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return ready;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  once = true,
  amount = 0.2,
}: RevealProps) {
  const ready = useMotionReady();

  return (
    <motion.div
      className={className}
      initial={ready ? { opacity: 0, y } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.65, ease: defaultEase, delay }}
    >
      {children}
    </motion.div>
  );
}

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
};

export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0.04,
  once = true,
  amount = 0.18,
}: StaggerGroupProps) {
  const ready = useMotionReady();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren,
          },
        },
      }}
      initial={ready ? "hidden" : false}
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.6, ease: defaultEase },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
