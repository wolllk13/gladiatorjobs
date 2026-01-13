import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg glass border border-border/50">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="group relative p-2 rounded-lg glass border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-110 overflow-hidden"
      aria-label="Toggle theme"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/20 to-accent/20 transition-opacity duration-300" />

      {/* Icons */}
      <div className="relative">
        <Sun
          className={`w-5 h-5 transition-all duration-500 ${
            theme === 'dark'
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          } text-amber-500`}
        />
        <Moon
          className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
            theme === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          } text-indigo-400`}
        />
      </div>
    </button>
  );
};
