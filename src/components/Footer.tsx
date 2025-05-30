import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowRight, Clock } from 'lucide-react';
import Logo from '/logo-flat.png';
import { useNavigation } from '../providers/SmoothNavigationProvider';

const Footer: React.FC = () => {
  const { Link } = useNavigation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-6 pt-16 pb-8">
        {/* Top section with logo and quick intro */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 border-b border-gray-800 pb-12">
          <div className="mb-8 md:mb-0 md:max-w-sm">
            <Link to="/" className="inline-block mb-6">
              <img src={Logo} alt="PA Real Estate Support Services" className="h-14 w-auto" />
            </Link>
            <p className="text-gray-400 mb-6">
              Your trusted partner in reliable transaction management, serving the Pocono Mountains and beyond.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {/* Quick Links */}
            <div>
              <h3 className="text-amber-500 font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                    <span className="w-1 h-1 bg-amber-500 rounded-full mr-2"></span>
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                    <span className="w-1 h-1 bg-amber-500 rounded-full mr-2"></span>
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/work-with-me" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                    <span className="w-1 h-1 bg-amber-500 rounded-full mr-2"></span>
                    Work With Me
                  </Link>
                </li>
                <li>
                  <Link to="/agent-portal" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                    <span className="w-1 h-1 bg-amber-500 rounded-full mr-2"></span>
                    Agent Portal
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="text-amber-500 font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/services#transaction" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                    <span className="w-1 h-1 bg-amber-500 rounded-full mr-2"></span>
                    Transaction Coordination
                  </Link>
                </li>
                <li>
                  <Link to="/services#document" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                    <span className="w-1 h-1 bg-amber-500 rounded-full mr-2"></span>
                    Document Management
                  </Link>
                </li>
                <li>
                  <Link to="/services#compliance" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                    <span className="w-1 h-1 bg-amber-500 rounded-full mr-2"></span>
                    Compliance Review
                  </Link>
                </li>
                <li>
                  <Link to="/services#closing" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                    <span className="w-1 h-1 bg-amber-500 rounded-full mr-2"></span>
                    Closing Coordination
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-amber-500 font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Phone className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <a href="tel:+5705884637" className="text-gray-400 hover:text-white transition-colors">
                    (570) 588-4637
                  </a>
                </li>
                <li className="flex items-start">
                  <Mail className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <a href="mailto:debbie@parealestatesupport.com" className="text-gray-400 hover:text-white transition-colors break-all">
                    debbie@parealestatesupport.com
                  </a>
                </li>
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-400">
                    Pocono Mountains, PA
                  </span>
                </li>
                <li className="flex items-start">
                  <Clock className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-400">
                    Mon-Fri 9:00 AM - 5:00 PM
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom section with Agent Portal button and copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-6 md:mb-0">
            &copy; {currentYear} PA Real Estate Support Services. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-2">
            <Link
              to="/agent-portal"
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-6 py-2.5 rounded-lg inline-flex items-center transition-colors duration-200"
            >
              Agent Portal
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Very bottom attribution */}
      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600 text-xs">
            Crafted with care for PA real estate professionals
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;