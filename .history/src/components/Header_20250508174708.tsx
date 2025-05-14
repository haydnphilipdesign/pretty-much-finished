import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Home, FileText, Info, BookOpen, HelpCircle } from 'lucide-react';
import Logo from '/logo-flat.png';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  
  const location = useLocation();

  // Handle scroll events for header visibility and styling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only track scrolling when not in the transaction form
      if (!document.body.classList.contains('form-active')) {
        // Detect scroll direction to show/hide header
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
          // Scrolling down - hide header
          setIsHeaderVisible(false);
        } else {
          // Scrolling up - show header
          setIsHeaderVisible(true);
        }
        
        // Update scrolled state for styling
        setScrolled(currentScrollY > 20);
        
        // Update last scroll position
        setLastScrollY(currentScrollY);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={16} /> },
    { path: '/about', label: 'About', icon: <Info size={16} /> },
    { path: '/services', label: 'Services', icon: <BookOpen size={16} /> },
    { path: '/workwithme', label: 'Work With Me', icon: <HelpCircle size={16} /> },
    { path: '/agent-portal', label: 'Agent Portal', icon: <FileText size={16} /> },
  ];

  const headerVariants = {
    initial: { y: -10, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "tween",
        duration: 0.2,
        ease: "easeOut"
      } 
    },
    exit: {
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -5 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const menuVariants = {
    closed: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    open: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
        delayChildren: 0.05
      } 
    }
  };
  
  const menuItemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      <motion.header
        key="header"
        variants={headerVariants}
        initial="initial"
        animate={isHeaderVisible ? "animate" : "exit"}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-brand-blue'
        }`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-20">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeOut"
                }
              }}
            >
              <Link 
                to="/" 
                className="relative group"
                aria-label="PA Real Estate Support Services home"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-brand-gold rounded-lg opacity-0 group-hover:opacity-75 blur transition duration-300" />
                <img 
                  src={Logo} 
                  alt="PA Real Estate Support Services"
                  className="h-12 relative"
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  variants={navItemVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.05 + index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className={`relative font-medium group flex items-center ${
                      location.pathname === item.path 
                        ? scrolled ? 'text-brand-blue' : 'text-white'
                        : scrolled ? 'text-gray-600 hover:text-brand-gold' : 'text-white hover:text-brand-gold'
                    } ${item.path === '/agent-portal' ? 'px-6 py-2 bg-gradient-to-r from-blue-600 to-brand-blue text-white rounded-lg hover:shadow-lg transition-all duration-300' : ''}`}
                  >
                    {item.icon && <span className="mr-1.5">{item.icon}</span>}
                    <span className="relative z-10">{item.label}</span>
                    {item.path !== '/agent-portal' && (
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-brand-blue transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                        location.pathname === item.path ? 'scale-x-100' : ''
                      }`} />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative z-50 p-2 rounded-full transition-colors ${
                  scrolled || isOpen
                    ? 'text-gray-600 hover:text-brand-blue'
                    : 'text-white hover:text-brand-gold'
                }`}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu with modern design */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 z-40 md:hidden bg-white/98 backdrop-blur-lg"
            >
              <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 space-y-6 overflow-y-auto">
                <motion.div
                  variants={menuItemVariants}
                  className="w-full max-w-sm"
                >
                  <img
                    src={Logo}
                    alt="PA Real Estate Support Services"
                    className="h-16 mx-auto mb-8"
                  />
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <motion.div
                        key={item.path}
                        variants={menuItemVariants}
                        className="overflow-hidden"
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center py-3 px-4 text-lg font-medium transition-colors rounded-lg ${
                            location.pathname === item.path
                              ? 'bg-blue-50 text-brand-blue'
                              : 'text-gray-600 hover:text-brand-gold'
                          } ${item.path === '/agent-portal' ? 'bg-gradient-to-r from-brand-gold to-brand-blue text-white hover:shadow-lg' : ''}`}
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full mr-3">
                            {item.icon || <Home size={16} className="text-brand-blue" />}
                          </div>
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </AnimatePresence>
  );
};

export default Header;