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
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative group"
          >
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-gray-200/50 to-gray-100/50 blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl opacity-75 blur group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src="/services.jpg"
                alt="Modern real estate office interior"
                className="relative rounded-xl shadow-2xl w-full max-w-md mx-auto object-cover h-[600px] transform group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Transforming Complex Transactions into Seamless Success Stories
              </h2>
              <p className="text-xl text-gray-600 italic">
                Three Decades of Excellence in the Pocono Mountains
              </p>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p className="text-gray-600 leading-relaxed text-lg">
                At PA Real Estate Support Services, I specialize in turning complex real estate transactions into seamless experiences. With a deep understanding of the unique challenges in today's market, I provide comprehensive coordination services that empower real estate professionals to scale their business while maintaining exceptional client service.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
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
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>Discover My Approach</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
