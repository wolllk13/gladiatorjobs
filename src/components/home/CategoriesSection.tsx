import { Link } from 'react-router-dom';
import { 
  Code2, 
  TrendingUp, 
  Palette, 
  PenTool, 
  Video, 
  Headphones,
  Calculator,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const CategoriesSection = () => {
  const { t } = useLanguage();

  const categories = [
    {
      id: 'it',
      icon: Code2,
      title: t.categories.it,
      description: t.categories.itDesc,
      count: 1240,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400',
    },
    {
      id: 'marketing',
      icon: TrendingUp,
      title: t.categories.marketing,
      description: t.categories.marketingDesc,
      count: 856,
      gradient: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
    },
    {
      id: 'design',
      icon: Palette,
      title: t.categories.design,
      description: t.categories.designDesc,
      count: 743,
      gradient: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-400',
    },
    {
      id: 'writing',
      icon: PenTool,
      title: t.categories.writing,
      description: t.categories.writingDesc,
      count: 612,
      gradient: 'from-orange-500/20 to-amber-500/20',
      iconColor: 'text-orange-400',
    },
    {
      id: 'video',
      icon: Video,
      title: t.categories.video,
      description: t.categories.videoDesc,
      count: 428,
      gradient: 'from-purple-500/20 to-violet-500/20',
      iconColor: 'text-purple-400',
    },
    {
      id: 'support',
      icon: Headphones,
      title: t.categories.support,
      description: t.categories.supportDesc,
      count: 534,
      gradient: 'from-teal-500/20 to-cyan-500/20',
      iconColor: 'text-teal-400',
    },
    {
      id: 'finance',
      icon: Calculator,
      title: t.categories.finance,
      description: t.categories.financeDesc,
      count: 287,
      gradient: 'from-yellow-500/20 to-amber-500/20',
      iconColor: 'text-yellow-400',
    },
    {
      id: 'consulting',
      icon: Briefcase,
      title: t.categories.consulting,
      description: t.categories.consultingDesc,
      count: 195,
      gradient: 'from-indigo-500/20 to-blue-500/20',
      iconColor: 'text-indigo-400',
    },
  ];

  return (
    <section id="categories" className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Ambient glow effects with animation */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-sm font-semibold gradient-text mb-6 glow-primary/20">
            {t.categories.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-slide-up">
            {t.categories.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-slide-up stagger-1">
            {t.categories.subtitle}
          </p>
        </div>

        {/* Categories Grid with 3D perspective */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ perspective: '1200px' }}
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to="/professionals"
                className={cn(
                  "group relative p-6 rounded-2xl glass border border-border/50",
                  "transition-all duration-500 ease-out",
                  "hover:border-primary/70 hover:bg-card/60",
                  "animate-scale-in",
                  // 3D transform on hover with more dramatic effect
                  "hover:[transform:rotateX(-8deg)_rotateY(8deg)_translateZ(30px)_scale(1.05)]",
                  "hover:shadow-[0_30px_60px_-15px_rgba(139,92,246,0.4)]",
                  "hover:z-10"
                )}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'forwards',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Gradient background on hover */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  category.gradient
                )} />

                {/* Floating glow effect with shimmer */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 animate-glow-pulse" />
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 animate-shimmer" />
                
                <div className="relative" style={{ transform: 'translateZ(30px)' }}>
                  {/* Icon with 3D float and glow */}
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-4 relative",
                    "bg-gradient-to-br from-secondary to-secondary/50 shadow-lg",
                    "group-hover:scale-125 group-hover:-translate-y-2 group-hover:rotate-6 transition-all duration-500",
                    category.iconColor
                  )}>
                    <Icon className="w-7 h-7 group-hover:animate-float" />
                    {/* Icon glow */}
                    <div className={cn(
                      "absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500",
                      "bg-current"
                    )} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
                    {category.description}
                  </p>

                  {/* Count & Arrow */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground group-hover:gradient-text transition-all duration-300">
                      {category.count.toLocaleString()} {t.categories.professionals}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-3 group-hover:scale-125 transition-all duration-500" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12 animate-fade-in stagger-2">
          <Link
            to="/professionals"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass border border-primary/40 font-semibold gradient-text hover:border-primary hover:glow-primary group transition-all duration-500 hover:scale-110"
          >
            {t.categories.viewAll}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
