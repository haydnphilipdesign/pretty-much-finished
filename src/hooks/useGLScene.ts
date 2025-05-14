import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const useGLScene = (fragmentShader: string) => {
  const renderer = useRef<THREE.WebGLRenderer>();
  const scene = useRef<THREE.Scene>();
  const camera = useRef<THREE.OrthographicCamera>();
  const uniforms = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);

  const mount = (container: HTMLElement) => {
    scene.current = new THREE.Scene();
    camera.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);
    uniforms.current = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() }
    };

    const material = new THREE.ShaderMaterial({
      fragmentShader,
      uniforms: uniforms.current,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.current.add(mesh);

    renderer.current = new THREE.WebGLRenderer({ alpha: true });
    renderer.current.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.current.domElement);

    const animate = () => {
      if (!renderer.current) return;
      requestAnimationFrame(animate);
      uniforms.current.time.value += 0.05;
      renderer.current.render(scene.current!, camera.current!);
    };

    const handleResize = () => {
      if (!renderer.current || !container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.current.setSize(width, height);
      uniforms.current.resolution.value.x = width;
      uniforms.current.resolution.value.y = height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animate();
  };

  const unmount = () => {
    if (renderer.current?.domElement) {
      renderer.current.domElement.remove();
    }
    window.removeEventListener('resize', () => {});
  };

  return {
    scene: containerRef,
    mount,
    unmount,
  };
};