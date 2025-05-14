import * as React from "react"

import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg bg-white px-4 py-2",
          "text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a8a]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-2 border-gray-200",
          "hover:border-[#1e3a8a]/30 focus:border-[#1e3a8a] transition-all duration-200",
          "hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
