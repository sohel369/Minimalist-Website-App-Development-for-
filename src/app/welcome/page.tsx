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
    Zap,
    Sparkles,
    Phone,
    Menu,
    X
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
    { icon: "🔧", name: "Plumbing" },
    { icon: "⚡", name: "Electrical" },
    { icon: "❄️", name: "AC & Cooling" },
    { icon: "🏠", name: "Home Repairs" },
    { icon: "🧹", name: "Cleaning" },
    { icon: "🎨", name: "Painting" },
];

export default function WelcomePage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base sm:text-lg">
                                S
                            </div>
                            <span className="font-semibold text-base sm:text-lg tracking-tight text-neutral-900">
                                ServiceApp
                            </span>
                        </div>

                        {/* Desktop Button */}
                        <Link href="/login" className="hidden sm:block">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Phone className="h-4 w-4 mr-2" />
                                Login / Sign Up
                            </Button>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="sm:hidden p-2 -mr-2 text-neutral-600"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="sm:hidden py-4 border-t border-neutral-100">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Login / Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                                #1 Trusted Home Services Platform
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-4 sm:mb-6"
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
                            className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-6 sm:mb-10 px-2"
                        >
                            Connect with verified professionals for all your home maintenance needs.
                            Fast, reliable, and backed by our 100% satisfaction guarantee.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col items-center gap-4 sm:gap-6"
                        >
                            <Link href="/login" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg rounded-xl shadow-lg shadow-emerald-200">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2 text-neutral-600">
                                <div className="flex -space-x-2">
                                    {["👨", "👩", "👨‍🦱", "👩‍🦰"].map((emoji, i) => (
                                        <div key={i} className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center text-xs sm:text-sm">
                                            {emoji}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-xs sm:text-sm">
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
                        className="mt-12 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6"
                    >
                        {[
                            { value: "50K+", label: "Customers" },
                            { value: "4.9★", label: "Rating" },
                            { value: "2K+", label: "Professionals" },
                            { value: "24/7", label: "Support" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-sm border border-neutral-100">
                                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600 mb-0.5 sm:mb-1">{stat.value}</div>
                                <div className="text-xs sm:text-sm text-neutral-500">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-12 sm:py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2 sm:mb-4">Our Services</h2>
                        <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto px-4">
                            From small repairs to major installations, we've got you covered.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4">
                        {services.map((service, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="group relative p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-neutral-50 hover:bg-white hover:shadow-lg transition-all duration-300 text-center cursor-pointer border border-transparent hover:border-neutral-200"
                            >
                                <div className="text-2xl sm:text-4xl mb-1 sm:mb-3 group-hover:scale-110 transition-transform">
                                    {service.icon}
                                </div>
                                <div className="text-xs sm:text-sm md:text-base font-medium text-neutral-900">{service.name}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 sm:py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2 sm:mb-4">Why Choose Us?</h2>
                        <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto px-4">
                            We're committed to providing the best experience for your home.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-sm border border-neutral-100 hover:shadow-md transition-shadow"
                            >
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 sm:mb-4">
                                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <h3 className="font-semibold text-neutral-900 mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h3>
                                <p className="text-xs sm:text-sm text-neutral-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-6 sm:p-10 md:p-16 text-center overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

                        <div className="relative z-10">
                            <Zap className="h-8 w-8 sm:h-12 sm:w-12 text-white/80 mx-auto mb-4 sm:mb-6" />
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-emerald-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-xl mx-auto px-2">
                                Join thousands of happy customers who trust us with their home services.
                            </p>
                            <Link href="/login" className="inline-block w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto bg-white text-emerald-600 hover:bg-emerald-50 px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg rounded-xl shadow-lg">
                                    <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    Sign Up with Phone
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 sm:py-10 px-4 border-t border-neutral-100">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-5 sm:h-6 sm:w-6 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] sm:text-xs">
                                S
                            </div>
                            <span className="font-medium text-sm sm:text-base text-neutral-900">ServiceApp</span>
                        </div>
                        <div className="text-xs sm:text-sm text-neutral-500 text-center">
                            © 2025 ServiceApp. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
