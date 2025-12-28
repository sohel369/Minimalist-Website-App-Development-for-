import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-white via-emerald-50/30 to-white">
            {/* Header */}
            <header className="px-4 py-4 sm:py-6">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm sm:text-lg">
                            S
                        </div>
                        <span className="font-semibold text-base sm:text-lg tracking-tight text-neutral-900">
                            ServiceApp
                        </span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-8 sm:py-12">
                <LoginForm />
            </main>

            {/* Footer */}
            <footer className="px-4 py-4 sm:py-6 text-center">
                <p className="text-xs sm:text-sm text-neutral-500">
                    © 2025 ServiceApp. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
