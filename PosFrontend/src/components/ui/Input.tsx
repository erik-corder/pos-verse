import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-N-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-B-200 focus:border-B-500 transition-colors",
            error ? "border-R-500" : "border-N-300",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-R-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-N-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
