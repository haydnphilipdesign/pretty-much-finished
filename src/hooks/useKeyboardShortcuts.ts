import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShortcutConfig {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  scope?: 'global' | 'form' | 'dashboard';
}

/**
 * Hook for managing keyboard shortcuts throughout the application
 * @param additionalShortcuts - Custom shortcuts for specific pages
 * @param scope - Scope for which shortcuts should be active
 */
const useKeyboardShortcuts = (
  additionalShortcuts: ShortcutConfig[] = [],
  scope: 'global' | 'form' | 'dashboard' = 'global'
) => {
  const navigate = useNavigate();
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  
  // Define global shortcuts
  const globalShortcuts: ShortcutConfig[] = [
    {
      key: '?',
      shiftKey: true,
      action: () => setShowShortcutsModal(true),
      description: 'Show keyboard shortcuts',
      scope: 'global'
    },
    {
      key: 'Escape',
      action: () => setShowShortcutsModal(false),
      description: 'Close modal',
      scope: 'global'
    },
    {
      key: 'h',
      altKey: true,
      action: () => navigate('/'),
      description: 'Go to home page',
      scope: 'global'
    },
    {
      key: 'a',
      altKey: true,
      action: () => navigate('/agent-portal'),
      description: 'Go to agent portal',
      scope: 'global'
    },
    {
      key: 't',
      altKey: true,
      action: () => navigate('/agent-portal/transaction'),
      description: 'Start new transaction',
      scope: 'global'
    },
    {
      key: 'd',
      altKey: true,
      action: () => {
        // Toggle dark mode
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        if (isDarkMode) {
          document.documentElement.classList.remove('dark-mode');
          localStorage.setItem('theme', 'light');
        } else {
          document.documentElement.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
        }
      },
      description: 'Toggle dark mode',
      scope: 'global'
    }
  ];
  
  // Form-specific shortcuts
  const formShortcuts: ShortcutConfig[] = [
    {
      key: 's',
      ctrlKey: true,
      action: () => {
        // Dispatch a custom event that the form can listen to for saving drafts
        const saveEvent = new CustomEvent('save-draft');
        document.dispatchEvent(saveEvent);
      },
      description: 'Save form draft',
      scope: 'form'
    },
    {
      key: 'ArrowRight',
      altKey: true,
      action: () => {
        // Next step in form
        const nextButton = document.querySelector('[data-action="next-step"]') as HTMLButtonElement;
        if (nextButton && !nextButton.disabled) {
          nextButton.click();
        }
      },
      description: 'Next step',
      scope: 'form'
    },
    {
      key: 'ArrowLeft',
      altKey: true,
      action: () => {
        // Previous step in form
        const prevButton = document.querySelector('[data-action="prev-step"]') as HTMLButtonElement;
        if (prevButton && !prevButton.disabled) {
          prevButton.click();
        }
      },
      description: 'Previous step',
      scope: 'form'
    }
  ];
  
  // Dashboard-specific shortcuts
  const dashboardShortcuts: ShortcutConfig[] = [
    {
      key: 'n',
      altKey: true,
      action: () => navigate('/agent-portal/transaction'),
      description: 'New transaction',
      scope: 'dashboard'
    },
    {
      key: 'r',
      altKey: true,
      action: () => {
        // Refresh data
        window.location.reload();
      },
      description: 'Refresh data',
      scope: 'dashboard'
    }
  ];
  
  // Merge shortcuts based on scope
  const allShortcuts = [
    ...globalShortcuts,
    ...(scope === 'form' ? formShortcuts : []),
    ...(scope === 'dashboard' ? dashboardShortcuts : []),
    ...additionalShortcuts.filter(s => !s.scope || s.scope === scope)
  ];
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip shortcuts when user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement).tagName)) {
        return;
      }
      
      // Find matching shortcut
      const matchingShortcut = allShortcuts.find(shortcut => {
        return shortcut.key === event.key &&
          (shortcut.altKey === undefined || shortcut.altKey === event.altKey) &&
          (shortcut.ctrlKey === undefined || shortcut.ctrlKey === event.ctrlKey) &&
          (shortcut.shiftKey === undefined || shortcut.shiftKey === event.shiftKey) &&
          (shortcut.metaKey === undefined || shortcut.metaKey === event.metaKey);
      });
      
      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };
    
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [allShortcuts, navigate]);
  
  const closeShortcutsModal = () => setShowShortcutsModal(false);
  
  // Return components and state for rendering the shortcuts modal
  return {
    showShortcutsModal,
    setShowShortcutsModal,
    closeShortcutsModal,
    shortcuts: allShortcuts
  };
};

export default useKeyboardShortcuts;
