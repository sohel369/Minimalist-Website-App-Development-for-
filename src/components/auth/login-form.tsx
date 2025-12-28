"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CountrySelect } from "@/components/auth/country-select";
import { setupRecaptcha, sendOtpToPhone } from "@/lib/firebase";
import { RecaptchaVerifier } from "firebase/auth";

export function LoginForm() {
    const router = useRouter();
    const [phone, setPhone] = React.useState("");
    const [countryCode, setCountryCode] = React.useState("+971"); // UAE default
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const recaptchaRef = React.useRef<RecaptchaVerifier | null>(null);

    // Initialize reCAPTCHA on mount
    React.useEffect(() => {
        // Setup will be done on form submit to avoid issues
        return () => {
            // Cleanup recaptcha on unmount
            if (recaptchaRef.current) {
                try {
                    recaptchaRef.current.clear();
                } catch (e) {
                    console.log("reCAPTCHA cleanup:", e);
                }
            }
        };
    }, []);

    const formatPhoneNumber = (rawPhone: string): string => {
        // Remove all non-digits
        const digits = rawPhone.replace(/\D/g, "");
        return `${countryCode}${digits}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;

        setLoading(true);
        setError("");

        try {
            // Setup reCAPTCHA verifier
            if (!recaptchaRef.current) {
                recaptchaRef.current = setupRecaptcha("recaptcha-container");
            }

            const fullPhone = formatPhoneNumber(phone);

            // Store phone for verification page
            if (typeof window !== "undefined") {
                sessionStorage.setItem("pendingPhone", fullPhone);
            }

            const result = await sendOtpToPhone(fullPhone, recaptchaRef.current);

            if (result.success) {
                router.push(`/verify?phone=${encodeURIComponent(fullPhone)}`);
            } else {
                setError(result.error || "Failed to send OTP. Please try again.");
                // Reset reCAPTCHA on error
                if (recaptchaRef.current) {
                    try {
                        recaptchaRef.current.clear();
                        recaptchaRef.current = null;
                    } catch (e) {
                        console.log("reCAPTCHA reset error:", e);
                    }
                }
            }
        } catch (err: any) {
            console.log("Login error:", err);

            // Handle timeout errors gracefully
            if (err?.message?.toLowerCase().includes("timeout") || err?.code === "timeout") {
                setError("Request timed out. Please try again.");
            } else {
                setError(err.message || "Network error. Please try again.");
            }

            // Reset reCAPTCHA on any error
            if (recaptchaRef.current) {
                try {
                    recaptchaRef.current.clear();
                    recaptchaRef.current = null;
                } catch (clearErr) {
                    // Silently ignore reCAPTCHA cleanup errors
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits
        const value = e.target.value.replace(/\D/g, "");
        setPhone(value);
        if (error) setError("");
    };

    const handleCountryChange = (code: string) => {
        setCountryCode(code);
    };

    return (
        <Card className="w-full max-w-sm border-0 shadow-none sm:border sm:shadow-sm">
            <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"
                    >
                        <Phone className="h-7 w-7" />
                    </motion.div>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                    Enter your phone number to sign in with OTP.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium leading-none">
                            Phone Number
                        </label>
                        <div className="flex rounded-lg shadow-sm group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
                            <CountrySelect
                                disabled={loading}
                                value={countryCode}
                                onChange={handleCountryChange}
                            />
                            <Input
                                id="phone"
                                placeholder="50 123 4567"
                                value={phone}
                                onChange={handlePhoneChange}
                                className="rounded-l-none focus-visible:ring-0 shadow-none border-l-0"
                                type="tel"
                                error={!!error}
                                disabled={loading}
                                autoComplete="tel"
                                autoFocus
                            />
                        </div>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-destructive flex items-center gap-1"
                            >
                                <AlertCircle className="h-3 w-3" /> {error}
                            </motion.p>
                        )}
                    </div>

                    {/* Invisible reCAPTCHA container */}
                    <div id="recaptcha-container"></div>

                    <Button type="submit" className="w-full" isLoading={loading} disabled={!phone || loading}>
                        {loading ? "Sending Code..." : "Send OTP"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground px-4 leading-relaxed">
                        By continuing, you agree to our <a href="/terms" className="underline hover:text-foreground transition-colors">Terms</a> and <a href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
