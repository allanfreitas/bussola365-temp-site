export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-platinum-50 tracking-tight">Admin Dashboard</h1>
        <p className="text-iron-grey-400 mt-1">Bem-vindo à área administrativa do Bússola365.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-prussian-blue-800 bg-prussian-blue-900/40 p-6 shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium text-iron-grey-400">Total de Webhooks</p>
          <p className="text-2xl font-bold text-jungle-green-400 mt-2">--</p>
        </div>
        <div className="rounded-xl border border-prussian-blue-800 bg-prussian-blue-900/40 p-6 shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium text-iron-grey-400">Usuários Ativos</p>
          <p className="text-2xl font-bold text-steel-azure-400 mt-2">--</p>
        </div>
        <div className="rounded-xl border border-prussian-blue-800 bg-prussian-blue-900/40 p-6 shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium text-iron-grey-400">Status do Sistema</p>
          <p className="text-2xl font-bold text-emerald-400 mt-2">Online</p>
        </div>
      </div>
    </div>
  );
}
