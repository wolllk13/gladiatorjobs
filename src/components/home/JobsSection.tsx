import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedDays: number;
  isUrgent?: boolean;
}

const JobsSection = () => {
  const { t } = useLanguage();

  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior React Developer',
      company: 'TechCorp',
      location: 'Москва',
      salary: '250 000 - 350 000 ₽',
      postedDays: 1,
      isUrgent: true,
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'StartupHub',
      location: 'Санкт-Петербург',
      salary: '180 000 - 250 000 ₽',
      postedDays: 2,
    },
    {
      id: '3',
      title: 'UI/UX Designer',
      company: 'DesignStudio',
      location: 'Удалённо',
      salary: '150 000 - 200 000 ₽',
      postedDays: 1,
      isUrgent: true,
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Москва',
      salary: '280 000 - 380 000 ₽',
      postedDays: 3,
    },
    {
      id: '5',
      title: 'Marketing Manager',
      company: 'BrandAgency',
      location: 'Казань',
      salary: '120 000 - 180 000 ₽',
      postedDays: 2,
    },
    {
      id: '6',
      title: 'Data Analyst',
      company: 'DataDriven',
      location: 'Новосибирск',
      salary: '140 000 - 200 000 ₽',
      postedDays: 1,
      isUrgent: true,
    },
  ];

  return (
    <section id="jobs" className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            {t.jobs.badge}
          </span>
          <h2 className="text-heading md:text-4xl text-heading mb-4">
            {t.jobs.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.jobs.subtitle}
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {jobs.map((job, index) => (
            <article
              key={job.id}
              className={cn(
                "bg-card rounded-xl p-6 card-shadow transition-all duration-300 hover:shadow-lg",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Urgent Tag */}
              {job.isUrgent && (
                <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-small font-medium mb-4">
                  {t.jobs.urgent}
                </span>
              )}

              {/* Job Title */}
              <h3 className="text-subheading text-heading mb-2 line-clamp-2">
                {job.title}
              </h3>

              {/* Company */}
              <p className="text-body text-muted-foreground mb-4">
                {job.company}
              </p>

              {/* Salary */}
              <p className="text-body font-semibold text-success mb-4">
                {job.salary}{t.jobs.perMonth}
              </p>

              {/* Location & Date */}
              <div className="flex items-center justify-between text-small text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" strokeWidth={1.5} />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" strokeWidth={1.5} />
                  {job.postedDays} {t.jobs.daysAgo}
                </span>
              </div>

              {/* Apply Button */}
              <Button className="w-full">
                {t.jobs.apply}
              </Button>
            </article>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-link font-medium hover:underline no-underline group"
          >
            {t.jobs.viewAll}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobsSection;
