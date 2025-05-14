import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, Award, ChevronRight, Shield, Users } from 'lucide-react';
import GlobalPageHero from './GlobalPageHero';
import { useNavigation } from '../providers/SmoothNavigationProvider';
import HeroButton from './HeroButton';
import HeroBadge from './HeroBadge';
import ContentCard from './ContentCard';

// Real testimonials data
const testimonials = [
  {
    id: 1,
    name: "Bob Hay",
    role: "Broker at Keller Williams",
    quote: "Debbie has been my transaction coordinator since 2012. She is incredibly organized, staying on top of every step and detail to ensure smooth transactions every time.",
    image: "/bob-hay.jpg"
  },
  {
    id: 2,
    name: "Cassie Transue",
    role: "Keller Williams Realtor",
    quote: "I have had the pleasure of working alongside Debbie for the past six years. She has consistently demonstrated outstanding dedication and skill as a transaction coordinator.",
    image: "/cassie-transue.jpg"
  },
  {
    id: 3,
    name: "Robert Hoffman",
    role: "Keller Williams Realtor",
    quote: "Working with Debbie feels effortless. Her communication and customer service are easily 5-star. Debbie handles challenges with grace, keeping everything on track.",
    image: "/robert-hoffman.jpg"
  },
  {
    id: 4,
    name: "Axel Struckmeyer",
    role: "Keller Williams Realtor",
    quote: "I have used her Transaction Coordinator services for around 13-14 years. Her professionalism and expertise have been a huge asset to my business.",
    image: "/axel-struckmeyer.jpg"
  },
  {
    id: 5,
    name: "Jess Keller",
    role: "Keller Williams Realtor",
    quote: "Deb and I have been working together for over six years now. She is an exceptional team player and has consistently exceeded my expectations.",
    image: "/jess-keller.jpg"
  }
];

// Key features to highlight
const features = [
  { icon: CheckCircle, title: "Streamlined Transactions", description: "Simplified process from contract to closing" },
  { icon: Clock, title: "Faster Closings", description: "Efficient coordination saves valuable time" },
  { icon: Shield, title: "Compliance Expertise", description: "Stay compliant with regulatory requirements" },
  { icon: Users, title: "Client Communication", description: "Professional updates to all parties" }
];

// Real statistics data
const stats = [
  { id: 1, value: '30+', label: 'Years of Excellence' },
  { id: 2, value: '2,000+', label: 'Transactions' },
  { id: 3, value: '10,000+', label: 'Agent Hours Saved' },
  { id: 4, value: '$500M+', label: 'Transaction Volume' },
];

const Hero: React.FC = () => {
  // State for rotating testimonials
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { Link } = useNavigation();

  // Testimonial rotation effect
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(testimonialInterval);
  }, []);

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

    // Set animation state after initial animation
    setTimeout(() => {
      hasAnimated.current = true;
    }, 1000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <GlobalPageHero>
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Content */}
          <div className="lg:col-span-7">
            <motion.div
              className="max-w-2xl mx-auto lg:mx-0 px-4 md:px-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{ willChange: "opacity" }}
              data-hero-content="container"
            >


              {/* Main headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ willChange: "opacity, transform" }}
                data-hero-content="title"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight text-white text-center lg:text-left">
                  <span className="block">Your trusted partner in</span>
                  <span className="block text-blue-300">reliable transaction</span>
                  <span className="block">management</span>
                </h1>
              </motion.div>

              {/* Subheadline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                data-hero-content="subtitle"
              >
                <p className="text-xl md:text-2xl mb-6 md:mb-8 text-blue-100 font-light text-center lg:text-left">
                  Empowering realtors with expert coordination services so you can focus on what matters most—your clients.
                </p>
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8 items-center sm:items-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                data-hero-content="cta"
              >
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

                <HeroButton
                  to="/services"
                  variant="ghost"
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 rounded-full"
                >
                  View Services
                </HeroButton>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side Card Section */}
          <motion.div
            className="lg:col-span-5 hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <ContentCard heroStyle={true} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl">
              {/* Stats section */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-xl font-bold text-white">{stats[0].value}</p>
                  <p className="text-xs text-blue-200">{stats[0].label}</p>
                </div>
                <div className="text-center bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-xl font-bold text-white">{stats[1].value}</p>
                  <p className="text-xs text-blue-200">{stats[1].label}</p>
                </div>
              </div>

              {/* Testimonial content with fixed height */}
              <div className="text-4xl text-blue-200 opacity-50 font-serif mb-4">"</div>
              <div className="min-h-[200px]">  {/* Fixed height container for testimonials */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-lg font-medium mb-4 text-white/90">
                      {testimonials[currentTestimonial].quote}
                    </p>
                    <p className="text-sm text-blue-200">
                      {testimonials[currentTestimonial].name}, {testimonials[currentTestimonial].role.split(',')[0]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Testimonial navigation dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentTestimonial === index
                        ? 'bg-white w-6'
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </ContentCard>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8 px-4 md:px-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-blue-300" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
                <p className="text-blue-200 text-xs">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator moved to bottom-right corner */}
        <motion.div
          className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 hidden sm:flex"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 1.5,
            y: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <span className="text-sm text-blue-200 mr-2">Scroll</span>
            <ChevronRight className="w-4 h-4 text-blue-300 transform rotate-90" />
          </div>
        </motion.div>
      </div>
    </GlobalPageHero>
  );
};

export default Hero;