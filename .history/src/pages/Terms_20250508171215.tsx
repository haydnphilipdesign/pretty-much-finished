import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import { Shield, Users, FileText, Clock, AlertCircle, DollarSign } from 'lucide-react';
import useScrollToTop from '../hooks/useScrollToTop';

const sections = [
  {
    title: "Service Agreement",
    icon: Shield,
    content: "By engaging my services, you agree to these terms and conditions. I provide professional transaction coordination services for real estate professionals.",
    items: []
  },
  {
    title: "Scope of Services",
    icon: FileText,
    content: "My services include:",
    items: [
      "Transaction coordination from contract to closing",
      "Document management and organization",
      "Timeline tracking and deadline management",
      "Communication coordination between parties",
      "Compliance review and verification"
    ]
  },
  {
    title: "Client Responsibilities",
    icon: Users,
    content: "As a client, you agree to:",
    items: [
      "Provide accurate and timely information",
      "Respond promptly to requests and communications",
      "Review and approve documents as needed",
      "Maintain professional conduct with all transaction parties"
    ]
  },
  {
    title: "Service Timeline",
    icon: Clock,
    content: "Service timelines and expectations:",
    items: [
      "Services begin upon receipt of transaction details",
      "Standard response time within 24 hours on business days",
      "Transaction timelines vary based on complexity",
      "Services conclude upon transaction completion or termination"
    ]
  },
  {
    title: "Payment Terms",
    icon: DollarSign,
    content: "Payment policies and procedures:",
    items: [
      "Fees are outlined in your service agreement",
      "Payment is due upon invoice receipt",
      "Accepted payment methods include check and ACH",
      "Late payments may result in service suspension"
    ]
  },
  {
    title: "Limitation of Liability",
    icon: AlertCircle,
    content: "Important liability limitations:",
    items: [
      "Services are provided on an 'as is' basis",
      "I am not responsible for third-party errors or delays",
      "Maximum liability is limited to the amount paid for services",
      "I do not provide legal, tax, or financial advice"
    ]
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const Terms: React.FC = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Terms of Service"
        subtitle="Guidelines for working together"
        backgroundImage="/terms.jpg"
        height="medium"
        overlay="gradient"
        overlayOpacity={0.7}
      />

      <motion.section 
        className="py-24 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.02)_100%)]" />
          <div className="absolute inset-0 bg-grid-gray-500/[0.02] bg-[length:32px_32px]" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">Important Information</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Working Together</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These terms outline our professional relationship and set clear expectations for my transaction coordination services. Please review them carefully.
              </p>
            </motion.div>

            <motion.div 
              className="grid gap-8 md:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div 
                    key={section.title}
                    variants={itemVariants}
                    className="group relative"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold to-brand-blue rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300" />
                    <div className="relative bg-white rounded-xl shadow-lg p-8 h-full transform group-hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 p-3 rounded-lg w-fit shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-brand-blue group-hover:text-brand-gold transition-colors duration-300" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-brand-blue transition-colors duration-300">{section.title}</h3>
                          <p className="text-gray-600 mb-4">{section.content}</p>
                          {section.items.length > 0 && (
                            <ul className="space-y-2">
                              {section.items.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="inline-block h-5 w-5 shrink-0 mt-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-brand-gold">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                  <span className="text-gray-600">{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div 
              className="mt-16 p-8 rounded-xl bg-gradient-to-r from-brand-blue/5 to-brand-gold/5 border border-blue-100 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-gray-700 font-medium">
                By using my services, you acknowledge that you have read and agree to these terms.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Last updated: March 2025
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Terms;
