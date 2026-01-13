import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, Check, Mail, User, Briefcase, Loader2, Building2, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = [
  { id: 'it', labelKey: 'it' as const },
  { id: 'marketing', labelKey: 'marketing' as const },
  { id: 'design', labelKey: 'design' as const },
  { id: 'writing', labelKey: 'writing' as const },
  { id: 'video', labelKey: 'video' as const },
  { id: 'support', labelKey: 'support' as const },
  { id: 'finance', labelKey: 'finance' as const },
  { id: 'consulting', labelKey: 'consulting' as const },
];

const Register = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'professional' as 'professional' | 'client',
    selectedCategories: [] as string[],
    skills: '',
    displayName: '',
    photoPreview: null as string | null,
    age: '',
    bio: '',
    companyName: '',
    companyDescription: '',
    website: '',
    phone: '',
  });

  const steps = [
    { number: 1, icon: Mail, label: t.registration.steps.account },
    { number: 2, icon: Briefcase, label: t.registration.steps.skills },
    { number: 3, icon: User, label: t.registration.steps.profile },
  ];

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId],
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      // 1. Регистрация пользователя
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.displayName,
            user_type: formData.userType,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Registration failed');

      // 2. Загрузка аватара (если есть)
      let avatarUrl = null;
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${authData.user.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, photoFile, { upsert: true });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
          avatarUrl = publicUrl;
        }
      }

      // 3. Обновление профиля
      const profileData: any = {
        full_name: formData.displayName,
        avatar_url: avatarUrl,
        user_type: formData.userType,
      };

      if (formData.userType === 'professional') {
        profileData.category = formData.selectedCategories[0] || null;
        profileData.skills = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
        profileData.age = formData.age ? parseInt(formData.age) : null;
        profileData.bio = formData.bio || null;
      } else {
        profileData.company_name = formData.companyName || null;
        profileData.company_description = formData.companyDescription || null;
        profileData.website = formData.website || null;
        profileData.phone = formData.phone || null;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      toast({
        title: 'Registration successful!',
        description: 'Welcome to Gladiator Jobs! Redirecting to your dashboard...',
      });

      // Переход в личный кабинет
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.email && formData.password && formData.password.length >= 6;
      case 2:
        if (formData.userType === 'professional') {
          return formData.selectedCategories.length > 0;
        } else {
          return formData.companyName.trim().length > 0;
        }
      case 3:
        return formData.displayName.trim().length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-12">
              {steps.map((s, index) => {
                const Icon = s.icon;
                const isActive = step === s.number;
                const isCompleted = step > s.number;
                
                return (
                  <div key={s.number} className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div 
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                          isActive && "bg-primary text-primary-foreground",
                          isCompleted && "bg-primary/20 text-primary",
                          !isActive && !isCompleted && "bg-secondary text-muted-foreground"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={cn(
                        "text-xs font-medium",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {s.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "w-12 h-px mb-6",
                        step > s.number ? "bg-primary" : "bg-border"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step 1: Account */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h1 className="text-3xl font-medium text-foreground mb-2">
                  {t.registration.accountStep.title}
                </h1>
                <p className="text-muted-foreground mb-8">
                  {t.registration.accountStep.subtitle}
                </p>

                <div className="space-y-4">
                  {/* User Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      I want to register as
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, userType: 'professional' }))}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all flex flex-col items-center gap-2",
                          formData.userType === 'professional'
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        <UserCircle className="w-6 h-6" />
                        <span className="text-sm font-medium text-center">Professional</span>
                        <span className="text-xs text-center opacity-70">Offering services</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, userType: 'client' }))}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all flex flex-col items-center gap-2",
                          formData.userType === 'client'
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        <Building2 className="w-6 h-6" />
                        <span className="text-sm font-medium text-center">Client</span>
                        <span className="text-xs text-center opacity-70">Hiring talents</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t.auth.email}
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t.auth.password}
                    </label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      className="bg-secondary border-border"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Skills or Company Info */}
            {step === 2 && (
              <div className="animate-fade-in">
                {formData.userType === 'professional' ? (
                  <>
                    <h1 className="text-3xl font-medium text-foreground mb-2">
                      {t.registration.skillsStep.title}
                    </h1>
                    <p className="text-muted-foreground mb-8">
                      {t.registration.skillsStep.subtitle}
                    </p>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                          {t.registration.skillsStep.selectCategory}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {CATEGORIES.map((category) => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => toggleCategory(category.id)}
                              className={cn(
                                "p-4 rounded-xl border text-left transition-all",
                                formData.selectedCategories.includes(category.id)
                                  ? "border-primary bg-primary/10 text-foreground"
                                  : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50"
                              )}
                            >
                              <span className="text-sm font-medium">
                                {t.categories[category.labelKey]}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t.registration.skillsStep.describeSkills}
                        </label>
                        <Textarea
                          value={formData.skills}
                          onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                          placeholder={t.registration.skillsStep.skillsPlaceholder}
                          className="bg-secondary border-border min-h-[120px] resize-none"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-medium text-foreground mb-2">
                      Company Information
                    </h1>
                    <p className="text-muted-foreground mb-8">
                      Tell us about your company
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Company Name
                        </label>
                        <Input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                          placeholder="Your Company Ltd."
                          className="bg-secondary border-border"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Company Description
                        </label>
                        <Textarea
                          value={formData.companyDescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyDescription: e.target.value }))}
                          placeholder="Brief description of your company..."
                          className="bg-secondary border-border min-h-[100px] resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Website <span className="text-muted-foreground font-normal">(optional)</span>
                        </label>
                        <Input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://yourcompany.com"
                          className="bg-secondary border-border"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone <span className="text-muted-foreground font-normal">(optional)</span>
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 234 567 8900"
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 3: Profile */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h1 className="text-3xl font-medium text-foreground mb-2">
                  {t.registration.profileStep.title}
                </h1>
                <p className="text-muted-foreground mb-8">
                  {t.registration.profileStep.subtitle}
                </p>

                <div className="space-y-6">
                  {/* Photo Upload */}
                  <div className="flex flex-col items-center">
                    <label className="block text-sm font-medium text-foreground mb-3 text-center">
                      {t.registration.profileStep.uploadPhoto} 
                      <span className="text-muted-foreground font-normal">
                        {' '}{t.registration.profileStep.optional}
                      </span>
                    </label>
                    <label className="relative cursor-pointer group">
                      <div className={cn(
                        "w-28 h-28 rounded-full flex items-center justify-center overflow-hidden",
                        "bg-secondary border-2 border-dashed border-border",
                        "group-hover:border-primary/50 transition-colors"
                      )}>
                        {formData.photoPreview ? (
                          <img 
                            src={formData.photoPreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t.registration.profileStep.displayName}
                    </label>
                    <Input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder={t.registration.profileStep.displayNamePlaceholder}
                      className="bg-secondary border-border"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Age <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="25"
                      className="bg-secondary border-border"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      About you <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      className="bg-secondary border-border min-h-[100px] resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center gap-4 mt-10">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 border-border"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.registration.back}
                </Button>
              )}
              <Button
                onClick={() => step < 3 ? setStep(step + 1) : handleRegister()}
                disabled={!canProceed() || loading}
                className={cn(
                  "flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 text-primary-foreground font-semibold transition-all duration-300",
                  step === 1 && "w-full"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    {step < 3 ? t.registration.next : t.registration.finish}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              {t.auth.hasAccount}{' '}
              <Link to="/login" className="text-primary hover:underline">
                {t.auth.signIn}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div 
        className="hidden lg:flex flex-1 items-center justify-center p-12"
        style={{ background: 'var(--gradient-warm)' }}
      >
        <div className="max-w-md text-center">
          <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent" />
          </div>
          <h2 className="text-2xl font-medium text-foreground mb-4">
            {t.registration.title}
          </h2>
          <p className="text-muted-foreground">
            {t.registration.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
