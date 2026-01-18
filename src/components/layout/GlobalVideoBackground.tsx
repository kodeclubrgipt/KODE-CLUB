"use client";

import { useEffect, useRef } from "react";

export function GlobalVideoBackground() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Force play on mount (helps with browser autoplay policies)
        const video = videoRef.current;
        if (video) {
            video.play().catch(() => {
                // Autoplay was prevented, but muted videos usually work
                console.log("Autoplay prevented, trying again...");
            });
        }
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Video Background */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
                <source
                    src="https://res.cloudinary.com/dzt9fr0cw/video/upload/v1768652790/original-e10daf1419f90a8b1787ae43f95d3c36_zrmdok.mp4"
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>

            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Subtle gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        </div>
    );
}
