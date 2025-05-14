import React from 'react';

/**
 * GlassCardsDemo Component
 * 
 * A demonstration component showing all variants of the new glass card system
 */
const GlassCardsDemo = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Elegant Glass Card System</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Standard White Glass Card */}
        <div className="glass-card">
          <h3 className="glass-card-title text-gray-900">Standard Glass Card</h3>
          <p className="glass-card-subtitle text-gray-600">Elegant, clean appearance</p>
          <p className="glass-card-content text-gray-700">
            Perfect for most content throughout the site. Provides a clean, sophisticated look with subtle depth.
          </p>
        </div>
        
        {/* Navy Glass Card */}
        <div className="glass-card-navy">
          <h3 className="glass-card-title">Navy Glass Card</h3>
          <p className="glass-card-subtitle">Rich blue backdrop</p>
          <p className="glass-card-content">
            Ideal for highlighting important information or creating visual interest in key sections.
          </p>
        </div>
        
        {/* Blue Glass Card */}
        <div className="glass-card-blue">
          <h3 className="glass-card-title">Blue Glass Card</h3>
          <p className="glass-card-subtitle">Vibrant blue effect</p>
          <p className="glass-card-content">
            Creates a bold statement while maintaining elegance. Great for call-to-action areas.
          </p>
        </div>
        
        {/* Dark Glass Card */}
        <div className="glass-card-dark">
          <h3 className="glass-card-title">Dark Glass Card</h3>
          <p className="glass-card-subtitle">Sophisticated dark appearance</p>
          <p className="glass-card-content">
            Perfect for nighttime viewing or creating dramatic contrast against light backgrounds.
          </p>
        </div>
        
        {/* Gold Glass Card */}
        <div className="glass-card-gold">
          <h3 className="glass-card-title">Gold Glass Card</h3>
          <p className="glass-card-subtitle">Premium warm appearance</p>
          <p className="glass-card-content">
            Conveys luxury and premium service. Ideal for highlighting special offerings or premium features.
          </p>
        </div>
        
        {/* Frost Glass Card */}
        <div className="glass-card-frost">
          <h3 className="glass-card-title text-gray-900">Frost Glass Card</h3>
          <p className="glass-card-subtitle text-gray-600">Light, subtle frost effect</p>
          <p className="glass-card-content text-gray-700">
            Creates a light, airy feeling. Great for secondary information or supporting content sections.
          </p>
        </div>
        
        {/* Login-specific Glass Card */}
        <div className="glass-card-login col-span-1 md:col-span-2 lg:col-span-3">
          <h3 className="glass-card-title text-gray-900 text-center">Login Card Style</h3>
          <p className="glass-card-subtitle text-gray-600 text-center">Used for the agent portal login</p>
          <div className="mt-6 max-w-md mx-auto">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" className="mt-1 block w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" className="mt-1 block w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h3 className="text-xl font-bold mb-6 text-center">Usage with Different Content</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Example with list */}
          <div className="glass-card">
            <h3 className="glass-card-title text-gray-900">Features</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 mr-2"></span>
                <span>Elegant glass card system</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 mr-2"></span>
                <span>Multiple color variations</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 mr-2"></span>
                <span>Consistent styling system</span>
              </li>
            </ul>
          </div>
          
          {/* Example with icon */}
          <div className="glass-card-navy">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="glass-card-title mb-0">Premium Service</h3>
            </div>
            <p className="glass-card-content">
              We provide top-tier real estate support with attention to every detail.
            </p>
          </div>
          
          {/* Example with badge */}
          <div className="glass-card-blue">
            <div className="flex justify-between items-start mb-3">
              <h3 className="glass-card-title mb-0">Quick Response</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                New
              </span>
            </div>
            <p className="glass-card-content">
              Our agents respond within 24 hours to all inquiries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassCardsDemo; 