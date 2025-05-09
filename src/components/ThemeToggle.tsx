
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="theme-toggle"
        checked={theme === 'dark'}
        onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <Label htmlFor="theme-toggle" className="text-xs sm:text-sm cursor-pointer">
        {theme === 'dark' ? (
          <span className="flex items-center">
            <Moon className="h-3 w-3 mr-1" /> Modalità notte
          </span>
        ) : (
          <span className="flex items-center">
            <Sun className="h-3 w-3 mr-1" /> Modalità giorno
          </span>
        )}
      </Label>
    </div>
  );
}
