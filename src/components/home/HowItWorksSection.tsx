import { UserPlus, FileEdit, Users, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: UserPlus,
      title: t.howItWorks.steps.register,
      description: t.howItWorks.steps.registerDesc,
    },
    {
      icon: FileEdit,
      title: t.howItWorks.steps.profile,
      description: t.howItWorks.steps.profileDesc,
    },
    {
      icon: Users,
      title: t.howItWorks.steps.connect,
      description: t.howItWorks.steps.connectDesc,
    },
    {
      icon: Rocket,
      title: t.howItWorks.steps.work,
      description: t.howItWorks.steps.workDesc,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border text-sm text-muted-foreground mb-6">
            {t.howItWorks.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-4">
            {t.howItWorks.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={cn(
                  "relative text-center group",
                  "opacity-0 animate-fade-in"
                )}
                style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
                )}

                {/* Step number */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-7xl font-bold text-muted/20 font-sans select-none">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                  <Icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3 font-sans">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
