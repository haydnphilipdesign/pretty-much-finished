import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, LogIn, Home, CheckCircle } from 'lucide-react';
import { useNavigation } from '../providers/SmoothNavigationProvider';
import { setAuthenticated } from '../utils/authUtils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Logo from '/logo-flat.png';
import GlobalPageHero from '../components/GlobalPageHeroNew';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { Link } = useNavigation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered state if available
  useEffect(() => {
    const remembered = localStorage.getItem('rememberAgent');
    if (remembered === 'true') {
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Store remember preference
    if (rememberMe) {
      localStorage.setItem('rememberAgent', 'true');
    } else {
      localStorage.removeItem('rememberAgent');
    }

    // Simple timeout to simulate loading
    setTimeout(() => {
      if (password === 'KWAgent2025!') {
        setAuthenticated();
        // Navigate using the standard router
        navigate('/agent-portal/transaction');
      } else {
        setError('Incorrect password. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <GlobalPageHero>
      <div className="container px-4 md:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-7">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Pre-title badge */}
            <motion.div
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
              Agent Transaction Portal
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="block">Welcome to the</span>
              <span className="block text-blue-300">Agent Portal</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-xl md:text-2xl mb-6 md:mb-8 text-blue-100 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Submit new transactions quickly and easily with our streamlined intake form.
            </motion.p>

            {/* Key benefits */}
            <motion.div
              className="flex flex-wrap gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center text-sm sm:text-base">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-300" />
                <span className="font-medium">Fast Transaction Submission</span>
              </div>
              <span className="mx-2 text-blue-400/50">•</span>
              <div className="flex items-center text-sm sm:text-base">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-300" />
                <span className="font-medium">Streamlined Process</span>
              </div>
            </motion.div>

            {/* Return to home button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium border border-white/20 transition-all duration-300"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Link>
            </motion.div>
          </motion.div>
        </div>

          {/* Login Card - Right Side (using our new glass-card-login style) */}
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
            <div className="glass-card-login relative p-6 md:p-8">
              {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-50 blur-sm"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-blue-300 rounded-full opacity-30 blur-sm"></div>

            <div className="relative">
                {/* Logo with hover effect */}
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-brand-gold rounded-lg opacity-0 group-hover:opacity-75 blur transition duration-300" />
                  <img
                    src={Logo}
                    alt="PA Real Estate Support Services"
                    className="h-16 relative"
                  />
                </div>
              </div>

                <h2 className="glass-card-title text-2xl font-bold text-center mb-6 text-gray-800">Agent Login</h2>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Password field with better contrast */}
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-800 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                        className="bg-white/70 border-gray-300 focus:border-blue-400 text-gray-800 pr-10 shadow-sm"
                      required
                    />
                    <button
                      type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                  {/* Remember me checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                      className="border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label
                    htmlFor="rememberMe"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Remember me on this device
                  </label>
                </div>

                  {/* Error message */}
                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-200">
                    {error}
                  </div>
                )}

                  {/* Submit button */}
                <Button
                  type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <LogIn className="h-4 w-4" />
                      <span>Sign in</span>
                    </div>
                  )}
                </Button>
              </form>

                {/* Stats section with glass effect */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">Fast</p>
                    <p className="text-xs text-gray-600">Transaction Submission</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">Secure</p>
                    <p className="text-xs text-gray-600">Agent Portal Access</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          </div>
      </div>
    </GlobalPageHero>
  );
};

export default Login;
