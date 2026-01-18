import { Hero } from "@/components/features/landing/Hero";
import { About } from "@/components/features/landing/About";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col overflow-x-hidden">
            <Hero />
            <About />
        </main>
    );
}
