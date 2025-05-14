export interface BrowserInfo {
  userAgent: string;
  screenSize: {
    width: number;
    height: number;
  };
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  browser: string;
  os: string;
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
  
  return 'Unknown';
}

function detectOS(): string {
  const ua = navigator.userAgent;
  
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS')) return 'MacOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  
  return 'Unknown';
}

function detectDeviceType(): { isMobile: boolean; isTablet: boolean; isDesktop: boolean } {
  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  
  // Check for mobile devices
  const isMobileDevice = /mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua);
  
  // Check for tablets
  const isTabletDevice = /ipad|tablet/i.test(ua) || (width >= 768 && width <= 1024);
  
  // If neither mobile nor tablet, assume desktop
  const isDesktopDevice = !isMobileDevice && !isTabletDevice;
  
  return {
    isMobile: isMobileDevice && !isTabletDevice,
    isTablet: isTabletDevice,
    isDesktop: isDesktopDevice
  };
}

export function getDeviceInfo(): BrowserInfo {
  const deviceType = detectDeviceType();
  
  return {
    userAgent: navigator.userAgent,
    screenSize: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    ...deviceType,
    browser: detectBrowser(),
    os: detectOS()
  };
}

export function formatScreenSize(width: number, height: number): string {
  return `${width}x${height}`;
}

export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
}

export function getNetworkInfo(): { effectiveType: string; downlink: number } {
  // @ts-ignore
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    return {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0
    };
  }
  
  return {
    effectiveType: 'unknown',
    downlink: 0
  };
}

export function getBrowserLocale(): string {
  return navigator.language || 'en-US';
}

export function getColorScheme(): 'light' | 'dark' | 'no-preference' {
  if (!window.matchMedia) return 'no-preference';
  
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  
  return 'no-preference';
}

// Memory and performance utilities
export function getMemoryInfo(): { totalJSHeapSize?: number; usedJSHeapSize?: number } {
  // @ts-ignore
  const memory = window.performance?.memory;
  
  if (memory) {
    return {
      totalJSHeapSize: memory.totalJSHeapSize,
      usedJSHeapSize: memory.usedJSHeapSize
    };
  }
  
  return {};
}

export function getPerformanceMetrics() {
  if (!window.performance) return null;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');
  
  return {
    loadTime: navigation?.loadEventEnd - navigation?.startTime,
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.startTime,
    firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
    firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime
  };
} 