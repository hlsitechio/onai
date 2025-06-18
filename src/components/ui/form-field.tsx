
import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export interface FormFieldProps {
  label: string;
  id?: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  component?: 'input' | 'textarea';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ 
    label, 
    id, 
    name, 
    type = "text", 
    placeholder, 
    required, 
    className, 
    error, 
    component = 'input',
    value,
    onChange,
    ...props 
  }, ref) => {
    // Generate a unique ID if none provided
    const fieldId = id || `field-${name}-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor={fieldId} className={required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}>
          {label}
        </Label>
        {component === 'textarea' ? (
          <Textarea
            id={fieldId}
            name={name}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
            {...props}
          />
        ) : (
          <Input
            type={type}
            id={fieldId}
            name={name}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            ref={ref as React.Ref<HTMLInputElement>}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
            {...props}
          />
        )}
        {error && (
          <p id={`${fieldId}-error`} className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
FormField.displayName = "FormField"

export { FormField }
