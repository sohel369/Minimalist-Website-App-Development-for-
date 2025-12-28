"use client";

import * as React from "react";
import { Smartphone, Monitor } from "lucide-react";

export function TrustSection() {
    return (
        <section className="py-12 bg-neutral-50 border-t border-b border-neutral-200">
            <div className="container mx-auto px-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-4 text-neutral-400">
                    <Monitor className="h-6 w-6" />
                    <span className="h-1 w-1 rounded-full bg-neutral-300 mx-2"></span>
                    <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-1">
                    Seamless Cross-Platform Experience
                </h3>
                <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                    Your account and requests are instantly synced across all your devices.
                </p>
            </div>
        </section>
    );
}
