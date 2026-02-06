import { useAuth } from "../hooks/useAuth";

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/80">
        <h1 className="text-xl font-semibold">
          Author Dashboard ✍️
        </h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-300">
            {user?.name || user?.email}
          </span>
          <button
            onClick={logout}
            className="rounded-md border border-slate-500 px-3 py-1 text-xs hover:bg-slate-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <p className="text-slate-400">
          Posts table 
        </p>
      </main>
    </div>
  );
}

export default DashboardPage;