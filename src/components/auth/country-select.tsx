"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Country {
    code: string;
    name: string;
    flag: string;
    dialCode: string;
}




const countries: Country[] = [
    { code: "BD", name: "Bangladesh", flag: "🇧🇩", dialCode: "+880" },
    { code: "AE", name: "UAE", flag: "🇦🇪", dialCode: "+971" },
    { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", dialCode: "+966" },
    { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
    { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91" },
    { code: "PK", name: "Pakistan", flag: "🇵🇰", dialCode: "+92" },
    { code: "EG", name: "Egypt", flag: "🇪🇬", dialCode: "+20" },
    { code: "KW", name: "Kuwait", flag: "🇰🇼", dialCode: "+965" },
    { code: "QA", name: "Qatar", flag: "🇶🇦", dialCode: "+974" },
    { code: "BH", name: "Bahrain", flag: "🇧🇭", dialCode: "+973" },
    { code: "OM", name: "Oman", flag: "🇴🇲", dialCode: "+968" },
    { code: "JO", name: "Jordan", flag: "🇯🇴", dialCode: "+962" },
    { code: "LB", name: "Lebanon", flag: "🇱🇧", dialCode: "+961" },
];

interface CountrySelectProps {
    disabled?: boolean;
    value?: string;
    onChange?: (dialCode: string) => void;
}

export function CountrySelect({ disabled, value = "+880", onChange }: CountrySelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedCountry, setSelectedCountry] = React.useState<Country>(
        countries.find(c => c.dialCode === value) || countries[0]
    );
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (country: Country) => {
        setSelectedCountry(country);
        onChange?.(country.dialCode);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "inline-flex items-center px-3 h-10 rounded-l-lg border border-r-0 border-input bg-muted/50 text-muted-foreground text-sm transition-colors",
                    "hover:bg-muted hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
                    "disabled:pointer-events-none disabled:opacity-50"
                )}
            >
                <span className="mr-2 text-base">{selectedCountry.flag}</span>
                <span className="font-medium">{selectedCountry.dialCode}</span>
                <ChevronDown className={cn(
                    "ml-1 h-3 w-3 opacity-50 transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-1 z-50 w-56 bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden"
                    >
                        <div className="max-h-64 overflow-y-auto py-1">
                            {countries.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => handleSelect(country)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-neutral-50 transition-colors",
                                        selectedCountry.code === country.code && "bg-primary/5"
                                    )}
                                >
                                    <span className="text-lg">{country.flag}</span>
                                    <span className="flex-1 text-left font-medium text-neutral-900">
                                        {country.name}
                                    </span>
                                    <span className="text-neutral-500">{country.dialCode}</span>
                                    {selectedCountry.code === country.code && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
