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
    <section id="categories" className="py-20 md:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border text-sm text-muted-foreground mb-6">
            {t.categories.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-4">
            {t.categories.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.categories.subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className={cn(
                  "group relative p-6 rounded-2xl bg-card border border-border",
                  "hover:border-primary/30 hover:shadow-lg transition-all duration-300",
                  "opacity-0 animate-fade-in"
                )}
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                {/* Gradient background on hover */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity",
                  category.gradient
                )} />
                
                <div className="relative">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                    "bg-secondary group-hover:scale-110 transition-transform",
                    category.iconColor
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 font-sans">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>

                  {/* Count & Arrow */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {category.count.toLocaleString()} professionals
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {t.categories.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
