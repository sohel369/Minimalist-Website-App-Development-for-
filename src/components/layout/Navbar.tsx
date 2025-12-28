"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "My Requests", href: "/requests" },
    { name: "Support", href: "/support" },
];

export function Navbar() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    const handleSignOut = async () => {
        await signOut();
        router.push("/welcome");
    };

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getInitials = () => {
        if (user?.displayName) {
            return user.displayName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
        }
        return "U";
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                isScrolled
                    ? "bg-white/80 backdrop-blur-md border-neutral-200 shadow-sm"
                    : "bg-white/0 border-transparent"
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                            S
                        </div>
                        <span className="font-semibold text-lg tracking-tight text-neutral-900">
                            ServiceApp
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-neutral-500 hover:text-emerald-600 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <button className="text-neutral-400 hover:text-neutral-900 transition-colors relative group">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-0.5 right-0.5 h-2 w-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                                </button>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="h-9 w-9 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-700 font-medium text-xs ring-2 ring-transparent hover:ring-emerald-50 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                    >
                                        {getInitials()}
                                    </button>

                                    {/* Simple Dropdown */}
                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-100 py-1 overflow-hidden"
                                            >
                                                <div className="px-4 py-2 border-b border-neutral-50">
                                                    <p className="text-sm font-medium text-neutral-900 truncate">
                                                        {user.displayName || "User"}
                                                    </p>
                                                    <p className="text-xs text-neutral-500 truncate">
                                                        {user.phoneNumber}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        handleSignOut();
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-50 transition-colors"
                                                >
                                                    Sign Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="px-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-neutral-200 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block text-base font-medium text-neutral-900 py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-neutral-100">
                                {user ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 font-medium text-sm">
                                                {getInitials()}
                                            </div>
                                            <div className="text-sm font-medium text-neutral-900">
                                                {user.displayName || user.phoneNumber}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSignOut()}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            Sign Out
                                        </Button>
                                    </div>
                                ) : (
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                                            Login / Sign Up
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
