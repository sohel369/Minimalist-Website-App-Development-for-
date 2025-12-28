import { Suspense } from "react";
import { OTPForm } from "@/components/auth/otp-form";

export default function VerifyPage() {
    return (
        <div className="min-h-screen w-full grid place-items-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <OTPForm />
            </Suspense>
        </div>
    );
}
