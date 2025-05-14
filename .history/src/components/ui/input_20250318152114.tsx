import * as React from "react"

import { cn } from "@/lib/utils"

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "text-base md:text-sm",
          "touch-manipulation",
          "appearance-none",
          props.disabled && "cursor-not-allowed opacity-50",
          className
        )}
        inputMode={type === 'number' ? 'decimal' : type === 'email' ? 'email' : 'text'}
        autoCapitalize={type === 'email' ? 'off' : 'sentences'}
        autoCorrect={type === 'email' ? 'off' : 'on'}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
