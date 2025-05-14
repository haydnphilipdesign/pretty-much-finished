import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './PageContainer.module.css';
import { useResponsive } from './useResponsive';
import './responsive.css'; // Import responsive styles

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
  noPadding?: boolean;
  disableResponsive?: boolean;
}

export function ResponsiveContainer({
  children,
  className,
  headerContent,
  footerContent,
  noPadding = false,
  disableResponsive = false,
}: ResponsiveContainerProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  // Apply responsive classes based on screen size
  const containerClasses = cn(
    styles.pageContainer,
    'transaction-container',
    'transition-responsive',
    isMobile && 'mobile-container',
    isTablet && 'tablet-container',
    isDesktop && 'desktop-container',
    className
  );

  const contentClasses = cn(
    styles.formContent,
    'form-content',
    noPadding && 'p-0',
    isMobile && 'safe-area-insets'
  );
  
  const headerClasses = cn(
    styles.formHeader,
    'form-header',
    isMobile && 'mobile-header',
    isTablet && 'tablet-header',
    isDesktop && 'desktop-header'
  );
  
  return (
    <div className={containerClasses}>
      <main className={cn(styles.mainContent, 'main-content')}>
        <div className={cn(styles.formContainer, 'form-container')}>
          {headerContent && (
            <div className={headerClasses}>
              {headerContent}
            </div>
          )}
          <div className={contentClasses}>
            {children}
          </div>
          {footerContent && (
            <div className={cn(styles.formFooter, 'form-footer')}>
              {footerContent}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Responsive version of the WizardContainer
export function ResponsiveWizardContainer({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  const { isMobile } = useResponsive();
  
  return (
    <div className={cn(
      styles.wizardContainer,
      'wizard-container',
      'step-wizard-container',
      isMobile ? 'mobile-wizard' : 'desktop-wizard',
      className
    )}>
      {children}
    </div>
  );
}