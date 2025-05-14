import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const benefits = [
  'Streamline Your Workflow',
  'Reduce Transaction Errors',
  'Increase Client Satisfaction',
  'Save Time and Resources',
  'Ensure Compliance',
  'Focus on Growing Your Business',
];

const Benefits: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <h2 className="section-title text-center">Benefits of Transaction Coordination</h2>
        <p className="section-subtitle text-center mb-12">
          Discover how our expert transaction coordination services can transform your real estate business
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center p-4 bg-gray-light rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CheckCircle className="text-primary mr-4 flex-shrink-0" />
              <span className="text-lg font-semibold">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;