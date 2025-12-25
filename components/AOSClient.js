"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";

export default function AOSClient() {
    const pathname = usePathname();

    useEffect(() => {
        // Initialize AOS with a slight delay to ensure hydration is complete
        const timer = setTimeout(() => {
            AOS.init({
                once: true,
                duration: 1000,
                easing: 'ease-out-quad',
            });
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        AOS.refresh();
    }, [ pathname ]);

    return null;
}
