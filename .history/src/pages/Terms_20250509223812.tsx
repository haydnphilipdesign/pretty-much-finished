import React from 'react';
import { motion } from 'framer-motion';
import GlobalPageHero from '../components/GlobalPageHeroNew';
import { Shield, Users, FileText, Clock, AlertCircle, DollarSign, Mail, Phone } from 'lucide-react';
import useScrollToTop from '../hooks/useScrollToTop';
import DelayTester from '../components/DelayTester';

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
    <div className="min-h-screen bg-transparent">
      {/* Using GlobalPageHero component with consistent height */}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="block">Terms of</span>
                  <span className="text-blue-300">Service</span>
                </motion.h1>

                <motion.p
                  className="text-xl text-blue-100 mb-6 md:mb-8 max-w-lg text-center lg:text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Guidelines for using our services and the commitments we make to you
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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

      {/* Main Content */}
      <section className="py-16 px-4 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">1. Introduction</h2>
            <p className="text-gray-700 mb-8">
              Welcome to PA Real Estate Support Services. By using our services, you agree to comply with and be bound by the following terms and conditions. Please review them carefully.
            </p>

            <div className="bg-blue-50 rounded-xl p-8 mb-12 border border-blue-100">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-5">
                  <AlertCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-blue-800">Important Note</h3>
                  <p className="text-blue-700">
                    These terms create a legally binding agreement between you and PA Real Estate Support Services. If you do not agree to these terms, please do not use our services.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">2. Services Description</h2>
            <p className="text-gray-700 mb-4">
              PA Real Estate Support Services provides transaction coordination services for real estate professionals, including but not limited to:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Document Management</h3>
                    <p className="text-gray-600 text-sm">Organization and handling of transaction documents</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Timeline Management</h3>
                    <p className="text-gray-600 text-sm">Tracking deadlines and key transaction milestones</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Communication Coordination</h3>
                    <p className="text-gray-600 text-sm">Facilitating communication between transaction parties</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Compliance Review</h3>
                    <p className="text-gray-600 text-sm">Ensuring transaction documentation meets requirements</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">3. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              As a user of our services, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-8 text-gray-700 space-y-2">
              <li>Provide accurate and complete information for all transactions</li>
              <li>Respond promptly to requests for additional information or clarification</li>
              <li>Review all documentation thoroughly before signing</li>
              <li>Maintain professional communication with all transaction parties</li>
              <li>Adhere to all applicable real estate laws and regulations</li>
              <li>Pay agreed-upon service fees in a timely manner</li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">4. Payment Terms</h2>
            <div className="bg-white rounded-xl p-8 mb-12 border border-gray-100 shadow-sm">
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-5">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Fee Structure</h3>
                  <p className="text-gray-700 mb-4">
                    Our fees are based on the type of transaction and services required. Payment is typically due at closing unless other arrangements have been made.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-sm">
                      Late payments may incur additional charges. Please refer to your service agreement for specific payment terms and conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">5. Confidentiality</h2>
            <p className="text-gray-700 mb-8">
              We take confidentiality seriously. All transaction information will be handled with the utmost care and in accordance with our Privacy Policy. We will not disclose your information to third parties unless required by law or necessary to provide our services.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">6. Limitation of Liability</h2>
            <p className="text-gray-700 mb-8">
              While we strive to provide accurate and reliable services, PA Real Estate Support Services is not liable for any damages arising from the use of our services, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">7. Changes to Terms</h2>
            <p className="text-gray-700 mb-8">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after changes indicates your acceptance of the updated terms.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">8. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-12">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">Debbie O'Brien</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">Email: debbie@parealestatesupport.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">Phone: (570) 588-4637</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;