import { useState } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import StarRating from '@/components/StarRating';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface WriteReviewDialogProps {
  professionalId: string;
  professionalName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingReview?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
  onReviewSubmitted?: () => void;
}

const WriteReviewDialog = ({
  professionalId,
  professionalName,
  open,
  onOpenChange,
  existingReview,
  onReviewSubmitted,
}: WriteReviewDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: 'Error',
        description: 'Please select a rating',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to leave a review',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      // Check if user is a client
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (profile?.user_type !== 'client') {
        toast({
          title: 'Error',
          description: 'Only clients can leave reviews',
          variant: 'destructive',
        });
        return;
      }

      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            rating,
            comment: comment.trim() || null,
          })
          .eq('id', existingReview.id);

        if (error) throw error;

        toast({
          title: 'Review updated!',
          description: 'Your review has been updated successfully.',
        });
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert({
            professional_id: professionalId,
            client_id: user.id,
            rating,
            comment: comment.trim() || null,
          });

        if (error) {
          if (error.code === '23505') {
            // Unique constraint violation
            toast({
              title: 'Error',
              description: 'You have already reviewed this professional',
              variant: 'destructive',
            });
            return;
          }
          throw error;
        }

        toast({
          title: 'Review submitted!',
          description: `Thank you for reviewing ${professionalName}!`,
        });
      }

      // Reset form
      setRating(0);
      setComment('');
      onOpenChange(false);

      // Callback to refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass border-border/50">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">
            {existingReview ? 'Edit Review' : 'Write a Review'}
          </DialogTitle>
          <DialogDescription>
            Share your experience working with {professionalName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Rating */}
            <div className="space-y-3">
              <Label>Your Rating *</Label>
              <div className="flex items-center gap-2">
                <StarRating
                  rating={rating}
                  size="lg"
                  interactive
                  onRatingChange={setRating}
                />
                {rating > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({rating} {rating === 1 ? 'star' : 'stars'})
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Your Review (optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your experience working with this professional..."
                className="glass border-border/50 min-h-[120px]"
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                Be specific about what you liked or what could be improved
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="glass border-border/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || rating === 0}
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {existingReview ? 'Update Review' : 'Submit Review'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WriteReviewDialog;
