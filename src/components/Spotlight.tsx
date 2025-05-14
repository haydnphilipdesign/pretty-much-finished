import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { StaggerContainer, StaggerItem } from './GlobalAnimations';

interface SpotlightItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface SpotlightProps {
  title: string;
  subtitle?: string;
  items: SpotlightItem[];
  className?: string;
}

const Spotlight: React.FC<SpotlightProps> = ({
  title,
  subtitle,
  items,
  className = ''
}) => {
  return (
    <section className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <StaggerItem key={index}>
              <motion.div
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className="w-8 h-8 text-indigo-600" />
                </motion.div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Spotlight; 