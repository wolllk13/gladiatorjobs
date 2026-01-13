import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  const navLinks = [
    { href: '/talent', label: t.nav.findTalent },
    { href: '/work', label: t.nav.findWork },
    { href: '/#how-it-works', label: t.nav.howItWorks },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground group-hover:gradient-text transition-all duration-300">
              Gladiator Jobs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.href 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass border border-border/50 text-sm hover:border-primary/50 transition-all duration-300 hover:scale-105"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase font-medium">{language}</span>
            </button>

            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-medium">
                {t.nav.signIn}
              </Button>
            </Link>

            <Link to="/register">
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 text-primary-foreground font-semibold transition-all duration-300 hover:scale-105">
                {t.nav.joinNow}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-border space-y-3">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'en' ? 'English' : 'Русский'}</span>
              </button>
              
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  {t.nav.signIn}
                </Button>
              </Link>
              
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  {t.nav.joinNow}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
