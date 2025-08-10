export interface Holiday {
  date: string;
  name: string;
  localName: string;
  countryCode: string;
  type: 'public' | 'cultural' | 'religious' | 'observance';
  emoji: string;
}

export const getHolidayEmoji = (name: string, type: string): string => {
  const lowercaseName = name.toLowerCase();
  
  // Specific holiday emojis
  if (lowercaseName.includes('christmas')) return '🎄';
  if (lowercaseName.includes('new year')) return '🎉';
  if (lowercaseName.includes('halloween')) return '🎃';
  if (lowercaseName.includes('valentine')) return '💝';
  if (lowercaseName.includes('thanksgiving')) return '🦃';
  if (lowercaseName.includes('independence') || lowercaseName.includes('independence day')) return '🎆';
  if (lowercaseName.includes('labor') || lowercaseName.includes('labour')) return '⚒️';
  if (lowercaseName.includes('memorial')) return '🇺🇸';
  if (lowercaseName.includes('martin luther king')) return '✊';
  if (lowercaseName.includes('presidents')) return '🏛️';
  if (lowercaseName.includes('veterans')) return '🎖️';
  if (lowercaseName.includes('columbus')) return '⛵';
  if (lowercaseName.includes('easter')) return '🐰';
  if (lowercaseName.includes('good friday')) return '✝️';
  if (lowercaseName.includes('mothers day') || lowercaseName.includes("mother's day")) return '💐';
  if (lowercaseName.includes('fathers day') || lowercaseName.includes("father's day")) return '👔';
  if (lowercaseName.includes('diwali')) return '🪔';
  if (lowercaseName.includes('holi')) return '🌈';
  if (lowercaseName.includes('eid')) return '🌙';
  if (lowercaseName.includes('ramadan')) return '🌙';
  if (lowercaseName.includes('chinese new year')) return '🐉';
  if (lowercaseName.includes('boxing day')) return '🎁';
  
  // Generic type-based emojis
  switch (type) {
    case 'public':
      return '🏢';
    case 'cultural':
    case 'religious':
      return '🎊';
    case 'observance':
      return '📅';
    default:
      return '🎉';
  }
};

// Holiday data cache
let holidayCache: { [country: string]: Holiday[] } = {};

export const fetchHolidays = async (countryCode: string, year: number = 2024): Promise<Holiday[]> => {
  const cacheKey = `${countryCode}-${year}`;
  
  if (holidayCache[cacheKey]) {
    return holidayCache[cacheKey];
  }

  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    
    if (!response.ok) {
      console.warn(`No holiday data for ${countryCode}`);
      return [];
    }

    const data = await response.json();
    const holidays: Holiday[] = data.map((holiday: any) => ({
      ...holiday,
      type: holiday.types?.[0]?.toLowerCase() || 'public',
      emoji: getHolidayEmoji(holiday.name, holiday.types?.[0]?.toLowerCase() || 'public')
    }));

    holidayCache[cacheKey] = holidays;
    return holidays;
  } catch (error) {
    console.error(`Failed to fetch holidays for ${countryCode}:`, error);
    return [];
  }
};

export const getHolidayForDate = (holidays: Holiday[], date: Date): Holiday | null => {
  const dateString = date.toISOString().split('T')[0];
  return holidays.find(h => h.date === dateString) || null;
};