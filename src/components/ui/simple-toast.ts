// A simple toast utility for the application
type ToastVariant = 'default' | 'destructive' | 'success';

export interface SimpleToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

// Export a simplified toast function
export const toast = (props: SimpleToastProps) => {
  const { title, description, variant = 'default', duration = 3000 } = props;
  
  // Create toast element
  const toastEl = document.createElement('div');
  toastEl.className = `fixed top-4 right-4 p-4 rounded-md shadow-md max-w-sm z-50 transform transition-transform duration-300 ease-in-out translate-y-0`;
  
  // Set background color based on variant
  switch (variant) {
    case 'destructive':
      toastEl.classList.add('bg-red-600', 'text-white');
      break;
    case 'success':
      toastEl.classList.add('bg-green-600', 'text-white');
      break;
    default:
      toastEl.classList.add('bg-white', 'text-gray-900', 'border', 'border-gray-200');
  }
  
  // Create toast content
  toastEl.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-1">
        <h3 class="font-medium ${variant === 'default' ? 'text-gray-900' : 'text-white'} text-sm">${title}</h3>
        ${description ? `<p class="mt-1 ${variant === 'default' ? 'text-gray-700' : 'text-white/90'} text-sm">${description}</p>` : ''}
      </div>
      <button class="text-sm ${variant === 'default' ? 'text-gray-500 hover:text-gray-900' : 'text-white/80 hover:text-white'} transition-colors">
        ✕
      </button>
    </div>
  `;
  
  document.body.appendChild(toastEl);
  
  // Add animation
  setTimeout(() => {
    toastEl.classList.add('translate-y-0');
    toastEl.classList.remove('-translate-y-4', 'opacity-0');
  }, 10);
  
  // Add click handler to close button
  const closeBtn = toastEl.querySelector('button');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      removeToast();
    });
  }
  
  // Function to remove the toast
  const removeToast = () => {
    toastEl.classList.add('translate-y-full', 'opacity-0');
    setTimeout(() => {
      if (document.body.contains(toastEl)) {
        document.body.removeChild(toastEl);
      }
    }, 300);
  };
  
  // Auto remove after duration
  setTimeout(removeToast, duration);
  
  // Return functions to control the toast
  return {
    id: Math.random().toString(36).substring(2, 9),
    dismiss: removeToast,
  };
}; 