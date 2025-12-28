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
        <div className="flex min-h-screen">
          <main className="flex-1 bg-gray-50 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
