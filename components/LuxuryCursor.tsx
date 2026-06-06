"use client";

import { useEffect, useRef } from "react";

export default function LuxuryCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -200;
    let mouseY = -200;
    let lagX = -200;
    let lagY = -200;
    let ringSize = 28;
    let animFrame: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
    };

    const expand = () => {
      ringSize = 48;
      ring.style.width = "48px";
      ring.style.height = "48px";
      ring.style.opacity = "0.2";
    };

    const shrink = () => {
      ringSize = 28;
      ring.style.width = "28px";
      ring.style.height = "28px";
      ring.style.opacity = "0.4";
    };

    const loop = () => {
      lagX += (mouseX - lagX) * 0.15;
      lagY += (mouseY - lagY) * 0.15;
      ring.style.transform = `translate(${lagX - ringSize / 2}px, ${lagY - ringSize / 2}px)`;
      animFrame = requestAnimationFrame(loop);
    };
    animFrame = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);

    const addHoverListeners = () => {
      document.querySelectorAll("a, button, [role='button']").forEach((el) => {
        // Remove first to avoid double-binding
        el.removeEventListener("mouseenter", expand);
        el.removeEventListener("mouseleave", shrink);
        el.addEventListener("mouseenter", expand);
        el.addEventListener("mouseleave", shrink);
      });
    };
    addHoverListeners();

    const obs = new MutationObserver(addHoverListeners);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animFrame);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="luxury-cursor-dot" />
      <div ref={ringRef} className="luxury-cursor-ring" />
    </>
  );
}
