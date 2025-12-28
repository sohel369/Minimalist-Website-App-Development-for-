"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    actionText: string;
    href?: string;
    onClick?: () => void;
    className?: string;
}

export function ActionCard({ title: Title, description, icon: Icon, actionText, href, onClick, className }: ActionCardProps) {
    const content = (
        <>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="h-24 w-24 -mr-8 -mt-8" />
            </div>

            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-neutral-100 text-neutral-900 mb-3 sm:mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-1 sm:mb-2">{Title}</h3>
            <p className="text-xs sm:text-sm text-neutral-500 mb-4 sm:mb-6 leading-relaxed line-clamp-2">
                {description}
            </p>

            <div className="flex items-center text-xs sm:text-sm font-medium text-primary mt-auto">
                {actionText} <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
            </div>
        </>
    );

    const cardClasses = cn(
        "group relative overflow-hidden rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer block",
        className
    );

    if (href) {
        return (
            <Link href={href}>
                <motion.div
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={cardClasses}
                >
                    {content}
                </motion.div>
            </Link>
        );
    }

    return (
        <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cardClasses}
            onClick={onClick}
        >
            {content}
        </motion.div>
    );
}
