"use client";
import { motion } from 'framer-motion';

export const Preloader = () => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-brand-blue z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5,
          ease: "easeOut"
        }}
        className="relative w-auto h-auto"
      >
        <div className="w-48 h-48 relative">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          >
            <source src="/animations/preloader.mp4" type="video/mp4" />
            <img 
              src="/animations/preloader.gif" 
              alt="Loading..."
              className="w-full h-full object-contain"
            />
          </video>
          <div className="absolute inset-0 bg-brand-blue mix-blend-screen"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};