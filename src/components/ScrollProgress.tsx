import React, { memo, useCallback, useEffect, useState } from 'react';

const ScrollProgress = memo(function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;
    setProgress(scrollPercent);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div 
      className="fixed top-0 left-0 h-1 bg-blue-500 transition-all duration-300"
      style={{ width: `${progress * 100}%` }}
    />
  );
});

export default ScrollProgress;