"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ResponsiveRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    if (window.innerWidth <= 768) {
      router.push("/mobile-page"); // Change to your target page
    }
  }, []);

  return null; // or a loading spinner if needed
};

export default ResponsiveRedirect;