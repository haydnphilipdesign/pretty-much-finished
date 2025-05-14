import * as React from "react";
import { cn } from "../../lib/utils";
import { Input } from "./input";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: 'invalid' | 'warning' | 'valid' | null;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, state, ...props }, ref) => (
    <Input
      className={cn(
        className,
        state === 'invalid' && "border-red-500 focus-visible:ring-red-500",
        state === 'warning' && "border-yellow-500 focus-visible:ring-yellow-500",
        state === 'valid' && "border-green-500 focus-visible:ring-green-500"
      )}
      {...props}
      ref={ref}
    />
  )
);

FormInput.displayName = "FormInput";

export { FormInput };