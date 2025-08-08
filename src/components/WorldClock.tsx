import { useState, useEffect } from 'react';
import { CitySearch } from './CitySearch';
import { TimeZoneCard } from './TimeZoneCard';
import { TimeZoneCalendar } from './TimeZoneCalendar';
import { UserSettings } from './UserSettings';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Clock, Globe, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface City {
  name: string;
  country: string;
  timezone: string;
  lat: number;
  lng: number;
}

interface TimeZone extends City {
  id: string;
}

export const WorldClock = () => {
  const [selectedTimeZones, setSelectedTimeZones] = useState<TimeZone[]>([
    {
      id: '1',
      name: 'New York',
      country: 'United States',
      timezone: 'America/New_York',
      lat: 40.7128,
      lng: -74.0060,
    },
  ]);
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tnd-timezones');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setSelectedTimeZones(parsed);
        }
      } catch (error) {
        console.error('Failed to parse saved timezones:', error);
      }
    }
  }, []);

  // Save to localStorage whenever selection changes
  useEffect(() => {
    localStorage.setItem('tnd-timezones', JSON.stringify(selectedTimeZones));
  }, [selectedTimeZones]);

  const addTimeZone = (city: City) => {
    if (selectedTimeZones.length >= 4) {
      toast({
        title: "Maximum reached",
        description: "You can compare up to 4 cities at once.",
        variant: "destructive",
      });
      return;
    }

    const exists = selectedTimeZones.some(tz => 
      tz.name === city.name && tz.country === city.country
    );

    if (exists) {
      toast({
        title: "City already added",
        description: `${city.name} is already in your comparison.`,
        variant: "destructive",
      });
      return;
    }

    const newTimeZone: TimeZone = {
      ...city,
      id: Date.now().toString(),
    };

    setSelectedTimeZones(prev => [...prev, newTimeZone]);
    toast({
      title: "City added",
      description: `${city.name} has been added to your comparison.`,
    });
  };

  const removeTimeZone = (id: string) => {
    setSelectedTimeZones(prev => prev.filter(tz => tz.id !== id));
  };

  const shareComparison = async () => {
    const cities = selectedTimeZones.map(tz => `${tz.name}, ${tz.country}`).join(' | ');
    const url = `${window.location.origin}/?cities=${encodeURIComponent(cities)}`;
    
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Shared successfully",
        description: "Comparison link copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const calculateTimeDifference = (timezone1: string, timezone2: string) => {
    const now = new Date();
    const time1 = new Date(now.toLocaleString('en-US', { timeZone: timezone1 }));
    const time2 = new Date(now.toLocaleString('en-US', { timeZone: timezone2 }));
    const diff = Math.abs(time1.getTime() - time2.getTime()) / (1000 * 60 * 60);
    return Math.round(diff * 10) / 10; // Round to 1 decimal place
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-3 mb-4 flex-1">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <Globe className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">TnD</h1>
              <p className="text-muted-foreground">Time & Daylight</p>
            </div>
          </div>
          <UserSettings />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Compare time zones across the world with live holiday and festival information
        </p>
      </div>

      {/* Search and Actions */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <CitySearch 
            onCitySelect={addTimeZone}
            placeholder="Add a city to compare..."
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={shareComparison}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="clocks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="clocks" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            World Clocks
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clocks" className="space-y-6">
          {/* Time Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {selectedTimeZones.map((timezone, index) => (
              <TimeZoneCard
                key={timezone.id}
                city={timezone.name}
                country={timezone.country}
                timezone={timezone.timezone}
                onRemove={selectedTimeZones.length > 1 ? () => removeTimeZone(timezone.id) : undefined}
                isMain={index === 0}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <TimeZoneCalendar selectedTimeZones={selectedTimeZones} />
        </TabsContent>
      </Tabs>

      {/* Time Differences */}
      {selectedTimeZones.length > 1 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Differences
          </h3>
          <div className="space-y-2">
            {selectedTimeZones.slice(1).map((timezone, index) => {
              const diff = calculateTimeDifference(selectedTimeZones[0].timezone, timezone.timezone);
              const baseTime = new Date().toLocaleString('en-US', { 
                timeZone: selectedTimeZones[0].timezone, 
                hour: 'numeric', 
                hour12: false 
              });
              const compareTime = new Date().toLocaleString('en-US', { 
                timeZone: timezone.timezone, 
                hour: 'numeric', 
                hour12: false 
              });
              const isAhead = parseInt(compareTime) > parseInt(baseTime);
              
              return (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span className="text-sm">
                    <strong>{timezone.name}</strong> vs <strong>{selectedTimeZones[0].name}</strong>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {diff === 0 ? 'Same time' : `${diff}h ${isAhead ? 'ahead' : 'behind'}`}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};