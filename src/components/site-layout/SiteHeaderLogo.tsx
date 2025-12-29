export default function SiteHeaderLogo() {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/logo-apenas-icone-120x120.png"
        alt="Bússola365 Logo"
        className="h-10 w-10 object-contain"
      />
      <span className="text-2xl font-bold tracking-tight text-white">
        Bússola<span className="text-jungle-green-500">365</span>
      </span>
    </div>
  );
}
