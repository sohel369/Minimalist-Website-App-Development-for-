"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/firebase";

export default function CompleteProfilePage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        // If not logged in after loading, redirect to login
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !user.uid) return;

        if (!name.trim()) {
            setError("Please enter your name");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const result = await updateUserProfile(user.uid, {
                displayName: name,
                email: email,
            });

            if (result.success) {
                // Force a reload or update context (Context updates automatically if we listen correctly, 
                // but we might need to trigger a refresh of profile data)
                router.push("/");
            } else {
                setError(result.error || "Failed to update profile");
            }
        } catch (err: any) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full grid place-items-center p-4 bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm"
            >
                <Card className="border-0 shadow-lg sm:border sm:shadow-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Complete your profile</CardTitle>
                        <CardDescription className="text-center">
                            Please provide your details to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium leading-none">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-9"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium leading-none">
                                    Email Address (Optional)
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs text-destructive text-center font-medium">
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isSubmitting}
                                disabled={!name || isSubmitting}
                            >
                                Continue <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
