import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ExternalLink, ChevronRight, Heart, Clock, Calendar } from 'lucide-react';
import Logo from '/logo-flat.png';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Animated badge that shows a random statistic
const AnimatedStatBadge = () => {
  const stats = [
    { icon: Clock, label: "Average Closing Time", value: "30 days" },
    { icon: Calendar, label: "Transactions Completed", value: "500+" },
    { icon: Heart, label: "Client Satisfaction", value: "99%" }
  ];
  
  // Get a random stat (would be replaced with a proper rotation in production)
  const randomStat = stats[Math.floor(Math.random() * stats.length)];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-blue-50 rounded-full pl-2 pr-4 py-1 text-sm flex items-center shadow-sm mb-4 max-w-max"
    >
      <div className="bg-blue-600 text-white p-1 rounded-full mr-2">
        <randomStat.icon size={14} />
      </div>
      <span className="text-blue-700 font-medium">{randomStat.label}: </span>
      <span className="ml-1 text-blue-900 font-bold">{randomStat.value}</span>
    </motion.div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-white border-t border-gray-100 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>
      
      {/* Newsletter section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100/50">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-5 sm:p-8 rounded-2xl shadow-lg max-w-4xl mx-auto relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-gold/5 rounded-full transform -translate-x-1/4 translate-y-1/4"></div>
            
            <div className="grid md:grid-cols-5 gap-8 items-center relative z-10">
              <div className="md:col-span-3">
                <h3 className="text-2xl md:text-2xl font-bold text-gray-900 mb-2">
                  Stay Updated on Real Estate Trends
                </h3>
                <p className="text-gray-600 mb-4">
                  Join our newsletter for the latest transaction management tips and industry updates.
                </p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Monthly updates</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Unsubscribe anytime</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-grow"
                    required
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-3 transition-colors duration-200 whitespace-nowrap">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12"
        >
          {/* Company Info - Spans 4 columns on desktop */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <Link to="/" className="flex items-center mb-5">
              <img src={Logo} alt="PA Real Estate Support Services" className="h-10 w-auto mr-3" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  PA Real Estate
                </h3>
                <p className="text-sm text-blue-600 -mt-1">Support Services</p>
              </div>
            </Link>
            
            <AnimatedStatBadge />
            
            <p className="text-gray-600 text-sm md:text-base mb-6">
              Your trusted partner in reliable transaction management, serving the Pocono Mountains and beyond with professional coordination services.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-100 hover:bg-blue-100 p-2 rounded-full text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-100 hover:bg-pink-100 p-2 rounded-full text-gray-600 hover:text-pink-600 transition-colors duration-300">
                <Instagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-gray-100 hover:bg-blue-100 p-2 rounded-full text-gray-600 hover:text-blue-700 transition-colors duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links - Spans 2 columns */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-brand-gold rounded-full block mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                  <ChevronRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">About</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                  <ChevronRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Services</span>
                </Link>
              </li>
              <li>
                <Link to="/work-with-me" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                  <ChevronRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Work With Me</span>
                </Link>
              </li>
              <li>
                <Link to="/agent-portal" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                  <ChevronRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Agent Portal</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Services - Spans 2 columns */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-brand-gold rounded-full block mr-2"></span>
              Services
            </h3>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link to="/services#transaction" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                  <ChevronRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Transaction Coordination</span>
                </Link>
              </li>
              <li>
                <Link to="/services#document" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                  <ChevronRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Document Management</span>
                </Link>
              </li>
              <li>
                <Link to="/services#compliance" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                  <ChevronRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Compliance Review</span>
                </Link>
              </li>
              <li>
                <Link to="/services#closing" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                  <ChevronRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Closing Coordination</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Legal Links - Spans 1 column */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-brand-gold rounded-full block mr-2"></span>
              Legal
            </h3>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                  <ChevronRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Privacy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                  <ChevronRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Terms</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info - Spans 3 columns */}
          <motion.div variants={itemVariants} className="md:col-span-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-brand-gold rounded-full block mr-2"></span>
              Contact
            </h3>
            
            {/* Office hours - new addition */}
            <div className="bg-gray-50 p-4 rounded-lg mb-5 border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-brand-gold" />
                Office Hours
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 5:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-medium">10:00 AM - 2:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">Closed</span>
                </li>
              </ul>
            </div>
            
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+5705884637"
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
                >
                  <div className="bg-gray-100 group-hover:bg-blue-100 p-2 rounded-full mr-3 transition-colors duration-300">
                    <Phone className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                  <span>(570) 588-4637</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:debbie@parealestatesupport.com"
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
                >
                  <div className="bg-gray-100 group-hover:bg-blue-100 p-2 rounded-full mr-3 transition-colors duration-300">
                    <Mail className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                  <span>debbie@parealestatesupport.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start text-gray-600">
                  <div className="bg-gray-100 p-2 rounded-full mr-3 mt-1">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div>Pocono Mountains, PA</div>
                    <div className="text-sm text-gray-500 mt-1">Serving all of northeastern Pennsylvania</div>
                  </div>
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-sm text-gray-600 mb-4 md:mb-0 text-center md:text-left">
            &copy; {new Date().getFullYear()} PA Real Estate Support Services. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 hidden sm:block">
              Crafted with care for PA real estate professionals
            </div>
            <div className="flex items-center">
              <Link to="/agent-portal" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full transition-colors duration-300 flex items-center">
                <span>Agent Portal</span>
                <ExternalLink className="ml-1 w-3 h-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
};

export default Footer;
