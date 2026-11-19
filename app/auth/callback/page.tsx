"use client";
import { useEffect } from "react";
export default function AuthCallback() {
  useEffect(() => {
    const hash = window.location.hash;
    window.location.replace("/" + window.location.search + hash);
  }, []);
  return null;
}
