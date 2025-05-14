import { useRef, useState, useEffect } from 'react';

interface PreloadedAnimationOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

/**
 * A hook to ensure elements are preloaded before animating them into view
 * This addresses issues where elements may animate while still being loaded
 */
export const usePreloadedAnimation = (options: PreloadedAnimationOptions = {}) => {
  const {
    rootMargin = '200px',
    threshold = 0,
    triggerOnce = true
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up intersection observer with larger margin for preloading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Start preloading when element is near viewport
        if (entry.isIntersecting && !isPreloaded) {
          setIsPreloaded(true);
          
          // If we only want to trigger once, disconnect after preloading starts
          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      {
        rootMargin,  // Start preloading when element is this far from viewport
        threshold
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin, threshold, triggerOnce, isPreloaded]);

  // Set up a second observer with smaller margin for actual visibility
  useEffect(() => {
    // Only start observing for visibility after preloading
    if (!isPreloaded) return;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // If we only want to trigger once, disconnect after becoming visible
          if (triggerOnce) {
            visibilityObserver.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        rootMargin: '0px',  // Only trigger when actually in viewport
        threshold
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      visibilityObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        visibilityObserver.unobserve(currentRef);
      }
    };
  }, [isPreloaded, threshold, triggerOnce]);

  // Allow time for images and content to load after preloading starts
  useEffect(() => {
    if (isPreloaded) {
      // Add a small delay to ensure content has time to load
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isPreloaded]);

  return { ref, isVisible, isPreloaded, isReady };
};

export default usePreloadedAnimation; 