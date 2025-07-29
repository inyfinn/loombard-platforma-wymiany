import { Bell, Search, User, LogOut, Settings, HelpCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const navigate = useNavigate();
  const goProfile = () => navigate("/profile");
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm dark:bg-slate-900/80 dark:border-slate-700/50">
      {/* Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-md ml-12 sm:ml-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Szukaj walut, kursów..." 
            className="pl-10 w-full bg-slate-50/50 border-slate-200 focus:bg-white dark:bg-slate-800/50 dark:border-slate-700 dark:focus:bg-slate-800"
          />
        </div>
      </div>

      {/* Center - Quick Actions */}
      <div className="hidden md:flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          onClick={() => navigate('/exchange')}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Szybka wymiana
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          onClick={() => navigate('/rates')}
        >
          Kursy LIVE
        </Button>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {/* Live Status */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-green-700 dark:text-green-400">Online</span>
        </div>

        <ThemeToggle />
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
            <span className="w-1 h-1 bg-white rounded-full"></span>
          </span>
        </Button>

        {/* Help */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => navigate('/settings')}
        >
          <HelpCircle className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Avatar className="w-8 h-8 border-2 border-slate-200 dark:border-slate-700">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  JK
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Jan Kowalski</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">jan@example.com</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-xl border-slate-200 dark:bg-slate-900/95 dark:border-slate-700">
            <DropdownMenuItem onClick={goProfile} className="hover:bg-slate-100 dark:hover:bg-slate-800">
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-slate-100 dark:hover:bg-slate-800">
              <Settings className="mr-2 h-4 w-4" />
              Ustawienia
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
            <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Wyloguj
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}