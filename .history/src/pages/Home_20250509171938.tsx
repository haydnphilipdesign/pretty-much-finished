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
    <div className="min-h-screen overflow-x-hidden max-w-full">
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

      {/* Combined blue sections */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-blue">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.03)_100%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="relative z-10"
        >
          <ServicesOverview />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="relative z-10 -mt-24" /* Negative margin to remove the gap */
        >
          <Statistics />
        </motion.div>
      </div>

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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to streamline your transactions?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Let me handle the paperwork while you focus on growing your business
          </p>
          <HeroButton
            to="/agent-portal"
            variant="inverted"
            size="lg"
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
          </HeroButton>
        </div>

        {/* Decorative elements for visual consistency */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 hidden lg:block"
          animate={{
            y: [0, 15, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
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
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="w-full h-full bg-brand-gold/10 rounded-full blur-xl" />
        </motion.div>
      </ContentSection>
    </div>
  );
};

export default Home;
