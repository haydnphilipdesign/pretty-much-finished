import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Briefcase, FileText, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '/logo-flat.png';
import { useNavigation } from '../providers/SmoothNavigationProvider';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: User },
  { path: '/services', label: 'Services', icon: Briefcase },
  { path: '/workwithme', label: 'Work With Me', icon: HelpCircle },
  { path: '/agent-portal', label: 'Agent Portal', icon: FileText }
];

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Determine if we're on the Agent Portal page to change nav style
  const isAgentPortal = location.pathname.includes('agent-portal');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isAgentPortal
          ? 'bg-white/95 backdrop-blur-lg shadow-md'
          : 'bg-gradient-to-r from-gray-900/70 to-blue-900/70 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Top bar with contact info - only visible on desktop and when scrolled */}
        {(isScrolled || isAgentPortal) && (
          <div className="hidden md:flex justify-end items-center py-1 text-xs text-gray-600 border-b border-gray-100">
            <a href="tel:+5705884637" className="flex items-center mr-4 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (570) 588-4637
            </a>
            <a href="mailto:debbie@parealestatesupport.com" className="flex items-center hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              debbie@parealestatesupport.com
            </a>
          </div>
        )}

        <nav className="py-3">
          <div className="flex items-center justify-between">
            {/* Logo with subtle animation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="relative z-10 group flex items-center">
                <div className="overflow-hidden rounded-full mr-2">
                  <motion.img
                    src={Logo}
                    alt="PA Real Estate Support Services"
                    className="h-12 md:h-14 w-auto transition-transform duration-500 group-hover:scale-110"
                    whileHover={{ rotate: 5 }}
                  />
                </div>
                <div className={`flex flex-col ${isScrolled || isAgentPortal ? 'text-gray-800' : 'text-white'}`}>
                  <span className="font-bold text-sm md:text-base leading-tight">PA Real Estate</span>
                  <span className="text-xs md:text-sm opacity-90 leading-tight">Support Services</span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation with pill effect */}
            <div className="hidden md:flex items-center">
              <div className={`flex space-x-1 p-1 rounded-full ${isScrolled || isAgentPortal ? 'bg-gray-100' : 'bg-white/10'}`}>
                {navLinks.map((link, index) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                      location.pathname === link.path
                        ? isScrolled || isAgentPortal
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white/20 text-white'
                        : isScrolled || isAgentPortal
                            ? 'text-gray-700 hover:bg-gray-200'
                            : 'text-white/90 hover:bg-white/20'
                    }`}
                  >
                    <link.icon className="w-4 h-4 mr-1 flex-shrink-0" />
                    {link.label}

                    {/* Pill indicator for active link */}
                    {location.pathname === link.path && (
                      <motion.span
                        layoutId="navIndicator"
                        className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                to="/agent-portal"
                className={`ml-4 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isScrolled || isAgentPortal
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                Start Transaction
              </Link>
            </div>

            {/* Mobile Menu Button with animation */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-10 p-2 rounded-full focus:outline-none"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative w-6 h-6">
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className={`w-6 h-6 ${isScrolled || isAgentPortal ? 'text-gray-800' : 'text-white'}`} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className={`w-6 h-6 ${isScrolled || isAgentPortal ? 'text-gray-800' : 'text-white'}`} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          </div>

          {/* Mobile Navigation with improved UI */}
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl overflow-hidden z-50 rounded-b-2xl border-t border-gray-100"
              >
                <div className="px-5 py-6 space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.07, duration: 0.2 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center py-3 px-4 rounded-xl transition-colors duration-300 ${
                          location.pathname === link.path
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <link.icon className={`w-5 h-5 mr-3 ${
                          location.pathname === link.path
                            ? 'text-blue-500'
                            : 'text-gray-500'
                        }`} />
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Mobile CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navLinks.length * 0.07 + 0.1, duration: 0.3 }}
                    className="pt-3 mt-4 border-t border-gray-100"
                  >
                    <Link
                      to="/agent-portal"
                      className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-xl shadow-md"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Start New Transaction
                    </Link>
                  </motion.div>

                  {/* Contact information for mobile */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navLinks.length * 0.07 + 0.2, duration: 0.3 }}
                    className="pt-3 mt-2 flex flex-col space-y-2 text-sm text-gray-600"
                  >
                    <a href="tel:+5705884637" className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      (570) 588-4637
                    </a>
                    <a href="mailto:debbie@parealestatesupport.com" className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      debbie@parealestatesupport.com
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;