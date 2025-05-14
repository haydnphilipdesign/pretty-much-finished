import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './PageContainer.module.css';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
  noPadding?: boolean;
}

export function PageContainer({
  children,
  className,
  headerContent,
  footerContent,
  noPadding = false,
}: PageContainerProps) {
  return (
    <div className={cn(styles.pageContainer, className)}>
      <main className={styles.mainContent}>
        <div className={styles.formContainer}>
          {headerContent && (
            <div className={styles.formHeader}>
              {headerContent}
            </div>
          )}
          <div 
            className={cn(
              styles.formContent,
              noPadding && 'p-0'
            )}
          >
            {children}
          </div>
          {footerContent && (
            <div className={styles.formFooter}>
              {footerContent}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface FormSectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  seamless?: boolean;
}

export function FormSection({
  children,
  className,
  title,
  description,
  seamless = false,
}: FormSectionProps) {
  return (
    <div 
      className={cn(
        'py-4 border-b border-gray-200 dark:border-gray-700',
        seamless && styles.seamlessConnection,
        className
      )}
    >
      {title && (
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}

// This component specifically helps integrating the step wizard with the form
export function WizardContainer({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn(styles.wizardContainer, className)}>
      {children}
    </div>
  );
}