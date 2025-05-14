import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * A component to test different delay values for the smooth navigation
 */
const DelayTester: React.FC = () => {
  const [scrollDuration, setScrollDuration] = useState(500);
  const [heroVisibilityDelay, setHeroVisibilityDelay] = useState(400);
  const navigate = useNavigate();

  const handleNavigate = (to: string) => {
    // Log the delay values
    console.log(`Manual navigation with delays: scrollDuration=${scrollDuration}ms, heroVisibilityDelay=${heroVisibilityDelay}ms`);
    
    // Scroll to top with smooth animation
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Wait for the scroll animation to complete
    setTimeout(() => {
      console.log(`Scroll animation completed, waiting ${heroVisibilityDelay}ms before navigation`);
      
      // Add a pause to ensure the hero is fully visible
      setTimeout(() => {
        console.log(`Hero visibility delay completed, navigating to ${to}`);
        navigate(to);
      }, heroVisibilityDelay);
    }, scrollDuration);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Navigation Delay Tester</h2>
      
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
            max="2000"
            step="100"
            value={heroVisibilityDelay}
            onChange={(e) => setHeroVisibilityDelay(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0ms</span>
            <span>1000ms</span>
            <span>2000ms</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          onClick={() => handleNavigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Home
        </button>
        <button
          onClick={() => handleNavigate('/about')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          About
        </button>
        <button
          onClick={() => handleNavigate('/services')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Services
        </button>
        <button
          onClick={() => handleNavigate('/privacy')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Privacy
        </button>
        <button
          onClick={() => handleNavigate('/terms')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Terms
        </button>
      </div>
      
      <p className="mt-6 text-sm text-gray-600">
        This component bypasses the SmoothNavigationProvider and directly implements the navigation
        with configurable delays. Use the sliders to adjust the timing and observe the effect.
      </p>
    </div>
  );
};

export default DelayTester;
