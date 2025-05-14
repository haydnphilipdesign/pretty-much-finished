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
      "Accepted payment methods include credit card and ACH",
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

const Terms: React.FC = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <PageHero
        title="Terms of Service"
        subtitle="Guidelines for working together"
        backgroundImage="/terms.jpg"
        height="medium"
        overlay="gradient"
        overlayOpacity={0.7}
      />

      <motion.section 
        className="py-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Working Together</h2>
              <p className="text-xl text-gray-600">
                These terms outline our professional relationship and set clear expectations for my transaction coordination services. Please review them carefully.
              </p>
            </motion.div>

            <div className="space-y-16">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div 
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-6">
                      <div className="bg-brand-blue/10 p-4 rounded-xl">
                        <Icon className="w-8 h-8 text-brand-blue" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h3>
                        <p className="text-gray-700 mb-4">{section.content}</p>
                        {section.items.length > 0 && (
                          <ul className="space-y-2">
                            {section.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-2">
                                <span className="text-brand-blue">•</span>
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-500 text-sm">
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
