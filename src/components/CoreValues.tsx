import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Users, Heart, MessageSquare, Award } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Upholding the highest standards of honesty and ethical conduct in every transaction.'
  },
  {
    icon: Clock,
    title: 'Efficiency',
    description: 'Streamlining processes to ensure timely and accurate completion of all tasks.'
  },
  {
    icon: Users,
    title: 'Partnership',
    description: 'Building strong, lasting relationships with clients based on trust and mutual success.'
  },
  {
    icon: Heart,
    title: 'Dedication',
    description: 'Committed to exceeding expectations and delivering exceptional results.'
  },
  {
    icon: MessageSquare,
    title: 'Communication',
    description: 'Maintaining clear, proactive, and responsive communication throughout the process.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Striving for the highest quality in every aspect of service delivery.'
  }
];

const CoreValues: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-6">
            My Core Values
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These principles guide my commitment to delivering exceptional service and building lasting partnerships
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
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
                    <value.icon className="w-6 h-6 text-brand-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 min-h-[2rem] flex items-center">
                    {value.title}
                  </h3>
                </div>
                <p className="text-gray-500 flex-grow min-h-[4rem]">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
