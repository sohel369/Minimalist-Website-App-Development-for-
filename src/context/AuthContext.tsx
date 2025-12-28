"use client";

import * as React from "react";
import { onAuthStateChange, signOutUser, UserProfile } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<UserProfile | null>(null);
    const [loading, setLoading] = React.useState(true);

    // Global handler for unhandled promise rejections (e.g., reCAPTCHA timeouts)
    React.useEffect(() => {
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const error = event.reason;
            const errorMessage = error?.message?.toLowerCase() || "";

            // Suppress timeout errors from showing as runtime errors
            if (errorMessage.includes("timeout") || error?.code === "timeout") {
                event.preventDefault();
                console.log("Timeout error handled silently");
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener("unhandledrejection", handleUnhandledRejection);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("unhandledrejection", handleUnhandledRejection);
            }
        };
    }, []);

    // Auth state listener
    React.useEffect(() => {
        const unsubscribeAuth = onAuthStateChange(async (firebaseUser) => {
            if (firebaseUser) {
                const initialProfile: UserProfile = {
                    uid: firebaseUser.uid,
                    phoneNumber: firebaseUser.phoneNumber,
                };

                try {
                    const userRef = doc(db, "users", firebaseUser.uid);
                    const unsubscribeSnapshot = onSnapshot(
                        userRef,
                        (docSnapshot) => {
                            if (docSnapshot.exists()) {
                                setUser({ ...initialProfile, ...docSnapshot.data() } as UserProfile);
                            } else {
                                setUser(initialProfile);
                            }
                            setLoading(false);
                        },
                        (error) => {
                            // Handle Firestore errors silently
                            console.log("Firestore error:", error.message);
                            setUser(initialProfile);
                            setLoading(false);
                        }
                    );

                    return () => unsubscribeSnapshot();
                } catch (e) {
                    console.log("Profile listener error");
                    setUser(initialProfile);
                    setLoading(false);
                }
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const signOut = async () => {
        try {
            await signOutUser();
            setUser(null);
        } catch (error) {
            console.log("Sign out error");
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function useRequireAuth(redirectUrl: string = "/login") {
    const { user, loading } = useAuth();

    React.useEffect(() => {
        if (!loading && !user) {
            window.location.href = redirectUrl;
        }
    }, [user, loading, redirectUrl]);

    return { user, loading };
}
