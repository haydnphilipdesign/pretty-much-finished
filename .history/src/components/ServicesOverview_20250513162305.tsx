import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../providers/SmoothNavigationProvider';
import { ArrowRight, FileSearch, Database, Clock, CheckSquare } from 'lucide-react';
import ContentCard from './ContentCard';

const services = [
  {
    icon: FileSearch,
    title: "Transaction\nCoordination",
    description: "Expert management of your transactions from contract to closing, allowing you to focus on growing your business.",
    style: "glass-navy" as const
  },
  {
    icon: Database,
    title: "Document\nManagement",
    description: "Secure digital handling system ensuring organized and instant access to all your transaction files and paperwork.",
    style: "glass-navy" as const
  },
  {
    icon: Clock,
    title: "Timeline\nTracking",
    description: "Strategic oversight of critical dates and deadlines, keeping your transactions on track with proactive monitoring.",
    style: "glass-navy" as const
  },
  {
    icon: CheckSquare,
    title: "Compliance\nReview",
    description: "Comprehensive review ensuring all transactions meet regulatory requirements and industry standards.",
    style: "glass-navy" as const
  },
];

const ServicesOverview: React.FC = () => {
  const { Link } = useNavigation();
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Enhanced background with consistent patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-blue">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.05)_100%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:32px_32px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Elevate Your Real Estate Business
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Experience seamless transaction management that empowers you to grow your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <ContentCard
              key={service.title}
              withAnimation={true}
              hoverEffect="lift"
              cardStyle={service.style}
              iconContent={
                <motion.div
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <service.icon className="w-8 h-8 text-white group-hover:text-white transition-colors duration-300" />
                </motion.div>
              }
              title={service.title}
              className="h-full"
            >
              <p className="glass-card-content min-h-[6rem] text-white">
                {service.description}
              </p>
            </ContentCard>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/services"
            className="group inline-flex items-center gap-2 bg-white backdrop-blur text-brand-blue px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>View All Services</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>

      {/* Decorative elements for visual consistency */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 hidden lg:block"
        animate={{
          y: [0, 20, 0],
          opacity: [0.2, 0.4, 0.2]
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
        className="absolute bottom-10 right-10 w-24 h-24 hidden lg:block"
        animate={{
          y: [0, -15, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="w-full h-full bg-brand-gold/20 rounded-full blur-xl" />
      </motion.div>
    </section>
  );
};

export default ServicesOverview;
