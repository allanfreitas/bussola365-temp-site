import "./../globals.css";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { LayoutDashboard, Webhook, Users, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login-adm");
  }

  if (session.user.role !== "admin") {
    // If authenticated but not admin, we still redirect to login or an unauthorized page.
    // Given the requirements, redirecting to login-adm seems appropriate if they are not the right kind of user.
    // Or maybe just show an error. Let's redirect to login for now.
    redirect("/login-adm");
  }

  const menuItems = [
    { title: "Dashboard", url: "/adm/dashboard", icon: LayoutDashboard },
    { title: "Webhooks", url: "/adm/webhooks", icon: Webhook },
    { title: "Usuários", url: "/adm/users", icon: Users },
    { title: "Configurações", url: "/adm/settings", icon: Settings },
  ];

  return (
    <html lang="pt-BR">
      <head>
        <title>Admin - Bússola365</title>
      </head>
      <body className="antialiased">
        <div className="flex min-h-screen bg-prussian-blue-950 text-platinum-50">
          <aside className="w-64 border-r border-prussian-blue-800 bg-prussian-blue-900 shadow-xl flex flex-col">
            <div className="p-6 border-b border-prussian-blue-800">
              <h1 className="text-xl font-bold bg-linear-to-r from-jungle-green-400 to-steel-azure-400 bg-clip-text text-transparent">
                Bússola365 Admin
              </h1>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-prussian-blue-800 transition-colors text-iron-grey-100 hover:text-jungle-green-400"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-prussian-blue-800">
              <div className="flex items-center gap-3 px-3 py-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-jungle-green-500 flex items-center justify-center text-prussian-blue-950 font-bold">
                  {session.user.name?.charAt(0) || "A"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{session.user.name}</p>
                  <p className="text-xs text-iron-grey-400 truncate">{session.user.email}</p>
                </div>
              </div>
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-red-900/20 text-red-400 transition-colors">
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </aside>
          <main className="flex-1 overflow-auto p-8">
            {children}
          </main>
          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  );
}
