"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    disabled?: boolean;
}

export function OTPInput({ length = 6, onComplete, disabled }: OTPInputProps) {
    const [otp, setOtp] = React.useState<string[]>(new Array(length).fill(""));
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    // Auto-focus first input
    React.useEffect(() => {
        if (!disabled && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [disabled]);

    const focusInput = (index: number) => {
        const target = inputRefs.current[index];
        if (target) {
            target.focus();
            target.setSelectionRange(1, 1);
        }
    };

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        // Take the last character if multiple entered
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === length && !newOtp.includes("")) {
            onComplete(combinedOtp);
        }

        // Advance focus
        if (value && index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            focusInput(index - 1);
        }
        if (e.key === "ArrowLeft" && index > 0) {
            e.preventDefault();
            focusInput(index - 1);
        }
        if (e.key === "ArrowRight" && index < length - 1) {
            e.preventDefault();
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, length);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split("").forEach((char, i) => {
            newOtp[i] = char;
        });
        setOtp(newOtp);

        const combined = newOtp.join("");
        if (combined.length === length) onComplete(combined);

        const focusIndex = Math.min(pastedData.length, length - 1);
        focusInput(focusIndex);
    };

    return (
        <div className="flex gap-2 justify-center w-full">
            {otp.map((digit, index) => (
                <React.Fragment key={index}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <input
                            ref={(el) => { inputRefs.current[index] = el }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            disabled={disabled}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className={cn(
                                "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-lg border bg-background transition-all duration-200 outline-none caret-primary",
                                "focus:border-primary focus:ring-4 focus:ring-primary/10",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                digit ? "border-primary text-foreground" : "border-input text-muted-foreground"
                            )}
                        />
                    </motion.div>
                    {index === 2 && length === 6 && (
                        <div className="flex items-center justify-center">
                            <div className="w-2 h-0.5 bg-border rounded-full" />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
