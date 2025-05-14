import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../providers/SmoothNavigationProvider';
import { ArrowRight } from 'lucide-react';
import ContentSection from './ContentSection';
import ContentCard from './ContentCard';
import HeroButton from './HeroButton';

const AboutSection: React.FC = () => {
  const { Link } = useNavigation();
  return (
    <ContentSection dark={false} className="py-20 overflow-x-hidden max-w-full relative">
      {/* Add background patterns for consistency with other sections */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,102,204,0.02)_100%)]" />
        <div className="absolute inset-0 bg-grid-blue-500/[0.01] bg-[length:32px_32px]" />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-center relative z-10">
        {/* Image Column */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative group"
        >
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-gray-200/50 to-gray-100/50 blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl opacity-75 blur group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src="/optimized/desk.jpg"
              alt="Modern real estate office interior"
              className="relative rounded-xl shadow-xl w-full max-w-md mx-auto object-cover h-[500px] transform group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        </motion.div>

        {/* Content Column - Use glass-card-on-white for better styling */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <ContentCard 
            cardStyle="glass-blue" 
            withAnimation={false} 
            className="overflow-hidden max-w-md ml-0 mr-auto"
          >
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="glass-card-title text-2xl md:text-3xl font-bold leading-tight break-words">
                Transforming Complex Transactions into Seamless Success Stories
              </h2>
              <p className="text-md text-blue-100 italic">
                Three Decades of Excellence in the Pocono Mountains
              </p>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p className="glass-card-content leading-relaxed text-sm md:text-base">
                At PA Real Estate Support Services, I specialize in turning complex real estate transactions into seamless experiences. With a deep understanding of the unique challenges in today's market, I provide comprehensive coordination services that empower real estate professionals to scale their business while maintaining exceptional client service.
              </p>
              <p className="glass-card-content leading-relaxed text-sm md:text-base">
                My extensive experience in the Pocono Mountains real estate market, combined with a commitment to cutting-edge technology and personalized service, ensures that every transaction is handled with precision and care. From contract to closing, I'm dedicated to being your trusted partner in success.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="pt-4"
            >
              <HeroButton
                to="/about"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                withAnimation={false}
              >
                Discover My Approach
              </HeroButton>
            </motion.div>
          </ContentCard>
        </motion.div>
      </div>
      
      {/* Add decorative elements for visual consistency with other pages */}
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
    </ContentSection>
  );
};

export default AboutSection;