import { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  speed: number;
  color: string;
}

export const useParticleEffect = (count: number = 50) => {
  const particles = useMemo(() => {
    const colors = ['#B40101', '#FF0000', '#FF3333', '#FF6666'];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.5,
      speed: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, [count]);

  const getParticleAnimation = (particle: Particle) => ({
    x: [`${particle.x}%`, `${particle.x + 10}%`],
    y: [`${particle.y}%`, `${particle.y + 10}%`],
    opacity: [0.2, 0.5, 0.2],
    scale: [particle.scale, particle.scale * 1.5, particle.scale]
  });

  const getParticleTransition = (particle: Particle) => ({
    duration: particle.speed,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut'
  });

  return {
    particles,
    getParticleAnimation,
    getParticleTransition
  };
};