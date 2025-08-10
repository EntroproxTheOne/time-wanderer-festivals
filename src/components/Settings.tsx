import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Info, Palette, Bell } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface SettingsProps {
  showHolidays: boolean;
  onShowHolidaysChange: (value: boolean) => void;
  onClose: () => void;
}

export const Settings = ({ showHolidays, onShowHolidaysChange, onClose }: SettingsProps) => {
  const { theme, setTheme } = useTheme();
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>(() => {
    return (localStorage.getItem('tnd-time-format') as '12h' | '24h') || '12h';
  });

  const handleTimeFormatChange = (checked: boolean) => {
    const format = checked ? '24h' : '12h';
    setTimeFormat(format);
    localStorage.setItem('tnd-time-format', format);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Settings</h2>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>

          <Tabs defaultValue="preferences" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preferences" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-holidays" className="text-sm font-medium">
                      Show Holidays (with emojis)
                    </Label>
                    <Switch
                      id="show-holidays"
                      checked={showHolidays}
                      onCheckedChange={onShowHolidaysChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Display public holidays and cultural events with colorful emojis on the calendar
                  </p>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="time-format" className="text-sm font-medium">
                      24-hour format
                    </Label>
                    <Switch
                      id="time-format"
                      checked={timeFormat === '24h'}
                      onCheckedChange={handleTimeFormatChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use 24-hour time format instead of AM/PM
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Theme Preference</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('light')}
                      className="flex items-center gap-2"
                    >
                      ☀️ Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                      className="flex items-center gap-2"
                    >
                      🌙 Dark
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('system')}
                      className="flex items-center gap-2"
                    >
                      💻 Auto
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Auto mode switches between light and dark based on local time (7 PM - 7 AM = dark theme)
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="about" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">TnD - Time & Daylight</h3>
                    <p className="text-sm text-muted-foreground">Version 2.0</p>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-medium mb-1">Purpose</h4>
                      <p className="text-muted-foreground">
                        A modern time zone comparison tool that helps you coordinate across different 
                        time zones with live holiday information and intelligent day/night themes.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Features</h4>
                      <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Compare up to 4 time zones simultaneously</li>
                        <li>Visual calendar with holiday indicators</li>
                        <li>Automatic day/night theme switching</li>
                        <li>Holiday data from 100+ countries</li>
                        <li>Responsive design for all devices</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Team</h4>
                      <p className="text-muted-foreground">
                        Built with ❤️ for global teams and remote workers who need to stay 
                        synchronized across time zones.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};