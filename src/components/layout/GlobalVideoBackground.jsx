"use client";

export function GlobalVideoBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    minWidth: '100%',
                    minHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                }}
            >
                <source 
                    src="https://res.cloudinary.com/dzt9fr0cw/video/upload/v1768652790/original-e10daf1419f90a8b1787ae43f95d3c36_zrmdok.mp4" 
                    type="video/mp4" 
                />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
