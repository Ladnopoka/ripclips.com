"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Add a small delay to ensure the router is ready
    const timeoutId = setTimeout(() => {
      // Use replace instead of push to avoid adding to history
      router.replace("/homepage");
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
