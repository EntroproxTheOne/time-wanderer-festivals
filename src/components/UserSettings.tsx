import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, User, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

export const UserSettings = () => {
  const { theme, setTheme } = useTheme();
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');

  const handleTimeFormatChange = (checked: boolean) => {
    setTimeFormat(checked ? '24h' : '12h');
    // Save to localStorage for persistence
    localStorage.setItem('tnd-time-format', checked ? '24h' : '12h');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'light':
        return <Sun className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 w-9 p-0">
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <div className="px-2 py-2 space-y-4">
            {/* Time Format Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="time-format" className="text-sm">
                24-hour format
              </Label>
              <Switch
                id="time-format"
                checked={timeFormat === '24h'}
                onCheckedChange={handleTimeFormatChange}
              />
            </div>
            
            {/* Theme Selector */}
            <div className="space-y-2">
              <Label className="text-sm">Theme</Label>
              <div className="space-y-1">
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className="cursor-pointer"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                  {theme === 'light' && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className="cursor-pointer"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                  {theme === 'dark' && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('system')}
                  className="cursor-pointer"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                  {theme === 'system' && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
              </div>
            </div>
          </div>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="h-4 w-4 mr-2" />
          More Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};