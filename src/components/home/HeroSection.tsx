import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{ background: 'var(--gradient-hero)' }}
      />
      

      {/* Accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">{t.hero.badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-tight mb-6 animate-fade-in stagger-1">
            <span className="text-foreground">{t.hero.title} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {t.hero.titleHighlight}
            </span>
            <br />
            <span className="text-foreground">{t.hero.titleEnd}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in stagger-2">
            {t.hero.subtitle}
          </p>

          {/* Online users indicator */}
          <div className="flex items-center justify-center gap-2 mb-10 animate-fade-in stagger-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">2,847</span> {t.hero.online}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-4">
            <Button
              size="lg"
              onClick={() => {
                const el = document.getElementById('categories');
                if (!el) return;
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium group"
            >
              {t.hero.cta.findTalent}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/register">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-border hover:bg-secondary/50 px-8 py-6 text-base"
              >
                {t.hero.cta.joinAsPro}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-border/50 animate-fade-in stagger-5">
            <div>
              <p className="text-3xl md:text-4xl font-semibold text-foreground font-sans">5,000+</p>
              <p className="text-sm text-muted-foreground mt-1">{t.hero.stats.professionals}</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-semibold text-foreground font-sans">850+</p>
              <p className="text-sm text-muted-foreground mt-1">{t.hero.stats.companies}</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-semibold text-foreground font-sans">42</p>
              <p className="text-sm text-muted-foreground mt-1">{t.hero.stats.countries}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
