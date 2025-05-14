import React from 'react';

interface SimpleHeroProps {
  children: React.ReactNode;
}

/**
 * SimpleHero - A basic hero component to use as a fallback
 */
const SimpleHero: React.FC<SimpleHeroProps> = ({ children }) => {
  return (
    <section
      className="relative flex items-center justify-center text-white overflow-hidden max-w-full h-screen"
      data-hero-component="true"
      data-hero-container="true"
      style={{ marginTop: 0, paddingTop: 0 }}
    >
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 w-full max-w-full overflow-hidden">
        {children}
      </div>
    </section>
  );
};

export default SimpleHero;