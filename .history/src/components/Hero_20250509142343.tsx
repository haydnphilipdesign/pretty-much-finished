import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, Award, ChevronRight } from 'lucide-react';
import GlobalPageHero from './GlobalPageHero';
import { useSlideshow } from '../context/GlobalSlideshowContext';
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

// Key benefits to highlight
const benefits = [
  { icon: CheckCircle, text: "Streamlined Transactions" },
  { icon: Clock, text: "Faster Closings" },
  { icon: Award, text: "Expert Coordination" }
];

// Real statistics data from the Statistics component
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

  return (
    <GlobalPageHero>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        {/* Main Hero Content */}
        <div className="lg:col-span-3">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Pre-title badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="hero-badge mb-4">
                <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
                Professional Transaction Coordination
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="hero-headline">
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
            >
              <p className="hero-subheadline">
                Empowering realtors with expert coordination services so you can focus on what matters most—your clients.
              </p>
            </motion.div>

            {/* Key benefits */}
            <motion.div
              className="flex flex-wrap gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm sm:text-base"
                >
                  <benefit.icon className="w-5 h-5 mr-2 text-blue-300" />
                  <span className="font-medium">{benefit.text}</span>
                  {index < benefits.length - 1 && (
                    <span className="mx-2 text-blue-400/50">•</span>
                  )}
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <HeroButton
                  to="/agent-portal"
                  variant="primary"
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
                >
                  View Services
                </HeroButton>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Testimonial Card Section */}
        <motion.div
          className="lg:col-span-2 hidden lg:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-50"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-blue-300 rounded-full opacity-30"></div>

            {/* Testimonial content */}
            <div className="text-4xl text-blue-200 opacity-50 font-serif mb-4">"</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="min-h-[150px]"
              >
                <p className="text-lg font-medium mb-4 text-white/90">
                  {testimonials[currentTestimonial].quote}
                </p>
                <p className="text-sm text-blue-200">
                  {testimonials[currentTestimonial].name}, {testimonials[currentTestimonial].role.split(',')[0]}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial navigation dots */}
            <div className="flex justify-center mt-6 space-x-2">
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

            {/* Stats section */}
            <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats[1].value}</p>
                <p className="text-xs text-blue-200">{stats[1].label}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats[0].value}</p>
                <p className="text-xs text-blue-200">{stats[0].label}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats[3].value}</p>
                <p className="text-xs text-blue-200">{stats[3].label}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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
        <div className="flex flex-col items-center">
          <span className="text-sm text-blue-200 mb-2">Scroll to explore</span>
          <ChevronRight className="w-5 h-5 text-blue-300 transform rotate-90" />
        </div>
      </motion.div>
    </GlobalPageHero>
  );
};

export default Hero;