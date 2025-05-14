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

// Define section variants
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};

const Home: React.FC = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen">
      {/* Hero section with parallax effect */}
      <Hero />

      {/* Other sections with scroll-triggered animations */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <AboutSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <ServicesOverview />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <Statistics />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <Testimonials />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <ContactSection />
      </motion.div>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-brand-blue to-brand-blue/90 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to streamline your transactions?</h2>
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
            Let me handle the paperwork while you focus on growing your business
          </p>
          <Link
            to="/agent-portal"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-brand-blue bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            Start a Transaction
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 ml-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
