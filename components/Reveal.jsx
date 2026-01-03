"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
    children,
    className = "",
    animation = "fade-up",
    delay = 0,
    threshold = 0.1
}) {
    const [ isVisible, setIsVisible ] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([ entry ]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ threshold ]);

    return (
        <div
            ref={ref}
            className={`${className} reveal-container ${animation} ${isVisible ? "reveal-visible" : ""}`}
            style={{
                visibility: isVisible ? "visible" : "hidden",
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    );
}
