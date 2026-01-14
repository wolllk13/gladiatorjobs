import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Camera, LogOut, Save, Trash2, Loader2, ExternalLink, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PortfolioDialog from '@/components/PortfolioDialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Profile {
  id: string;
  email: string;
  user_type: 'professional' | 'client';
  full_name: string | null;
  avatar_url: string | null;
  age: number | null;
  bio: string | null;
  skills: string[] | null;
  category: string | null;
  experience_years: number | null;
  hourly_rate: number | null;
  location: string | null;
  company_name: string | null;
  company_description: string | null;
  website: string | null;
  phone: string | null;
  crypto_wallet_trc20: string | null;
  accepts_crypto: boolean | null;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  tags: string[] | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/login');
      return;
    }

    await loadProfile(user.id);
    await loadPortfolio(user.id);
    setLoading(false);
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    setProfile(data);
  };

  const loadPortfolio = async (userId: string) => {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading portfolio:', error);
      return;
    }

    setPortfolio(data || []);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      let avatarUrl = profile.avatar_url;

      // Upload avatar if changed
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${profile.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
          avatarUrl = publicUrl;
        }
      }

      const updateData: any = {
        full_name: profile.full_name,
        avatar_url: avatarUrl,
      };

      if (profile.user_type === 'professional') {
        updateData.age = profile.age;
        updateData.bio = profile.bio;
        updateData.skills = profile.skills;
        updateData.category = profile.category;
        updateData.experience_years = profile.experience_years;
        updateData.hourly_rate = profile.hourly_rate;
        updateData.location = profile.location;
        updateData.crypto_wallet_trc20 = profile.crypto_wallet_trc20;
        updateData.accepts_crypto = profile.accepts_crypto;
      } else {
        updateData.company_name = profile.company_name;
        updateData.company_description = profile.company_description;
        updateData.website = profile.website;
        updateData.phone = profile.phone;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, avatar_url: avatarUrl });
      setAvatarFile(null);
      setAvatarPreview(null);

      toast({
        title: 'Profile updated!',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleDeleteProject = async (projectId: string, imageUrl: string | null) => {
    try {
      // Delete image from storage if exists
      if (imageUrl) {
        const urlParts = imageUrl.split('/');
        const fileName = urlParts.slice(-2).join('/'); // Get "userId/filename.ext"
        await supabase.storage.from('portfolio').remove([fileName]);
      }

      // Delete portfolio item
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      // Refresh portfolio
      if (profile) {
        await loadPortfolio(profile.id);
      }

      toast({
        title: 'Project deleted',
        description: 'Your project has been removed from the portfolio',
      });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent relative">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Dashboard</h1>
              <p className="text-muted-foreground mt-2">Manage your profile and portfolio</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="glass border-border/50 hover:border-destructive/50 hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 glass border-border/50 animate-scale-in">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg">
                      {(avatarPreview || profile.avatar_url) ? (
                        <img 
                          src={avatarPreview || profile.avatar_url || ''} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <User className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                      <Camera className="w-4 h-4" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  <h2 className="text-xl font-bold text-foreground mb-1">
                    {profile.full_name || 'Anonymous User'}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">{profile.email}</p>

                  {profile.category && (
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {profile.category}
                    </span>
                  )}
                </div>
              </Card>
            </div>

            {/* Edit Profile Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 glass border-border/50 animate-slide-up">
                <h3 className="text-xl font-bold text-foreground mb-6">Edit Profile</h3>

                <div className="space-y-4">
                  {profile.user_type === 'professional' ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                          <Input
                            value={profile.full_name || ''}
                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            className="glass border-border/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Age</label>
                          <Input
                            type="number"
                            value={profile.age || ''}
                            onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || null })}
                            className="glass border-border/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Experience (years)</label>
                          <Input
                            type="number"
                            value={profile.experience_years || ''}
                            onChange={(e) => setProfile({ ...profile, experience_years: parseInt(e.target.value) || null })}
                            className="glass border-border/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Hourly Rate ($)</label>
                          <Input
                            type="number"
                            value={profile.hourly_rate || ''}
                            onChange={(e) => setProfile({ ...profile, hourly_rate: parseFloat(e.target.value) || null })}
                            className="glass border-border/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                        <Input
                          value={profile.location || ''}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          placeholder="City, Country"
                          className="glass border-border/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                        <Textarea
                          value={profile.bio || ''}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          placeholder="Tell us about yourself..."
                          className="glass border-border/50 min-h-[100px]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Skills (comma separated)</label>
                        <Input
                          value={profile.skills?.join(', ') || ''}
                          onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          placeholder="JavaScript, React, Node.js"
                          className="glass border-border/50"
                        />
                      </div>

                      {/* Crypto Payment Settings */}
                      <div className="pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 mb-4">
                          <Wallet className="w-5 h-5 text-primary" />
                          <h4 className="text-lg font-semibold text-foreground">Crypto Payments (USDT TRC20)</h4>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 glass border border-border/50 rounded-lg">
                            <div className="flex-1">
                              <Label htmlFor="accepts-crypto" className="text-sm font-medium text-foreground">
                                Accept Crypto Payments
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">
                                Allow clients to pay you with USDT on TRC20 network
                              </p>
                            </div>
                            <Switch
                              id="accepts-crypto"
                              checked={profile.accepts_crypto || false}
                              onCheckedChange={(checked) => setProfile({ ...profile, accepts_crypto: checked })}
                            />
                          </div>

                          {profile.accepts_crypto && (
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                USDT TRC20 Wallet Address
                              </label>
                              <Input
                                value={profile.crypto_wallet_trc20 || ''}
                                onChange={(e) => setProfile({ ...profile, crypto_wallet_trc20: e.target.value })}
                                placeholder="TXXXxxxXXXxxxXXXxxxXXXxxx..."
                                className="glass border-border/50 font-mono text-sm"
                              />
                              <p className="text-xs text-muted-foreground mt-2">
                                Enter your TRON (TRC20) wallet address to receive USDT payments
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Contact Name</label>
                        <Input
                          value={profile.full_name || ''}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                          placeholder="John Doe"
                          className="glass border-border/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
                        <Input
                          value={profile.company_name || ''}
                          onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                          placeholder="Your Company Ltd."
                          className="glass border-border/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Company Description</label>
                        <Textarea
                          value={profile.company_description || ''}
                          onChange={(e) => setProfile({ ...profile, company_description: e.target.value })}
                          placeholder="Brief description of your company..."
                          className="glass border-border/50 min-h-[100px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Website</label>
                          <Input
                            type="url"
                            value={profile.website || ''}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                            placeholder="https://yourcompany.com"
                            className="glass border-border/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                          <Input
                            type="tel"
                            value={profile.phone || ''}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            placeholder="+1 234 567 8900"
                            className="glass border-border/50"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 text-primary-foreground font-semibold transition-all duration-300"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Portfolio Section - Only for Professionals */}
          {profile.user_type === 'professional' && (
            <div className="mt-8 animate-fade-in stagger-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold gradient-text">Portfolio</h3>
                <PortfolioDialog
                  userId={profile.id}
                  onProjectAdded={() => loadPortfolio(profile.id)}
                />
              </div>

              {portfolio.length === 0 ? (
                <Card className="p-12 glass border-border/50 text-center">
                  <p className="text-muted-foreground">No portfolio items yet. Add your first project!</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolio.map((item) => (
                    <Card key={item.id} className="glass border-border/50 overflow-hidden group hover:border-primary/50 transition-all duration-300">
                      {item.image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-foreground flex-1">{item.title}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteProject(item.id, item.image_url)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                        )}
                        {item.project_url && (
                          <a
                            href={item.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-primary hover:underline mb-3"
                          >
                            View Project
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.tags.map((tag, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
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
          )}

          {/* Quick Actions - For Clients */}
          {profile.user_type === 'client' && (
            <div className="mt-8 animate-fade-in stagger-1">
              <h3 className="text-2xl font-bold gradient-text mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/professionals">
                  <Card className="p-6 glass border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                    <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Browse Professionals</h4>
                    <p className="text-sm text-muted-foreground mb-4">Find the perfect talent for your project</p>
                    <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground">
                      Browse Now
                    </Button>
                  </Card>
                </Link>
                <Link to="/messages">
                  <Card className="p-6 glass border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                    <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">My Messages</h4>
                    <p className="text-sm text-muted-foreground mb-4">View conversations with professionals</p>
                    <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground">
                      View Messages
                    </Button>
                  </Card>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
