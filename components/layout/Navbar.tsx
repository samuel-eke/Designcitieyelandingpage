"use client";

import { useEffect } from "react";
import { useAuthStore } from "../auth/authStore";
import { ResizableNavbar } from "../ui/resizable-navbar";

export function Navbar() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      {/* Spacer for the fixed navbar */}
      <div className="h-24 w-full bg-white"></div>
      <ResizableNavbar />
    </>
  );
}
