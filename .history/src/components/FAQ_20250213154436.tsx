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
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.02)_100%)]" />
        <div className="absolute inset-0 bg-grid-gray-500/[0.02] bg-[length:32px_32px]" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about my transaction coordination services
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="mb-4"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none group"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 pr-8">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-6 h-6 text-brand-gold transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
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
                      <p className="text-gray-600 mt-4 pt-4 border-t border-gray-100">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 