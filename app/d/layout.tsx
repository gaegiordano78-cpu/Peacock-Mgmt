import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digitals — Peacock Models",
  description: "Polaroids and video — Peacock Models MGMT",
  robots: { index: false, follow: false },
};

export default function DigitalsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
