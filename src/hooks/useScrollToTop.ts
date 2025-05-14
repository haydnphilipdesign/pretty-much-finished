import { useEffect } from 'react';

/**
 * Enhanced custom hook to scroll to the top of the page with a classy, elegant animation
 * @param delay - Delay in milliseconds before scrolling starts (default: 300ms)
 */
const useScrollToTop = (delay: number = 300) => {
  useEffect(() => {
    // Set data attribute to prevent immediate page transition
    document.body.setAttribute('data-scrolling', 'true');
    
    const scrollTimer = setTimeout(() => {
      // Get the current scroll position
      const startPosition = window.scrollY;
      
      // Early return if already at the top
      if (startPosition <= 0) {
        document.body.removeAttribute('data-scrolling');
        return;
      }
      
      // Enhanced smooth scrolling with easing function
      const scrollDuration = 1200; // Longer duration for a more elegant feel
      const startTime = performance.now();
      
      // Use a custom easing function for more luxurious feel
      // This is a cubic bezier approximation for a sophisticated easing
      const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);
      
      const scrollStep = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / scrollDuration, 1);
        const easedProgress = easeOutQuart(progress);
        
        // Calculate the new scroll position with easing
        const newPosition = startPosition * (1 - easedProgress);
        
        // Smoothly scroll to the calculated position
        window.scrollTo(0, newPosition);
        
        // Continue animation until duration is complete
        if (progress < 1) {
          requestAnimationFrame(scrollStep);
        } else {
          // Animation complete, remove the scrolling attribute
          document.body.removeAttribute('data-scrolling');
        }
      };
      
      // Start the animation
      requestAnimationFrame(scrollStep);
    }, delay);
    
    return () => clearTimeout(scrollTimer);
  }, [delay]);
};

export default useScrollToTop;
