import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Star, Mail, Briefcase, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProfessionalProfileDialog from '@/components/ProfessionalProfileDialog';
import AdvancedFilters, { FilterOptions } from '@/components/AdvancedFilters';
import StarRating from '@/components/StarRating';
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
  average_rating?: number;
  review_count?: number;
  crypto_wallet_trc20?: string | null;
  accepts_crypto?: boolean | null;
}

const Professionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    minPrice: null,
    maxPrice: null,
    minExperience: null,
    hasPortfolio: false,
    sortBy: 'newest',
  });

  useEffect(() => {
    loadProfessionals();
  }, []);

  useEffect(() => {
    filterProfessionals();
  }, [selectedCategory, searchQuery, professionals, filters]);

  const loadProfessionals = async () => {
    try {
      // Load professionals
      const { data: profData, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'professional')
        .order('created_at', { ascending: false });

      if (profError) throw profError;

      // Load ratings for each professional
      const professionalsWithRatings = await Promise.all(
        (profData || []).map(async (prof) => {
          const { data: ratingData } = await supabase
            .from('professional_ratings')
            .select('average_rating, review_count')
            .eq('professional_id', prof.id)
            .single();

          return {
            ...prof,
            average_rating: ratingData?.average_rating ? parseFloat(ratingData.average_rating) : undefined,
            review_count: ratingData?.review_count || 0,
          };
        })
      );

      setProfessionals(professionalsWithRatings);
    } catch (error) {
      console.error('Error loading professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProfessionals = async () => {
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

    // Filter by price range
    if (filters.minPrice !== null) {
      filtered = filtered.filter(p =>
        p.hourly_rate !== null && p.hourly_rate >= filters.minPrice!
      );
    }
    if (filters.maxPrice !== null) {
      filtered = filtered.filter(p =>
        p.hourly_rate !== null && p.hourly_rate <= filters.maxPrice!
      );
    }

    // Filter by experience
    if (filters.minExperience !== null) {
      filtered = filtered.filter(p =>
        p.experience_years !== null && p.experience_years >= filters.minExperience!
      );
    }

    // Filter by portfolio
    if (filters.hasPortfolio) {
      // Get professionals with portfolio items
      const professionalsWithPortfolio = await Promise.all(
        filtered.map(async (prof) => {
          const { count } = await supabase
            .from('portfolio_items')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', prof.id);
          return { ...prof, hasPortfolio: (count ?? 0) > 0 };
        })
      );
      filtered = professionalsWithPortfolio.filter(p => p.hasPortfolio);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.hourly_rate ?? Infinity) - (b.hourly_rate ?? Infinity));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.hourly_rate ?? 0) - (a.hourly_rate ?? 0));
        break;
      case 'experience':
        filtered.sort((a, b) => (b.experience_years ?? 0) - (a.experience_years ?? 0));
        break;
      case 'newest':
      default:
        // Already sorted by created_at DESC from the query
        break;
    }

    setFilteredProfessionals(filtered);
  };

  const handleViewProfile = (professional: Professional) => {
    setSelectedProfessional(professional);
    setDialogOpen(true);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minPrice !== null) count++;
    if (filters.maxPrice !== null) count++;
    if (filters.minExperience !== null) count++;
    if (filters.hasPortfolio) count++;
    if (filters.sortBy !== 'newest') count++;
    return count;
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
            <div className="flex gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, skills, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 glass border-border/50 text-lg"
                />
              </div>
              <AdvancedFilters
                filters={filters}
                onFiltersChange={setFilters}
                activeFiltersCount={getActiveFiltersCount()}
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

                    {/* Rating */}
                    {professional.average_rating !== undefined && professional.review_count! > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2">
                          <StarRating rating={professional.average_rating} size="sm" showNumber />
                          <span className="text-xs text-muted-foreground">
                            ({professional.review_count} {professional.review_count === 1 ? 'review' : 'reviews'})
                          </span>
                        </div>
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

                    {/* View Profile Button */}
                    <Button
                      onClick={() => handleViewProfile(professional)}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 text-primary-foreground transition-all duration-300 group-hover:scale-105"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Professional Profile Dialog */}
      {selectedProfessional && (
        <ProfessionalProfileDialog
          professional={selectedProfessional}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}

      <Footer />
    </div>
  );
};

export default Professionals;
