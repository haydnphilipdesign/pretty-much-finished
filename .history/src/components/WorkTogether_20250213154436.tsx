import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Database, MessageCircle, Clock } from 'lucide-react';

const steps = [
  {
    icon: FileSearch,
    title: 'Initial Consultation',
    description: 'We begin with a thorough review of your needs and current processes to create a tailored solution.'
  },
  {
    icon: Database,
    title: 'Setup & Integration',
    description: 'I establish efficient systems and workflows customized to your business requirements.'
  },
  {
    icon: MessageCircle,
    title: 'Ongoing Support',
    description: 'Regular communication and updates ensure smooth transaction management and coordination.'
  },
  {
    icon: Clock,
    title: 'Timely Execution',
    description: 'Consistent monitoring and follow-up to keep all transactions on track and on schedule.'
  }
];

const WorkTogether: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-brand-blue">
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
            How We'll Work Together
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            A streamlined approach to managing your real estate transactions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
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
                <div className="flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-full flex items-center justify-center mb-6">
                    <step.icon className="w-8 h-8 text-brand-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center min-h-[3rem]">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 flex-grow min-h-[4.5rem]">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkTogether; 