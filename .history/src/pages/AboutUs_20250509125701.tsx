import React from "react";
import { motion } from 'framer-motion';
import { Link } from '../components/GlobalLinkProvider';
import ProfileSection from '../components/ProfileSection';
import { ArrowRight, Calendar, CheckCircle2, Target, Presentation, Users } from 'lucide-react';
import useScrollToTop from "../hooks/useScrollToTop";
import Timeline from "../components/Timeline";
import PageHeroWrapper from '../components/PageHeroWrapper';

// Enhanced Core Value Component
const CoreValue = ({ title, description, icon: Icon }: { title: string; description: string; icon: React.ComponentType<any> }) => (
  <motion.div
    className="group relative"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold to-brand-blue rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300" />
    <div className="relative bg-white rounded-xl shadow-lg p-8 h-full transform group-hover:shadow-xl transition-all duration-300">
      <div className="bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-8 h-8 text-brand-blue group-hover:text-brand-gold transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

const AboutMe: React.FC = () => {
  useScrollToTop();

  return (
    <div className="bg-white">
      {/* Using the synchronized PageHeroWrapper with consistent min-h-screen height */}
      <PageHeroWrapper
        title="Meet Your Transaction Expert"
        subtitle="Dedicated support for your real estate business"
        badge="About PA Real Estate Support Services"
        minHeight="min-h-screen"
      >
        <Link
          to="/work-with-me"
          className="inline-flex items-center mt-6 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium border border-white/20 transition-all duration-300"
        >
          Get in Touch
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </PageHeroWrapper>

      {/* Profile Section */}
      <ProfileSection />

      {/* Journey Section */}
      <section className="py-24 bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-blue relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.05)_100%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:32px_32px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">Professional Journey</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              My path to becoming your dedicated real estate transaction coordinator
            </p>
          </motion.div>

          <Timeline />
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.02)_100%)]" />
          <div className="absolute inset-0 bg-grid-gray-500/[0.02] bg-[length:32px_32px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">Our Values</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide my work and commitment to your success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle2,
                title: "Reliability",
                description: "You can count on me to deliver consistent, high-quality service for every transaction, every time."
              },
              {
                icon: Target,
                title: "Precision",
                description: "I pay meticulous attention to detail, ensuring all documentation is accurate and compliant."
              },
              {
                icon: Calendar,
                title: "Timeliness",
                description: "I respect deadlines and ensure all tasks are completed promptly to keep your transactions on schedule."
              },
              {
                icon: Presentation,
                title: "Professionalism",
                description: "I maintain the highest standards of professionalism in all interactions and communications."
              },
              {
                icon: Users,
                title: "Client-Focused",
                description: "Your success is my priority. I tailor my services to meet your specific needs and preferences."
              },
              {
                icon: ArrowRight,
                title: "Continuous Improvement",
                description: "I constantly seek to enhance my skills and knowledge to provide you with the best possible service."
              }
            ].map((value, index) => (
              <CoreValue key={index} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-brand-blue to-brand-blue/90 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to work together?</h2>
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
            Let me handle your transaction coordination so you can focus on growing your business
          </p>
          <Link
            to="/work-with-me"
            className="group inline-flex items-center px-8 py-4 text-lg font-medium text-brand-blue bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1"
          >
            Get in Touch
            <motion.div
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutMe;