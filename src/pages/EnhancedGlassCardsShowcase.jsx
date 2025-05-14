import React from 'react';
import EnhancedGlassCardsDemo from '../components/ui/EnhancedGlassCardsDemo';
import { motion } from 'framer-motion';

const EnhancedGlassCardsShowcase = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-brand-blue to-brand-navy">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.03)_100%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Enhanced Glass Card System
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-blue-100">
              A beautiful, modern glass card system with improved visual appearance and text contrast
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Demo Section */}
      <EnhancedGlassCardsDemo />
      
      {/* Implementation Guide */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Implementation Guide
            </h2>
            
            <div className="glass-card-frost mb-8">
              <h3 className="text-xl font-semibold mb-4">How to Use Glass Cards</h3>
              <p className="mb-4">
                Simply add the appropriate glass card class to your container element:
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                {`<div className="glass-card-blue">
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</div>`}
              </pre>
            </div>
            
            <div className="glass-card-frost mb-8">
              <h3 className="text-xl font-semibold mb-4">Available Variants</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><code className="bg-gray-100 px-2 py-1 rounded">.glass-card</code> - Standard glass card</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.glass-card-blue</code> - Blue glass card</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.glass-card-navy</code> - Navy glass card</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.glass-card-white</code> - White glass card</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.glass-card-dark</code> - Dark glass card</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.glass-card-frost</code> - Frost glass card</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.glass-card-light</code> - Light glass card</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.glass-card-gold</code> - Gold glass card</li>
              </ul>
            </div>
            
            <div className="glass-card-frost">
              <h3 className="text-xl font-semibold mb-4">Usage Guidelines</h3>
              <p className="mb-4">
                When choosing a glass card variant, consider the background it will be placed on:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Light backgrounds:</strong> Use glass-card, glass-card-blue, glass-card-navy, or glass-card-dark</li>
                <li><strong>Dark backgrounds:</strong> Use glass-card-white, glass-card-frost, or glass-card-light</li>
                <li><strong>Forms:</strong> Use glass-card-frost for optimal form element styling</li>
                <li><strong>Accent areas:</strong> Use glass-card-gold to draw attention</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Implement
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
            These enhanced glass card styles are ready to be used throughout the website for a consistent,
            elegant design language with proper text contrast.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-dark transition-colors"
            >
              Return Home
            </a>
            <a 
              href="/glass-cards-showcase" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-brand-blue bg-white hover:bg-gray-50 transition-colors"
            >
              View Original Cards
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGlassCardsShowcase;
