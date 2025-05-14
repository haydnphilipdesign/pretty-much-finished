import React from "react";
import { motion } from "framer-motion";
import { TransactionForm } from "./TransactionForm";
import GlobalPageHero from "../GlobalPageHeroNew";

interface PortalTransactionFormProps {
}

export const PortalTransactionForm: React.FC<PortalTransactionFormProps> = () => {
  return (
    <GlobalPageHero minHeight="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start pt-4">
        {/* Left side - Title and subtitle */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <motion.div
            className="max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
              Agent Portal
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 1.0, delay: 0.4 }}
            >
              <span className="block">Transaction</span>
              <span className="block text-blue-300">Form</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl mb-6 text-blue-100 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 1.0, delay: 0.6 }}
            >
              Submit your transaction details for processing
            </motion.p>

            {/* Additional information - only visible on desktop */}
            <motion.div
              className="hidden lg:block mt-8 glass-card-navy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <h3 className="hero-card-title mb-2">Need Help?</h3>
              <p className="text-blue-100 text-sm mb-3">
                If you have any questions about this form, please contact our support team.
              </p>
              <div className="flex items-center text-white/80 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                debbie@parealestatesupport.com
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right side - Form */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="glass-card-navy mb-16"
          >
            <TransactionForm />
          </motion.div>
        </div>
      </div>
    </GlobalPageHero>
  );
};
