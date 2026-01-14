import { useState, useEffect } from 'react';
import { Mail, MapPin, DollarSign, Briefcase, ExternalLink, X, Star, Wallet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import SendMessageDialog from '@/components/SendMessageDialog';
import WriteReviewDialog from '@/components/WriteReviewDialog';
import ReviewsList from '@/components/ReviewsList';
import StarRating from '@/components/StarRating';
import CryptoPaymentDialog from '@/components/CryptoPaymentDialog';
import { supabase } from '@/lib/supabase';

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  tags: string[] | null;
}

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
  crypto_wallet_trc20: string | null;
  accepts_crypto: boolean | null;
}

interface ProfessionalProfileDialogProps {
  professional: Professional;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfessionalProfileDialog = ({
  professional,
  open,
  onOpenChange,
}: ProfessionalProfileDialogProps) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [cryptoPaymentOpen, setCryptoPaymentOpen] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [reviewsKey, setReviewsKey] = useState(0);

  useEffect(() => {
    if (open && professional.id) {
      loadPortfolio();
      loadRating();
    }
  }, [open, professional.id]);

  const loadPortfolio = async () => {
    setLoadingPortfolio(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', professional.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolio(data || []);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const loadRating = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_ratings')
        .select('average_rating, review_count')
        .eq('professional_id', professional.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

      setAverageRating(data?.average_rating ? parseFloat(data.average_rating) : null);
      setReviewCount(data?.review_count || 0);
    } catch (error) {
      console.error('Error loading rating:', error);
    }
  };

  const handleReviewSubmitted = () => {
    loadRating();
    setReviewsKey(prev => prev + 1); // Force re-render of ReviewsList
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 glass border-border/50">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/30 flex-shrink-0">
                  {professional.avatar_url ? (
                    <img
                      src={professional.avatar_url}
                      alt={professional.full_name || 'Professional'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-2xl">
                      {professional.full_name?.charAt(0) || 'P'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-3xl gradient-text mb-2">
                    {professional.full_name || 'Anonymous Professional'}
                  </DialogTitle>
                  <div className="flex items-center gap-3 flex-wrap">
                    {professional.category && (
                      <span className="inline-block text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {professional.category}
                      </span>
                    )}
                    {averageRating !== null && reviewCount > 0 && (
                      <div className="flex items-center gap-2">
                        <StarRating rating={averageRating} size="sm" showNumber />
                        <span className="text-xs text-muted-foreground">
                          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* About */}
            {professional.bio && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground mb-2">About</h3>
                <p className="text-muted-foreground">{professional.bio}</p>
              </div>
            )}

            {/* Skills */}
            {professional.skills && professional.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {professional.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-sm px-3 py-1 rounded-md bg-secondary text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="mb-6 space-y-3">
              {professional.location && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{professional.location}</span>
                </div>
              )}
              {professional.experience_years !== null && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Briefcase className="w-5 h-5" />
                  <span>{professional.experience_years} years of experience</span>
                </div>
              )}
              {professional.hourly_rate !== null && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-semibold text-primary text-lg">
                    ${professional.hourly_rate}/hour
                  </span>
                </div>
              )}
            </div>

            {/* Portfolio */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground mb-3">Portfolio</h3>
              {loadingPortfolio ? (
                <div className="text-center py-8">
                  <div className="inline-block w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : portfolio.length === 0 ? (
                <p className="text-muted-foreground text-sm">No portfolio items yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio.map((item) => (
                    <Card key={item.id} className="glass border-border/50 overflow-hidden group">
                      {item.image_url && (
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.project_url && (
                          <a
                            href={item.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-primary hover:underline"
                          >
                            View Project
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Reviews</h3>
                <Button
                  onClick={() => setReviewDialogOpen(true)}
                  variant="outline"
                  size="sm"
                  className="glass border-border/50"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Leave a Review
                </Button>
              </div>
              <ReviewsList
                key={reviewsKey}
                professionalId={professional.id}
                professionalName={professional.full_name || 'this professional'}
              />
            </div>

            <Separator className="my-6" />

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Crypto Payment Button - Only show if professional accepts crypto */}
              {professional.accepts_crypto && professional.crypto_wallet_trc20 && (
                <Button
                  onClick={() => setCryptoPaymentOpen(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/30 text-white"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Pay with Crypto (USDT TRC20)
                </Button>
              )}

              {/* Contact Button */}
              <Button
                onClick={() => setMessageDialogOpen(true)}
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact {professional.full_name}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>

      {/* Send Message Dialog */}
      <SendMessageDialog
        recipientId={professional.id}
        recipientName={professional.full_name || 'this professional'}
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}
      />

      {/* Write Review Dialog */}
      <WriteReviewDialog
        professionalId={professional.id}
        professionalName={professional.full_name || 'this professional'}
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        onReviewSubmitted={handleReviewSubmitted}
      />

      {/* Crypto Payment Dialog */}
      {professional.accepts_crypto && professional.crypto_wallet_trc20 && (
        <CryptoPaymentDialog
          professionalId={professional.id}
          professionalName={professional.full_name || 'this professional'}
          walletAddress={professional.crypto_wallet_trc20}
          open={cryptoPaymentOpen}
          onOpenChange={setCryptoPaymentOpen}
        />
      )}
    </Dialog>
  );
};

export default ProfessionalProfileDialog;
