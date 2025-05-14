import React from 'react';
import { motion } from 'framer-motion';
import ContentCard from './ContentCard';

const stats = [
  { id: 1, value: '30+', label: 'Years of Excellence', description: 'Decades of dedicated service in real estate' },
  { id: 2, value: '2,000+', label: 'Successful Transactions', description: 'Expert coordination from contract to closing' },
  { id: 3, value: '10,000+', label: 'Agent Hours Saved', description: 'Allowing agents to focus on growing their business' },
  { id: 4, value: '$500M+', label: 'Transaction Volume', description: 'Trusted with significant real estate portfolios' },
];

const Statistics: React.FC = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden max-w-full statistics-section">
      {/* Enhanced background with more pronounced patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F1C2E] via-[#0F1C2E]/95 to-[#0F1C2E]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.07)_100%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:32px_32px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFB81C] mb-4">
            Proven Excellence in Numbers
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            A track record of success built on dedication, expertise, and unwavering commitment to excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <ContentCard
              key={stat.id}
              withAnimation={true}
              cardStyle="glass-navy"
              hoverEffect="lift"
              className="text-center p-6 h-full"
              iconContent={
                <div className="mb-4 bg-[rgba(255,184,28,0.15)] w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm border border-[rgba(255,184,28,0.3)]">
                  <span className="text-2xl font-bold text-[#FFB81C]">{stat.id}</span>
                </div>
              }
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2 text-[#FFB81C]">{stat.value}</div>
                <div className="text-base font-medium text-white mb-3">{stat.label}</div>
                <div className="text-sm text-white/80">{stat.description}</div>
              </motion.div>
            </ContentCard>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-24 left-24 w-32 h-32 hidden lg:block"
        animate={{
          y: [0, 20, 0],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="w-full h-full bg-white/10 rounded-full blur-xl" />
      </motion.div>

      <motion.div
        className="absolute bottom-24 right-24 w-24 h-24 hidden lg:block"
        animate={{
          y: [0, -15, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="w-full h-full bg-[#FFB81C]/20 rounded-full blur-xl" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-40 left-40 w-16 h-16 hidden lg:block"
        animate={{
          x: [0, 15, 0],
          y: [0, -10, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="w-full h-full bg-white/15 rounded-full blur-lg" />
      </motion.div>
    </section>
  );
};

export default Statistics;