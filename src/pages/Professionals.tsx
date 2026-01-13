import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Star, Mail, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'it', label: 'IT & Programming' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'design', label: 'Design' },
  { id: 'writing', label: 'Writing' },
  { id: 'video', label: 'Video & Animation' },
  { id: 'support', label: 'Support' },
  { id: 'finance', label: 'Finance' },
  { id: 'consulting', label: 'Consulting' },
];

interface Professional {
  id: string;
  full_name: string;
  avatar_url: string | null;
  category: string | null;
  skills: string[] | null;
  bio: string | null;
  experience_years: number | null;
  hourly_rate: number | null;
  location: string | null;
}

const Professionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProfessionals();
  }, []);

  useEffect(() => {
    filterProfessionals();
  }, [selectedCategory, searchQuery, professionals]);

  const loadProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'professional')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Error loading professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProfessionals = () => {
    let filtered = [...professionals];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.full_name?.toLowerCase().includes(query) ||
        p.bio?.toLowerCase().includes(query) ||
        p.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    setFilteredProfessionals(filtered);
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Find Your Perfect Professional
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse through {professionals.length}+ talented professionals ready to work
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 animate-slide-up">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, skills, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 glass border-border/50 text-lg"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-10 animate-slide-up stagger-1">
            <div className="flex flex-wrap gap-3 justify-center">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30"
                      : "glass border border-border/50 text-foreground hover:border-primary/50"
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Professionals Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProfessionals.length === 0 ? (
            <Card className="p-12 glass border-border/50 text-center">
              <p className="text-lg text-muted-foreground">
                No professionals found matching your criteria.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in stagger-2">
              {filteredProfessionals.map((professional) => (
                <Card
                  key={professional.id}
                  className="glass border-border/50 overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="p-6">
                    {/* Avatar and Basic Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                        {professional.avatar_url ? (
                          <img
                            src={professional.avatar_url}
                            alt={professional.full_name || 'Professional'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl">
                            {professional.full_name?.charAt(0) || 'P'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                          {professional.full_name || 'Anonymous Professional'}
                        </h3>
                        {professional.category && (
                          <span className="inline-block text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            {CATEGORIES.find(c => c.id === professional.category)?.label || professional.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {professional.bio && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {professional.bio}
                      </p>
                    )}

                    {/* Skills */}
                    {professional.skills && professional.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {professional.skills.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-md bg-secondary text-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                        {professional.skills.length > 3 && (
                          <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                            +{professional.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                      {professional.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{professional.location}</span>
                        </div>
                      )}
                      {professional.experience_years !== null && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>{professional.experience_years} years experience</span>
                        </div>
                      )}
                      {professional.hourly_rate !== null && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>${professional.hourly_rate}/hour</span>
                        </div>
                      )}
                    </div>

                    {/* Contact Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 text-primary-foreground transition-all duration-300 group-hover:scale-105"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Professionals;
