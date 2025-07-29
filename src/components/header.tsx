import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Shield,
  CreditCard,
  Wallet,
  TrendingUp,
  BarChart3,
  Star,
  Zap,
  Target,
  Calculator,
  History,
  ArrowRightLeft,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Users,
  Award,
  BookOpen,
  Lightbulb,
  Brain,
  Trophy,
  StarIcon,
  TrendingDown,
  DollarSign,
  Euro,
  PoundSterling,
  SwissFranc,
  Bitcoin,
  Home,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Info,
  MessageSquare,
  Video,
  Mic,
  Camera,
  Image,
  Music,
  Film,
  Monitor as MonitorIcon,
  Smartphone,
  Tablet,
  Watch,
  Headphones,
  Speaker,
  Printer,
  Wifi,
  Bluetooth,
  Battery,
  Power,
  Cloud,
  Wind,
  Thermometer,
  Navigation,
  Compass,
  Flag,
  Building,
  Store,
  ShoppingCart,
  ShoppingBag,
  Receipt,
  Tag,
  Hash,
  AtSign,
  Percent,
  HashIcon,
  DollarSignIcon,
  EuroIcon,
  PoundIcon,
  YenIcon,
  RubleIcon,
  WonIcon,
  LiraIcon,
  RupeeIcon,
  RinggitIcon,
  BahtIcon,
  DongIcon,
  PesoIcon,
  RealIcon,
  RandIcon,
  ShekelIcon,
  TengeIcon,
  HryvniaIcon,
  ForintIcon,
  KorunaIcon,
  ZlotyIcon,
  LeuIcon,
  LevIcon,
  KunaIcon,
  MarkIcon,
  FrancIcon,
  GuilderIcon,
  EscudoIcon,
  PesetaIcon,
  DrachmaIcon,
  CrownIcon,
  FlorinIcon,
  ThalerIcon,
  DucatIcon,
  SovereignIcon,
  GuineaIcon,
  ShillingIcon,
  PennyIcon,
  FarthingIcon,
  GroatIcon,
  NobleIcon,
  AngelIcon,
  RoseIcon,
  UnicornIcon,
  LionIcon,
  LeopardIcon,
  MiteIcon,
  FarthingsIcon,
  PenceIcon,
  ShillingsIcon,
  PoundsIcon,
  GuineasIcon,
  SovereignsIcon,
  CrownsIcon,
  FlorinsIcon,
  ThalersIcon,
  DucatsIcon,
  AngelsIcon,
  NoblesIcon,
  RosesIcon,
  UnicornsIcon,
  LionsIcon,
  LeopardsIcon,
  MitesIcon,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { useTheme } from "./theme-provider";
import { Logo } from "./logo";

export const Header = () => {
  const navigate = useNavigate();
  const { totalValuePLN } = usePortfolio();
  const { theme, setTheme } = useTheme();
  const [notifications] = useState(3);
  const [showSearch, setShowSearch] = useState(false);

  const formatPLN = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <header className="bg-[#00071c] border-b border-[#1FFFA9]/20 text-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <Logo />
            
            {/* Quick navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="text-gray-300 hover:text-[#1FFFA9] hover:bg-[#1FFFA9]/10"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/exchange")}
                className="text-gray-300 hover:text-[#1FFFA9] hover:bg-[#1FFFA9]/10"
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Wymiana
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/rates")}
                className="text-gray-300 hover:text-[#1FFFA9] hover:bg-[#1FFFA9]/10"
              >
                <Target className="w-4 h-4 mr-2" />
                Kursy
              </Button>
            </nav>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Szukaj walut, transakcji..."
                className="w-full pl-10 pr-4 py-2 bg-[#1FFFA9]/10 border border-[#1FFFA9]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1FFFA9]/50 focus:border-[#1FFFA9]/50"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Portfolio value */}
            <div className="hidden lg:block">
              <div className="text-right">
                <p className="text-xs text-gray-400">Wartość portfela</p>
                <p className="text-sm font-semibold text-[#1FFFA9]">
                  {formatPLN(totalValuePLN)}
                </p>
              </div>
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-gray-300 hover:text-[#1FFFA9] hover:bg-[#1FFFA9]/10"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-[#1FFFA9] hover:bg-[#1FFFA9]/10">
                  {theme === "light" ? (
                    <Sun className="w-4 h-4" />
                  ) : theme === "dark" ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Monitor className="w-4 h-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#00071c] border-[#1FFFA9]/20">
                <DropdownMenuItem onClick={() => setTheme("light")} className="text-white hover:bg-[#1FFFA9]/10">
                  <Sun className="w-4 h-4 mr-2" />
                  Jasny
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="text-white hover:bg-[#1FFFA9]/10">
                  <Moon className="w-4 h-4 mr-2" />
                  Ciemny
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="text-white hover:bg-[#1FFFA9]/10">
                  <Monitor className="w-4 h-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/user.jpg" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-[#1FFFA9] to-[#02c349] text-black">
                      J
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#00071c] border-[#1FFFA9]/20" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">Jan Kowalski</p>
                    <p className="text-xs leading-none text-gray-400">jan.kowalski@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#1FFFA9]/20" />
                <DropdownMenuItem className="text-white hover:bg-[#1FFFA9]/10" onClick={() => navigate("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-[#1FFFA9]/10" onClick={() => navigate("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Ustawienia
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-[#1FFFA9]/10" onClick={() => navigate("/wallet")}>
                  <Wallet className="w-4 h-4 mr-2" />
                  Portfel
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#1FFFA9]/20" />
                <DropdownMenuItem className="text-white hover:bg-[#1FFFA9]/10">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Pomoc
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-[#1FFFA9]/10">
                  <Shield className="w-4 h-4 mr-2" />
                  Bezpieczeństwo
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#1FFFA9]/20" />
                <DropdownMenuItem className="text-white hover:bg-[#1FFFA9]/10">
                  <LogOut className="w-4 h-4 mr-2" />
                  Wyloguj
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};