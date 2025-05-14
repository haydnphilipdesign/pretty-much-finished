import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const journeySteps = [
  {
    year: '1987-1991',
    title: 'Graduated from McAdoo Regional High School',
    description: 'Foundation in business and administrative studies'
  },
  {
    year: '1991-1995',
    title: 'Closing Administrator at Specialty Abstract, Inc.',
    description: 'Managed real estate closings and title documentation'
  },
  {
    year: '1995-2000',
    title: 'Office Manager at M&T Mortgage Co., Inc.',
    description: 'Oversaw mortgage processing and client relations'
  },
  {
    year: '2000-2005',
    title: 'Bookkeeper/Secretary at John F. Patton Attorney',
    description: 'Handled legal documentation and financial records'
  },
  {
    year: '2005-2010',
    title: 'Office Manager at Pocono Builders Association',
    description: 'Coordinated operations and member services'
  },
  {
    year: '2010-2015',
    title: 'Closing Administrator at Fidelity Home Abstract, Inc.',
    description: 'Managed real estate transaction processing'
  },
  {
    year: '2015-2020',
    title: 'Transaction Coordinator/Compliance Review Officer for Bob Hay, Broker for Keller Williams',
    description: 'Managed transaction coordination and compliance review for a high-volume real estate team.'
  },
  {
    year: '2020-Present',
    title: 'Owner/President, PA Real Estate Support Services',
    description: 'Providing comprehensive transaction coordination services'
  }
];

const ProfessionalJourney: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-brand-blue to-brand-blue/90">
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Professional Journey</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Three decades of experience in real estate and administrative excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {journeySteps.map((step, index) => (
            <motion.div
              key={step.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold to-white rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
              <div className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col group-hover:bg-gray-50">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-brand-gold" />
                  </div>
                </div>
                <div className="text-brand-gold font-semibold mb-2">{step.year}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 min-h-[3rem] flex items-center group-hover:text-brand-blue">
                  {step.title}
                </h3>
                <p className="text-gray-700 text-sm flex-grow group-hover:text-gray-900 font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalJourney; 