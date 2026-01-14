import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Lightbulb, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const FEEDBACK_TYPES = [
  { id: 'feature', label: 'Feature Request', icon: Lightbulb, description: 'Suggest a new feature' },
  { id: 'improvement', label: 'Improvement', icon: MessageSquare, description: 'Suggest an improvement' },
  { id: 'bug', label: 'Bug Report', icon: MessageSquare, description: 'Report a problem' },
  { id: 'other', label: 'Other', icon: MessageSquare, description: 'Other feedback' },
];

const Feedback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'feature',
    title: '',
    description: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Получаем текущего пользователя
      const { data: { user } } = await supabase.auth.getUser();

      // Сохраняем обратную связь в базу данных
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user?.id || null,
          type: formData.type,
          title: formData.title,
          description: formData.description,
          email: formData.email || user?.email || null,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: 'Thank you!',
        description: 'Your feedback has been submitted successfully. We will review it soon!',
      });

      // Очищаем форму
      setFormData({
        type: 'feature',
        title: '',
        description: '',
        email: '',
      });

    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Share Your Ideas</h1>
              <p className="text-muted-foreground mt-2">
                Help us improve Gladiator Jobs with your suggestions
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="glass border-border/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Feedback Form */}
          <Card className="p-8 glass border-border/50 animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Feedback Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  What type of feedback do you have?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FEEDBACK_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all duration-300",
                          formData.type === type.id
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={cn(
                            "w-5 h-5 mt-0.5",
                            formData.type === type.id ? "text-primary" : "text-muted-foreground"
                          )} />
                          <div>
                            <p className="font-medium text-sm">{type.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of your suggestion"
                  className="glass border-border/50"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description <span className="text-destructive">*</span>
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Please provide as much detail as possible..."
                  className="glass border-border/50 min-h-[150px] resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 20 characters
                </p>
              </div>

              {/* Email (optional for logged in users) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com (for updates on your suggestion)"
                  className="glass border-border/50"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !formData.title || formData.description.length < 20}
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 text-primary-foreground font-semibold py-6 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Info Box */}
          <Card className="p-6 glass border-border/50 mt-6 animate-fade-in stagger-1">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Your Voice Matters
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• All feedback is reviewed by our team</li>
              <li>• Popular suggestions get priority</li>
              <li>• We'll notify you when your suggestion is implemented</li>
              <li>• Your feedback helps shape the future of Gladiator Jobs</li>
            </ul>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Feedback;
