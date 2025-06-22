<<<<<<< HEAD

=======
>>>>>>> noteai-suite/main
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
<<<<<<< HEAD
  ({ className, type, id, name, ...props }, ref) => {
    // Generate a unique ID if none provided and we have a name
    const inputId = id || (name ? `input-${name}` : undefined);
    
    return (
      <input
        type={type}
        id={inputId}
        name={name}
=======
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
>>>>>>> noteai-suite/main
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
