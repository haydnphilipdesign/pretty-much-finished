import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ShortcutItem {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  description: string;
  scope?: 'global' | 'form' | 'dashboard';
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutItem[];
}

/**
 * Modal component that displays available keyboard shortcuts
 */
const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  shortcuts
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Filter shortcuts by scope for better organization
  const globalShortcuts = shortcuts.filter(s => s.scope === 'global' || !s.scope);
  const formShortcuts = shortcuts.filter(s => s.scope === 'form');
  const dashboardShortcuts = shortcuts.filter(s => s.scope === 'dashboard');
  
  // Focus trap for accessibility
  useEffect(() => {
    if (!isOpen) return;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        // If shift + tab and on first element, wrap to last
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } 
        // If tab and on last element, wrap to first
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    // Focus first element when modal opens
    const focusFirst = () => {
      if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
    };
    
    // Save previous focus to restore when closing
    const previousFocus = document.activeElement as HTMLElement;
    
    window.addEventListener('keydown', handleTabKey);
    setTimeout(focusFirst, 100); // Small delay to ensure DOM is ready
    
    return () => {
      window.removeEventListener('keydown', handleTabKey);
      if (previousFocus) previousFocus.focus();
    };
  }, [isOpen]);
  
  // Format key combination for display
  const formatKey = (shortcut: ShortcutItem) => {
    const parts = [];
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.metaKey) parts.push('⌘');
    
    // Format special keys
    let key = shortcut.key;
    if (key === 'ArrowLeft') key = '←';
    if (key === 'ArrowRight') key = '→';
    if (key === 'ArrowUp') key = '↑';
    if (key === 'ArrowDown') key = '↓';
    if (key === 'Escape') key = 'Esc';
    
    parts.push(key);
    
    return parts.map(part => (
      <span key={part} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-medium mx-0.5">
        {part}
      </span>
    ));
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300
            }}
            className="relative z-10 bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 
                  id="shortcuts-title" 
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-8">
                {/* Global shortcuts section */}
                {globalShortcuts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      Global Shortcuts
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {globalShortcuts.map((shortcut, index) => (
                          <div 
                            key={`global-${index}`}
                            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <span className="text-gray-700 dark:text-gray-300">
                              {shortcut.description}
                            </span>
                            <div className="flex items-center space-x-1">
                              {formatKey(shortcut)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Form shortcuts section */}
                {formShortcuts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      Form Shortcuts
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {formShortcuts.map((shortcut, index) => (
                          <div 
                            key={`form-${index}`}
                            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <span className="text-gray-700 dark:text-gray-300">
                              {shortcut.description}
                            </span>
                            <div className="flex items-center space-x-1">
                              {formatKey(shortcut)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Dashboard shortcuts section */}
                {dashboardShortcuts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      Dashboard Shortcuts
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {dashboardShortcuts.map((shortcut, index) => (
                          <div 
                            key={`dashboard-${index}`}
                            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <span className="text-gray-700 dark:text-gray-300">
                              {shortcut.description}
                            </span>
                            <div className="flex items-center space-x-1">
                              {formatKey(shortcut)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Press <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-medium mx-1">Shift</span> + <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-medium mx-1">?</span> at any time to show this dialog.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsModal;
