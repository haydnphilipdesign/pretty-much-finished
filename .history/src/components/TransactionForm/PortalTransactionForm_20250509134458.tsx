import React from "react";
import { motion } from "framer-motion";
import { TransactionForm } from "./TransactionForm";
import GlobalPageHero from "../GlobalPageHero";

interface PortalTransactionFormProps {
}

export const PortalTransactionForm: React.FC<PortalTransactionFormProps> = () => {
  return (
    <GlobalPageHero minHeight="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        <div className="lg:col-span-3">
          <motion.div
            className="max-w-2xl"
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
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight"
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
              className="text-xl md:text-2xl mb-6 md:mb-8 text-blue-100 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 1.0, delay: 0.6 }}
            >
              Submit your transaction details for processing
            </motion.p>
          </motion.div>
        </div>

        <div className="lg:col-span-5 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl"
          >
            <TransactionForm />
          </motion.div>
        </div>
      </div>
    </GlobalPageHero>
  );
};
