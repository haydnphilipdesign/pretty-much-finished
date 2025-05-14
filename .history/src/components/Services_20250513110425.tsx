import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  Phone,
  Users,
  CheckSquare,
  Shield,
  Clock,
  FileSearch,
  MessageCircle,
  Database
} from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 'service-1',
    icon: FileText,
    title: 'Document Management',
    description: 'Comprehensive handling of all transaction paperwork including contract review, addendums, disclosures, and closing documents. We ensure all documentation is complete, accurate, and submitted on time.',
    features: [
      'Contract review and organization',
      'Digital document management',
      'Deadline tracking',
      'Electronic signature coordination'
    ]
  },
  {
    id: 'service-2',
    icon: Calendar,
    title: 'Timeline Management',
    description: 'Proactive management of your transaction timeline from contract to closing. We track all deadlines, coordinate inspections, and ensure smooth progress through each phase.',
    features: [
      'Inspection scheduling',
      'Deadline monitoring',
      'Milestone tracking',
      'Closing coordination'
    ]
  },
  {
    id: 'service-3',
    icon: Phone,
    title: 'Communication Coordination',
    description: 'Seamless coordination between all parties including agents, buyers, sellers, title companies, lenders, and other vendors. We keep everyone informed and aligned throughout the process.',
    features: [
      'Regular status updates',
      'Vendor coordination',
      'Issue resolution',
      'Clear communication channels'
    ]
  },
  {
    id: 'service-4',
    icon: Users,
    title: 'Client Support',
    description: 'Dedicated assistance for agents and their clients throughout the entire transaction process. We handle inquiries, provide updates, and ensure a smooth experience for all parties.',
    features: [
      'Agent support',
      'Client assistance',
      'Query resolution',
      'Process guidance'
    ]
  },
  {
    id: 'service-5',
    icon: CheckSquare,
    title: 'Compliance Management',
    description: 'Ensure all transactions comply with state regulations and brokerage requirements. We maintain detailed checklists and verify all necessary documentation is properly executed.',
    features: [
      'Regulatory compliance',
      'Documentation verification',
      'Checklist management',
      'Audit preparation'
    ]
  },
  {
    id: 'service-6',
    icon: Shield,
    title: 'Risk Mitigation',
    description: 'Proactive identification and resolution of potential issues before they become problems. We help protect your interests throughout the transaction process.',
    features: [
      'Issue identification',
      'Problem resolution',
      'Risk assessment',
      'Preventive measures'
    ]
  }
];

const process = [
  {
    id: 'process-1',
    icon: FileSearch,
    title: 'Initial Review',
    description: 'We begin by thoroughly reviewing the contract and gathering all necessary documentation.'
  },
  {
    id: 'process-2',
    icon: Database,
    title: 'Setup & Organization',
    description: 'Creating a digital transaction file and establishing timelines and checklists.'
  },
  {
    id: 'process-3',
    icon: MessageCircle,
    title: 'Coordination',
    description: 'Managing communications and coordinating with all parties throughout the process.'
  },
  {
    id: 'process-4',
    icon: Clock,
    title: 'Closing',
    description: 'Ensuring all requirements are met and coordinating a smooth closing process.'
  }
];

const Services: React.FC = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Transaction Coordination Services</h1>
            <p className="text-xl opacity-90">
              Professional transaction coordination services designed to streamline your real estate deals from contract to closing.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <motion.div
                key={service.id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <service.icon className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={`${service.id}-feature-${index}`} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Process</h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step) => (
                <motion.div
                  key={step.id}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Streamline Your Transactions?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let us handle the details while you focus on growing your business.
          </p>
          <Link
            to="/work-with-me"
            className="inline-flex items-center px-8 py-4 bg-brand-gold text-brand-blue rounded-xl font-semibold hover:bg-brand-gold/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
