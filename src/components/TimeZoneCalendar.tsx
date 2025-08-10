import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Clock, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { format, addDays, startOfWeek, isWeekend, isSameDay, addMonths, subMonths } from 'date-fns';
import { fetchHolidays, getHolidayForDate, Holiday } from '@/data/holidays';

interface TimeZone {
  id: string;
  name: string;
  country: string;
  timezone: string;
  lat: number;
  lng: number;
}

interface TimeZoneCalendarProps {
  selectedTimeZones: TimeZone[];
  showHolidays?: boolean;
}

export const TimeZoneCalendar = ({ selectedTimeZones, showHolidays = true }: TimeZoneCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<'grid' | 'list'>('grid');
  const [weekendHighlight, setWeekendHighlight] = useState(true);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [holidays, setHolidays] = useState<{ [country: string]: Holiday[] }>({});

  // Load holidays when time zones change
  useEffect(() => {
    if (!showHolidays) return;
    
    const loadHolidays = async () => {
      const holidayData: { [country: string]: Holiday[] } = {};
      const uniqueCountries = [...new Set(selectedTimeZones.map(tz => 
        tz.country.toLowerCase() === 'united states' ? 'US' :
        tz.country.toLowerCase() === 'united kingdom' ? 'GB' :
        tz.country.toLowerCase() === 'india' ? 'IN' :
        tz.country.toLowerCase() === 'japan' ? 'JP' :
        tz.country.slice(0, 2).toUpperCase()
      ))];

      for (const country of uniqueCountries) {
        try {
          holidayData[country] = await fetchHolidays(country, selectedDate.getFullYear());
        } catch (error) {
          console.error(`Failed to load holidays for ${country}:`, error);
        }
      }
      
      setHolidays(holidayData);
    };

    loadHolidays();
  }, [selectedTimeZones, selectedDate, showHolidays]);

  // Generate week days for calendar view
  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday start
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const formatTimeForTimezone = (date: Date, timezone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(date);
    } catch (error) {
      return 'Invalid';
    }
  };

  const formatDateForTimezone = (date: Date, timezone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      return 'Invalid';
    }
  };

  const getHourColor = (hour: number, isWeekendDay: boolean = false) => {
    let baseColor = '';
    if (hour >= 6 && hour < 12) baseColor = 'bg-yellow-100 dark:bg-yellow-900/20'; // Morning
    else if (hour >= 12 && hour < 18) baseColor = 'bg-blue-100 dark:bg-blue-900/20'; // Afternoon
    else if (hour >= 18 && hour < 22) baseColor = 'bg-orange-100 dark:bg-orange-900/20'; // Evening
    else baseColor = 'bg-indigo-100 dark:bg-indigo-900/20'; // Night
    
    if (weekendHighlight && isWeekendDay) {
      baseColor += ' ring-2 ring-pink-200 dark:ring-pink-800';
    }
    
    return baseColor;
  };

  const getDateNumbers = () => {
    const start = new Date(selectedDate);
    start.setDate(1);
    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(direction === 'prev' ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1));
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Time Zone Calendar</h3>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant={calendarView === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCalendarView('grid')}
            >
              Grid
            </Button>
            <Button
              variant={calendarView === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCalendarView('list')}
            >
              List
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="p-4 bg-accent/5">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Calendar Settings</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="weekend-highlight" className="text-sm">Weekend highlighting</Label>
                <Switch
                  id="weekend-highlight"
                  checked={weekendHighlight}
                  onCheckedChange={setWeekendHighlight}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h4 className="text-lg font-semibold">
            {format(selectedDate, 'MMMM yyyy')}
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid View */}
        {calendarView === 'grid' && (
          <div className="space-y-4">
            {/* Date selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {getDateNumbers().slice(0, 31).map((day) => {
                const dateForDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                const isSelected = isSameDay(dateForDay, selectedDate);
                const isWeekendDay = isWeekend(dateForDay);
                
                // Get holiday for this date
                const holiday = showHolidays ? Object.values(holidays).flat().find(h => 
                  getHolidayForDate([h], dateForDay)
                ) : null;
                
                return (
                  <Button
                    key={day}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`min-w-[50px] h-12 relative ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground font-bold' 
                        : isWeekendDay && weekendHighlight 
                          ? 'bg-pink-50 hover:bg-pink-100 dark:bg-pink-950 dark:hover:bg-pink-900' 
                          : holiday 
                            ? 'bg-success/10 hover:bg-success/20 border-success/30' 
                            : ''
                    }`}
                    onClick={() => setSelectedDate(dateForDay)}
                    title={holiday ? `${holiday.name} ${holiday.emoji}` : undefined}
                  >
                    <div className="text-center">
                      <div className={`text-sm font-bold ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                        {day}
                      </div>
                      <div className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {format(dateForDay, 'EEE')}
                      </div>
                      {holiday && showHolidays && (
                        <div className="absolute -top-1 -right-1 text-xs">
                          {holiday.emoji}
                        </div>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
            
            {/* Time Zone Grid - WorldTimeBuddy Style */}
            <div className="overflow-x-auto">
              <div className="min-w-full border rounded-lg">
                {/* Header */}
                <div className="bg-accent/10 border-b">
                  <div className="grid grid-cols-[200px_1fr] gap-0">
                    <div className="p-3 border-r font-medium text-sm text-foreground">
                      {format(selectedDate, 'EEE, MMM d')}
                    </div>
                    <div className="flex">
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className={`min-w-[40px] p-2 text-xs text-center border-r font-mono cursor-pointer transition-colors ${
                            selectedHour === hour ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                          }`}
                          onClick={() => setSelectedHour(selectedHour === hour ? null : hour)}
                        >
                          {hour}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Time Zone Rows */}
                {selectedTimeZones.map((tz, index) => {
                  const currentTimeInTz = new Date().toLocaleString('en-US', { 
                    timeZone: tz.timezone, 
                    hour12: false, 
                    hour: '2-digit' 
                  });
                  const currentHour = parseInt(currentTimeInTz);
                  const isWeekendDay = isWeekend(selectedDate);
                  
                  return (
                    <div key={tz.id} className={`grid grid-cols-[200px_1fr] gap-0 ${index < selectedTimeZones.length - 1 ? 'border-b' : ''}`}>
                      <div className="p-3 border-r">
                        <div className="font-medium text-sm">{tz.name}</div>
                        <div className="text-xs text-muted-foreground">{tz.country}</div>
                        <div className="text-sm font-mono mt-1">
                          {formatTimeForTimezone(selectedDate, tz.timezone)}
                        </div>
                      </div>
                      <div className="flex">
                        {hours.map((hour) => {
                          const timeAtHour = new Date(selectedDate);
                          timeAtHour.setHours(hour, 0, 0, 0);
                          const localTime = formatTimeForTimezone(timeAtHour, tz.timezone);
                          const localHour = parseInt(localTime.split(':')[0]);
                          const isCurrentHour = hour === currentHour;
                          const isSelectedHour = selectedHour === hour;
                          
                          return (
                            <div
                              key={hour}
                              className={`min-w-[40px] p-2 text-xs text-center border-r font-mono transition-all ${
                                getHourColor(localHour, isWeekendDay)
                              } ${isCurrentHour ? 'ring-2 ring-primary ring-inset' : ''} ${
                                isSelectedHour ? 'ring-2 ring-blue-400 ring-inset' : ''
                              } hover:bg-opacity-80 cursor-pointer`}
                              onClick={() => setSelectedHour(selectedHour === hour ? null : hour)}
                              title={`${localTime} in ${tz.name}`}
                            >
                              {localTime.split(':')[0]}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Selected Hour Info */}
            {selectedHour !== null && (
              <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
                <h4 className="font-medium mb-2">
                  Times at {selectedHour.toString().padStart(2, '0')}:00 on {format(selectedDate, 'MMM d, yyyy')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {selectedTimeZones.map((tz) => {
                    const timeAtHour = new Date(selectedDate);
                    timeAtHour.setHours(selectedHour, 0, 0, 0);
                    const localTime = formatTimeForTimezone(timeAtHour, tz.timezone);
                    
                    return (
                      <div key={tz.id} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                        <span className="text-sm">{tz.name}</span>
                        <span className="font-mono font-bold">{localTime}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* List View */}
        {calendarView === 'list' && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-foreground">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h4>
              {/* Show holiday for selected date */}
              {showHolidays && Object.values(holidays).flat().map(h => {
                const holiday = getHolidayForDate([h], selectedDate);
                return holiday ? (
                  <div key={h.date} className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-lg">{holiday.emoji}</span>
                    <span className="text-sm text-muted-foreground">{holiday.name}</span>
                  </div>
                ) : null;
              })}
            </div>
            
            <div className="space-y-4">
              {selectedTimeZones.map((tz) => (
                <Card key={tz.id} className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xl font-semibold">{tz.name}</h5>
                      <p className="text-base text-muted-foreground">{tz.country}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-mono font-bold">
                        {formatTimeForTimezone(selectedDate, tz.timezone)}
                      </div>
                      <div className="text-base text-muted-foreground">
                        {formatDateForTimezone(selectedDate, tz.timezone)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedTimeZones.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Add cities to see time zone comparison</p>
          </div>
        )}
      </div>
    </Card>
  );
};