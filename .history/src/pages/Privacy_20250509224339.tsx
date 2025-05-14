import React from 'react';
import { motion } from 'framer-motion';
import GlobalPageHero from '../components/GlobalPageHeroNew';
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

// Animation variants - modified to not use y-axis translation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const Privacy: React.FC = () => {
  useScrollToTop();

  return (
    <div className="relative min-h-screen bg-white">
      <GlobalPageHero minHeight="min-h-screen">
        <div className="container px-4 md:px-6 lg:px-8 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <motion.div
                className="max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1
                  className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight text-white text-center lg:text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="block">Privacy</span>
                  <span className="text-blue-300">Policy</span>
                </motion.h1>

                <motion.p
                  className="text-xl text-blue-100 mb-6 md:mb-8 max-w-lg text-center lg:text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  How we handle and protect your information
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-full py-1.5 px-3 flex items-center text-sm text-white border border-white/10">
                    <span className="mr-2">Last updated: June 1, 2023</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </GlobalPageHero>

      {/* Content section with solid background */}
      <div className="bg-white relative z-10">
        <motion.section
          className="py-24 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Background elements */}
          <div className="absolute inset-0 bg-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.02)_100%)]" />
            <div className="absolute inset-0 bg-grid-gray-500/[0.02] bg-[length:32px_32px]" />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-5xl mx-auto">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">Data Protection</span>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Privacy Matters</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  This Privacy Policy outlines how I collect, use, and protect your personal information when you use my transaction coordination services. I am committed to ensuring the privacy and security of your data.
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
                      style={{
                        gridColumn: index === sections.length - 1 && sections.length % 2 !== 0 ? 'span 2' : 'auto'
                      }}
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
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-gray-700 font-medium">
                  I am committed to protecting your privacy and maintaining the confidentiality of your personal information.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Last updated: March 2025
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Privacy;
