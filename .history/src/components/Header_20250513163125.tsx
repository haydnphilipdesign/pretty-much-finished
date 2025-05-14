import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '../providers/SmoothNavigationProvider';
import { Menu, X, User, Home, FileText, Info, BookOpen, HelpCircle } from 'lucide-react';
import Logo from '/logo-flat.png';
import ScrollToTopLink from './ScrollToTopLink';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const location = useLocation();
  const { Link } = useNavigation();

  // Handle scroll events for header visibility and styling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only track scrolling when not in the transaction form
      if (!document.body.classList.contains('form-active')) {
        // Detect scroll direction to show/hide header
        // More responsive detection with smaller threshold
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          // Scrolling down - hide header
          setIsHeaderVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - show header immediately
          setIsHeaderVisible(true);
        }

        // Update scrolled state for styling
        setScrolled(currentScrollY > 10);

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
    { path: '/work-with-me', label: 'Work With Me', icon: <HelpCircle size={16} /> },
    { path: '/agent-portal', label: 'Agent Portal', icon: <FileText size={16} /> },
  ];

  const headerVariants = {
    initial: { y: -10, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -5 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.4,
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
    <AnimatePresence mode="wait">
      <motion.header
        key="header"
        variants={headerVariants}
        initial={false}
        animate={isHeaderVisible ? "animate" : "exit"}
        className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
          scrolled ? 'bg-transparent shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-20">
            <motion.div
              initial={false}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeOut"
                }
              }}
            >
              <ScrollToTopLink
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
              </ScrollToTopLink>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  variants={navItemVariants}
                  initial={false}
                  animate="animate"
                  transition={{ delay: 0.05 + index * 0.05 }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <ScrollToTopLink
                    to={item.path}
                    className={`relative font-medium group flex items-center px-4 py-2 rounded-full ${
                      location.pathname === item.path
                        ? 'text-[#e9c77b] font-semibold bg-black/60'
                        : 'text-[#e9c77b] hover:text-white bg-black/50 hover:bg-black/60'
                    } ${item.path === '/agent-portal' ? 'px-6 py-2 bg-[#e9c77b] text-brand-blue hover:text-brand-blue font-semibold rounded-lg hover:shadow-lg transition-all duration-300' : ''}`}
                  >
                    {item.icon && <span className="mr-1.5">{item.icon}</span>}
                    <span className="relative z-10">{item.label}</span>
                    {item.path !== '/agent-portal' && (
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#e9c77b] to-[#e9c77b]/80 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                        location.pathname === item.path ? 'scale-x-100' : ''
                      }`} />
                    )}
                  </ScrollToTopLink>
                </motion.div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.div
              className="md:hidden flex items-center"
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full bg-black/50 text-[#e9c77b] hover:bg-black/60 hover:text-white transition-colors duration-200"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </motion.div>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="absolute top-20 left-0 right-0 z-30 md:hidden"
            >
              <motion.div
                className="bg-black/90 backdrop-blur-md rounded-xl mx-4 overflow-hidden shadow-xl"
              >
                <nav className="flex flex-col p-4 space-y-2">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.path}
                      variants={menuItemVariants}
                      className="overflow-hidden"
                    >
                      <ScrollToTopLink
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-lg ${
                          location.pathname === item.path
                            ? 'bg-[#e9c77b]/20 text-[#e9c77b] font-semibold'
                            : 'text-[#e9c77b] hover:bg-[#e9c77b]/10 hover:text-white'
                        } ${item.path === '/agent-portal' ? 'mt-4 bg-[#e9c77b] text-brand-blue hover:bg-[#e9c77b]/90 hover:text-brand-blue' : ''}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        <span>{item.label}</span>
                      </ScrollToTopLink>
                    </motion.div>
                  ))}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </AnimatePresence>
  );
};

export default Header;