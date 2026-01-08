import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    { href: '/', label: t.nav.home },
    { href: '/jobs', label: t.nav.jobs },
    { href: '/employers', label: t.nav.employers },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group no-underline"
          >
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">Р</span>
            </div>
            <span className="text-xl font-bold text-heading group-hover:text-primary transition-colors">
              РаботаПро
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-base font-medium transition-colors no-underline hover:text-primary",
                  location.pathname === link.href 
                    ? "text-primary" 
                    : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="w-4 h-4" strokeWidth={1.5} />
              <span className="uppercase">{language}</span>
            </button>
            
            <Link to="/login" className="no-underline">
              <Button variant="ghost" className="text-foreground">
                {t.nav.signIn}
              </Button>
            </Link>
            
            <Link to="/register" className="no-underline">
              <Button>
                {t.nav.joinNow}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-card border-b border-border">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-foreground hover:text-primary transition-colors no-underline"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-border space-y-3">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Globe className="w-4 h-4" strokeWidth={1.5} />
                <span>{language === 'en' ? 'English' : 'Русский'}</span>
              </button>
              
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block no-underline">
                <Button variant="ghost" className="w-full justify-start">
                  {t.nav.signIn}
                </Button>
              </Link>
              
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block no-underline">
                <Button className="w-full">
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
