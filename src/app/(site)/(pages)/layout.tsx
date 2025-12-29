import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bússola365",
  description: "Norteando suas finanças com simplicidade e tecnologia",
};

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Instagram,
  Layout,
  Linkedin,
  MessageCircle,
  Twitter,
  Users,
} from "lucide-react";
import Link from "next/link";
import SiteHeaderLogo from "@/components/site-layout/SiteHeaderLogo";
import SiteFooter from "@/components/site-layout/SiteFooter";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-prussian-blue-950/80 backdrop-blur-md border-b border-prussian-blue-900">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <SiteHeaderLogo />
        </div>
      </nav>

      {children}
    </>
  );
}
