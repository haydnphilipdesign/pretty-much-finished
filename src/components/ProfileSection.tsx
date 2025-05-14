import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Award, Heart, MapPin, CheckCircle2, ArrowRightCircle, Star, Clock, Users } from 'lucide-react';

const HighlightBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-brand-gold/10 to-brand-blue/10 text-brand-blue">
    {children}
  </span>
);

const ProfileSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
        {/* Premium Bio Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-blue/5 rounded-3xl transform -rotate-1"></div>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16 relative">
            <div className="grid md:grid-cols-12 gap-12 items-start">
              {/* Enhanced Profile Image Column */}
              <div className="md:col-span-5">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-brand-gold/20 to-brand-blue/20 rounded-2xl blur-lg opacity-50"></div>
                    <img
                      src="/debbie.jpg"
                      alt="Debbie O'Brien"
                      className="relative w-full rounded-2xl shadow-2xl"
                    />
                  </div>
                  {/* Premium Experience Badge */}
                  <motion.div
                    className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-3xl font-bold bg-gradient-to-r from-brand-gold to-brand-blue bg-clip-text text-transparent">30+</p>
                    <p className="text-sm text-gray-600 font-medium">Years of Excellence</p>
                  </motion.div>
                </motion.div>

                {/* Quick Stats Under Image */}
                <div className="mt-12 space-y-4">
                  {[
                    { icon: Users, text: "1000+ Successful Closings" },
                    { icon: MapPin, text: "Poconos Market Authority" },
                    { icon: CheckCircle2, text: "PA Real Estate License in Escrow" }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 text-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                    >
                      <stat.icon className="w-5 h-5 text-brand-gold" />
                      <span className="font-medium">{stat.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Enhanced Bio Content Column */}
              <div className="md:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-4xl font-bold mb-2">About Debbie O'Brien</h2>
                  <div className="flex gap-2 mb-6">
                    <HighlightBadge>Transaction Expert</HighlightBadge>
                    <HighlightBadge>Contract Specialist</HighlightBadge>
                  </div>

                  <div className="prose prose-lg max-w-none space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      With over three decades of experience in real estate, Debbie O'Brien has established herself as a premier transaction coordinator in the Poconos market. Her journey began with a passion for ensuring smooth, compliant real estate transactions and has evolved into a comprehensive service that supports agents and their clients throughout the entire process.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Specializing in transaction coordination, Debbie combines her deep industry knowledge with meticulous attention to detail. Her expertise spans the entire transaction lifecycle, from contract to close, ensuring every detail is handled with precision and care.
                    </p>
                  </div>

                  {/* Expertise Areas */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-brand-blue">Areas of Expertise</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "Contract Review & Compliance",
                        "Timeline Management",
                        "Documentation Organization",
                        "Communication Facilitation",
                        "Process Optimization",
                        "Closing Coordination"
                      ].map((skill, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + (index * 0.1) }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0" />
                          <span className="text-gray-700">{skill}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Service Cards */}
        <div className="mb-16">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Comprehensive Transaction Support
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Transaction Excellence",
                description: "Every transaction is handled with meticulous attention to detail, ensuring compliance and efficiency throughout the process.",
                points: [
                  "Detailed contract review",
                  "Timeline optimization",
                  "Document management",
                  "Progress tracking"
                ]
              },
              {
                icon: Award,
                title: "Quality Assurance",
                description: "Implementing rigorous quality control measures to prevent issues and maintain the highest standards of service.",
                points: [
                  "Compliance verification",
                  "Process monitoring",
                  "Risk mitigation",
                  "Best practice implementation"
                ]
              },
              {
                icon: Heart,
                title: "Client Care",
                description: "Providing exceptional support and clear communication to ensure a smooth and stress-free experience.",
                points: [
                  "Regular updates",
                  "Prompt response times",
                  "Clear communication",
                  "Proactive problem-solving"
                ]
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-2xl transform group-hover:scale-105 transition-transform duration-300 blur opacity-0 group-hover:opacity-100"></div>
                <div className="bg-white rounded-xl shadow-lg p-8 relative transform group-hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                  <div className="bg-gradient-to-br from-brand-gold/10 to-brand-blue/10 p-4 rounded-xl w-fit mb-6">
                    <service.icon className="w-8 h-8 text-brand-blue" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-3 mt-auto">
                    {service.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ArrowRightCircle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                        <span className="text-gray-600">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Premium Quote Display */}
          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/20 to-brand-blue/20 rounded-2xl transform rotate-1"></div>
            <div className="relative bg-white rounded-xl shadow-lg p-10 text-center max-w-3xl mx-auto">
              <svg className="w-12 h-12 text-brand-gold/20 absolute top-6 left-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-2xl text-gray-700 italic font-light">
                "Your success is my commitment - not just a promise, but my daily practice."
              </p>
              <p className="text-brand-blue font-medium mt-4">- Debbie O'Brien</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;