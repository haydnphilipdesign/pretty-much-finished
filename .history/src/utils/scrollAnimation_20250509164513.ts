/**
 * Enhanced scroll animation utility
 * Provides a smooth, customizable scroll animation with easing functions
 */

// Easing functions
const easing = {
  // Cubic easing in/out - acceleration until halfway, then deceleration
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,

  // Quartic easing out - deceleration to zero velocity
  easeOutQuart: (t: number): number =>
    1 - Math.pow(1 - t, 4),

  // Quintic easing in/out - acceleration until halfway, then deceleration
  easeInOutQuint: (t: number): number =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2,

  // Elastic easing out - exponentially decaying sine wave
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

interface ScrollOptions {
  /** Target scroll position (default: 0 - top of page) */
  targetPosition?: number;

  /** Duration of the scroll animation in milliseconds */
  duration?: number;

  /** Easing function to use for the animation */
  easingFunction?: keyof typeof easing;

  /** Callback function to execute when the scroll animation completes */
  onComplete?: () => void;
}

/**
 * Performs an enhanced smooth scroll animation with customizable easing
 * @param options Scroll animation options
 */
export const smoothScrollTo = (options: ScrollOptions = {}): void => {
  const {
    targetPosition = 0,
    duration = 400,
    easingFunction = 'easeOutQuart',
    onComplete
  } = options;

  // Get the starting scroll position
  const startPosition = window.pageYOffset;

  // Calculate the distance to scroll
  const distance = targetPosition - startPosition;

  // If there's no distance to scroll, just call the callback and return
  if (distance === 0) {
    if (onComplete) onComplete();
    return;
  }

  // Track the animation start time
  let startTime: number | null = null;

  // Animation function
  const animateScroll = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;

    // Calculate elapsed time
    const elapsedTime = currentTime - startTime;

    // Calculate progress (0 to 1)
    const progress = Math.min(elapsedTime / duration, 1);

    // Apply easing function
    const easedProgress = easing[easingFunction](progress);

    // Calculate new scroll position
    const newPosition = startPosition + distance * easedProgress;

    // Perform the scroll
    window.scrollTo(0, newPosition);

    // Continue animation if not complete
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    } else if (onComplete) {
      // Call the completion callback
      onComplete();
    }
  };

  // Start the animation
  requestAnimationFrame(animateScroll);
};
