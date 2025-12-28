import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjjSEb4Zt1aiE7L-JEOu3EHtGdqjIAhK0",
    authDomain: "real-mobile-number-app.firebaseapp.com",
    projectId: "real-mobile-number-app",
    storageBucket: "real-mobile-number-app.firebasestorage.app",
    messagingSenderId: "824438797670",
    appId: "1:824438797670:web:bbf999bd53cf87a1ef04a7",
    measurementId: "G-ZBYKT3NHMH"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
export const initAnalytics = async () => {
    if (typeof window !== "undefined") {
        const supported = await isSupported();
        if (supported) {
            return getAnalytics(app);
        }
    }
    return null;
};

// ─────────────────────────────────────────────────────────────
// User Profile Management
// ─────────────────────────────────────────────────────────────

export interface UserProfile {
    uid: string;
    phoneNumber: string | null;
    displayName?: string;
    email?: string;
    createdAt?: any;
    updatedAt?: any;
}

/**
 * Create or update a user profile in Firestore
 */
export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
    try {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return { success: true };
    } catch (error: any) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get a user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
        const userRef = doc(db, "users", uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

// ─────────────────────────────────────────────────────────────
// Phone Authentication Utilities
// ─────────────────────────────────────────────────────────────

// Store the confirmation result for OTP verification
let confirmationResult: ConfirmationResult | null = null;

/**
 * Set up the invisible reCAPTCHA verifier
 * This must be called before sending OTP
 */
export function setupRecaptcha(buttonId: string = "recaptcha-container"): RecaptchaVerifier {
    // Clear any existing verifier
    if (typeof window !== "undefined" && (window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
    }

    const verifier = new RecaptchaVerifier(auth, buttonId, {
        size: "invisible",
        callback: () => {
            // reCAPTCHA solved - will proceed with sending OTP
            console.log("reCAPTCHA verified");
        },
        "expired-callback": () => {
            // Response expired, ask user to re-verify
            console.log("reCAPTCHA expired");
        }
    });

    if (typeof window !== "undefined") {
        (window as any).recaptchaVerifier = verifier;
    }

    return verifier;
}

/**
 * Send OTP to the provided phone number
 * @param phoneNumber - Phone number with country code (e.g., "+971501234567")
 * @returns Promise with success status
 */
export async function sendOtpToPhone(
    phoneNumber: string,
    recaptchaVerifier: RecaptchaVerifier
): Promise<{ success: boolean; error?: string }> {
    try {
        // Ensure phone number has country code
        const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;

        confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);

        // Store for verification step
        if (typeof window !== "undefined") {
            (window as any).confirmationResult = confirmationResult;
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error sending OTP:", error);

        // Handle specific Firebase errors
        let errorMessage = "Failed to send verification code. Please try again.";

        switch (error.code) {
            case "auth/invalid-phone-number":
                errorMessage = "Invalid phone number format. Please include country code.";
                break;
            case "auth/too-many-requests":
                errorMessage = "Too many attempts. Please wait a few minutes and try again.";
                break;
            case "auth/quota-exceeded":
                errorMessage = "SMS quota exceeded. Please try again later.";
                break;
            case "auth/captcha-check-failed":
                errorMessage = "reCAPTCHA verification failed. Please refresh and try again.";
                break;
            case "auth/missing-phone-number":
                errorMessage = "Please enter your phone number.";
                break;
            default:
                errorMessage = error.message || errorMessage;
        }

        return { success: false, error: errorMessage };
    }
}

/**
 * Verify the OTP code entered by user
 * @param code - 6-digit OTP code
 * @returns Promise with success status and user data
 */
export async function verifyOtpCode(
    code: string
): Promise<{ success: boolean; error?: string; user?: any }> {
    try {
        // Retrieve stored confirmation result
        const storedConfirmation = confirmationResult ||
            (typeof window !== "undefined" ? (window as any).confirmationResult : null);

        if (!storedConfirmation) {
            return {
                success: false,
                error: "Session expired. Please request a new verification code."
            };
        }

        const result = await storedConfirmation.confirm(code);

        // Clear the confirmation result after successful verification
        confirmationResult = null;
        if (typeof window !== "undefined") {
            (window as any).confirmationResult = null;
        }

        const user = {
            uid: result.user.uid,
            phoneNumber: result.user.phoneNumber,
            isNewUser: result.user.metadata.creationTime === result.user.metadata.lastSignInTime
        };

        // If new user, create initial profile placeholder in Firestore
        if (user.isNewUser && user.uid) {
            await updateUserProfile(user.uid, {
                phoneNumber: user.phoneNumber || "",
                createdAt: serverTimestamp()
            });
        }

        return {
            success: true,
            user
        };
    } catch (error: any) {
        console.error("Error verifying OTP:", error);

        let errorMessage = "Failed to verify code. Please try again.";

        switch (error.code) {
            case "auth/invalid-verification-code":
                errorMessage = "Invalid verification code. Please check and try again.";
                break;
            case "auth/code-expired":
                errorMessage = "Verification code has expired. Please request a new code.";
                break;
            case "auth/session-expired":
                errorMessage = "Session expired. Please request a new verification code.";
                break;
            default:
                errorMessage = error.message || errorMessage;
        }

        return { success: false, error: errorMessage };
    }
}

/**
 * Sign out the current user
 */
export async function signOutUser(): Promise<void> {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Error signing out:", error);
    }
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser() {
    return auth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: any) => void) {
    return auth.onAuthStateChanged(callback);
}

export default app;
