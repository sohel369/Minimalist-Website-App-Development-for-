"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Shield,
    Clock,
    Star,
    CheckCircle2,
    Wrench,
    Zap,
    Sparkles,
    Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
    {
        icon: Shield,
        title: "Verified Professionals",
        description: "All technicians are background-checked and certified.",
    },
    {
        icon: Clock,
        title: "Same-Day Service",
        description: "Book now and get service within hours, not days.",
    },
    {
        icon: Star,
        title: "5-Star Quality",
        description: "Rated excellent by over 50,000 happy customers.",
    },
    {
        icon: CheckCircle2,
        title: "Satisfaction Guarantee",
        description: "Not happy? We'll make it right or refund you.",
    },
];

const services = [
    { icon: "🔧", name: "Plumbing", color: "from-blue-500 to-cyan-500" },
    { icon: "⚡", name: "Electrical", color: "from-yellow-500 to-orange-500" },
    { icon: "❄️", name: "AC & Cooling", color: "from-cyan-500 to-blue-500" },
    { icon: "🏠", name: "Home Repairs", color: "from-emerald-500 to-teal-500" },
    { icon: "🧹", name: "Cleaning", color: "from-purple-500 to-pink-500" },
    { icon: "🎨", name: "Painting", color: "from-rose-500 to-red-500" },
];

export default function WelcomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                                S
                            </div>
                            <span className="font-semibold text-lg tracking-tight text-neutral-900">
                                ServiceApp
                            </span>
                        </div>
                        <Link href="/login">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Phone className="h-4 w-4 mr-2" />
                                Login / Sign Up
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                                <Sparkles className="h-4 w-4" />
                                #1 Trusted Home Services Platform
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6"
                        >
                            Expert Home Services
                            <br />
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                                At Your Fingertips
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10"
                        >
                            Connect with verified professionals for all your home maintenance needs.
                            Fast, reliable, and backed by our 100% satisfaction guarantee.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link href="/login">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-14 text-lg rounded-xl shadow-lg shadow-emerald-200">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2 text-neutral-600">
                                <div className="flex -space-x-2">
                                    {["👨", "👩", "👨‍🦱", "👩‍🦰"].map((emoji, i) => (
                                        <div key={i} className="h-8 w-8 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center text-sm">
                                            {emoji}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm">
                                    <strong className="text-neutral-900">50K+</strong> Happy Customers
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {[
                            { value: "50K+", label: "Customers" },
                            { value: "4.9★", label: "Rating" },
                            { value: "2K+", label: "Professionals" },
                            { value: "24/7", label: "Support" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-6 rounded-2xl bg-white shadow-sm border border-neutral-100">
                                <div className="text-3xl font-bold text-emerald-600 mb-1">{stat.value}</div>
                                <div className="text-sm text-neutral-500">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Services</h2>
                        <p className="text-neutral-600 max-w-xl mx-auto">
                            From small repairs to major installations, we've got you covered.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {services.map((service, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="group relative p-6 rounded-2xl bg-neutral-50 hover:bg-white hover:shadow-lg transition-all duration-300 text-center cursor-pointer border border-transparent hover:border-neutral-200"
                            >
                                <div className={`text-4xl mb-3 group-hover:scale-110 transition-transform`}>
                                    {service.icon}
                                </div>
                                <div className="font-medium text-neutral-900">{service.name}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why Choose Us?</h2>
                        <p className="text-neutral-600 max-w-xl mx-auto">
                            We're committed to providing the best experience for your home.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="p-6 rounded-2xl bg-white shadow-sm border border-neutral-100 hover:shadow-md transition-shadow"
                            >
                                <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-neutral-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-10 sm:p-16 text-center overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

                        <div className="relative z-10">
                            <Zap className="h-12 w-12 text-white/80 mx-auto mb-6" />
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
                                Join thousands of happy customers who trust us with their home services.
                            </p>
                            <Link href="/login">
                                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 h-14 text-lg rounded-xl shadow-lg">
                                    <Phone className="mr-2 h-5 w-5" />
                                    Sign Up with Phone
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 px-4 border-t border-neutral-100">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                                S
                            </div>
                            <span className="font-medium text-neutral-900">ServiceApp</span>
                        </div>
                        <div className="text-sm text-neutral-500">
                            © 2025 ServiceApp. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
