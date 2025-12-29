import type { Metadata } from "next";
import "./../globals.css";
import SiteFooter from "@/components/site-layout/SiteFooter";

export const metadata: Metadata = {
  title: "Bússola365",
  description: "Norteando suas finanças com simplicidade e tecnologia",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Bussola365 - Suas Finanças na direção correta</title>
      </head>
      <body>
        <div className="min-h-screen font-sans selection:bg-jungle-green-500 selection:text-prussian-blue-950">
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
