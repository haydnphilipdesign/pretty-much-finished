import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../providers/SmoothNavigationProvider';
import { ArrowRight, FileSearch, Database, Clock, CheckSquare } from 'lucide-react';
import ContentCard from './ContentCard';

const services = [
  {
    icon: FileSearch,
    title: "Transaction Coordination",
    description: "Expert management of your transactions from contract to closing, allowing you to focus on growing your business.",
    style: "glass-navy" as const
  },
  {
    icon: Database,
    title: "Document Management",
    description: "Secure digital handling system ensuring organized and instant access to all your transaction files and paperwork.",
    style: "glass-navy" as const
  },
  {
    icon: Clock,
    title: "Timeline Tracking",
    description: "Strategic oversight of critical dates and deadlines, keeping your transactions on track with proactive monitoring.",
    style: "glass-navy" as const
  },
  {
    icon: CheckSquare,
    title: "Compliance Review",
    description: "Comprehensive review ensuring all transactions meet regulatory requirements and industry standards.",
    style: "glass-navy" as const
  },
];

const ServicesOverview: React.FC = () => {
  const { Link } = useNavigation();
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Enhanced background with rich blue gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.07)_100%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.04] bg-[length:24px_24px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Elevate Your Real Estate Business
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Experience seamless transaction management that empowers you to grow your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <div className="bg-blue-900/95 backdrop-blur-md rounded-xl p-6 h-full border border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group">
                {/* Solid background instead of gradient overlay for better text contrast */}
                <div className="absolute inset-0 bg-blue-900 opacity-90" />
                
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 opacity-100" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white/30">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-extrabold text-white mb-3 leading-tight tracking-tight">
                    {service.title.split('\n').map((text, i) => (
                      <span key={i} className="block shadow-text">{text}</span>
                    ))}
                  </h3>
                  
                  <p className="text-white leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
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
            className="group inline-flex items-center gap-2 bg-white px-8 py-4 rounded-lg font-semibold text-blue-700 hover:bg-amber-500 hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>View All Services</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute top-1/4 right-0 h-40 w-40 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 h-48 w-48 bg-blue-400/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default ServicesOverview;