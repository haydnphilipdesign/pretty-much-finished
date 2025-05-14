import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useNavigation } from '../providers/SmoothNavigationProvider';

const ContactSection: React.FC = () => {
  const { Link } = useNavigation();
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
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.02)_100%)]" />
        <div className="absolute inset-0 bg-grid-gray-500/[0.02] bg-[length:32px_32px]" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-brand-blue font-serif">
              Let's Transform Your Business
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Ready to experience seamless transaction coordination? Connect with me to discuss how we can elevate your real estate business together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "Direct Line",
                content: "(570) 588-4637",
                link: "tel:+5705884637",
                subtext: ["Available Monday-Friday", "9:00 AM - 5:00 PM EST"]
              },
              {
                icon: Mail,
                title: "Email Support",
                content: "debbie@parealestatesupport.com",
                link: "mailto:debbie@parealestatesupport.com",
                subtext: ["Quick response guaranteed", "within 24 hours"]
              },
              {
                icon: MapPin,
                title: "Service Area",
                content: "Serving Realtors in the Pocono Mountains",
                subtext: ["Pennsylvania's Premier", "Transaction Coordinator"]
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group relative"
              >
                <div className="absolute -inset-px bg-gradient-to-r from-brand-blue to-brand-gold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
                <div className="relative h-full flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-gold/10 to-brand-blue/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-brand-gold group-hover:text-brand-blue transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {item.title}
                  </h3>
                  {item.link ? (
                    <a
                      href={item.link}
                      className="text-brand-blue hover:text-brand-gold transition-colors duration-300 font-medium text-center"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-gray-600 text-center">
                      {item.content}
                    </p>
                  )}
                  <div className="mt-4 text-sm text-gray-500 text-center">
                    {item.subtext.map((text, i) => (
                      <p key={i}>{text}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <Link
              to="/workwithme"
              className="group inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-blue/90 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Start Your Success Journey</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;