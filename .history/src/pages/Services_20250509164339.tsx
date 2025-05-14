import React from "react";
import { motion } from "framer-motion";
import { useNavigation } from "../providers/SmoothNavigationProvider";
import PageHeroWrapper from "../components/PageHeroWrapper";
import { FileSearch, Database, Clock, CheckSquare, Shield, Users, FileText, Briefcase, CheckCircle, ArrowRight } from "lucide-react";
import useScrollToTop from "../hooks/useScrollToTop";
import ContentSection from "../components/ContentSection";
import ContentCard from "../components/ContentCard";
import HeroButton from "../components/HeroButton";
import HeroBadge from "../components/HeroBadge";

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

// Services data
const services = [
  {
    icon: FileSearch,
    title: "Transaction Coordination",
    description: "Comprehensive management of real estate transactions from contract to closing, handling paperwork, deadlines, and coordination.",
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
    description: "Secure digital handling of all transaction documents, ensuring everything is properly organized, stored, and accessible.",
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
    description: "Strategic oversight of critical dates and deadlines, keeping transactions on track with proactive monitoring.",
    features: [
      "Critical date tracking",
      "Proactive deadline management",
      "Progress monitoring",
      "Schedule coordination"
    ]
  },
  {
    icon: CheckSquare,
    title: "Compliance Oversight",
    description: "Ensuring transactions adhere to all regulatory requirements and keeping track of changing regulations.",
    features: [
      "Regulatory compliance checks",
      "Documentation verification",
      "Error prevention",
      "Industry standard adherence"
    ]
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Proactive identification and mitigation of potential issues before they become problems.",
    features: [
      "Issue identification",
      "Problem resolution",
      "Risk assessment",
      "Contingency planning"
    ]
  },
  {
    icon: Users,
    title: "Client Communication",
    description: "Professional and timely updates to all parties involved in transactions, ensuring transparency.",
    features: [
      "Regular status updates",
      "Clear communication",
      "Question handling",
      "Transaction transparency"
    ]
  }
];

// Process steps data
const processSteps = [
  {
    icon: FileText,
    title: "Initial Consultation",
    desc: "We'll discuss your specific needs and how I can best support your real estate business."
  },
  {
    icon: Briefcase,
    title: "Service Selection",
    desc: "Choose the specific services that align with your business goals and transaction needs."
  },
  {
    icon: CheckCircle,
    title: "Implementation Planning",
    desc: "We'll develop a customized plan to integrate my services with your existing workflow."
  },
  {
    icon: ArrowRight,
    title: "Ongoing Support",
    desc: "I provide continuous support and adjust services as your business evolves and grows."
  }
];

// Detailed services data
const detailedServices = [
  {
    title: "Transaction Coordination",
    description: "Comprehensive management from contract to closing",
    features: [
      "Initial contract review and organization",
      "Transaction timeline creation and management",
      "Document collection and distribution",
      "Deadline tracking and reminder systems",
      "Coordination with all parties (agents, lenders, title, etc.)",
      "Regular status updates to all stakeholders",
      "Closing preparation and attendance if needed",
      "Post-closing follow-up and documentation"
    ]
  },
  {
    title: "Document Management",
    description: "Secure and efficient handling of all paperwork",
    features: [
      "Digital document organization and storage",
      "Electronic signature coordination",
      "Document completion verification",
      "Required disclosure management",
      "Secure file sharing with authorized parties",
      "Document retention and archiving",
      "Transaction file audits for completeness",
      "Customized filing systems to match your workflow"
    ]
  },
  {
    title: "Compliance Services",
    description: "Ensuring regulatory adherence and risk mitigation",
    features: [
      "Regulatory requirement monitoring",
      "Documentation compliance verification",
      "Disclosure timing and delivery tracking",
      "Error identification and correction",
      "Compliance checklist management",
      "Industry standard updates and implementation",
      "Audit preparation assistance",
      "Compliance issue resolution"
    ]
  }
];

const Services: React.FC = () => {
  useScrollToTop();
  const { Link } = useNavigation();

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <PageHeroWrapper
        title="Real Estate Support Services"
        subtitle="Comprehensive transaction support to help your business thrive"
        badge="Our Services"
        minHeight="min-h-screen"
      >
        <HeroButton
          to="/agent-portal"
          variant="ghost"
          size="lg"
          icon={<ArrowRight className="h-5 h-5" />}
          className="mt-6"
        >
          Start a Transaction
        </HeroButton>
      </PageHeroWrapper>

      {/* Services Overview Section */}
      <ContentSection dark={false} className="py-24 relative overflow-hidden" title="Expert Transaction Support" subtitle="Tailored services designed to streamline your real estate transactions and enhance your professional efficiency" centered={true}>
        <div className="absolute inset-0 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,102,204,0.03)_100%)]" />
          <div className="absolute inset-0 bg-grid-blue-500/[0.02] bg-[length:32px_32px]" />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-brand-blue mb-2">Our Services</h2>
          <p className="text-gray-600 max-w-3xl">Comprehensive solutions to streamline your real estate transactions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ContentCard
              key={service.title}
              title={service.title}
              withAnimation={true}
              hoverEffect="lift"
              iconContent={
                <div className="w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-brand-gold group-hover:text-brand-blue transition-colors duration-300" />
                </div>
              }
              className="h-full"
            >
              <p className="text-gray-600 mb-6 text-sm">
                {service.description}
              </p>
              <ul className="space-y-2 mt-auto">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-gray-600 text-sm">
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mr-2 mt-1.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </ContentCard>
          ))}
        </div>
      </ContentSection>

      {/* Process Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.05)_100%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:32px_32px]" />
        </div>

        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How We Work Together</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              A simple, efficient process designed to integrate seamlessly with your business
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <ContentCard
                key={step.title}
                title={step.title}
                withAnimation={true}
                heroStyle={true}
                className="h-full text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
                iconContent={
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-8 h-8 text-white group-hover:text-brand-gold transition-colors duration-300" />
                  </div>
                }
              >
                <p className="text-blue-100">
                  {step.desc}
                </p>

                {/* Numbered indicator */}
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">{index + 1}</span>
                </div>
              </ContentCard>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <ContentSection
        dark={false}
        className="py-24 relative overflow-hidden"
        title="Comprehensive Support"
        subtitle="Detailed breakdown of my professional services"
        centered={true}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,102,204,0.02)_100%)]" />
          <div className="absolute inset-0 bg-grid-blue-500/[0.01] bg-[length:32px_32px]" />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-brand-blue mb-2">Service Details</h2>
          <p className="text-gray-600 max-w-3xl">In-depth information about our specialized real estate support services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {detailedServices.map((service, index) => (
            <ContentCard
              key={service.title}
              title={service.title}
              withAnimation={true}
              hoverEffect="lift"
              className="h-full"
            >
              <p className="text-gray-600 mb-6 text-sm">
                {service.description}
              </p>
              <ul className="space-y-2 mt-auto">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-gray-600 text-sm">
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mr-2 mt-1.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </ContentCard>
          ))}
        </div>
      </ContentSection>

      {/* Call to Action */}
      <ContentSection
        className="py-20 bg-gradient-to-br from-brand-blue to-brand-blue/90 relative overflow-hidden"
        centered={true}
        fullWidth={true}
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to streamline your transactions?
          </h2>

          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Let me handle the paperwork while you focus on growing your business
          </p>

          <HeroButton
            to="/agent-portal"
            variant="ghost"
            size="lg"
            icon={
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            }
          >
            Start a Transaction
          </HeroButton>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 hidden lg:block"
          animate={{
            y: [0, 15, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="w-full h-full bg-white/10 rounded-full blur-xl" />
        </motion.div>

        <motion.div
          className="absolute bottom-10 right-10 w-32 h-32 hidden lg:block"
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="w-full h-full bg-brand-gold/10 rounded-full blur-xl" />
        </motion.div>
      </ContentSection>
    </div>
  );
};

export default Services;