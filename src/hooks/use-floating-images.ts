import { useCallback, useRef } from 'react';
import gsap from 'gsap';
import type { MouseEvent, RefObject } from 'react';

const EASING = 0.1;
const SPEED = 0.02;

const lerp = (start: number, target: number, amount: number) => start * (1 - amount) + target * amount;

const useFloatingImages = (
  ref1: RefObject<HTMLDivElement>,
  ref2: RefObject<HTMLDivElement>,
  ref3: RefObject<HTMLDivElement>,
) => {
  // Mutable animation state kept in refs so it survives re-renders instead of
  // being recreated on every render (which made the effect feel laggy).
  const rafId = useRef<number | null>(null);
  const xForce = useRef(0);
  const yForce = useRef(0);

  const animate = useCallback(() => {
    xForce.current = lerp(xForce.current, 0, EASING);
    yForce.current = lerp(yForce.current, 0, EASING);

    gsap.set(ref1.current, { x: `+=${xForce.current * 0.2}`, y: `+=${yForce.current * 0.2}` });
    gsap.set(ref2.current, { x: `+=${xForce.current * 0.6}`, y: `+=${yForce.current * 0.6}` });
    gsap.set(ref3.current, { x: `+=${xForce.current * 0.15}`, y: `+=${yForce.current * 0.15}` });

    if (Math.abs(xForce.current) < 0.01) xForce.current = 0;
    if (Math.abs(yForce.current) < 0.01) yForce.current = 0;

    if (xForce.current !== 0 || yForce.current !== 0) {
      rafId.current = requestAnimationFrame(animate);
    } else {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, [ref1, ref2, ref3]);

  const manageMouseMove = useCallback(
    (e: MouseEvent) => {
      xForce.current = e.movementX * SPEED;
      yForce.current = e.movementY * SPEED;

      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(animate);
      }
    },
    [animate],
  );

  return { manageMouseMove };
};

export default useFloatingImages;
