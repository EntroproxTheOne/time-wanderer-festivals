import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Plus } from 'lucide-react';
import { cities, type City } from '@/data/cities';

interface CitySearchProps {
  onCitySelect: (city: City) => void;
  placeholder?: string;
}

export const CitySearch = ({ onCitySelect, placeholder = "Search for a city..." }: CitySearchProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const searchQuery = query.toLowerCase().trim();
      const terms = searchQuery.split(/[\s,]+/).filter(Boolean);
      
      const filtered = cities.filter(city => {
        const cityName = city.name.toLowerCase();
        const stateCode = city.stateCode.toLowerCase();
        const country = city.country.toLowerCase();
        const region = city.region.toLowerCase();
        const fullString = `${cityName} ${stateCode} ${country} ${region}`;
        
        // Match all search terms
        return terms.every(term => 
          fullString.includes(term) ||
          `${cityName}, ${stateCode}`.includes(term) ||
          `${cityName}, ${country}`.includes(term)
        );
      }).slice(0, 8);
      
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
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
                  <span className="font-medium">
                    {city.name}{city.stateCode ? `, ${city.stateCode}` : ''}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {city.country} • {city.region}
                  </span>
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