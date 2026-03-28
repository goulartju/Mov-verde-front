import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Calendar,
  School,
  Users,
  UserPlus,
  Gift,
  Trophy,
  Menu,
  Recycle, SquarePen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/calendario", label: "Calendário", icon: Calendar },
    { path: "/escolas", label: "Escolas", icon: School },
    { path: "/turmas", label: "Turmas", icon: Users },
    { path: "/alunos", label: "Alunos", icon: UserPlus },
    { path: "/doacoes", label: "Doações", icon: Gift },
    { path: "/rankings", label: "Rankings", icon: Trophy },
    { path: "/administrativo", label: "Administrativo", icon: SquarePen },

  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background-default">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"
          } bg-primary text-white transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-green-500">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Recycle className="h-8 w-8" />
              <div>
                <h2 className="font-bold text-lg">EcoColeta</h2>
                <p className="text-xs text-green-100">Sustentabilidade</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-green-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive
                  ? "bg-accent text-white"
                  : "text-green-50 hover:bg-hover/70"
                  } ${!sidebarOpen && "justify-center"}`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-green-500 text-xs text-green-100">
            <p>Sistema de Arrecadação</p>
            <p className="mt-1"> de Materiais Recicláveis</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;