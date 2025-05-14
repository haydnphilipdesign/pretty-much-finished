import React from "react";
import { motion } from "framer-motion";
import { Home, Star, Users, DollarSign, FileText, Info, PenTool, CheckCircle, AlertTriangle } from "lucide-react";

interface ArtisticStepWizardProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  skippedFields?: { step: number, fields: string[] }[];
}

export function ArtisticStepWizard({
  currentStep,
  totalSteps,
  onStepClick,
  skippedFields = []
}: ArtisticStepWizardProps) {
  // Icons for each step
  const stepIcons = [
    <Home key="home" size={20} />,
    <Star key="star" size={20} />,
    <Users key="users" size={20} />,
    <DollarSign key="dollar" size={20} />,
    <Home key="home2" size={20} />,
    <FileText key="file" size={20} />,
    <Info key="info" size={20} />,
    <PenTool key="pen" size={20} />,
  ];
  
  // Step titles
  const stepTitles = [
    "Role",
    "Property",
    "Clients",
    "Commission",
    "Details",
    "Documents",
    "Notes",
    "Review"
  ];

  // Generate steps array
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Function to check if a step has missing fields
  const stepHasMissingFields = (step: number) => {
    return skippedFields?.some(item => item.step === step && item.fields.length > 0);
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="art-step-wizard py-6 px-4">
      <div className="max-w-4xl mx-auto relative">
        {/* Progress line that connects all steps */}
        <div 
          className="absolute h-1 bg-gray-300 top-1/2 -translate-y-1/2 left-0 right-0 z-0"
          style={{ width: '100%' }}
        />
        
        {/* Animated progress line that fills based on current step */}
        <motion.div 
          className="absolute h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 top-1/2 -translate-y-1/2 left-0 z-1 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="flex justify-between items-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step) => (
            <motion.div 
              key={step}
              className="flex flex-col items-center"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.button
                onClick={() => onStepClick?.(step)}
                disabled={!onStepClick}
                className={`
                  art-step relative flex items-center justify-center 
                  w-12 h-12 md:w-14 md:h-14 rounded-full 
                  transition-all duration-500 ease-in-out
                  ${currentStep === step ? "art-step-active" : currentStep > step ? "art-step-completed" : ""}
                `}
                whileHover={currentStep !== step ? { scale: 1.05, boxShadow: "0px 0px 10px rgba(255,255,255,0.5)" } : {}}
                aria-label={`Go to step ${step}: ${stepTitles[step - 1]}`}
              >
                {currentStep > step ? (
                  <CheckCircle className="text-white" size={22} />
                ) : (
                  stepIcons[step - 1] || step
                )}
                
                {/* Missing fields indicator */}
                {stepHasMissingFields(step) && (
                  <motion.div 
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(239, 68, 68, 0.4)", 
                        "0 0 0 6px rgba(239, 68, 68, 0)", 
                        "0 0 0 0 rgba(239, 68, 68, 0)"
                      ]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2
                    }}
                  >
                    <AlertTriangle size={10} className="text-white" />
                  </motion.div>
                )}
              </motion.button>
              
              {/* Step label */}
              <span 
                className={`
                  hidden md:block mt-2 text-xs font-medium text-center
                  ${currentStep === step ? "text-brand-gold font-bold" : "text-white text-opacity-80"}
                  transition-all duration-300
                `}
              >
                {stepTitles[step - 1]}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
