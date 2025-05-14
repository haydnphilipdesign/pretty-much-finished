import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Users } from 'lucide-react';

const achievements = [
  {
    icon: Star,
    title: '30+ Years',
    description: 'Experience in Real Estate'
  },
  {
    icon: Award,
    title: '1000+',
    description: 'Transactions Managed'
  },
  {
    icon: Users,
    title: '200+',
    description: 'Satisfied Clients'
  }
];

const AboutOwner: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.02)_100%)]" />
        <div className="absolute inset-0 bg-grid-gray-500/[0.02] bg-[length:32px_32px]" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-brand-gold/50 to-brand-blue/50 blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold to-brand-blue rounded-2xl opacity-75 blur group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src="/debbie-profile.jpg"
                alt="Debbie O'Brien - Owner of PA Real Estate Support Services"
                className="relative rounded-xl shadow-2xl w-full object-cover h-[600px] transform group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Meet Debbie O'Brien
              </h2>
              <p className="text-xl text-gray-600 italic">
                Your Dedicated Transaction Coordinator
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-gray-600 leading-relaxed text-lg">
                With over three decades of experience in real estate and transaction management, I've dedicated my career to helping real estate professionals streamline their operations and grow their businesses.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                My journey in the Pocono Mountains real estate market has equipped me with deep industry knowledge and a comprehensive understanding of what it takes to make transactions smooth and successful.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-3 gap-6"
            >
              {achievements.map((achievement, index) => (
                <div key={achievement.title} className="text-center">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-full flex items-center justify-center mb-4">
                    <achievement.icon className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div className="text-2xl font-bold text-brand-blue mb-1">
                    {achievement.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {achievement.description}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutOwner;
