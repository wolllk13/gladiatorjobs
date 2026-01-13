import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 opacity-60 animate-gradient"
        style={{ background: 'var(--gradient-hero)' }}
      />

      {/* Multiple accent glows for depth */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px] pointer-events-none animate-glow-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] pointer-events-none animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[110px] pointer-events-none animate-glow-pulse" style={{ animationDelay: '3s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8 animate-scale-in glow-primary/30 group cursor-default">
            <Sparkles className="w-4 h-4 text-accent animate-float" />
            <span className="text-sm font-medium gradient-text">{t.hero.badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-up stagger-1">
            <span className="text-foreground">{t.hero.title} </span>
            <span className="gradient-text animate-gradient inline-block">
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-scale-in stagger-4">
            <Button
              size="lg"
              onClick={() => {
                const el = document.getElementById('categories');
                if (!el) return;
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/50 text-primary-foreground px-8 py-6 text-base font-semibold group transition-all duration-300 hover:scale-105 glow-primary"
            >
              {t.hero.cta.findTalent}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/register">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto glass border-primary/50 hover:bg-primary/10 hover:border-primary px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105"
              >
                {t.hero.cta.joinAsPro}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-primary/20 animate-slide-up stagger-5">
            <div className="group cursor-default">
              <p className="text-3xl md:text-4xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">5,000+</p>
              <p className="text-sm text-muted-foreground mt-2 font-medium">{t.hero.stats.professionals}</p>
            </div>
            <div className="group cursor-default">
              <p className="text-3xl md:text-4xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">850+</p>
              <p className="text-sm text-muted-foreground mt-2 font-medium">{t.hero.stats.companies}</p>
            </div>
            <div className="group cursor-default">
              <p className="text-3xl md:text-4xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">42</p>
              <p className="text-sm text-muted-foreground mt-2 font-medium">{t.hero.stats.countries}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
