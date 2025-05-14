import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, Award, ChevronRight, Shield, Users } from 'lucide-react';
import GlobalPageHero from './GlobalPageHeroNew'; // Use the new component that relies on PersistentBackground
import { useNavigation } from '../providers/SmoothNavigationProvider';
import { UnifiedButton } from './ui/unified-button';
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
      <div className="container px-4 md:px-6 lg:px-8 mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Main Hero Content */}
          <div className="lg:col-span-7">
            <motion.div
              className="max-w-2xl mx-auto lg:mx-0 use-standard-animations framer-entrance-override"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.7, 
                  ease: [0.22, 0.03, 0.36, 1.0] 
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -20,
                transition: { 
                  duration: 0.7, 
                  ease: [0.22, 0.03, 0.36, 1.0] 
                }
              }}
              style={{ willChange: "opacity, transform" }}
              data-hero-content="container"
              data-page-transitioning-content="true" /* Mark content for page transition handling */
            >


              {/* Main headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.7,
                    ease: [0.22, 0.03, 0.36, 1.0],
                    delay: 0.1
                  }
                }}
                exit={{ 
                  opacity: 0,
                  y: -20,
                  transition: {
                    duration: 0.7,
                    ease: [0.22, 0.03, 0.36, 1.0],
                    delay: 0
                  }
                }}
                className="use-standard-animations framer-entrance-override"
                style={{ willChange: "opacity, transform" }}
                data-hero-content="title"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight text-white text-center lg:text-left">
                  <motion.div 
                    className="overflow-hidden inline-block w-full"
                  >
                    <motion.span 
                      className="inline-block"
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1,
                        transition: { 
                          duration: 1.5, 
                          ease: [0.22, 0.03, 0.26, 1.0],
                          delay: 0.2 
                        } 
                      }}
                      exit={{ 
                        y: -40, 
                        opacity: 0,
                        transition: { 
                          duration: 0.8, 
                          ease: [0.22, 0.03, 0.36, 1.0],
                          delay: 0 
                        } 
                      }}
                    >
                      Your trusted partner in
                    </motion.span>
                  </motion.div>
                  <motion.div 
                    className="overflow-hidden inline-block w-full"
                  >
                    <motion.span 
                      className="inline-block text-blue-300"
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1,
                        transition: { 
                          duration: 1.5, 
                          ease: [0.22, 0.03, 0.36, 1.0],
                          delay: 0.35 
                        } 
                      }}
                      exit={{ 
                        y: -40, 
                        opacity: 0,
                        transition: { 
                          duration: 0.8, 
                          ease: [0.22, 0.03, 0.36, 1.0],
                          delay: 0.1 
                        } 
                      }}
                    >
                      reliable transaction
                    </motion.span>
                  </motion.div>
                  <motion.div 
                    className="overflow-hidden inline-block w-full"
                  >
                    <motion.span 
                      className="inline-block"
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1,
                        transition: { 
                          duration: 1.5, 
                          ease: [0.22, 0.03, 0.36, 1.0],
                          delay: 0.5 
                        } 
                      }}
                      exit={{ 
                        y: -40, 
                        opacity: 0,
                        transition: { 
                          duration: 0.8, 
                          ease: [0.22, 0.03, 0.36, 1.0],
                          delay: 0.2 
                        } 
                      }}
                    >
                      management
                    </motion.span>
                  </motion.div>
                </h1>
              </motion.div>

              {/* Subheadline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: {
                    duration: 1.2,
                    ease: [0.22, 0.03, 0.26, 1.0],
                    delay: 0.7
                  }
                }}
                exit={{ 
                  opacity: 0,
                  transition: {
                    duration: 0.5,
                    ease: [0.22, 0.03, 0.26, 1.0],
                    delay: 0.1
                  }
                }}
                style={{ willChange: "opacity, transform" }}
                data-hero-content="subtitle"
              >
                <motion.p 
                  className="text-xl md:text-2xl mb-6 md:mb-8 text-blue-100 font-light text-center lg:text-left"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 1.6,
                      ease: [0.22, 0.03, 0.36, 1.0],
                      delay: 0.8
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -15,
                    transition: {
                      duration: 0.7,
                      ease: [0.22, 0.03, 0.36, 1.0],
                      delay: 0.15
                    }
                  }}
                >
                  Empowering realtors with expert coordination services so you can focus on what matters most—your clients.
                </motion.p>
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8 items-center sm:items-start"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: {
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1.0],
                    delay: 0.9
                  }
                }}
                exit={{ 
                  opacity: 0,
                  transition: {
                    duration: 0.4,
                    ease: [0.4, 0.0, 0.2, 1.0],
                    delay: 0.3
                  }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: [0.25, 0.1, 0.25, 1.0],
                      delay: 0.95
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -10, 
                    scale: 0.97,
                    transition: {
                      duration: 0.4,
                      ease: [0.4, 0.0, 0.2, 1.0],
                      delay: 0.35
                    }
                  }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  style={{ willChange: "opacity, transform" }}
                  data-hero-content="cta-primary"
                >
                  <UnifiedButton
                    to="/agent-portal"
                    variant="secondary"
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: [0.25, 0.1, 0.25, 1.0],
                      delay: 1.05
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -10, 
                    scale: 0.97,
                    transition: {
                      duration: 0.4,
                      ease: [0.4, 0.0, 0.2, 1.0],
                      delay: 0.4
                    }
                  }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  style={{ willChange: "opacity, transform" }}
                  data-hero-content="cta-secondary"
                >
                  <UnifiedButton
                    to="/services"
                    variant="glass"
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
                    View Services
                  </UnifiedButton>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side Card Section */}
          <motion.div
            className="lg:col-span-5 hidden lg:block"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              transition: {
                duration: 0.9,
                ease: [0.25, 0.1, 0.25, 1.0],
                delay: 0.7
              }
            }}
            exit={{ 
              opacity: 0, 
              x: 30, 
              scale: 0.98,
              transition: {
                duration: 0.6,
                ease: [0.4, 0.0, 0.2, 1.0],
                delay: 0.15
              }
            }}
          >
            <ContentCard heroStyle={true} className="glass-card-navy p-8">
              {/* Stats section */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center bg-white/10 p-4 rounded-xl">
                  <p className="text-xl font-bold text-white">{stats[0].value}</p>
                  <p className="text-xs text-blue-200">{stats[0].label}</p>
                </div>
                <div className="text-center bg-white/10 p-4 rounded-xl">
                  <p className="text-xl font-bold text-white">{stats[1].value}</p>
                  <p className="text-xs text-blue-200">{stats[1].label}</p>
                </div>
              </div>

              {/* Testimonial content with fixed height */}
              <div className="text-4xl text-blue-200 opacity-50 font-serif mb-4">"</div>
              <div className="min-h-[200px]">  {/* Fixed height container for testimonials */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-6"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: {
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1.0],
              delay: 1.1,
              staggerChildren: 0.15,
              delayChildren: 1.2
            }
          }}
          exit={{ 
            opacity: 0,
            transition: {
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1.0],
              delay: 0.1,
              staggerChildren: 0.08,
              staggerDirection: -1
            }
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card-navy p-4"
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                show: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: {
                    duration: 0.7,
                    ease: [0.25, 0.1, 0.25, 1.0]
                  }
                },
                exit: { 
                  opacity: 0, 
                  y: -15, 
                  scale: 0.97,
                  transition: {
                    duration: 0.4,
                    ease: [0.4, 0.0, 0.2, 1.0]
                  }
                }
              }}
              initial="hidden"
              animate="show"
              exit="exit"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1.0],
              delay: 2.0
            }
          }}
          exit={{ 
            opacity: 0, 
            y: 20,
            transition: {
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1.0],
              delay: 0
            }
          }}
        >
          <motion.div 
            className="flex items-center glass-card-navy rounded-full px-4 py-2"
            animate={{ 
              y: [0, -8, 0],
              transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
          >
            <span className="text-sm text-blue-200 mr-2">Scroll</span>
            <ChevronRight className="w-4 h-4 text-blue-300 transform rotate-90" />
          </motion.div>
        </motion.div>
      </div>
    </GlobalPageHero>
  );
};

export default Hero;