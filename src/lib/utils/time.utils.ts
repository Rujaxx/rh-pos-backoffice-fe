/**
 * Time utility functions for converting between time formats
 * Frontend uses HH:mm format for user input
 * Backend expects minutes from 00:00 (0-1439)
 */

/**
 * Convert time string (HH:mm) to minutes from 00:00
 * @param timeString - Time in HH:mm format (e.g., "09:30")
 * @returns Minutes from 00:00 (e.g., 570 for "09:30")
 *
 * @example
 * timeStringToMinutes("00:00") // 0
 * timeStringToMinutes("06:00") // 360
 * timeStringToMinutes("09:30") // 570
 * timeStringToMinutes("23:59") // 1439
 */
export function timeStringToMinutes(timeString: string): number {
  if (!timeString || !timeString.includes(':')) {
    return 0;
  }

  const [hours, minutes] = timeString.split(':').map(Number);

  // Validate input
  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return 0;
  }

  return hours * 60 + minutes;
}

/**
 * Convert minutes from 00:00 to time string (HH:mm)
 * @param minutes - Minutes from 00:00 (e.g., 570)
 * @returns Time string in HH:mm format (e.g., "09:30")
 *
 * @example
 * minutesToTimeString(0)    // "00:00"
 * minutesToTimeString(360)  // "06:00"
 * minutesToTimeString(570)  // "09:30"
 * minutesToTimeString(1439) // "23:59"
 */
export function minutesToTimeString(minutes: number): string {
  if (isNaN(minutes) || minutes < 0) {
    return '00:00';
  }

  // Handle values over 1439 (24 hours) by wrapping around
  const normalizedMinutes = minutes % 1440;

  const hours = Math.floor(normalizedMinutes / 60);
  const mins = normalizedMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Convert minutes since midnight to human-readable 12-hour format
 *
 * @param minutes - Minutes since midnight (0-1439)
 * @returns Time in 12-hour format with AM/PM (e.g., "8:30 AM", "2:00 PM")
 *
 * @example
 * minutesToDisplayTime(0)    // "12:00 AM" (midnight)
 * minutesToDisplayTime(360)  // "6:00 AM"
 * minutesToDisplayTime(480)  // "8:00 AM"
 * minutesToDisplayTime(720)  // "12:00 PM" (noon)
 * minutesToDisplayTime(1380) // "11:00 PM"
 * minutesToDisplayTime(1439) // "11:59 PM"
 */
export function minutesToDisplayTime(minutes: number): string {
  if (isNaN(minutes) || minutes < 0) {
    return '12:00 AM';
  }

  const normalizedMinutes = minutes % 1440;
  const hours = Math.floor(normalizedMinutes / 60);
  const mins = normalizedMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}

/**
 * Convert backend time format (0-2359) to minutes from 00:00
 * This is for backward compatibility with the current backend format
 * @param timeValue - Time in backend format (e.g., 930 for 09:30)
 * @returns Minutes from 00:00 (e.g., 570 for 09:30)
 */
export function backendTimeToMinutes(timeValue: number): number {
  if (isNaN(timeValue) || timeValue < 0 || timeValue > 2359) {
    return 0;
  }

  const hours = Math.floor(timeValue / 100);
  const minutes = timeValue % 100;

  // Validate extracted values
  if (hours > 23 || minutes > 59) {
    return 0;
  }

  return hours * 60 + minutes;
}

/**
 * Convert minutes from 00:00 to backend time format (0-2359)
 * This is for backward compatibility with the current backend format
 * @param minutes - Minutes from 00:00 (e.g., 570)
 * @returns Time in backend format (e.g., 930 for 09:30)
 */
export function minutesToBackendTime(minutes: number): number {
  if (isNaN(minutes) || minutes < 0) {
    return 0;
  }

  // Handle values over 1439 (24 hours) by wrapping around
  const normalizedMinutes = minutes % 1440;

  const hours = Math.floor(normalizedMinutes / 60);
  const mins = normalizedMinutes % 60;

  return hours * 100 + mins;
}

/**
 * Validate if a time string is in correct HH:mm format
 * @param timeString - Time string to validate
 * @returns Boolean indicating if the format is valid
 *
 * @example
 * isValidTimeString("08:30") // true
 * isValidTimeString("14:00") // true
 * isValidTimeString("23:59") // true
 * isValidTimeString("24:00") // false
 * isValidTimeString("08:60") // false
 */
export function isValidTimeString(timeString: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  return timeRegex.test(timeString);
}

/**
 * Validates if minutes value is within valid range
 *
 * @param minutes - Minutes to validate
 * @returns true if valid (0-1439), false otherwise
 *
 * @example
 * isValidMinutes(0)    // true
 * isValidMinutes(720)  // true
 * isValidMinutes(1439) // true
 * isValidMinutes(-1)   // false
 * isValidMinutes(1440) // false
 */
export function isValidMinutes(minutes: number): boolean {
  return Number.isInteger(minutes) && minutes >= 0 && minutes <= 1439;
}

/**
 * Get default time strings for restaurant opening hours
 */
export const DEFAULT_TIMES = {
  START_TIME: '10:00', // 10:00 AM
  END_TIME: '23:00', // 11:00 PM
} as const;

/**
 * Common business hours presets in minutes since midnight
 */
export const BUSINESS_HOURS_PRESETS = {
  MIDNIGHT: 0, // 12:00 AM
  EARLY_MORNING: 360, // 6:00 AM
  MORNING: 480, // 8:00 AM
  LATE_MORNING: 540, // 9:00 AM
  NOON: 720, // 12:00 PM
  AFTERNOON: 840, // 2:00 PM
  EVENING: 1020, // 5:00 PM
  LATE_EVENING: 1200, // 8:00 PM
  NIGHT: 1320, // 10:00 PM
  LATE_NIGHT: 1380, // 11:00 PM
  END_OF_DAY: 1439, // 11:59 PM
} as const;

/**
 * Common business hours presets with labels for UI dropdowns
 */
export const BUSINESS_HOURS_PRESET_OPTIONS = [
  { label: '12:00 AM (Midnight)', value: BUSINESS_HOURS_PRESETS.MIDNIGHT },
  {
    label: '6:00 AM (Early Morning)',
    value: BUSINESS_HOURS_PRESETS.EARLY_MORNING,
  },
  { label: '8:00 AM (Morning)', value: BUSINESS_HOURS_PRESETS.MORNING },
  {
    label: '9:00 AM (Late Morning)',
    value: BUSINESS_HOURS_PRESETS.LATE_MORNING,
  },
  { label: '12:00 PM (Noon)', value: BUSINESS_HOURS_PRESETS.NOON },
  { label: '2:00 PM (Afternoon)', value: BUSINESS_HOURS_PRESETS.AFTERNOON },
  { label: '5:00 PM (Evening)', value: BUSINESS_HOURS_PRESETS.EVENING },
  {
    label: '8:00 PM (Late Evening)',
    value: BUSINESS_HOURS_PRESETS.LATE_EVENING,
  },
  { label: '10:00 PM (Night)', value: BUSINESS_HOURS_PRESETS.NIGHT },
  { label: '11:00 PM (Late Night)', value: BUSINESS_HOURS_PRESETS.LATE_NIGHT },
  { label: '11:59 PM (End of Day)', value: BUSINESS_HOURS_PRESETS.END_OF_DAY },
] as const;
