import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[600px] flex items-center justify-center pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border mb-8 animate-fade-in">
            <span className="text-sm text-muted-foreground">{t.hero.badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-display sm:text-5xl md:text-6xl leading-tight mb-6 animate-fade-in stagger-1">
            <span className="text-heading">{t.hero.title} </span>
            <span className="text-primary">
              {t.hero.titleHighlight}
            </span>
            <br />
            <span className="text-heading">{t.hero.titleEnd}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-body md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in stagger-2">
            {t.hero.subtitle}
          </p>

          {/* Search Box */}
          <div className="bg-card rounded-xl card-shadow p-4 md:p-6 mb-10 animate-fade-in stagger-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder={t.hero.searchPlaceholder}
                  className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder={t.hero.locationPlaceholder}
                  className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <Button size="lg" className="md:w-auto w-full">
                <Search className="w-4 h-4 mr-2" strokeWidth={1.5} />
                {t.hero.searchButton}
              </Button>
            </div>
          </div>

          {/* New jobs indicator */}
          <div className="flex items-center justify-center gap-2 mb-10 animate-fade-in stagger-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">2,847</span> {t.hero.online}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-10 border-t border-border animate-fade-in stagger-5">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-heading">5,000+</p>
              <p className="text-sm text-muted-foreground mt-1">{t.hero.stats.professionals}</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-heading">850+</p>
              <p className="text-sm text-muted-foreground mt-1">{t.hero.stats.companies}</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-heading">1,200+</p>
              <p className="text-sm text-muted-foreground mt-1">{t.hero.stats.countries}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
