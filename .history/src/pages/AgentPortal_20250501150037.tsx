import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Clock, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from '../components/ui/simple-toast';
import Footer from '../components/Footer';
import { TransactionForm } from '../components/TransactionForm/TransactionForm';
import useScrollToTop from '../hooks/useScrollToTop';

// Password for accessing the form - use from environment variables if available
const FORM_PASSWORD = import.meta.env.VITE_PORTAL_PASSWORD || 'KWAgent2025!';

const AgentPortal = (): JSX.Element => {
  useScrollToTop();
  
  // State for password protection
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordChecking, setIsPasswordChecking] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Check for saved credentials on component mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('agentAuth');
    if (savedAuth === FORM_PASSWORD) {
      setIsPasswordProtected(false);
      setShowForm(true);
    }
  }, []);

  // Handle password submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordChecking(true);
    
    // Simulate a slight delay for UX
    setTimeout(() => {
      if (password === FORM_PASSWORD) {
        setIsPasswordProtected(false);
        setShowForm(true);
        if (rememberMe) {
          localStorage.setItem('agentAuth', password);
        }
        toast({
          title: "Access granted",
          description: "Welcome to the Agent Portal",
        });
      } else {
        toast({
          title: "Access denied",
          description: "The password you entered is incorrect",
          variant: "destructive",
        });
      }
      setIsPasswordChecking(false);
    }, 800);
  };

  // Features list for the password-protected view
  const features = [
    {
      icon: FileText,
      title: "Streamlined Documentation",
      description: "Submit transaction details through a user-friendly form designed for real estate professionals."
    },
    {
      icon: Shield,
      title: "Secure Handling",
      description: "Your transaction information is securely processed and stored with industry-standard encryption."
    },
    {
      icon: Clock,
      title: "Time-Saving",
      description: "Save hours on paperwork and follow-ups with our efficient transaction coordination service."
    }
  ];

  return (
    <div className="min-h-screen bg-brand-blue">
      {isPasswordProtected ? (
        <motion.div 
          className="min-h-screen flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-grow grid lg:grid-cols-2">
            {/* Left side - Password form */}
            <motion.div 
              className="flex items-center justify-center p-8 bg-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900">Agent Portal</h1>
                  <p className="mt-2 text-gray-600">
                    Enter the password to access the transaction form
                  </p>
                </div>
                
                <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        placeholder="Enter portal password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me on this device
                    </label>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPasswordChecking}
                  >
                    {isPasswordChecking ? "Checking..." : "Access Portal"}
                  </Button>
                </form>
              </div>
            </motion.div>
            
            {/* Right side - Features */}
            <motion.div 
              className="hidden lg:flex lg:flex-col bg-gradient-to-br from-brand-blue to-brand-blue/90 text-white p-12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="my-auto max-w-lg mx-auto">
                <h2 className="text-3xl font-bold mb-8">Transaction Coordination Portal</h2>
                <div className="space-y-8">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div 
                        key={index} 
                        className="flex gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                      >
                        <div className="bg-white/10 p-3 rounded-lg">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-xl">{feature.title}</h3>
                          <p className="text-white/80 mt-1">{feature.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
          <Footer className="bg-gray-100" />
        </motion.div>
      ) : (
        <motion.div 
          className="min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TransactionForm />
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AgentPortal;
