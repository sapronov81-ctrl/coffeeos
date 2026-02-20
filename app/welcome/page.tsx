"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/app");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4 animate-fadeIn">
        <h1 className="text-4xl font-light tracking-wide">
          CoffeeOS
        </h1>
        <p className="text-neutral-400 text-sm">
          Digital Mentor for Baristas
        </p>
      </div>
    </div>
  );
}