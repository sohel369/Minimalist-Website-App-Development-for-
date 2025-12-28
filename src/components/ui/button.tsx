"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "destructive";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {

        // Base styles
        const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background";

        // Variants
        const variants = {
            primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
            secondary: "bg-white border border-input text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        };

        // Sizes
        const sizes = {
            sm: "h-9 px-3 text-xs",
            md: "h-11 px-6 text-sm",
            lg: "h-14 px-8 text-base",
        };

        return (
            <motion.button
                ref={ref}
                whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </motion.button>
        );
    }
);
Button.displayName = "Button";
