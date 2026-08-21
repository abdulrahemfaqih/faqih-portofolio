"use client";

/**
 * Kursor kustom — Signature Element dari design.md §5
 * Berubah jadi lingkaran berlabel "Lihat" saat hover di atas [data-cursor="view"]
 * Berubah jadi lingkaran berlabel "Baca" saat hover di atas [data-cursor="read"]
 */

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const labelRef = useRef<string>("");
  const isHoveringRef = useRef(false);

  const springConfig = { damping: 28, stiffness: 300, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Jangan aktifkan di touch device
    if (window.matchMedia("(pointer: coarse)").matches) return;
    // Hormati prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as Element).closest("[data-cursor]");
      if (target) {
        labelRef.current = target.getAttribute("data-cursor") ?? "";
        isHoveringRef.current = true;
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as Element).closest("[data-cursor]");
      if (target) {
        labelRef.current = "";
        isHoveringRef.current = false;
      }
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:flex"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border border-[--ink] bg-[--ink] text-[--paper]"
        animate={{
          width: isHoveringRef.current ? 64 : 8,
          height: isHoveringRef.current ? 64 : 8,
          opacity: isHoveringRef.current ? 1 : 0.5,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ fontSize: "0.625rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
      >
        {isHoveringRef.current ? labelRef.current : null}
      </motion.div>
    </motion.div>
  );
}
