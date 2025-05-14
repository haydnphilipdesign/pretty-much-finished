import React, { useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useParticleEffect } from '../../hooks/useParticleEffect';
import { useToast } from '../../hooks/use-toast';

const formSectionVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  }
};

const backgroundVariants = {
  initial: { scale: 1.1, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.5, ease: 'easeOut' }
  }
};

const EnhancedTransactionForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const controls = useAnimation();

  // Enhanced particle effect background
  const { particles, getParticleAnimation, getParticleTransition } = useParticleEffect(75);

  const formSections = [
    { title: 'Property Details', fields: ['mlsNumber', 'address', 'price'] },
    { title: 'Client Information', fields: ['clientName', 'email', 'phone'] },
    { title: 'Transaction Details', fields: ['closingDate', 'commission'] },
    { title: 'Documents & Verification', fields: ['documents', 'signature'] }
  ];

  const handleNext = () => {
    if (currentSection < formSections.length - 1) {
      // Simplified navigation without animation dependency
      setCurrentSection(prev => prev + 1);
      
      // Reset animation controls after state update
      setTimeout(() => {
        controls.set('hidden');
        controls.start('visible');
      }, 10);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Success!',
        description: 'Transaction submitted successfully',
        variant: 'default'
      });
      
      // Reset form or redirect
      setCurrentSection(0);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit transaction',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white"
      initial="initial"
      animate="animate"
      variants={backgroundVariants}
    >
      {/* Particle effect background */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            animate={getParticleAnimation(particle)}
            transition={getParticleTransition(particle)}
            style={{ backgroundColor: particle.color }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Progress indicator */}
        <motion.div
          className="fixed top-0 left-0 h-1 bg-red-600"
          style={{
            width: `${((currentSection + 1) / formSections.length) * 100}%`
          }}
          transition={{ duration: 0.5 }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            variants={formSectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-red-500">
              {formSections[currentSection].title}
            </h2>

            {/* Form fields would go here */}
            <div className="space-y-6">
              {formSections[currentSection].fields.map(field => (
                <div key={field} className="form-field-animation">
                  <input
                    type="text"
                    placeholder={`Enter ${field}`}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              {currentSection > 0 && (
                <button
                  onClick={() => setCurrentSection(prev => prev - 1)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Back
                </button>
              )}
              {currentSection < formSections.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors ml-auto disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EnhancedTransactionForm;