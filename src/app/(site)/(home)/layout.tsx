import type { Metadata } from "next";
import "./../../globals.css";

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
import SiteHeaderLogo from "@/components/site-layout/SiteHeaderLogo";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-prussian-blue-950/80 backdrop-blur-md border-b border-prussian-blue-900">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <SiteHeaderLogo />
          <div className="hidden md:flex gap-8 text-sm font-medium text-iron-grey-300">
            <a
              href="#funcionalidades"
              className="hover:text-jungle-green-400 transition-colors"
            >
              Funcionalidades
            </a>
            <a
              href="#desenvolvimento"
              className="hover:text-jungle-green-400 transition-colors"
            >
              Status
            </a>
          </div>
        </div>
      </nav>

      {children}
    </>
  );
}
