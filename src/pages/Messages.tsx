import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader2, ArrowLeft, Mail, User, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SendMessageDialog from '@/components/SendMessageDialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
  sender: {
    full_name: string | null;
    avatar_url: string | null;
    user_type: string;
  };
  recipient: {
    full_name: string | null;
    avatar_url: string | null;
    user_type: string;
  };
}

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyRecipient, setReplyRecipient] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    checkAuthAndLoadMessages();
  }, []);

  const checkAuthAndLoadMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate('/login');
      return;
    }

    setCurrentUserId(user.id);
    await loadMessages(user.id);
    setLoading(false);
  };

  const loadMessages = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(full_name, avatar_url, user_type),
          recipient:recipient_id(full_name, avatar_url, user_type)
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Today ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const handleReply = (userId: string, userName: string) => {
    setReplyRecipient({ id: userId, name: userName });
    setReplyDialogOpen(true);
  };

  const markAsRead = async (messageId: string, isReceived: boolean) => {
    if (!isReceived) return; // Only mark received messages as read

    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent relative">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Messages</h1>
              <p className="text-muted-foreground mt-2">Your conversations</p>
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

          {/* Messages List */}
          {messages.length === 0 ? (
            <Card className="p-12 glass border-border/50 text-center animate-fade-in">
              <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-foreground mb-2">No messages yet</h3>
              <p className="text-muted-foreground mb-6">
                Start a conversation by contacting a professional
              </p>
              <Button
                onClick={() => navigate('/professionals')}
                className="bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground"
              >
                Browse Professionals
              </Button>
            </Card>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {messages.map((message) => {
                const isReceived = message.recipient_id === currentUserId;
                const otherUser = isReceived ? message.sender : message.recipient;

                return (
                  <Card
                    key={message.id}
                    className={`p-6 glass border-border/50 hover:border-primary/50 transition-all duration-300 ${
                      !message.read && isReceived ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                        {otherUser.avatar_url ? (
                          <img
                            src={otherUser.avatar_url}
                            alt={otherUser.full_name || 'User'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                            {otherUser.full_name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-foreground">
                              {isReceived ? 'From' : 'To'}: {otherUser.full_name || 'Anonymous User'}
                            </h4>
                            {message.subject && (
                              <p className="text-sm font-medium text-primary mt-1">
                                {message.subject}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                            {formatDate(message.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {message.message}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          {!message.read && isReceived && (
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                              New
                            </span>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              handleReply(otherUser.id, otherUser.full_name || 'User');
                              if (!message.read && isReceived) {
                                markAsRead(message.id, isReceived);
                              }
                            }}
                            className="glass border-border/50 hover:border-primary/50"
                          >
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Info Box */}
          <Card className="p-6 glass border-border/50 mt-8 animate-fade-in stagger-1">
            <h3 className="font-bold text-foreground mb-2">How messaging works</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Browse professionals and click "Contact" to send a message</li>
              <li>• All your conversations will appear here</li>
              <li>• Messages are private and secure</li>
              <li>• Negotiate terms and discuss your project requirements directly</li>
            </ul>
          </Card>
        </div>
      </main>

      {/* Reply Dialog */}
      {replyRecipient && (
        <SendMessageDialog
          recipientId={replyRecipient.id}
          recipientName={replyRecipient.name}
          open={replyDialogOpen}
          onOpenChange={(open) => {
            setReplyDialogOpen(open);
            if (!open) {
              // Reload messages after sending
              if (currentUserId) {
                loadMessages(currentUserId);
              }
            }
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default Messages;
