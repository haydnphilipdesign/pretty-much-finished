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
import HeroButton from '../components/HeroButton';
import { ArrowRight } from 'lucide-react';

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
  const { Link } = useNavigation();

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
      <ContentSection
        className="py-20 bg-gradient-to-br from-brand-blue to-brand-blue/90 relative overflow-hidden"
        centered={true}
        fullWidth={true}
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        <div className="text-center relative z-10">
          <h2 className="hero-headline text-white mb-6">Ready to streamline your transactions?</h2>
          <p className="hero-subheadline text-gray-200 mb-10 max-w-3xl mx-auto">
            Let me handle the paperwork while you focus on growing your business
          </p>
          <HeroButton
            to="/agent-portal"
            variant="ghost"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Start a Transaction
          </HeroButton>
        </div>
      </ContentSection>
    </div>
  );
};

export default Home;
