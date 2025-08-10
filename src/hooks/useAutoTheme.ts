import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export const useAutoTheme = () => {
  const { theme, setTheme } = useTheme();
  const [isNightTime, setIsNightTime] = useState(false);

  useEffect(() => {
    const updateThemeBasedOnTime = () => {
      try {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date();
        const currentHour = parseInt(now.toLocaleString('en-US', { 
          timeZone: userTimezone, 
          hour: '2-digit', 
          hour12: false 
        }));

        // Night time is considered 19:00 (7 PM) to 07:00 (7 AM)
        const isNight = currentHour >= 19 || currentHour < 7;
        setIsNightTime(isNight);
        
        // Only auto-switch theme if user hasn't set a preference
        if (theme === 'system') {
          setTheme(isNight ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Failed to detect timezone or time:', error);
        // Fallback to system preference
        setTheme('system');
      }
    };

    // Initial check
    updateThemeBasedOnTime();

    // Check every minute for time changes
    const interval = setInterval(updateThemeBasedOnTime, 60000);

    return () => clearInterval(interval);
  }, [theme, setTheme]);

  return { isNightTime };
};