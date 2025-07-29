import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  TrendingUp, 
  History, 
  Settings, 
  Menu,
  X,
  Wallet,
  User,
  Sparkles,
  BarChart3,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getPolishVocative } from "@/lib/utils";
import { Logo } from "./logo";

// Get user name - in a real app this would come from user context/profile
const userName = "Jan"; // This should be fetched from user profile/context
// Example: change this to test different names: "Anna", "Piotr", "Katarzyna", "Michał", "Maria"

const navigation = [
  { name: "Panel główny", href: "/dashboard", icon: LayoutDashboard, badge: null },
  { name: "Portfel", href: "/portfel", icon: Wallet, badge: null },
  { name: "Wymiana", href: "/exchange", icon: ArrowRightLeft, badge: "Nowa" },
  { name: "Kursy LIVE", href: "/rates", icon: TrendingUp, badge: null },
  { name: "Historia", href: "/history", icon: History, badge: null },
  { name: "Profil", href: "/profile", icon: User, badge: null },
  { name: "Ustawienia", href: "/settings", icon: Settings, badge: null },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white/80 backdrop-blur-xl border-r border-slate-200/50 shadow-xl transition-all duration-300 lg:relative lg:translate-x-0 dark:bg-slate-900/80 dark:border-slate-700/50",
          collapsed ? "-translate-x-full lg:w-16" : "w-72 translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Loombard
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Wymiana walut</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </Button>
        </div>

        {/* User Welcome */}
        {!collapsed && (
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{userName.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  Cześć, {getPolishVocative(userName)}!
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Gotowy na wymianę?
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href === "/dashboard" && location.pathname === "/");
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25" 
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200",
                  !collapsed && "group-hover:scale-110"
                )} />
                {!collapsed && (
                  <>
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isActive && !collapsed && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Stats */}
        {!collapsed && (
          <div className="p-4 mt-auto">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dzisiejszy zysk</span>
                <span className="text-sm font-bold text-green-600">+2.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Transakcje</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">12</span>
              </div>
            </div>
          </div>
        )}

        {/* Toggle button for desktop */}
        <div className="absolute bottom-4 left-4 hidden lg:block">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </Button>
        </div>
      </aside>

      {/* Mobile menu button */}
      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(false)}
          className="fixed top-4 left-4 z-40 lg:hidden bg-white/80 backdrop-blur-sm shadow-lg border border-slate-200/50 dark:bg-slate-900/80 dark:border-slate-700/50"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
    </>
  );
}