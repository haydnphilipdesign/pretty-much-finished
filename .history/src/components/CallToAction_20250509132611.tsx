import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../providers/SmoothNavigationProvider';
import { ArrowRight } from 'lucide-react';

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  theme?: 'light' | 'dark';
  className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  theme = 'light',
  className = ''
}) => {
  const { Link } = useNavigation();
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-indigo-900';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const buttonStyle = theme === 'light'
    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
    : 'bg-white text-indigo-900 hover:bg-indigo-50';

  return (
    <section className={`py-16 ${bgColor} ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className={`text-3xl font-bold mb-6 ${textColor}`}>
            {title}
          </h2>
          <p className={`text-lg mb-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            {description}
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={buttonLink}
              className={`inline-flex items-center px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${buttonStyle}`}
            >
              {buttonText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;