import React from 'react';

interface SkipToContentProps {
  /**
   * ID of the main content section to skip to
   * @default "main-content"
   */
  contentId?: string;
  
  /**
   * Custom text for the skip link
   * @default "Skip to main content"
   */
  text?: string;
  
  /**
   * Additional CSS class to apply to the skip link
   */
  className?: string;
}

/**
 * SkipToContent component - An accessibility feature that allows keyboard users
 * to bypass navigation and jump directly to the main content.
 * The link becomes visible only when focused, typically by pressing Tab when the page loads.
 */
const SkipToContent: React.FC<SkipToContentProps> = ({
  contentId = "main-content",
  text = "Skip to main content",
  className = ""
}) => {
  return (
    <a 
      href={`#${contentId}`}
      className={`skip-link ${className}`}
      data-testid="skip-to-content"
    >
      {text}
    </a>
  );
};

export default SkipToContent;
