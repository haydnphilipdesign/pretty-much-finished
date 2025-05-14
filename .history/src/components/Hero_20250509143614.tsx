import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, Award, ChevronRight, FileText, Home } from 'lucide-react';
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
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
                <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                <span>Agent Transaction Portal</span>
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight text-white">
                Welcome to the<br />
                <span className="text-blue-300">Agent Portal</span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-xl mb-8 text-blue-100 font-light">
                Submit new transactions quickly and easily with our streamlined intake form.
              </p>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <HeroButton
                  to="/agent-portal"
                  variant="primary"
                  size="lg"
                  icon={<FileText className="w-5 h-5 mr-2" />}
                >
                  Start Transaction Submission
                </HeroButton>

                <HeroButton
                  to="/services"
                  variant="ghost"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5 mr-2" />}
                >
                  Streamlined Process
                </HeroButton>
              </div>
            </motion.div>

            {/* Return to Home link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8"
            >
              <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white transition-colors">
                <Home className="w-4 h-4 mr-2" />
                <span>Return to Home</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Login Card Section */}
        <motion.div
          className="lg:col-span-2 hidden lg:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <ContentCard heroStyle={true} className="bg-white/10 backdrop-blur-md border border-white/20">
            {/* Card header with logo */}
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <img src="/logo-icon.png" alt="PA Real Estate Support" className="h-8 w-8" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-white mb-4">Agent Login</h2>

            {/* Password field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-blue-200 mb-1">Password</label>
              <input
                type="password"
                className="w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="remember-me"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-200">
                Remember me on this device
              </label>
            </div>

            {/* Sign in button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all duration-300 mb-6">
              Sign In
            </button>

            {/* Stats section */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="text-center bg-white/5 rounded-lg p-3">
                <p className="text-xl font-bold text-white">Fast</p>
                <p className="text-xs text-blue-200">Transaction Submission</p>
              </div>
              <div className="text-center bg-white/5 rounded-lg p-3">
                <p className="text-xl font-bold text-white">Secure</p>
                <p className="text-xs text-blue-200">Agent Portal Access</p>
              </div>
            </div>
          </ContentCard>
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