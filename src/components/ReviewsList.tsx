import { useState, useEffect } from 'react';
import { User, Loader2, Edit2, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/StarRating';
import WriteReviewDialog from '@/components/WriteReviewDialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  professional_id: string;
  client_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  client: {
    full_name: string | null;
    avatar_url: string | null;
    company_name: string | null;
  };
}

interface ReviewsListProps {
  professionalId: string;
  professionalName: string;
}

const ReviewsList = ({ professionalId, professionalName }: ReviewsListProps) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    loadReviews();
    getCurrentUser();
  }, [professionalId]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          client:client_id(full_name, avatar_url, company_name)
        `)
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditDialogOpen(true);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: 'Review deleted',
        description: 'Your review has been removed',
      });

      loadReviews();
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6 glass border-border/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                  {review.client.avatar_url ? (
                    <img
                      src={review.client.avatar_url}
                      alt={review.client.full_name || 'Client'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                      {review.client.full_name?.charAt(0) || review.client.company_name?.charAt(0) || 'C'}
                    </div>
                  )}
                </div>

                {/* Client Info */}
                <div>
                  <h4 className="font-semibold text-foreground">
                    {review.client.full_name || review.client.company_name || 'Anonymous Client'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              </div>

              {/* Actions (if current user is the author) */}
              {currentUserId === review.client_id && (
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(review)}
                    className="h-8 w-8"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(review.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="mb-3">
              <StarRating rating={review.rating} size="sm" />
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            )}
          </Card>
        ))}
      </div>

      {/* Edit Review Dialog */}
      {editingReview && (
        <WriteReviewDialog
          professionalId={professionalId}
          professionalName={professionalName}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          existingReview={{
            id: editingReview.id,
            rating: editingReview.rating,
            comment: editingReview.comment,
          }}
          onReviewSubmitted={() => {
            loadReviews();
            setEditingReview(null);
          }}
        />
      )}
    </>
  );
};

export default ReviewsList;
