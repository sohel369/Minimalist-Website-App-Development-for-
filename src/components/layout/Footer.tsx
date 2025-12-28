"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Shield,
    Clock,
    HeartHandshake
} from "lucide-react";

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const quickLinks = [
    { label: "About", href: "#" },
    { label: "Services", href: "#" },
    { label: "Support", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
];

const trustBadges = [
    { icon: Shield, label: "Verified" },
    { icon: Clock, label: "24/7" },
    { icon: HeartHandshake, label: "Guaranteed" },
];

export function Footer() {
    return (
        <footer className="bg-white border-t border-neutral-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Row */}
                <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-neutral-100">
                    {/* Brand */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-md">
                                <span className="text-white font-bold">S</span>
                            </div>
                            <span className="text-lg font-bold text-slate-900">ServiceApp</span>
                        </Link>

                        {/* Trust Badges - Desktop */}
                        <div className="hidden lg:flex items-center gap-4 pl-8 border-l border-neutral-200">
                            {trustBadges.map((badge) => (
                                <div key={badge.label} className="flex items-center gap-1.5 text-neutral-500">
                                    <badge.icon className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-xs font-medium">{badge.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm text-neutral-500 hover:text-slate-900 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Social Links */}
                    <div className="flex items-center gap-2">
                        {socialLinks.map((social) => (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                aria-label={social.label}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-9 w-9 rounded-lg bg-neutral-100 hover:bg-primary/10 border border-neutral-200 hover:border-primary/30 flex items-center justify-center text-neutral-500 hover:text-primary transition-all"
                            >
                                <social.icon className="h-4 w-4" />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Copyright Row */}
                <div className="py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-neutral-400 text-xs">
                        © {new Date().getFullYear()} ServiceApp Inc. All rights reserved.
                    </p>
                    <p className="text-neutral-400 text-xs">
                        Made with ❤️ for premium home services
                    </p>
                </div>
            </div>
        </footer>
    );
}
