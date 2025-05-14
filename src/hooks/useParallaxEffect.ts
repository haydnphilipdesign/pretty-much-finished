import { useState, useEffect, RefObject } from 'react';

export const useParallaxEffect = (ref: RefObject<HTMLElement>, intensity: number = 1) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      setMouseX(mouseX);
      setMouseY(mouseY);

      const rotateX = (mouseY / rect.height) * 20 * intensity;
      const rotateY = (mouseX / rect.width) * 20 * intensity;

      setRotateX(-rotateX);
      setRotateY(rotateY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [ref, intensity]);

  return { mouseX, mouseY, rotateX, rotateY };
};