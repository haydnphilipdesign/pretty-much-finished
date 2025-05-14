import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import AnimatedSection from "../components/AnimatedSection";
import { RevealSection, HoverScale } from "../components/GlobalAnimations";
import { FileSearch, Database, Clock, CheckSquare, Shield, Users, Phone, Mail, FileText, Briefcase, CheckCircle, ArrowRight } from "lucide-react";
import useScrollToTop from "../hooks/useScrollToTop";

const services = [
  {
    icon: FileSearch,
    title: "Transaction Coordination",
    description: "Comprehensive management of your real estate transactions from contract to closing. I handle all the paperwork, deadlines, and coordination so you can focus on growing your business.",
    features: [
      "Contract to closing management",
      "Document collection and organization",
      "Deadline tracking and reminders",
      "Communication with all parties"
    ]
  },
  {
    icon: Database,
    title: "Document Management",
    description: "Secure digital handling of all your transaction documents. I ensure everything is properly organized, stored, and easily accessible when you need it.",
    features: [
      "Digital file organization",
      "Secure document storage",
      "Easy access and retrieval",
      "Compliance documentation"
    ]
  },
  {
    icon: Clock,
    title: "Timeline Management",
    description: "Strategic oversight of all critical dates and deadlines. I keep your transactions on track with proactive monitoring and timely updates.",
    features: [
      "Critical date tracking",
      "Proactive deadline management",
      "Progress monitoring",
      "Schedule coordination"
    ]
  },
  {
    icon: CheckSquare,
    title: "Compliance Review",
    description: "Thorough review of all transaction documents to ensure compliance with regulations and requirements. I help minimize risk and maintain professional standards.",
    features: [
      "Document compliance check",
      "Regulatory requirement review",
      "Error prevention",
      "Quality assurance"
    ]
  },
  {
    icon: Users,
    title: "Stakeholder Coordination",
    description: "Effective communication and coordination with all transaction parties. I ensure smooth collaboration between agents, title companies, lenders, and clients.",
    features: [
      "Multi-party coordination",
      "Clear communication channels",
      "Progress updates",
      "Issue resolution"
    ]
  },
  {
    icon: Phone,
    title: "Support Services",
    description: "Dedicated support throughout the transaction process. I'm here to answer questions, resolve issues, and provide updates whenever needed.",
    features: [
      "Responsive communication",
      "Issue troubleshooting",
      "Status updates",
      "Process guidance"
    ]
  }
];

const processSteps = [
  { 
    icon: FileSearch, 
    title: "Comprehensive\nReview", 
    desc: "Expert analysis of contracts and documentation to ensure accuracy and completeness" 
  },
  { 
    icon: Database, 
    title: "Strategic\nSetup", 
    desc: "Creation of customized transaction timeline and systematic file organization" 
  },
  { 
    icon: Clock, 
    title: "Proactive\nManagement", 
    desc: "Vigilant oversight of deadlines, tasks, and communications to prevent delays" 
  },
  { 
    icon: CheckSquare, 
    title: "Successful\nCompletion", 
    desc: "Thorough closing process management and secure documentation archival" 
  }
];

const detailedServices = [
  {
    title: "Contract to Close Management",
    description: "Comprehensive oversight of the entire transaction process",
    features: [
      "Contract review and compliance verification",
      "Timeline creation and milestone tracking",
      "Coordination with all parties involved",
      "Document collection and organization",
      "Closing preparation and follow-up"
    ]
  },
  {
    title: "Document Management System",
    description: "State-of-the-art digital document handling and storage",
    features: [
      "Secure cloud-based storage",
      "Easy access and retrieval",
      "Digital signature integration",
      "Automated filing system",
      "Document version control"
    ]
  },
  {
    title: "Communication Management",
    description: "Streamlined communication between all transaction parties",
    features: [
      "Regular status updates",
      "Deadline reminders",
      "Issue resolution coordination",
      "Multi-party communication management",
      "Clear documentation of all communications"
    ]
  }
];

const Services: React.FC = () => {
  useScrollToTop();
  return (
    <div className="min-h-screen">
      <PageHero
        title={
          <>
            Real Estate
            <br />
            Support Services
          </>
        }
        subtitle="Comprehensive real estate transaction support to help your business thrive"
        backgroundImage="/writing.jpg"
        height="large"
        overlay="gradient"
        overlayOpacity={0.7}
      />

      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold to-brand-blue rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-full flex items-center justify-center mr-4">
                      <service.icon className="w-6 h-6 text-brand-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6 flex-grow">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600">
                        <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mr-3" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-blue relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.03)_100%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              My Process
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              A systematic approach to ensure smooth and successful transactions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold to-brand-blue rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-full flex items-center justify-center mb-6">
                      <step.icon className="w-8 h-8 text-brand-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 whitespace-pre-line">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-24 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.02)_100%)]" />
          <div className="absolute inset-0 bg-grid-gray-500/[0.02] bg-[length:32px_32px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Comprehensive Support
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Detailed breakdown of my professional services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {detailedServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold to-brand-blue rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600">
                        <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mr-3" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold via-brand-blue to-brand-blue">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.03)_100%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Streamline Your Transactions?
              </h2>
              <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                Let's work together to make your real estate transactions smoother and more efficient. Book a consultation today to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/workwithme"
                  className="inline-flex items-center justify-center gap-2 bg-white text-brand-blue px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <span>Schedule a Consultation</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to="/workwithme#contact"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 group"
                >
                  <span>Contact Me</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
