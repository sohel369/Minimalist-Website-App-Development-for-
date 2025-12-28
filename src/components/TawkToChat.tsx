"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        Tawk_API: any;
        Tawk_LoadStart: Date;
    }
}

export function TawkToChat() {
    useEffect(() => {
        // Initialize Tawk.to
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        const script = document.createElement("script");
        script.async = true;
        script.src = "https://embed.tawk.to/69515f46d03d62198349898f/1jditob1o";
        script.charset = "UTF-8";
        script.setAttribute("crossorigin", "*");

        const firstScript = document.getElementsByTagName("script")[0];
        if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript);
        } else {
            document.head.appendChild(script);
        }

        return () => {
            // Cleanup on unmount
            const tawkScript = document.querySelector('script[src*="embed.tawk.to"]');
            if (tawkScript) {
                tawkScript.remove();
            }
        };
    }, []);

    return null;
}
