"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Copy, Code2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface CompareProps {
    firstImage: string;
    secondImage: string;
    className?: string;
    firstImageClassName?: string;
    secondImageClassname?: string;
    initialSliderPercentage?: number;
    slideMode?: "drag" | "hover";
    showHandlebar?: boolean;
    autoplay?: boolean;
    autoplayDuration?: number;
}

export const Compare = ({
    firstImage,
    secondImage,
    className,
    firstImageClassName,
    secondImageClassname,
    initialSliderPercentage = 50,
    slideMode = "hover",
    showHandlebar = true,
    autoplay = false,
    autoplayDuration = 5000,
}: CompareProps) => {
    const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent | MouseEvent) => {
            if (!sliderRef.current) return;
            if (slideMode === "drag" && !isDragging) return;

            const rect = sliderRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            setSliderXPercent(Math.max(0, Math.min(100, percent)));
        },
        [isDragging, slideMode]
    );

    useEffect(() => {
        if (slideMode === "drag") {
            if (isDragging) {
                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", () => setIsDragging(false));
            } else {
                document.removeEventListener("mousemove", handleMouseMove);
            }
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isDragging, handleMouseMove, slideMode]);

    return (
        <div
            ref={sliderRef}
            className={cn("w-[400px] h-[400px] overflow-hidden select-none relative", className)}
            onMouseMove={slideMode === "hover" ? handleMouseMove : undefined}
            onMouseDown={slideMode === "drag" ? () => setIsDragging(true) : undefined}
            onTouchMove={(e) => {
                if (!sliderRef.current) return;
                const rect = sliderRef.current.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const percent = (x / rect.width) * 100;
                setSliderXPercent(Math.max(0, Math.min(100, percent)));
            }}
        >
            <AnimatePresence>
                <div className="absolute inset-0 z-20 h-full w-full pointer-events-none">
                    {/* Handle */}
                    {showHandlebar && (
                        <div
                            className="h-full w-0.5 bg-gradient-to-b from-transparent via-white to-transparent absolute top-0 z-30"
                            style={{ left: `${sliderXPercent}%` }}
                        >
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 backdrop-blur-md bg-white/10 rounded-full h-8 w-8 flex items-center justify-center border border-white/20 shadow-xl">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Second Image (The 'Reveal' / 'Solution') - Rendered fully, acts as background */}
                <div className="absolute inset-0 w-full h-full z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={secondImage}
                        alt="Solution"
                        className={cn("w-full h-full select-none", secondImageClassname)}
                    />
                </div>

                {/* First Image (The 'Problem') - Clipped */}
                <div
                    className="absolute inset-0 w-full h-full z-10 overflow-hidden"
                    style={{
                        clipPath: `polygon(0 0, ${sliderXPercent}% 0, ${sliderXPercent}% 100%, 0 100%)`,
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={firstImage}
                        alt="Problem"
                        className={cn("w-full h-full select-none", firstImageClassName)}
                    />
                </div>
            </AnimatePresence>
        </div>
    );
};
