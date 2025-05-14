import React from "react";
import { motion } from "framer-motion";
import { useNavigation } from "../providers/SmoothNavigationProvider";
import PageHeroWrapper from "../components/PageHeroWrapper";
import AnimatedSection from "../components/AnimatedSection";
import { RevealSection, HoverScale } from "../components/GlobalAnimations";
import { FileSearch, Database, Clock, CheckSquare, Shield, Users, Phone, Mail, FileText, Briefcase, CheckCircle, ArrowRight } from "lucide-react";
import useScrollToTop from "../hooks/useScrollToTop";
import ContentSection from "../components/ContentSection";
import ContentCard from "../components/ContentCard";
import HeroButton from "../components/HeroButton";
import HeroBadge from "../components/HeroBadge";

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
    title: "Compliance Oversight",
    description: "Ensuring your transactions adhere to all regulatory requirements. I keep track of changing regulations and ensure all documents meet current standards.",
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
    description: "Proactive identification and mitigation of potential issues before they become problems. I help you navigate complex situations with confidence.",
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
    description: "Professional and timely updates to all parties involved in your transactions. I ensure everyone stays informed throughout the process.",
    features: [
      "Regular status updates",
      "Clear communication",
      "Question handling",
      "Transaction transparency"
    ]
  }
];

const processSteps = [
  {
    icon: FileText,
    title: "Initial\nConsultation",
    desc: "We'll discuss your specific needs and how I can best support your real estate business."
  },
  {
    icon: Briefcase,
    title: "Service\nSelection",
    desc: "Choose the specific services that align with your business goals and transaction needs."
  },
  {
    icon: CheckCircle,
    title: "Implementation\nPlanning",
    desc: "We'll develop a customized plan to integrate my services with your existing workflow."
  },
  {
    icon: ArrowRight,
    title: "Ongoing\nSupport",
    desc: "I provide continuous support and adjust services as your business evolves and grows."
  }
];

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
      {/* Using our synchronized PageHeroWrapper component with consistent min-h-screen height */}
      <PageHeroWrapper
        title="Real Estate Support Services"
        subtitle="Comprehensive real estate transaction support to help your business thrive"
        badge="Our Services"
        minHeight="min-h-screen"
      >
        <HeroButton
          to="/work-with-me"
          variant="ghost"
          size="md"
          icon={<ArrowRight className="h-4 w-4" />}
          className="mt-6"
        >
          Start Working Together
        </HeroButton>
      </PageHeroWrapper>

      <ContentSection
        title="Expert Transaction Support"
        subtitle="Tailored services designed to streamline your real estate transactions and enhance your professional efficiency"
        centered={true}
        className="py-24"
      >
        <div className="mb-16">
          <HeroBadge className="bg-blue-100 text-blue-800 mb-4">Our Services</HeroBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ContentCard
              key={service.title}
              title={service.title}
              withAnimation={true}
              className="h-full"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-8 h-8 text-brand-gold group-hover:text-brand-blue transition-colors duration-300" />
              </div>
              <p className="text-gray-600 mb-6">
                {service.description}
              </p>
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </ContentCard>
          ))}
        </div>
      </ContentSection>

      {/* Process Section */}
      <ContentSection
        title="How We Work Together"
        subtitle="A simple, efficient process designed to integrate seamlessly with your business"
        centered={true}
        className="py-24 bg-gradient-to-br from-brand-blue to-brand-blue/90 relative overflow-hidden text-white"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.05)_100%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:32px_32px]" />
        </div>

        <div className="mb-16">
          <HeroBadge className="bg-white/20 text-white mb-4">Our Process</HeroBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <ContentCard
              key={step.title}
              withAnimation={true}
              className="h-full text-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-brand-gold group-hover:text-brand-blue transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 whitespace-pre-line">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.desc}
                </p>
              </div>
            </ContentCard>
          ))}
        </div>
      </ContentSection>

      {/* Detailed Services */}
      <ContentSection
        title="Comprehensive Support"
        subtitle="Detailed breakdown of my professional services"
        centered={true}
        className="py-24 bg-gray-50"
        dark={false}
      >
        <div className="mb-16">
          <HeroBadge className="bg-blue-100 text-blue-800 mb-4">Service Details</HeroBadge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {detailedServices.map((service, index) => (
            <ContentCard
              key={service.title}
              title={service.title}
              subtitle={service.description}
              withAnimation={true}
              className="h-full"
            >
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mr-3" />
                    <span className="text-sm">{feature}</span>
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
        <div className="text-center relative z-10">
          <h2 className="hero-headline text-white mb-6">Ready to streamline your transactions?</h2>
          <p className="hero-subheadline text-gray-200 mb-10 max-w-3xl mx-auto">
            Let me handle the paperwork while you focus on growing your business
          </p>
          <HeroButton
            to="/work-with-me"
            variant="ghost"
            size="lg"
            icon={
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            }
          >
            Start Working Together
          </HeroButton>
        </div>
      </ContentSection>
    </div>
  );
};

export default Services;