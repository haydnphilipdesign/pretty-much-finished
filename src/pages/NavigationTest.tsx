import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeroWrapper from '../components/PageHeroWrapper';

/**
 * A standalone test page for navigation timing
 */
const NavigationTest: React.FC = () => {
  const [scrollDuration, setScrollDuration] = useState(500);
  const [heroVisibilityDelay, setHeroVisibilityDelay] = useState(1000);
  const navigate = useNavigate();

  // Custom navigation function that doesn't rely on any providers
  const customNavigate = useCallback((to: string) => {
    console.log(`NavigationTest: Starting navigation to ${to}`);
    console.log(`NavigationTest: Using scrollDuration=${scrollDuration}ms, heroVisibilityDelay=${heroVisibilityDelay}ms`);

    // Get current scroll position
    const currentScrollPosition = window.scrollY;
    console.log(`NavigationTest: Current scroll position: ${currentScrollPosition}px`);

    // Only scroll if we're not already at the top
    if (currentScrollPosition > 0) {
      console.log(`NavigationTest: Scrolling to top...`);

      // Scroll to top with smooth animation
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Wait for the scroll animation to complete
      console.log(`NavigationTest: Waiting ${scrollDuration}ms for scroll animation...`);
      setTimeout(() => {
        console.log(`NavigationTest: Scroll complete, waiting ${heroVisibilityDelay}ms for hero visibility...`);

        // Add a pause to ensure the hero is fully visible
        setTimeout(() => {
          console.log(`NavigationTest: Hero visibility delay complete, navigating to ${to}`);
          navigate(to);
        }, heroVisibilityDelay);
      }, scrollDuration);
    } else {
      // If already at the top, navigate immediately
      console.log(`NavigationTest: Already at top, navigating immediately to ${to}`);
      navigate(to);
    }
  }, [navigate, scrollDuration, heroVisibilityDelay]);

  // Generate a lot of content to make the page scrollable
  const generateContent = () => {
    const content = [];
    for (let i = 0; i < 20; i++) {
      content.push(
        <div key={i} className="p-6 bg-white rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-3">Section {i + 1}</h3>
          <p className="text-gray-700">
            This is a test section to make the page scrollable. Scroll down to see more content,
            then use the navigation controls to test the smooth scrolling and hero visibility delay.
          </p>
        </div>
      );
    }
    return content;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeroWrapper
        title="Navigation Test"
        subtitle="Test page for smooth navigation timing"
        minHeight="min-h-screen"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12 sticky top-20 z-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Navigation Timing Test</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scroll Duration: {scrollDuration}ms
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={scrollDuration}
                onChange={(e) => setScrollDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>100ms</span>
                <span>1000ms</span>
                <span>2000ms</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Visibility Delay: {heroVisibilityDelay}ms
              </label>
              <input
                type="range"
                min="0"
                max="3000"
                step="100"
                value={heroVisibilityDelay}
                onChange={(e) => setHeroVisibilityDelay(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0ms</span>
                <span>1500ms</span>
                <span>3000ms</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button
              onClick={() => customNavigate('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => customNavigate('/about')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => customNavigate('/services')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => customNavigate('/privacy')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => customNavigate('/terms')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Terms
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Scroll down to test navigation from different scroll positions.
            The console will show detailed logs of the navigation process.
          </p>
        </div>

        {/* Scrollable content */}
        <div className="space-y-6">
          {generateContent()}
        </div>
      </div>
    </div>
  );
};

export default NavigationTest;
