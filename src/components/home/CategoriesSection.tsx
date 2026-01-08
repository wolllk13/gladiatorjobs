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
    },
    {
      id: 'marketing',
      icon: TrendingUp,
      title: t.categories.marketing,
      description: t.categories.marketingDesc,
      count: 856,
    },
    {
      id: 'design',
      icon: Palette,
      title: t.categories.design,
      description: t.categories.designDesc,
      count: 743,
    },
    {
      id: 'writing',
      icon: PenTool,
      title: t.categories.writing,
      description: t.categories.writingDesc,
      count: 612,
    },
    {
      id: 'video',
      icon: Video,
      title: t.categories.video,
      description: t.categories.videoDesc,
      count: 428,
    },
    {
      id: 'support',
      icon: Headphones,
      title: t.categories.support,
      description: t.categories.supportDesc,
      count: 534,
    },
    {
      id: 'finance',
      icon: Calculator,
      title: t.categories.finance,
      description: t.categories.financeDesc,
      count: 287,
    },
    {
      id: 'consulting',
      icon: Briefcase,
      title: t.categories.consulting,
      description: t.categories.consultingDesc,
      count: 195,
    },
  ];

  return (
    <section id="categories" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            {t.categories.badge}
          </span>
          <h2 className="text-heading md:text-4xl text-heading mb-4">
            {t.categories.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.categories.subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className={cn(
                  "group bg-card rounded-xl p-6 card-shadow transition-all duration-300",
                  "hover:shadow-lg hover:-translate-y-1 no-underline",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-6 h-6 text-secondary group-hover:text-primary-foreground" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="text-subheading text-heading mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-small text-muted-foreground mb-4 line-clamp-2">
                  {category.description}
                </p>

                {/* Count */}
                <div className="flex items-center justify-between">
                  <span className="text-small text-muted-foreground">
                    {category.count.toLocaleString()} {t.categories.professionals}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-link font-medium hover:underline no-underline group"
          >
            {t.categories.viewAll}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
