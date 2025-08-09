import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

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
}

export const TimeZoneCalendar = ({ selectedTimeZones }: TimeZoneCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<'grid' | 'list'>('grid');

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

  const getHourColor = (hour: number) => {
    if (hour >= 6 && hour < 12) return 'bg-yellow-100 dark:bg-yellow-900/20'; // Morning
    if (hour >= 12 && hour < 18) return 'bg-blue-100 dark:bg-blue-900/20'; // Afternoon
    if (hour >= 18 && hour < 22) return 'bg-orange-100 dark:bg-orange-900/20'; // Evening
    return 'bg-indigo-100 dark:bg-indigo-900/20'; // Night
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Time Zone Calendar</h3>
          </div>
          <div className="flex gap-2">
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

        {/* Date Picker */}
        <div className="flex items-center gap-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
        </div>

        {/* Calendar Grid View */}
        {calendarView === 'grid' && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h4>
            </div>
            
            {/* Time Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Header with cities */}
                <div className="grid grid-cols-[120px_1fr] gap-3 mb-4">
                  <div className="text-sm font-medium text-muted-foreground p-3">
                    Time
                  </div>
                  <div className={`grid grid-cols-${Math.min(selectedTimeZones.length, 4)} gap-3`}>
                    {selectedTimeZones.slice(0, 4).map((tz) => (
                      <div key={tz.id} className="text-sm font-medium text-center p-3 bg-accent rounded-lg">
                        {tz.name}
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDateForTimezone(selectedDate, tz.timezone)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time rows */}
                <div className="space-y-2">
                  {hours.map((hour) => (
                    <div key={hour} className="grid grid-cols-[120px_1fr] gap-3">
                      <div className="text-sm p-3 text-right font-mono font-medium">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                      <div className={`grid grid-cols-${Math.min(selectedTimeZones.length, 4)} gap-3`}>
                        {selectedTimeZones.slice(0, 4).map((tz) => {
                          const timeAtHour = new Date(selectedDate);
                          timeAtHour.setHours(hour, 0, 0, 0);
                          const localTime = formatTimeForTimezone(timeAtHour, tz.timezone);
                          const localHour = parseInt(localTime.split(':')[0]);
                          
                          return (
                            <div
                              key={`${tz.id}-${hour}`}
                              className={`text-sm p-3 rounded-lg text-center font-mono font-medium ${getHourColor(localHour)}`}
                            >
                              {localTime}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {calendarView === 'list' && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h4>
            </div>
            
            <div className="space-y-4">
              {selectedTimeZones.map((tz) => (
                <Card key={tz.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-lg font-medium">{tz.name}</h5>
                      <p className="text-sm text-muted-foreground">{tz.country}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold">
                        {formatTimeForTimezone(selectedDate, tz.timezone)}
                      </div>
                      <div className="text-sm text-muted-foreground">
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