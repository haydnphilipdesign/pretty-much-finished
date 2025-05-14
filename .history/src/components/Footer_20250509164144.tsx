import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ExternalLink, ChevronRight, Heart, Clock } from 'lucide-react';
import Logo from '/logo-flat.png';
import { useNavigation } from '../providers/SmoothNavigationProvider';

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
    { icon: Calendar, label: "Transactions Completed", value: "2000+" },
    { icon: Heart, label: "Philosophy", value: "Your success is my commitment" }
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
  const { Link } = useNavigation();
  return (
    <footer className="relative bg-gradient-to-b from-blue-50 to-blue-100/50 border-t border-blue-100 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-gold rounded-full opacity-10 transform -translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-300 rounded-full opacity-10 blur-3xl"></div>

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

            {/* Office hours - compact version */}
            <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-1 flex items-center text-sm">
                <Clock className="w-3 h-3 mr-1 text-brand-gold" />
                Office Hours: Mon-Fri 9:00 AM - 5:00 PM
              </h4>
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
