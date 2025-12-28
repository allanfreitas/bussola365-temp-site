export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>User Area - Bussola365</title>
      </head>
      <body>
        <div className="flex">
          <aside className="w-64 bg-gray-100 p-4">
            <nav>
              <ul>
                <li>
                  <a href="/u/dashboard">Dashboard</a>
                </li>
                <li>
                  <a href="/u/profile">Perfil</a>
                </li>
                <li>
                  <a href="/u/settings">Configurações</a>
                </li>
              </ul>
            </nav>
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
