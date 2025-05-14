import React from 'react';
import { motion } from 'framer-motion';
import { useForm, UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';
import { useOptimizedAnimation } from '../hooks/useOptimizedAnimation';

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  validation?: {
    required?: string;
    pattern?: { value: RegExp; message: string };
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
  };
}

interface FormProps<T extends FieldValues> {
  fields: FormField[];
  onSubmit: (data: T) => void;
  isSubmitting?: boolean;
  submitText?: string;
  className?: string;
}

const Form = <T extends FieldValues>({
  fields,
  onSubmit,
  isSubmitting = false,
  submitText = 'Submit',
  className = ''
}: FormProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<T>();
  
  const { elementRef, animate, getTransitionConfig } = useOptimizedAnimation();

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: getTransitionConfig()
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: getTransitionConfig()
    }
  };

  const handleFormSubmit = async (data: T) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field: FormField) => {
    const validation: any = {
      required: field.required && (field.validation?.required || 'This field is required'),
      ...(field.validation?.pattern && { pattern: field.validation.pattern }),
      ...(field.validation?.minLength && { minLength: field.validation.minLength }),
      ...(field.validation?.maxLength && { maxLength: field.validation.maxLength })
    };

    return (
      <motion.div
        key={field.name}
        variants={fieldVariants}
        className="mb-4"
      >
        <label 
          htmlFor={field.name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {field.type === 'textarea' ? (
          <textarea
            id={field.name}
            {...register(field.name as any, validation)}
            placeholder={field.placeholder}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors[field.name] ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
            aria-invalid={errors[field.name] ? 'true' : 'false'}
          />
        ) : (
          <input
            id={field.name}
            type={field.type}
            {...register(field.name as any, validation)}
            placeholder={field.placeholder}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors[field.name] ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={errors[field.name] ? 'true' : 'false'}
          />
        )}
        
        {errors[field.name] && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {errors[field.name]?.message as string}
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <motion.form
      ref={elementRef}
      variants={formVariants}
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
      className={`space-y-4 ${className}`}
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
    >
      {fields.map(renderField)}
      
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          submitText
        )}
      </motion.button>
    </motion.form>
  );
};

const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    validation: {
      required: 'Name is required'
    }
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validation: {
      required: 'Email is required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Invalid email address'
      }
    }
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    validation: {
      required: 'Password is required',
      minLength: {
        value: 8,
        message: 'Password must be at least 8 characters long'
      }
    }
  }
];

const CustomForm = () => {
  const onSubmit = async (data: any) => {
    // Handle form submission
  };

  return (
    <Form
      fields={fields}
      onSubmit={onSubmit}
    />
  );
};

export default CustomForm;
