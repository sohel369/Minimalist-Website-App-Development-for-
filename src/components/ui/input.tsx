"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => {
        return (
            <motion.div
                initial={false}
                animate={error ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative w-full"
            >
                <input
                    type={type}
                    className={cn(
                        "flex h-12 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </motion.div>
        );
    }
);
Input.displayName = "Input";
