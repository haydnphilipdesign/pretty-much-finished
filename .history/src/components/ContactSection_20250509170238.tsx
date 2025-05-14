import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useNavigation } from '../providers/SmoothNavigationProvider';
import ContentCard from './ContentCard';
import HeroButton from './HeroButton';
import HeroBadge from './HeroBadge';

const ContactSection: React.FC = () => {
  const { Link } = useNavigation();

  const contactInfo = [
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
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,102,204,0.02)_100%)]" />
        <div className="absolute inset-0 bg-grid-blue-500/[0.01] bg-[length:32px_32px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >

          <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">
            Let's Transform Your Business
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to experience seamless transaction coordination? Connect with me to discuss how we can elevate your real estate business together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((item, index) => (
            <ContentCard
              key={item.title}
              withAnimation={true}
              hoverEffect="gradient"
              className="h-full flex flex-col items-center text-center"
              iconContent={
                <div className="w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-8 h-8 text-brand-gold group-hover:text-brand-blue transition-colors duration-300" />
                </div>
              }
            >
              <h3 className="text-xl font-bold text-brand-blue mb-3">
                {item.title}
              </h3>

              {item.link ? (
                <a
                  href={item.link}
                  className="text-brand-blue hover:text-brand-gold transition-colors duration-300 font-medium mb-4"
                >
                  {item.content}
                </a>
              ) : (
                <p className="text-gray-700 mb-4 font-medium">
                  {item.content}
                </p>
              )}

              <div className="text-sm text-gray-500 space-y-1 mt-auto">
                {item.subtext.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </ContentCard>
          ))}
        </div>


      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 hidden lg:block"
        animate={{
          y: [0, 15, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="w-full h-full bg-brand-blue/10 rounded-full blur-xl" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 hidden lg:block"
        animate={{
          y: [0, -10, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="w-full h-full bg-brand-gold/10 rounded-full blur-xl" />
      </motion.div>
    </section>
  );
};

export default ContactSection;