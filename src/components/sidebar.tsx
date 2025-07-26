import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  TrendingUp, 
  History, 
  Settings, 
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Wymiana", href: "/exchange", icon: ArrowRightLeft },
  { name: "Kursy LIVE", href: "/rates", icon: TrendingUp },
  { name: "Historia", href: "/history", icon: History },
  { name: "Ustawienia", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-card border-r border-border transition-all duration-300 lg:relative lg:translate-x-0",
          collapsed ? "-translate-x-full lg:w-16" : "w-64 translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg currency-card flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg">Currency Dash</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="lg:hidden"
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href === "/dashboard" && location.pathname === "/");
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Toggle button for desktop */}
        <div className="absolute bottom-4 left-4 hidden lg:block">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
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
          className="fixed top-4 left-4 z-40 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
    </>
  );
}