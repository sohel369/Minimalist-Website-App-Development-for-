"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    actionText: string;
    onClick?: () => void;
    className?: string;
}

export function ActionCard({ title: Title, description, icon: Icon, actionText, onClick, className }: ActionCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="h-24 w-24 -mr-8 -mt-8" />
            </div>

            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-100 text-neutral-900 mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Icon className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-semibold text-neutral-900 mb-2">{Title}</h3>
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed line-clamp-2">
                {description}
            </p>

            <div className="flex items-center text-sm font-medium text-primary mt-auto">
                {actionText} <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
        </motion.div>
    );
}
