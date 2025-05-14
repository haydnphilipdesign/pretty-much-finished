import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Award, ChevronRight } from 'lucide-react';

// Array of background images for rotation
const backgroundImages = [
  '/laptop.jpg',
  '/home-hero.jpg',
  '/service-hero.jpg',
  '/work-with-me-hero.jpg'
];

// Real testimonials data from the Testimonials component
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
  // State for rotating background images
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  // const [isChanging, setIsChanging] = useState(false); // Removed for smoother transition
  
  // State for rotating testimonials
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Background image rotation effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 7000); // Image changes every 7 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Testimonial rotation effect
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(testimonialInterval);
  }, []);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
      role="banner"
      aria-label="Welcome to PA Real Estate Support Services"
    >
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}> {/* Removed mode="wait" to allow overlap */}
          <motion.div
            key={currentBgIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} // Animate directly to opacity 1
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }} // Smoother 1-second crossfade
          >
            <div className="absolute inset-0 bg-black/20" /> {/* Consistent dark overlay */}
            <img
              src={backgroundImages[currentBgIndex]}
              alt="Real estate professionals"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Enhanced gradient overlay with animated pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/30 to-blue-900/80">
          <div className="absolute inset-0 opacity-20 pattern-dots" />
        </div>
      </div>

      {/* Animated dots in corner - decorative element */}
      <div className="absolute top-20 right-20 w-32 h-32 hidden lg:block">
        <motion.div 
          className="w-2 h-2 rounded-full bg-blue-400 absolute"
          animate={{ 
            x: [0, 10, 0], 
            y: [0, 10, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div 
          className="w-2 h-2 rounded-full bg-blue-300 absolute left-10"
          animate={{ 
            x: [0, -10, 0], 
            y: [0, 5, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="w-3 h-3 rounded-full bg-blue-200 absolute left-20 top-10"
          animate={{ 
            x: [0, 15, 0], 
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
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
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
              Professional Transaction Coordination
            </motion.div>
            
            {/* Main headline */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="block">Your trusted partner in</span>
              <span className="block text-blue-300">reliable transaction</span>
              <span className="block">management</span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              className="text-xl md:text-2xl mb-6 md:mb-8 text-blue-100 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Empowering realtors with expert coordination services so you can focus on what matters most—your clients.
            </motion.p>
            
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
              <Link
                to="/agent-portal"
                className="inline-flex items-center justify-center px-6 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xl hover:shadow-blue-700/30 transition-all duration-300 transform hover:-translate-y-1 group"
              >
                Start a Transaction
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold border border-white/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                View Services
              </Link>
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
                className="min-h-[100px]"
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
    </section>
  );
};

export default Hero;