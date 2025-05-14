import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import { Shield, Database, Lock, FileText, Users, Bell, HelpCircle } from 'lucide-react';
import useScrollToTop from '../hooks/useScrollToTop';

const sections = [
  {
    title: "Information Collection and Use",
    icon: Database,
    content: "I collect information that you voluntarily provide when using my services, including:",
    items: [
      "Contact information (name, email, phone number)",
      "Transaction-related information",
      "Communication records and correspondence",
      "Business and professional details"
    ]
  },
  {
    title: "Use of Information",
    icon: FileText,
    content: "The information collected is used to:",
    items: [
      "Provide and improve transaction coordination services",
      "Communicate about your transactions and services",
      "Maintain accurate records",
      "Comply with legal obligations"
    ]
  },
  {
    title: "Data Security",
    icon: Lock,
    content: "I take the security of your information seriously and implement appropriate measures to protect it:",
    items: [
      "Secure storage and processing systems",
      "Limited access to personal information",
      "Regular security assessments",
      "Industry-standard encryption where applicable"
    ]
  },
  {
    title: "Information Sharing",
    icon: Users,
    content: "I may share your information with:",
    items: [
      "Third parties necessary for transaction completion (with your consent)",
      "Service providers who assist in business operations",
      "Legal authorities when required by law",
      "Professional advisors as needed"
    ]
  },
  {
    title: "Your Rights",
    icon: Shield,
    content: "You have certain rights regarding your personal information:",
    items: [
      "Access to your personal information",
      "Correction of inaccurate information",
      "Deletion of your information (subject to legal requirements)",
      "Objection to certain processing activities"
    ]
  },
  {
    title: "Updates to Privacy Policy",
    icon: Bell,
    content: "This Privacy Policy may be updated periodically:",
    items: [
      "Changes will be posted on this page",
      "Material changes will be communicated directly when possible",
      "Continued use of services constitutes acceptance of updated policy"
    ]
  },
  {
    title: "Contact Information",
    icon: HelpCircle,
    content: "If you have questions about this Privacy Policy, please contact me at:",
    items: [
      "Email: debbie@parealestatesupport.com",
      "Phone: (570) 588-4637"
    ]
  }
];

const Privacy: React.FC = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <PageHero
        title="Privacy Policy"
        subtitle="How I protect and manage your information"
        backgroundImage="/privacy.jpg"
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Privacy Matters</h2>
              <p className="text-xl text-gray-600">
                This Privacy Policy outlines how I collect, use, and protect your personal information when you use my transaction coordination services. I am committed to ensuring the privacy and security of your data.
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
                Last updated: March 2025
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Privacy;
