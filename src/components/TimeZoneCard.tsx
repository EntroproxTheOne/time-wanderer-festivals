import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Copy, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimeZoneCardProps {
  city: string;
  country: string;
  timezone: string;
  onRemove?: () => void;
  isMain?: boolean;
}

export const TimeZoneCard = ({ city, country, timezone, onRemove, isMain = false }: TimeZoneCardProps) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [holidays, setHolidays] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch holidays for this location
    const fetchHolidays = async () => {
      try {
        // Using a simplified country code mapping - in real app would be more comprehensive
        const countryCode = getCountryCode(country);
        if (countryCode) {
          const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/2024/${countryCode}`);
          if (response.ok) {
            const holidayData = await response.json();
            const today = new Date().toISOString().split('T')[0];
            const todaysHolidays = holidayData.filter((holiday: any) => holiday.date === today);
            setHolidays(todaysHolidays);
          }
        }
      } catch (error) {
        console.error('Failed to fetch holidays:', error);
      }
    };

    fetchHolidays();
  }, [country]);

  const getCountryCode = (country: string): string | null => {
    const countryMap: { [key: string]: string } = {
      'United States': 'US',
      'United Kingdom': 'GB',
      'Japan': 'JP',
      'Germany': 'DE',
      'France': 'FR',
      'Australia': 'AU',
      'India': 'IN',
      'Canada': 'CA',
      'Brazil': 'BR',
      'China': 'CN',
      'Russia': 'RU',
      'Italy': 'IT',
      'Spain': 'ES',
      'Mexico': 'MX',
      'South Korea': 'KR',
    };
    return countryMap[country] || null;
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getTimeOfDay = () => {
    const hour = new Date().toLocaleString('en-US', { 
      timeZone: timezone, 
      hour: 'numeric', 
      hour12: false 
    });
    const hourNum = parseInt(hour);
    
    if (hourNum >= 6 && hourNum < 12) return 'morning';
    if (hourNum >= 12 && hourNum < 18) return 'afternoon';
    if (hourNum >= 18 && hourNum < 22) return 'evening';
    return 'night';
  };

  const timeOfDay = getTimeOfDay();
  const isDayTime = timeOfDay === 'morning' || timeOfDay === 'afternoon';

  const copyToClipboard = () => {
    const timeString = `${city}: ${formatTime(currentTime)} (${formatDate(currentTime)})`;
    navigator.clipboard.writeText(timeString);
    toast({
      title: "Copied to clipboard",
      description: timeString,
    });
  };

  return (
    <Card className={`p-6 relative transition-all duration-300 hover:shadow-lg ${
      timeOfDay === 'morning' ? 'bg-gradient-to-br from-timezone-morning/10 to-card' :
      timeOfDay === 'afternoon' ? 'bg-gradient-to-br from-timezone-afternoon/10 to-card' :
      timeOfDay === 'evening' ? 'bg-gradient-to-br from-timezone-evening/10 to-card' :
      'bg-gradient-to-br from-timezone-night/20 to-card'
    }`}>
      {!isMain && onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{city}</h3>
            <p className="text-sm text-muted-foreground">{country}</p>
          </div>
          <div className="flex items-center gap-2">
            {isDayTime ? (
              <Sun className="h-6 w-6 text-yellow-500" />
            ) : (
              <Moon className="h-6 w-6 text-blue-400" />
            )}
            <Badge variant="outline" className="text-xs">
              {timezone.split('/').pop()?.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="text-4xl font-mono font-bold tracking-tight">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(currentTime)}
          </div>
        </div>

        {holidays.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-primary">Today's Celebrations</h4>
            {holidays.map((holiday, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                🎉 {holiday.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <Badge 
            variant={isDayTime ? "default" : "secondary"}
            className="text-xs"
          >
            {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 px-2"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </div>
      </div>
    </Card>
  );
};