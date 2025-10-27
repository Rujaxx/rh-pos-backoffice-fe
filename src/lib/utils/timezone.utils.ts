/**
 * Timezone utility functions for detecting and working with user timezones
 */

/**
 * Get the user's current timezone using Intl.DateTimeFormat
 * @returns The user's timezone identifier (e.g., "America/New_York", "Asia/Dubai")
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    // Fallback to UTC if detection fails
    console.warn('Unable to detect user timezone, falling back to UTC:', error);
    return 'UTC';
  }
}

/**
 * Get a list of common timezones for restaurant operations
 * The user's current timezone will be prioritized if available
 */
export function getTimezoneOptions(t: (key: string) => string) {
  const userTimezone = getUserTimezone();
  
  const commonTimezones = [
    { value: 'UTC', label: t('restaurants.form.timezon.utc'), region: 'Global' },
    { value: 'America/New_York', label: t('restaurants.form.timezon.eastern'), region: 'Americas' },
    { value: 'America/Chicago', label: t('restaurants.form.timezon.central'), region: 'Americas' },
    { value: 'America/Denver', label: t('restaurants.form.timezon.mountain'), region: 'Americas' },
    { value: 'America/Los_Angeles', label: t('restaurants.form.timezon.pacific'), region: 'Americas' },
    { value: 'Europe/London', label: t('restaurants.form.timezon.london') || 'London (GMT)', region: 'Europe' },
    { value: 'Europe/Paris', label: t('restaurants.form.timezon.paris') || 'Paris (CET)', region: 'Europe' },
    { value: 'Europe/Berlin', label: t('restaurants.form.timezon.berlin') || 'Berlin (CET)', region: 'Europe' },
    { value: 'Asia/Dubai', label: t('restaurants.form.timezon.dubai'), region: 'Middle East' },
    { value: 'Asia/Riyadh', label: t('restaurants.form.timezon.saudiArabia'), region: 'Middle East' },
    { value: 'Asia/Kuwait', label: t('restaurants.form.timezon.kuwait') || 'Kuwait (AST)', region: 'Middle East' },
    { value: 'Asia/Qatar', label: t('restaurants.form.timezon.qatar') || 'Qatar (AST)', region: 'Middle East' },
    { value: 'Asia/Bahrain', label: t('restaurants.form.timezon.bahrain') || 'Bahrain (AST)', region: 'Middle East' },
    { value: 'Asia/Tokyo', label: t('restaurants.form.timezon.tokyo') || 'Tokyo (JST)', region: 'Asia' },
    { value: 'Asia/Shanghai', label: t('restaurants.form.timezon.shanghai') || 'Shanghai (CST)', region: 'Asia' },
    { value: 'Asia/Kolkata', label: t('restaurants.form.timezon.kolkata') || 'Kolkata (IST)', region: 'Asia' },
    { value: 'Australia/Sydney', label: t('restaurants.form.timezon.sydney') || 'Sydney (AEDT)', region: 'Australia' },
  ];

  // Check if user's timezone is in our common list
  const userTimezoneInList = commonTimezones.find(tz => tz.value === userTimezone);
  
  if (userTimezoneInList) {
    // Move user's timezone to the top and mark it
    const otherTimezones = commonTimezones.filter(tz => tz.value !== userTimezone);
    return [
      {
        ...userTimezoneInList,
        label: `${userTimezoneInList.label} (${t('restaurants.form.timezon.current') || 'Current'})`,
      },
      ...otherTimezones
    ];
  } else {
    // Add user's timezone at the top if it's not in the common list
    return [
      {
        value: userTimezone,
        label: `${userTimezone} (${t('restaurants.form.timezon.current') || 'Current'})`,
        region: 'Current'
      },
      ...commonTimezones
    ];
  }
}

/**
 * Format timezone for display with offset information
 * @param timezone - The timezone identifier
 * @returns Formatted timezone string with offset
 */
export function formatTimezoneWithOffset(timezone: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    
    const parts = formatter.formatToParts(now);
    const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value || '';
    
    // Get the offset
    const offset = getTimezoneOffset(timezone);
    
    return `${timezone} (${timeZoneName}, ${offset})`;
  } catch (error) {
    return timezone;
  }
}

/**
 * Get timezone offset string (e.g., "+04:00", "-05:00")
 * @param timezone - The timezone identifier
 * @returns Offset string
 */
export function getTimezoneOffset(timezone: string): string {
  try {
    const now = new Date();
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const hours = Math.floor(absOffset);
    const minutes = Math.round((absOffset - hours) * 60);
    
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    return '+00:00';
  }
}

/**
 * Check if a timezone is valid
 * @param timezone - The timezone identifier to validate
 * @returns Boolean indicating if the timezone is valid
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get default timezone for new restaurants
 * Uses user's current timezone if valid, otherwise falls back to UTC
 */
export function getDefaultTimezone(): string {
  const userTimezone = getUserTimezone();
  return isValidTimezone(userTimezone) ? userTimezone : 'UTC';
}