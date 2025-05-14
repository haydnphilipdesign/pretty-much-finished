"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';
import AboutSection from '../components/AboutSection';
import ServicesOverview from '../components/ServicesOverview';
import Statistics from '../components/Statistics';
import ContactSection from '../components/ContactSection';
import Testimonials from '../components/Testimonials';
import Hero from '../components/Hero';
import { useNavigation } from '../providers/SmoothNavigationProvider';
import { RevealSection } from '../components/GlobalAnimations';
import OptimizedImage from '../components/OptimizedImage';
import useScrollToTop from "../hooks/useScrollToTop";
import ContentSection from '../components/ContentSection';
import { UnifiedButton } from '../components/ui/unified-button';
import { ArrowRight } from 'lucide-react';
import PreloadedAnimationWrapper from '../components/PreloadedAnimationWrapper';

// Define section variants - remove y-axis movement
const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};

const Home: React.FC = () => {
  useScrollToTop();
  const { Link } = useNavigation();

  return (
    <div className="min-h-screen overflow-x-hidden max-w-full">
      {/* Hero section with parallax effect */}
      <Hero />

      {/* Other sections with scroll-triggered animations */}
      <PreloadedAnimationWrapper>
        <AboutSection />
      </PreloadedAnimationWrapper>

      {/* Combined blue sections */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-blue">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.03)_100%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        </div>

        <PreloadedAnimationWrapper
          className="relative z-10"
        >
          <ServicesOverview />
        </PreloadedAnimationWrapper>

        <PreloadedAnimationWrapper
          className="relative z-10 -mt-24" /* Negative margin to remove the gap */
        >
          <Statistics />
        </PreloadedAnimationWrapper>
      </div>

      <Testimonials />

      <ContactSection />

      {/* CTA Section with Glass Card */}
      <section className="py-20 relative overflow-hidden">
        {/* Enhanced gradient background with consistent patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-blue">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.05)_100%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:32px_32px]" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
          <motion.div 
            className="glass-card-navy mx-auto overflow-visible"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="glass-card-title text-4xl md:text-5xl font-bold text-center mb-6">Ready to streamline your transactions?</h2>
            <p className="glass-card-content text-xl mb-10 max-w-3xl mx-auto text-center">
              Let me handle the paperwork while you focus on growing your business
            </p>
            <div className="flex justify-center">
              <UnifiedButton
                to="/agent-portal"
                variant="hero"
                size="lg"
                radius="full"
                withAnimation={true}
                icon={
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                }
              >
                Start a Transaction
              </UnifiedButton>
            </div>
          </motion.div>
        </div>

        {/* Enhanced decorative elements for visual consistency */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 hidden lg:block"
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="w-full h-full bg-white/10 rounded-full blur-xl" />
        </motion.div>

        <motion.div
          className="absolute bottom-10 right-10 w-32 h-32 hidden lg:block"
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="w-full h-full bg-brand-gold/20 rounded-full blur-xl" />
        </motion.div>
        
        {/* Additional floating element for visual interest */}
        <motion.div
          className="absolute bottom-40 left-40 w-20 h-20 hidden lg:block"
          animate={{
            x: [0, 15, 0],
            y: [0, -10, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="w-full h-full bg-white/15 rounded-full blur-lg" />
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
