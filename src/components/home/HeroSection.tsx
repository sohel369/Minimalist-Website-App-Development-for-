"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Users, CheckCircle2, Zap } from "lucide-react";

const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "4.9", label: "Rating", icon: Star },
    { value: "24/7", label: "Support" },
];

const features = [
    "Licensed & Insured Professionals",
    "Same-Day Service Available",
    "100% Satisfaction Guarantee",
];

export function HeroSection() {
    return (
        <section className="relative py-16 lg:py-24 overflow-hidden bg-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-60 animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl opacity-40" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 px-4 py-2 mb-8"
                        >
                            <Zap className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                                #1 Home Services Platform
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                            Premium Home Services{" "}
                            <span className="relative">
                                <span className="bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent">
                                    At Your Fingertips
                                </span>
                                <motion.svg
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 200 8"
                                    fill="none"
                                >
                                    <motion.path
                                        d="M2 6C50 2 150 2 198 6"
                                        stroke="url(#gradient)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.8, duration: 0.6 }}
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0">
                                            <stop offset="0%" stopColor="rgb(var(--primary))" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </motion.svg>
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-neutral-600 mb-8 max-w-lg leading-relaxed">
                            Connect with verified professionals for all your home maintenance needs.
                            Fast, reliable, and backed by our satisfaction guarantee.
                        </p>

                        {/* Features List */}
                        <div className="flex flex-wrap gap-4 mb-10">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="flex items-center gap-2 text-sm text-neutral-600"
                                >
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span>{feature}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-primary/40"
                            >
                                <span className="relative z-10 flex items-center">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-primary opacity-0 transition-opacity group-hover:opacity-100" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-3 rounded-2xl border-2 border-neutral-200 bg-white px-6 py-4 text-base font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-neutral-50"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Play className="h-4 w-4 text-primary ml-0.5" fill="currentColor" />
                                </div>
                                Watch Demo
                            </motion.button>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                                        {stat.icon && <stat.icon className="h-5 w-5 text-amber-400 fill-amber-400" />}
                                    </div>
                                    <span className="text-sm text-neutral-500">{stat.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Content - Visual Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative hidden lg:block"
                    >
                        {/* Main Card */}
                        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl">
                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-neutral-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Service Completed</p>
                                        <p className="text-xs text-neutral-500">Just now</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                                className="absolute -bottom-4 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-neutral-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-violet-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                                                {String.fromCharCode(64 + i)}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">+2.5k</p>
                                        <p className="text-xs text-neutral-500">Active pros</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Card Content */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">Dashboard</p>
                                            <p className="text-white/60 text-sm">Service overview</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                </div>

                                {/* Progress Bars */}
                                <div className="space-y-4">
                                    {[
                                        { label: "Active Services", value: 85, color: "from-emerald-400 to-emerald-600" },
                                        { label: "Customer Satisfaction", value: 98, color: "from-primary to-violet-500" },
                                        { label: "Response Time", value: 92, color: "from-amber-400 to-orange-500" },
                                    ].map((item) => (
                                        <div key={item.label}>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-white/80">{item.label}</span>
                                                <span className="text-white font-semibold">{item.value}%</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.value}%` }}
                                                    transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                                                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom Stats */}
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                                    {[
                                        { value: "156", label: "Bookings" },
                                        { value: "42", label: "Completed" },
                                        { value: "8", label: "In Progress" },
                                    ].map((stat) => (
                                        <div key={stat.label} className="text-center">
                                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                                            <p className="text-xs text-white/60">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
