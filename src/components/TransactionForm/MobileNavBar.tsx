import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, Info, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Remove Button dependency to eliminate potential Router context dependencies
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
}

// Simple Button component that doesn't depend on any contexts
const Button = ({
  variant = 'default',
  size = 'default',
  children,
  className,
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50";
  
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700"
  };
  
  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10"
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

interface MobileNavBarProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext?: boolean;
  isLastStep?: boolean;
  hasMissingFields?: boolean;
  onSave?: () => void;
  className?: string;
}

export function MobileNavBar({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  canGoNext = true,
  isLastStep = false,
  hasMissingFields = false,
  onSave,
  className
}: MobileNavBarProps) {
  const progress = (currentStep / totalSteps) * 100;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll direction detection for auto-hiding
  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') return undefined;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY + 5) {
        setIsScrollingUp(false);
      } else if (currentScrollY < lastScrollY - 5) {
        setIsScrollingUp(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  // Handle keyboard visibility
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') return undefined;
    
    const checkKeyboard = () => {
      // On mobile, when keyboard opens, window height becomes smaller
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.clientHeight;
      
      // If the window height is significantly smaller than document height,
      // keyboard is likely open
      setIsKeyboardVisible(windowHeight < documentHeight * 0.8);
    };
    
    window.addEventListener('resize', checkKeyboard);
    return () => window.removeEventListener('resize', checkKeyboard);
  }, []);
  
  return (
    <>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: isKeyboardVisible ? 100 : 0, 
          opacity: isKeyboardVisible ? 0 : 1 
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-blue-800 py-3 px-4 md:hidden z-50 shadow-lg safe-area-bottom",
          className
        )}
      >
        {/* Enhanced progress bar */}
        <div className="h-1 absolute top-0 left-0 w-full bg-blue-900 -translate-y-1 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={cn(
              "h-full relative bg-white"
            )}
          >
            {/* Animated shine effect */}
            <div className="absolute top-0 left-0 h-full w-20 bg-white/20 skew-x-30 shimmer"></div>
          </motion.div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            disabled={currentStep === 1}
            className={cn(
              "flex items-center px-3 h-11 rounded-full shadow-sm touch-target",
              "text-white/90 hover:text-white hover:bg-blue-700/50",
              "transition-all duration-200 ease-in-out transform active:scale-95 touch-ripple",
              currentStep === 1 ? "opacity-50" : "opacity-100"
            )}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          
          {onSave && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (onSave) onSave();
                // Show toast notification for mobile
                const toast = document.createElement('div');
                toast.className = 'mobile-toast';
                toast.innerText = 'Draft saved successfully';
                document.body.appendChild(toast);
                setTimeout(() => {
                  toast.style.opacity = '0';
                  setTimeout(() => document.body.removeChild(toast), 300);
                }, 2000);
              }}
              className={cn(
                "px-3 h-11 rounded-full text-white hover:bg-blue-700/50 shadow-sm touch-target",
                "transition-all duration-200 ease-in-out transform active:scale-95 touch-ripple"
              )}
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save
            </Button>
          )}
          
          <Button
            variant="default"
            size="sm"
            onClick={onNext}
            disabled={!canGoNext}
            className={cn(
              "flex items-center px-4 h-11 rounded-full shadow-sm touch-target",
              "transition-all duration-200 ease-in-out transform active:scale-95 touch-ripple",
              isLastStep 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-white text-blue-800 hover:bg-blue-50",
              !canGoNext && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLastStep ? "Submit" : "Next"}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center text-xs text-white/70 mt-3">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-white mr-1.5"></div>
            <span>Step {currentStep} of {totalSteps}</span>
          </div>
          
          <div className="text-right">
            <span className="font-medium">{Math.round(progress)}% Complete</span>
            {hasMissingFields && (
              <div className="flex items-center text-yellow-300 mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>Missing fields</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Menu button in bottom right */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="absolute bottom-20 right-4 w-12 h-12 rounded-full bg-blue-600 shadow-lg flex items-center justify-center text-white border border-blue-500 mobile-fab"
          aria-label="Show menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </motion.div>
      
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[51] md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-blue-800 rounded-t-xl p-4 safe-area-bottom"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4"></div>
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Transaction Options</h3>
                <button onClick={() => setIsMenuOpen(false)} className="p-1 text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2">
                <button className="w-full py-3 px-4 bg-blue-700/50 rounded-lg text-white font-medium text-left flex items-center">
                  <Save className="w-4 h-4 mr-3" />
                  Save as Draft
                </button>
                
                <button className="w-full py-3 px-4 bg-blue-700/50 rounded-lg text-white font-medium text-left flex items-center">
                  <Info className="w-4 h-4 mr-3" />
                  View Transaction Details
                </button>
                
                <button className="w-full py-3 px-4 bg-red-500/20 rounded-lg text-red-200 font-medium text-left flex items-center mt-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                    <path d="M10 16l4-4m0 0l-4-4m4 4H3"></path>
                    <path d="M21 12v4a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2v4z"></path>
                  </svg>
                  Exit Transaction
                </button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-blue-700/30">
                <div className="text-white/60 text-xs mb-2">Transaction Progress</div>
                <div className="w-full h-2 bg-blue-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>Step {currentStep}/{totalSteps}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add global styles for toast notifications */}
      <style jsx global>{`
        .mobile-toast {
          position: fixed;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 10px 16px;
          border-radius: 20px;
          font-size: 14px;
          z-index: 9999;
          transition: opacity 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .mobile-fab {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .mobile-fab:active {
          transform: scale(0.95);
        }
        
        .shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-30deg);
          }
          100% {
            transform: translateX(200%) skewX(-30deg);
          }
        }
        
        .touch-target {
          position: relative;
        }
        
        .touch-target::after {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          pointer-events: none;
        }
        
        .touch-ripple {
          position: relative;
          overflow: hidden;
        }
        
        .touch-ripple::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 0;
          border-radius: 100%;
          transform: scale(1, 1) translate(-50%, -50%);
          transform-origin: 50% 50%;
        }
        
        .touch-ripple:active::after {
          animation: ripple 0.4s ease-out;
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0, 0);
            opacity: 0.5;
          }
          100% {
            transform: scale(20, 20);
            opacity: 0;
          }
        }
        
        .safe-area-bottom {
          padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
        }
      `}</style>
    </>
  );
}