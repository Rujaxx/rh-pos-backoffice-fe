/**
 * Time utility functions for converting between time formats
 * Frontend uses HH:mm format for user input
 * Backend expects minutes from 00:00 (0-1439)
 */

/**
 * Convert time string (HH:mm) to minutes from 00:00
 * @param timeString - Time in HH:mm format (e.g., "09:30")
 * @returns Minutes from 00:00 (e.g., 570 for "09:30")
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
 */
export function isValidTimeString(timeString: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  return timeRegex.test(timeString);
}

/**
 * Get default time strings for restaurant opening hours
 */
export const DEFAULT_TIMES = {
  START_TIME: '10:00', // 10:00 AM
  END_TIME: '23:00', // 11:00 PM
} as const;
