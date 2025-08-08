import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Plus } from 'lucide-react';

interface City {
  name: string;
  country: string;
  timezone: string;
  lat: number;
  lng: number;
}

interface CitySearchProps {
  onCitySelect: (city: City) => void;
  placeholder?: string;
}

const CITIES_DATABASE: City[] = [
  { name: 'New York', country: 'United States', timezone: 'America/New_York', lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'London', country: 'United Kingdom', timezone: 'Europe/London', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', country: 'France', timezone: 'Europe/Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', lat: 22.3193, lng: 114.1694 },
  { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', lat: 19.0760, lng: 72.8777 },
  { name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', lat: -23.5558, lng: -46.6396 },
  { name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', lat: 55.7558, lng: 37.6176 },
  { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', lat: 52.5200, lng: 13.4050 },
  { name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', lat: 43.6532, lng: -79.3832 },
  { name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', lat: 19.4326, lng: -99.1332 },
  { name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', lat: 37.5665, lng: 126.9780 },
  { name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', lat: 13.7563, lng: 100.5018 },
  { name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', lat: 30.0444, lng: 31.2357 },
  { name: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos', lat: 6.5244, lng: 3.3792 },
  { name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', lat: 41.0082, lng: 28.9784 },
];

export const CitySearch = ({ onCitySelect, placeholder = "Search for a city..." }: CitySearchProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = CITIES_DATABASE.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: City) => {
    onCitySelect(city);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="pl-10 pr-4"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-2 bg-card border shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="space-y-1">
            {suggestions.map((city, index) => (
              <Button
                key={`${city.name}-${city.country}-${index}`}
                variant="ghost"
                className="w-full justify-between text-left h-auto p-3 hover:bg-accent"
                onClick={() => handleSelect(city)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{city.name}</span>
                  <span className="text-sm text-muted-foreground">{city.country}</span>
                </div>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};