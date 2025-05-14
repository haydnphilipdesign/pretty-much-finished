import React from 'react';
import { motion } from 'framer-motion';
import { Link } from './GlobalLinkProvider';
import { ArrowRight, FileSearch, Database, Clock, CheckSquare } from 'lucide-react';

const services = [
  {
    icon: FileSearch,
    title: "Transaction\nCoordination",
    description: "Expert management of your transactions from contract to closing, allowing you to focus on growing your business.",
  },
  {
    icon: Database,
    title: "Document\nManagement",
    description: "Secure digital handling system ensuring organized and instant access to all your transaction files and paperwork.",
  },
  {
    icon: Clock,
    title: "Timeline\nTracking",
    description: "Strategic oversight of critical dates and deadlines, keeping your transactions on track with proactive monitoring.",
  },
  {
    icon: CheckSquare,
    title: "Compliance\nReview",
    description: "Comprehensive review ensuring all transactions meet regulatory requirements and industry standards.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const ServicesOverview: React.FC = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-blue">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.03)_100%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
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
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Experience seamless transaction management that empowers you to grow your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="group relative h-full"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold to-brand-blue rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="flex flex-col items-center text-center h-full">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <service.icon className="w-8 h-8 text-brand-gold group-hover:text-brand-blue transition-colors duration-300" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-brand-blue mb-4 whitespace-pre-line min-h-[4rem] flex items-center justify-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 flex-grow min-h-[6rem]">
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
            className="group inline-flex items-center gap-2 bg-blue-500 backdrop-blur text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>View All Services</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOverview;
