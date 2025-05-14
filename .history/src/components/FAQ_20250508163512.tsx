import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What services do you provide as a transaction coordinator?",
    answer: "I provide comprehensive transaction coordination services including contract-to-close management, document organization, deadline tracking, communication management, and compliance review. I handle all the administrative details so you can focus on growing your business."
  },
  {
    question: "How do you handle document management and organization?",
    answer: "I use a secure digital system to organize and store all transaction documents. Everything is properly categorized, easily accessible, and backed up. This ensures you have instant access to any document you need, when you need it."
  },
  {
    question: "What is your response time for communications?",
    answer: "I prioritize responsive communication. During business hours, I typically respond to emails and calls within 1-2 hours. For urgent matters, I'm available for immediate assistance. I also provide regular status updates to keep you informed."
  },
  {
    question: "How do you ensure transaction compliance?",
    answer: "I maintain a comprehensive checklist of regulatory requirements and conduct thorough reviews of all documentation. I stay updated with the latest regulations and ensure all transactions meet both legal requirements and industry standards."
  },
  {
    question: "What is your pricing structure?",
    answer: "I offer flexible pricing options based on your specific needs and transaction volume. Please contact me for a personalized quote that aligns with your business requirements."
  },
  {
    question: "How do you handle multiple transactions simultaneously?",
    answer: "I use advanced project management tools and systems to track and manage multiple transactions efficiently. Each transaction is given dedicated attention, with careful monitoring of deadlines and requirements."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="mb-4 group"
        >
          <div className="relative">
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-brand-gold to-brand-blue rounded-xl blur opacity-0 transition duration-300 ${openIndex === index ? 'opacity-30' : 'group-hover:opacity-20'}`} />
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none relative"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 pr-8">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 p-2 rounded-full flex items-center justify-center"
                >
                  <ChevronDown className="w-5 h-5 text-brand-gold" />
                </motion.div>
              </div>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-600 mt-4 pt-4 border-t border-gray-100 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FAQ; 