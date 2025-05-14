import React from 'react';
import GlassCardsDemo from '../components/ui/GlassCardsDemo';

const GlassCardsShowcase: React.FC = () => {
  return (
    <div className="relative min-h-screen py-16">
      {/* Background gradient for the showcase */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Elegant Glass Card System
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Our new design system features beautiful frosted glass cards with multiple variants
            for different sections of the website.
          </p>
        </div>
        
        <GlassCardsDemo />
        
        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Implement</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
            These glass card styles are ready to be used throughout the website for a consistent,
            elegant design language.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Return Home
            </a>
            <a 
              href="/services" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50"
            >
              View Services
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassCardsShowcase; 