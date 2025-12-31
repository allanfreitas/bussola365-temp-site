import type { Metadata } from "next";
import "./../globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
    title: "Admin Login - Bússola365",
    description: "Área restrita para administradores do sistema",
};

export default function LoginAdmLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <head>
                <title>Admin Login - Bússola365</title>
            </head>
            <body className="antialiased">
                {children}
                <Toaster position="top-right" />
            </body>
        </html>
    );
}
