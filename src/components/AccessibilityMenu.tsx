import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, ZoomIn, ZoomOut } from 'lucide-react';

const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle('high-contrast');
  };

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));

  React.useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <motion.button
        className="bg-primary text-white p-2 rounded-full shadow-lg"
        onClick={toggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        A11y
      </motion.button>
      {isOpen && (
        <motion.div
          className="absolute bottom-12 left-0 bg-white p-4 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <button onClick={toggleHighContrast} className="block mb-2">
            {highContrast ? <Sun /> : <Moon />} Toggle High Contrast
          </button>
          <div className="flex items-center mb-2">
            <button onClick={decreaseFontSize}><ZoomOut /></button>
            <span className="mx-2">Font Size</span>
            <button onClick={increaseFontSize}><ZoomIn /></button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AccessibilityMenu;