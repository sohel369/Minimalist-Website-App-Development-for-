"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const highlights = [
    {
        icon: Clock,
        title: "Instant Booking",
        description: "Verified professionals ready to help.",
        gradient: "from-emerald-500/5 to-teal-500/5",
        iconColor: "text-emerald-600",
    },
    {
        icon: ShieldCheck,
        title: "Vetted Experts",
        description: "Strict background checks & skills verification.",
        gradient: "from-emerald-500/5 to-teal-500/5",
        iconColor: "text-emerald-600",
    },
    {
        icon: RefreshCw,
        title: "Live Tracking",
        description: "Real-time updates status at every step.",
        gradient: "from-emerald-500/5 to-teal-500/5",
        iconColor: "text-emerald-600",
    },
    {
        icon: Zap,
        title: "Bank-Grade Security",
        description: "Your data is protected by latest encryption.",
        gradient: "from-emerald-500/5 to-teal-500/5",
        iconColor: "text-emerald-600",
    },
];

export function ServiceHighlights() {
    return (
        <section className="py-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-neutral-50/50 -z-10" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {highlights.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -5 }}
                                className="group relative bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                {/* Hover Gradient Background */}
                                <div
                                    className={cn(
                                        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br pointer-events-none",
                                        item.gradient
                                    )}
                                />

                                <div className="relative z-10">
                                    <div className={cn(
                                        "h-12 w-12 rounded-xl mb-4 flex items-center justify-center transition-colors duration-300 bg-neutral-50 group-hover:bg-white/80",
                                        item.iconColor
                                    )}>
                                        <Icon className="h-6 w-6" />
                                    </div>

                                    <h4 className="text-base font-bold text-neutral-900 mb-2 group-hover:text-neutral-800 transition-colors">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-neutral-500 leading-relaxed group-hover:text-neutral-600 transition-colors">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
