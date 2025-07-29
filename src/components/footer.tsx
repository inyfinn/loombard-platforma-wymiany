import { Link } from "react-router-dom";
import { 
  Star, 
  Shield, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Globe,
  FileText,
  Users,
  Award,
  Zap,
  Target,
  TrendingUp,
  Calculator,
  Bell,
  Settings,
  User,
  History,
  Wallet,
  ArrowRightLeft
} from "lucide-react";

const footerLinks = {
  platform: [
    { name: "Panel główny", href: "/dashboard", icon: TrendingUp },
    { name: "Portfel", href: "/portfel", icon: Wallet },
    { name: "Wymiana", href: "/exchange", icon: ArrowRightLeft },
    { name: "Kursy LIVE", href: "/rates", icon: Target },
    { name: "Historia", href: "/history", icon: History },
    { name: "Kalkulator", href: "/calculator", icon: Calculator },
  ],
  account: [
    { name: "Profil", href: "/profile", icon: User },
    { name: "Ustawienia", href: "/settings", icon: Settings },
    { name: "Alerty cenowe", href: "/settings/price-alerts", icon: Bell },
    { name: "Powiadomienia", href: "/settings/notifications", icon: Bell },
  ],
  support: [
    { name: "Pomoc", href: "/help", icon: HelpCircle },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
    { name: "Kontakt", href: "/contact", icon: Mail },
    { name: "O nas", href: "/about", icon: Users },
  ],
  legal: [
    { name: "Regulamin", href: "/terms", icon: FileText },
    { name: "Polityka prywatności", href: "/privacy", icon: Shield },
    { name: "Rodo", href: "/gdpr", icon: Shield },
    { name: "Cookies", href: "/cookies", icon: FileText },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "YouTube", href: "#", icon: Youtube },
  { name: "GitHub", href: "#", icon: Github },
];

export const Footer = () => {
  return (
    <footer className="bg-[#00071c] border-t border-[#1FFFA9]/20 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1FFFA9] to-[#02c349] rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-lg bg-gradient-to-r from-[#1FFFA9] to-[#02c349] bg-clip-text text-transparent">
                  KANTOOR.pl
                </h3>
                <p className="text-sm text-gray-400">Platforma wymiany walut</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Najnowocześniejsza platforma do wymiany walut w Polsce. 
              Bezpieczne transakcje, najkorzystniejsze kursy i profesjonalne wsparcie.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 bg-[#1FFFA9]/10 rounded-lg flex items-center justify-center text-[#1FFFA9] hover:bg-[#1FFFA9]/20 transition-colors"
                  title={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="font-semibold text-[#1FFFA9] mb-4 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Platforma
            </h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-[#1FFFA9] transition-colors flex items-center text-sm"
                  >
                    <link.icon className="w-3 h-3 mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h4 className="font-semibold text-[#1FFFA9] mb-4 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Konto
            </h4>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-[#1FFFA9] transition-colors flex items-center text-sm"
                  >
                    <link.icon className="w-3 h-3 mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="font-semibold text-[#1FFFA9] mb-4 flex items-center">
              <HelpCircle className="w-4 h-4 mr-2" />
              Wsparcie
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-[#1FFFA9] transition-colors flex items-center text-sm"
                  >
                    <link.icon className="w-3 h-3 mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-semibold text-[#1FFFA9] mb-4 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Prawne
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-[#1FFFA9] transition-colors flex items-center text-sm"
                  >
                    <link.icon className="w-3 h-3 mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact info */}
        <div className="border-t border-[#1FFFA9]/20 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#1FFFA9]/10 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-[#1FFFA9]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">kontakt@kantoor.pl</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#1FFFA9]/10 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-[#1FFFA9]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Telefon</p>
                <p className="text-white">+48 123 456 789</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#1FFFA9]/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#1FFFA9]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Adres</p>
                <p className="text-white">Warszawa, Polska</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1FFFA9]/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>© 2024 KANTOOR.pl. Wszystkie prawa zastrzeżone.</span>
              <span>•</span>
              <span>Regulamin</span>
              <span>•</span>
              <span>Polityka prywatności</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Globe className="w-4 h-4" />
              <span>Polski</span>
              <span>•</span>
              <span>English</span>
              <span>•</span>
              <span>Deutsch</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 