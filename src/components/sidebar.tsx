import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  TrendingUp,
  History,
  User,
  Settings,
  ChevronLeft,
  Menu,
  Star,
  Zap,
  Target,
  BarChart3,
  Bell,
  HelpCircle,
  FileText,
  Shield,
  CreditCard,
  PiggyBank,
  Coins,
  Globe,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  PieChart,
  LineChart,
  Activity,
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
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Info,
  Mail,
  Phone,
  MessageSquare,
  Video,
  Mic,
  Camera,
  Image,
  Music,
  Film,
  Monitor,
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
  Sun,
  Moon,
  Cloud,
  Wind,
  Thermometer,
  MapPin,
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

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    title: "Panel główny",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Portfel",
    href: "/portfel",
    icon: Wallet,
    badge: null,
  },
  {
    title: "Wymiana",
    href: "/exchange",
    icon: ArrowRightLeft,
    badge: { text: "Nowa", variant: "destructive" as const },
  },
  {
    title: "Kursy LIVE",
    href: "/rates",
    icon: TrendingUp,
    badge: null,
  },
  {
    title: "Historia",
    href: "/history",
    icon: History,
    badge: null,
  },
  {
    title: "Profil",
    href: "/profile",
    icon: User,
    badge: null,
  },
  {
    title: "Ustawienia",
    href: "/settings",
    icon: Settings,
    badge: null,
  },
];

const collapsedIcons = [
  { icon: LayoutDashboard, title: "Panel główny", href: "/dashboard" },
  { icon: Wallet, title: "Portfel", href: "/portfel" },
  { icon: ArrowRightLeft, title: "Wymiana", href: "/exchange" },
  { icon: TrendingUp, title: "Kursy LIVE", href: "/rates" },
  { icon: History, title: "Historia", href: "/history" },
  { icon: User, title: "Profil", href: "/profile" },
  { icon: Settings, title: "Ustawienia", href: "/settings" },
];

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalValuePLN } = usePortfolio();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const formatPLN = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Responsive behavior
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  // On mobile/tablet, always show full sidebar when open
  const shouldShowFullSidebar = isOpen && (isMobile || isTablet);
  // On desktop, show collapsed sidebar when collapsed
  const shouldShowCollapsedSidebar = !isMobile && !isTablet && isCollapsed;

  if (!isOpen && (isMobile || isTablet)) {
    return null;
  }

  return (
    <>
      {/* Desktop collapsed sidebar */}
      {shouldShowCollapsedSidebar && (
        <div className="fixed left-0 top-0 h-full w-16 bg-[#00071c] border-r border-[#1FFFA9]/20 z-50">
          <div className="flex flex-col h-full">
            {/* Logo area */}
            <div className="p-4 border-b border-[#1FFFA9]/20">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1FFFA9] to-[#02c349] rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-black" />
              </div>
            </div>

            {/* Navigation icons */}
            <div className="flex-1 py-4">
              {collapsedIcons.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "w-full h-12 flex items-center justify-center text-gray-400 hover:text-[#1FFFA9] hover:bg-[#1FFFA9]/10 transition-colors relative group",
                    location.pathname === item.href && "text-[#1FFFA9] bg-[#1FFFA9]/20"
                  )}
                  title={item.title}
                >
                  <item.icon className="w-5 h-5" />
                  {location.pathname === item.href && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#1FFFA9] rounded-l-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Performance summary */}
            <div className="p-2 border-t border-[#1FFFA9]/20">
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-400 mb-1">Dzisiejszy zysk</div>
                <div className="text-sm font-semibold text-[#1FFFA9]">+2.4%</div>
                <div className="text-xs text-gray-400 mt-1">Transakcje</div>
                <div className="text-sm font-semibold text-white">12</div>
              </div>
            </div>

            {/* Expand button */}
            <button
              onClick={handleToggleCollapse}
              className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-[#1FFFA9] rounded-full flex items-center justify-center text-black hover:bg-[#1FFFA9]/90 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Full sidebar */}
      {shouldShowFullSidebar && (
        <div className="fixed left-0 top-0 h-full w-64 bg-[#00071c] border-r border-[#1FFFA9]/20 z-50">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#1FFFA9]/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#1FFFA9] to-[#02c349] rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h1 className="font-bold text-lg bg-gradient-to-r from-[#1FFFA9] to-[#02c349] bg-clip-text text-transparent">
                    KANTOOR.pl
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Wymiana walut</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-gray-400 hover:text-[#1FFFA9]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>

            {/* User greeting */}
            <div className="p-4 border-b border-[#1FFFA9]/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1FFFA9] to-[#02c349] rounded-full flex items-center justify-center">
                  <span className="text-black font-semibold">J</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">Cześć, Janie!</p>
                  <p className="text-xs text-gray-400">Gotowy na wymianę?</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-4">
              {navigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left transition-colors relative group",
                    location.pathname === item.href
                      ? "bg-gradient-to-r from-[#1FFFA9] to-[#02c349] text-black"
                      : "text-gray-400 hover:text-[#1FFFA9] hover:bg-[#1FFFA9]/10"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge variant={item.badge.variant} className="text-xs">
                      {item.badge.text}
                    </Badge>
                  )}
                  {location.pathname === item.href && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-black rounded-l-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Performance summary */}
            <div className="p-4 border-t border-[#1FFFA9]/20">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Dzisiejszy zysk</span>
                  <span className="text-sm font-semibold text-[#1FFFA9]">+2.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Transakcje</span>
                  <span className="text-sm font-semibold text-white">12</span>
                </div>
              </div>
            </div>

            {/* Collapse button for desktop */}
            {!isMobile && !isTablet && (
              <button
                onClick={handleToggleCollapse}
                className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-[#1FFFA9] rounded-full flex items-center justify-center text-black hover:bg-[#1FFFA9]/90 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};