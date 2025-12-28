"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCw, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/ui/otp-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyOtpCode, setupRecaptcha, sendOtpToPhone, getUserProfile } from "@/lib/firebase";
import { RecaptchaVerifier } from "firebase/auth";

function OTPFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phone = searchParams.get("phone") || "+971 50 000 0000";

    const [otp, setOtp] = React.useState("");
    const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [countdown, setCountdown] = React.useState(60);
    const [isResending, setIsResending] = React.useState(false);
    const recaptchaRef = React.useRef<RecaptchaVerifier | null>(null);

    React.useEffect(() => {
        if (countdown > 0 && status !== "success") {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, status]);

    const handleVerify = async (code = otp) => {
        if (code.length !== 6) return;

        setStatus("loading");
        setErrorMessage("");

        try {
            const result = await verifyOtpCode(code);

            if (result.success && result.user) {
                setStatus("success");

                // Store basic user info for immediate use
                if (typeof window !== "undefined") {
                    sessionStorage.setItem("user", JSON.stringify(result.user));
                }

                // Check if user has a profile with name
                let hasName = false;
                try {
                    const profile = await getUserProfile(result.user.uid);
                    hasName = !!(profile && profile.displayName);
                } catch (e) {
                    console.error("Error checking profile:", e);
                }

                setTimeout(() => {
                    if (hasName) {
                        router.push("/");
                    } else {
                        // Redirect to complete profile if name is missing
                        router.push("/complete-profile");
                    }
                }, 1500);
            } else {
                setStatus("error");
                setErrorMessage(result.error || "Invalid verification code");
                setTimeout(() => setStatus("idle"), 3000);
            }
        } catch (err: any) {
            console.log("Verification error:", err);
            setStatus("error");

            // Handle timeout errors gracefully
            if (err?.message?.toLowerCase().includes("timeout") || err?.code === "timeout") {
                setErrorMessage("Request timed out. Please try again.");
            } else {
                setErrorMessage(err.message || "Verification failed. Please try again.");
            }
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0 || isResending) return;

        setIsResending(true);
        setErrorMessage("");

        try {
            // Setup reCAPTCHA for resend
            if (!recaptchaRef.current) {
                recaptchaRef.current = setupRecaptcha("resend-recaptcha-container");
            }

            const result = await sendOtpToPhone(phone, recaptchaRef.current);

            if (result.success) {
                setCountdown(60);
                setOtp("");
            } else {
                setErrorMessage(result.error || "Failed to resend code");
            }
        } catch (err: any) {
            console.log("Resend error:", err);

            // Handle timeout errors gracefully
            if (err?.message?.toLowerCase().includes("timeout") || err?.code === "timeout") {
                setErrorMessage("Request timed out. Please try again.");
            } else {
                setErrorMessage("Failed to resend. Please try again.");
            }
        } finally {
            setIsResending(false);
            // Reset reCAPTCHA
            if (recaptchaRef.current) {
                try {
                    recaptchaRef.current.clear();
                    recaptchaRef.current = null;
                } catch (e) {
                    console.log("reCAPTCHA cleanup:", e);
                }
            }
        }
    };

    const onComplete = (code: string) => {
        setOtp(code);
        handleVerify(code);
    };

    const formatPhone = (phoneNumber: string) => {
        // Format for display: +971 50 123 4567
        const cleaned = phoneNumber.replace(/\D/g, "");
        if (cleaned.length > 10) {
            return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
        }
        return phoneNumber;
    };

    return (
        <Card className="w-full max-w-sm border-0 shadow-none sm:border sm:shadow-sm relative">
            {/* Back Button */}
            <div className="absolute top-4 left-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
            </div>

            <CardHeader className="space-y-1 mt-6">
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`h-14 w-14 rounded-2xl flex items-center justify-center ${status === "success"
                            ? "bg-green-100 text-green-600"
                            : "bg-primary/5 text-primary"
                            }`}
                    >
                        {status === "success" ? (
                            <CheckCircle2 className="h-7 w-7" />
                        ) : (
                            <ShieldCheck className="h-7 w-7" />
                        )}
                    </motion.div>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-center">
                    {status === "success" ? "Verified!" : "Check your phone"}
                </CardTitle>
                <CardDescription className="text-center text-base">
                    {status === "success" ? (
                        "Redirecting you to the app..."
                    ) : (
                        <>
                            We've sent a 6-digit code to <br />
                            <span className="font-semibold text-foreground">{formatPhone(phone)}</span>
                        </>
                    )}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-8">
                    <div className="relative">
                        <OTPInput
                            length={6}
                            onComplete={onComplete}
                            disabled={status === "loading" || status === "success"}
                        />
                        <AnimatePresence>
                            {status === "error" && errorMessage && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute -bottom-6 left-0 right-0 text-center text-xs text-destructive font-medium flex items-center justify-center gap-1"
                                >
                                    <AlertCircle className="h-3 w-3" />
                                    {errorMessage}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col items-center gap-4 pt-2">
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full"
                                >
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" disabled>
                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Verified Successfully
                                    </Button>
                                </motion.div>
                            ) : (
                                <Button
                                    onClick={() => handleVerify()}
                                    className="w-full"
                                    isLoading={status === "loading"}
                                    disabled={otp.length !== 6}
                                >
                                    Verify Code
                                </Button>
                            )}
                        </AnimatePresence>

                        {/* Invisible reCAPTCHA container for resend */}
                        <div id="resend-recaptcha-container"></div>

                        <div className="text-sm">
                            {countdown > 0 ? (
                                <span className="text-muted-foreground tabular-nums">
                                    Resend code in {countdown}s
                                </span>
                            ) : (
                                <button
                                    onClick={handleResendOtp}
                                    disabled={isResending}
                                    className="flex items-center text-primary font-medium hover:underline disabled:opacity-50 transition-all"
                                >
                                    {isResending ? (
                                        <>
                                            <RotateCw className="h-3 w-3 mr-1.5 animate-spin" /> Sending...
                                        </>
                                    ) : (
                                        <>
                                            <RotateCw className="h-3 w-3 mr-1.5" /> Resend Code
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function OTPForm() {
    return (
        <React.Suspense
            fallback={
                <Card className="w-full max-w-sm border-0 shadow-none sm:border sm:shadow-sm">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-primary/20 animate-pulse" />
                            Loading...
                        </div>
                    </CardContent>
                </Card>
            }
        >
            <OTPFormContent />
        </React.Suspense>
    );
}
