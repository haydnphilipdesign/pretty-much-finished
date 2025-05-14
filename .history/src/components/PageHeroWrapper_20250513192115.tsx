import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SimpleHero from './SimpleHero';
import { Award, Calendar, CheckCircle, Download, FileText,
         HelpCircle, InfoIcon, LayoutGrid, Mail, Phone,
         Shield, Star, Users, Clock, Target } from 'lucide-react';
import ContentCard from './ContentCard';

interface PageHeroWrapperProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  minHeight?: string;
  className?: string;
  pageType?: 'about' | 'services' | 'work' | 'privacy' | 'terms' | 'login';
}

/**
 * A reusable hero component for all pages that connects to the global slideshow
 * Uses the same positioning and width as the Home page hero with page-specific glass cards
 */
const PageHeroWrapper: React.FC<PageHeroWrapperProps> = ({
  title,
  subtitle,
  children,
  minHeight = 'min-h-screen',
  className = '',
  pageType
}) => {
  // Split title to apply different styling to the last word
  const words = title.split(' ');
  const lastWord = words.pop();
  const firstWords = words.join(' ');

  // Create refs to track animation state
  const hasAnimated = useRef(false);

  // Prevent re-animation when scrolling back to top
  useEffect(() => {
    const handleScroll = () => {
      if (hasAnimated.current) {
        // If we've already animated, prevent re-animation by removing data attributes
        const heroElements = document.querySelectorAll('[data-hero-content]');
        heroElements.forEach(el => {
          if (el instanceof HTMLElement) {
            // Remove the data attribute that triggers animations
            el.removeAttribute('data-hero-content');
          }
        });
      }
    };

    // Set animation state after initial animation with longer delay
    setTimeout(() => {
      hasAnimated.current = true;
    }, 2000); // Increased from 1000ms to 2000ms for better user experience

    // Add the scrolling attribute to prevent immediate transitions
    document.body.setAttribute('data-scrolling', 'true');

    // Clear the scrolling attribute after animations complete
    setTimeout(() => {
      document.body.removeAttribute('data-scrolling');
    }, 1500);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine page type if not explicitly provided
  const determinedPageType = pageType ||
    title.toLowerCase().includes('about') ? 'about' :
    title.toLowerCase().includes('service') ? 'services' :
    title.toLowerCase().includes('work') ? 'work' :
    title.toLowerCase().includes('privacy') ? 'privacy' :
    title.toLowerCase().includes('terms') ? 'terms' :
    title.toLowerCase().includes('login') ? 'login' : undefined;

  // Content for the glass card based on page type
  const getGlassCardContent = () => {
    switch (determinedPageType) {
      case 'about':
        return (
          <div>
            <h3 className="hero-card-title flex items-center">
              <InfoIcon className="w-5 h-5 mr-2" />
              About Debbie O'Brien
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Star className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Experienced transaction coordinator with 30+ years in real estate
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Handled over 2,000 successful transactions
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Trusted partner for agents across the Poconos
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Target className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Dedicated to helping you focus on growing your business
                </p>
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <div>
            <h3 className="hero-card-title flex items-center">
              <LayoutGrid className="w-5 h-5 mr-2" />
              Services Highlights
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Complete contract-to-close coordination
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Shield className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Compliance review and documentation management
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Clock className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Timeline management and deadline tracking
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Client communication and progress updates
                </p>
              </div>
            </div>
          </div>
        );

      case 'work':
        return (
          <div>
            <h3 className="hero-card-title flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Get In Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="bg-white/10 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </span>
                <p className="text-sm text-white/90">
                  (570) 588-4637
                </p>
              </div>
              <div className="flex items-center">
                <span className="bg-white/10 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Mail className="w-4 h-4 text-white" />
                </span>
                <p className="text-sm text-white/90">
                  debbie@parealestatesupport.com
                </p>
              </div>
              <div className="flex items-center">
                <span className="bg-white/10 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Calendar className="w-4 h-4 text-white" />
                </span>
                <p className="text-sm text-white/90">
                  Available Mon-Fri, 9:00 AM - 5:00 PM
                </p>
              </div>
              <div className="rounded-lg bg-white/10 p-4 mt-4">
                <p className="text-sm text-white/90 italic">
                  "Let's work together to streamline your transactions and help your business thrive."
                </p>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div>
            <h3 className="hero-card-title flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Privacy Commitment
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Shield className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Your data is protected with industry-standard security measures
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  We only collect information necessary to provide our services
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Have questions about your data? Contact us anytime
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Download className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Last updated: June 1, 2023
                </p>
              </div>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div>
            <h3 className="hero-card-title flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Terms Highlights
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Clear service expectations and responsibilities
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Shield className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Professional confidentiality and information handling
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Documentation and intellectual property guidelines
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-400/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Download className="w-4 h-4 text-blue-300" />
                </span>
                <p className="text-sm text-white/90">
                  Last updated: June 1, 2023
                </p>
              </div>
            </div>
          </div>
        );

      case 'login':
        return (
          <div>
            <h3 className="hero-card-title flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Agent Benefits
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="bg-brand-gold/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Clock className="w-4 h-4 text-brand-gold" />
                </span>
                <p className="text-sm text-white/90">
                  Save 15+ hours per transaction with our services
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-brand-gold/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-brand-gold" />
                </span>
                <p className="text-sm text-white/90">
                  Track transaction progress in real-time
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-brand-gold/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <FileText className="w-4 h-4 text-brand-gold" />
                </span>
                <p className="text-sm text-white/90">
                  Access and manage all transaction documents online
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-brand-gold/20 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <Users className="w-4 h-4 text-brand-gold" />
                </span>
                <p className="text-sm text-white/90">
                  Join 100+ agents who trust our services
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SimpleHero>
      {/* Using the exact same grid layout and column spans as the Home hero */}
      <div className="container px-4 md:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <motion.div
              className="max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }} // Increased from 0.8 to 1.2
              style={{ willChange: "opacity" }}
              data-hero-content="container"
              data-transition-element="true"
              data-page-transitioning-content="true" /* Mark content for page transition handling */
            >
              {/* Title */}
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight text-white text-shadow-md text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }} {/* Match entrance animation exactly */}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  exit: { duration: 0.8, delay: 0 } // No delay on exit
                }}
                style={{ willChange: "opacity, transform" }}
                data-hero-content="title"
                data-transition-element="true"
              >
                {firstWords && <span className="block">{firstWords}</span>}
                {lastWord && <span className="block text-blue-200 drop-shadow-lg">{lastWord}</span>}
              </motion.h1>

              {/* Subtitle */}
              {subtitle && (
                <motion.p
                  className="text-xl md:text-2xl mb-6 md:mb-8 text-blue-100 font-light text-shadow-sm text-center lg:text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }} {/* Match entrance animation exactly */}
                  transition={{
                    duration: 0.8,
                    delay: 0.6,
                    exit: { duration: 0.8, delay: 0.1 } // Slight delay on exit for staggered effect
                  }}
                  style={{ willChange: "opacity, transform" }}
                  data-hero-content="subtitle"
                  data-transition-element="true"
                >
                  {subtitle}
                </motion.p>
              )}

              {/* Additional content */}
              {children && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }} {/* Match entrance animation exactly */}
                  transition={{
                    duration: 0.8,
                    delay: 0.8,
                    exit: { duration: 0.8, delay: 0.2 } // Slight delay on exit for staggered effect
                  }}
                  style={{ willChange: "opacity, transform" }}
                  data-hero-content="cta"
                  data-transition-element="true"
                  className="flex justify-center lg:justify-start"
                >
                  {children}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right side column for glass card */}
          <motion.div
            className="lg:col-span-5 hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <ContentCard heroStyle={true} className="glass-card-navy p-8">
              {getGlassCardContent()}
            </ContentCard>
          </motion.div>
        </div>
      </div>
    </SimpleHero>
  );
};

export default PageHeroWrapper;