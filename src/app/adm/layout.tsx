export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Admin Area - Bussola365</title>
      </head>
      <body>
        <div className="flex min-h-screen">
          <aside className="w-72 bg-gray-900 text-white p-4">
            <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
            <nav>
              <ul>
                <li>
                  <a href="/adm/dashboard">Dashboard</a>
                </li>
                <li>
                  <a href="/adm/users">Usuários</a>
                </li>
                <li>
                  <a href="/adm/reports">Relatórios</a>
                </li>
                <li>
                  <a href="/adm/settings">Configurações</a>
                </li>
              </ul>
            </nav>
          </aside>
          <main className="flex-1 bg-gray-50 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
