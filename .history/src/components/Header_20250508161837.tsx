import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Home, Sun, Moon, Settings, Bell } from 'lucide-react';
import Logo from '/logo-flat.png';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
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

  // Handle dark mode toggle
  useEffect(() => {
    // Check user's preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-mode');
    }
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
  };

  // Handle clicks outside of dropdown menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Keyboard navigation for menus
  const handleKeyDown = (e: React.KeyboardEvent, menuType: 'notifications' | 'userMenu') => {
    if (e.key === 'Escape') {
      if (menuType === 'notifications') setShowNotifications(false);
      if (menuType === 'userMenu') setShowUserMenu(false);
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={16} /> },
    { path: '/about', label: 'About', icon: null },
    { path: '/services', label: 'Services', icon: null },
    { path: '/agent-portal', label: 'Agent Portal', icon: <User size={16} /> },
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
  
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.header
        key="header"
        variants={headerVariants}
        initial="initial"
        animate={isHeaderVisible ? "animate" : "exit"}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg dark:bg-gray-900/95' : 'bg-brand-blue dark:bg-gray-800'
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
                  className="h-12 relative dark:brightness-110"
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
                        ? scrolled ? 'text-brand-blue dark:text-brand-gold' : 'text-white'
                        : scrolled ? 'text-gray-600 hover:text-brand-blue dark:text-gray-300 dark:hover:text-brand-gold' : 'text-white hover:text-brand-gold'
                    }`}
                  >
                    {item.icon && <span className="mr-1.5">{item.icon}</span>}
                    <span className="relative z-10">{item.label}</span>
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-blue to-brand-gold transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                      location.pathname === item.path ? 'scale-x-100' : ''
                    }`} />
                  </Link>
                </motion.div>
              ))}
              
              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: {
                    duration: 0.2,
                    ease: "easeOut",
                    delay: 0.25
                  }
                }}
              >
                <Link
                  to="/work-with-me"
                  className={`relative inline-flex items-center px-6 py-2 overflow-hidden font-medium transition-all rounded-lg group ${
                    scrolled 
                      ? 'bg-brand-blue text-white hover:bg-gradient-to-r hover:from-brand-blue hover:to-brand-gold dark:bg-brand-gold dark:hover:from-brand-gold dark:hover:to-brand-blue'
                      : 'bg-white text-brand-blue hover:bg-brand-gold hover:text-white dark:bg-gray-200 dark:text-gray-800'
                  }`}
                >
                  <span className="relative">Work With Me</span>
                </Link>
              </motion.div>
              
              {/* Notification Bell */}
              <div ref={notificationsRef} className="relative">
                <button
                  aria-label="Notifications"
                  aria-expanded={showNotifications}
                  aria-controls="notifications-dropdown"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-full transition-colors ${
                    scrolled 
                      ? 'text-gray-600 hover:text-brand-blue hover:bg-blue-50 dark:text-gray-300 dark:hover:text-brand-gold dark:hover:bg-gray-800' 
                      : 'text-white hover:text-brand-gold hover:bg-white/10'
                  }`}
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full"></span>
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      id="notifications-dropdown"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
                      role="menu"
                      onKeyDown={(e) => handleKeyDown(e, 'notifications')}
                    >
                      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300">New transaction submission from John Doe</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</span>
                        </div>
                        <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Document updated: Smith Property Purchase</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Yesterday</span>
                        </div>
                        <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Closing date reminder: 123 Main St</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">3 days ago</span>
                        </div>
                      </div>
                      <div className="p-3 text-center border-t border-gray-100 dark:border-gray-700">
                        <a href="#" className="text-sm text-brand-blue dark:text-brand-gold hover:underline">View all notifications</a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* User Menu */}
              <div ref={userMenuRef} className="relative">
                <button
                  aria-label="User menu"
                  aria-expanded={showUserMenu}
                  aria-controls="user-dropdown"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-1 p-1 rounded transition-colors ${
                    scrolled 
                      ? 'text-gray-600 hover:text-brand-blue dark:text-gray-300 dark:hover:text-brand-gold' 
                      : 'text-white hover:text-brand-gold'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    <User size={16} className="text-gray-600 dark:text-gray-300" />
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      id="user-dropdown"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
                      role="menu"
                      onKeyDown={(e) => handleKeyDown(e, 'userMenu')}
                    >
                      <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white">Debbie Smith</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">debbie@parealestatesupport.com</p>
                      </div>
                      <div>
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <User size={16} className="mr-2" />
                          Profile
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <Settings size={16} className="mr-2" />
                          Settings
                        </a>
                        <button 
                          onClick={toggleDarkMode}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          {isDarkMode ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                        <div className="border-t border-gray-100 dark:border-gray-700 mt-1">
                          <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                            Sign out
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              {/* Mobile notification bell */}
              <button
                aria-label="Notifications"
                className={`relative p-2 rounded-full transition-colors ${
                  scrolled 
                    ? 'text-gray-600 hover:text-brand-blue dark:text-gray-300 dark:hover:text-brand-gold' 
                    : 'text-white hover:text-brand-gold'
                }`}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full"></span>
              </button>
              
              {/* Mobile theme toggle */}
              <button
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                className={`p-2 rounded-full transition-colors ${
                  scrolled 
                    ? 'text-gray-600 hover:text-brand-blue dark:text-gray-300 dark:hover:text-brand-gold' 
                    : 'text-white hover:text-brand-gold'
                }`}
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative z-50 p-2 rounded-full transition-colors ${
                  scrolled || isOpen 
                    ? 'text-gray-600 hover:text-brand-blue dark:text-gray-300 dark:hover:text-brand-gold' 
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
              className="fixed inset-0 z-40 md:hidden bg-white/98 dark:bg-gray-900/98 backdrop-blur-lg"
            >
              <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 space-y-6 overflow-y-auto">
                <motion.div 
                  variants={menuItemVariants}
                  className="w-full max-w-sm"
                >
                  <img 
                    src={Logo} 
                    alt="PA Real Estate Support Services" 
                    className="h-16 mx-auto mb-8 dark:brightness-110"
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
                              ? 'bg-blue-50 text-brand-blue dark:bg-gray-800 dark:text-brand-gold' 
                              : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-gray-700 rounded-full mr-3">
                            {item.icon || <Home size={16} className="text-brand-blue dark:text-brand-gold" />}
                          </div>
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                    <motion.div
                      variants={menuItemVariants}
                      className="pt-4"
                    >
                      <Link
                        to="/work-with-me"
                        className="flex items-center justify-center w-full px-8 py-4 bg-brand-blue text-white dark:bg-brand-gold dark:text-gray-900 rounded-lg hover:bg-blue-600 dark:hover:bg-amber-500 transition-colors"
                      >
                        Work With Me
                      </Link>
                    </motion.div>
                  </div>
                  
                  {/* Mobile menu additional options */}
                  <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                    <div className="flex items-center justify-center space-x-2">
                      <a href="#" className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-gold rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </a>
                      <a href="#" className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-gold rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </a>
                      <a href="#" className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-gold rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </a>
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      <p>© {new Date().getFullYear()} PA Real Estate Support Services</p>
                      <p className="mt-1">All rights reserved</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile Notifications Panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-x-0 top-20 mx-3 md:hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg z-40"
            >
              <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300">New transaction submission from John Doe</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</span>
                </div>
                <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300">Document updated: Smith Property Purchase</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Yesterday</span>
                </div>
                <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300">Closing date reminder: 123 Main St</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">3 days ago</span>
                </div>
              </div>
              <div className="p-3 text-center border-t border-gray-100 dark:border-gray-700">
                <a href="#" className="text-sm text-brand-blue dark:text-brand-gold hover:underline">View all notifications</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </AnimatePresence>
  );
};

export default Header;