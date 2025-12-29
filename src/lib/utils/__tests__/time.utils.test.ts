import {
  timeStringToMinutes,
  minutesToTimeString,
  minutesToDisplayTime,
  backendTimeToMinutes,
  minutesToBackendTime,
  isValidTimeString,
  isValidMinutes,
  BUSINESS_HOURS_PRESETS,
  DEFAULT_TIMES,
} from '../time.utils';

describe('Time Conversion Utilities', () => {
  describe('timeStringToMinutes', () => {
    it('should convert midnight to 0 minutes', () => {
      expect(timeStringToMinutes('00:00')).toBe(0);
    });

    it('should convert morning times correctly', () => {
      expect(timeStringToMinutes('06:00')).toBe(360); // 6 AM
      expect(timeStringToMinutes('08:00')).toBe(480); // 8 AM
      expect(timeStringToMinutes('09:30')).toBe(570); // 9:30 AM
    });

    it('should convert noon correctly', () => {
      expect(timeStringToMinutes('12:00')).toBe(720);
    });

    it('should convert afternoon/evening times correctly', () => {
      expect(timeStringToMinutes('14:00')).toBe(840); // 2 PM
      expect(timeStringToMinutes('17:30')).toBe(1050); // 5:30 PM
      expect(timeStringToMinutes('20:00')).toBe(1200); // 8 PM
    });

    it('should convert end of day correctly', () => {
      expect(timeStringToMinutes('23:00')).toBe(1380); // 11 PM
      expect(timeStringToMinutes('23:59')).toBe(1439); // 11:59 PM
    });

    it('should handle invalid inputs gracefully', () => {
      expect(timeStringToMinutes('')).toBe(0);
      expect(timeStringToMinutes('invalid')).toBe(0);
      expect(timeStringToMinutes('25:00')).toBe(0); // Invalid hour
      expect(timeStringToMinutes('12:60')).toBe(0); // Invalid minute
      expect(timeStringToMinutes('-1:00')).toBe(0); // Negative hour
    });

    it('should handle single digit hours', () => {
      expect(timeStringToMinutes('9:00')).toBe(540);
      expect(timeStringToMinutes('9:30')).toBe(570);
    });
  });

  describe('minutesToTimeString', () => {
    it('should convert 0 minutes to midnight', () => {
      expect(minutesToTimeString(0)).toBe('00:00');
    });

    it('should convert morning times correctly', () => {
      expect(minutesToTimeString(360)).toBe('06:00'); // 6 AM
      expect(minutesToTimeString(480)).toBe('08:00'); // 8 AM
      expect(minutesToTimeString(570)).toBe('09:30'); // 9:30 AM
    });

    it('should convert noon correctly', () => {
      expect(minutesToTimeString(720)).toBe('12:00');
    });

    it('should convert afternoon/evening times correctly', () => {
      expect(minutesToTimeString(840)).toBe('14:00'); // 2 PM
      expect(minutesToTimeString(1050)).toBe('17:30'); // 5:30 PM
      expect(minutesToTimeString(1200)).toBe('20:00'); // 8 PM
    });

    it('should convert end of day correctly', () => {
      expect(minutesToTimeString(1380)).toBe('23:00'); // 11 PM
      expect(minutesToTimeString(1439)).toBe('23:59'); // 11:59 PM
    });

    it('should handle invalid inputs gracefully', () => {
      expect(minutesToTimeString(-1)).toBe('00:00');
      expect(minutesToTimeString(NaN)).toBe('00:00');
    });

    it('should wrap around values over 1439', () => {
      expect(minutesToTimeString(1440)).toBe('00:00'); // Next day midnight
      expect(minutesToTimeString(1500)).toBe('01:00'); // Next day 1 AM
    });

    it('should pad single digit hours and minutes with zeros', () => {
      expect(minutesToTimeString(65)).toBe('01:05'); // 1:05 AM
      expect(minutesToTimeString(125)).toBe('02:05'); // 2:05 AM
    });
  });

  describe('minutesToDisplayTime', () => {
    it('should convert midnight to 12:00 AM', () => {
      expect(minutesToDisplayTime(0)).toBe('12:00 AM');
    });

    it('should convert morning times correctly', () => {
      expect(minutesToDisplayTime(360)).toBe('6:00 AM'); // 6 AM
      expect(minutesToDisplayTime(480)).toBe('8:00 AM'); // 8 AM
      expect(minutesToDisplayTime(570)).toBe('9:30 AM'); // 9:30 AM
    });

    it('should convert noon correctly', () => {
      expect(minutesToDisplayTime(720)).toBe('12:00 PM');
    });

    it('should convert afternoon/evening times correctly', () => {
      expect(minutesToDisplayTime(840)).toBe('2:00 PM'); // 2 PM
      expect(minutesToDisplayTime(1050)).toBe('5:30 PM'); // 5:30 PM
      expect(minutesToDisplayTime(1200)).toBe('8:00 PM'); // 8 PM
    });

    it('should convert late night correctly', () => {
      expect(minutesToDisplayTime(1380)).toBe('11:00 PM'); // 11 PM
      expect(minutesToDisplayTime(1439)).toBe('11:59 PM'); // 11:59 PM
    });

    it('should handle invalid inputs gracefully', () => {
      expect(minutesToDisplayTime(-1)).toBe('12:00 AM');
      expect(minutesToDisplayTime(NaN)).toBe('12:00 AM');
    });

    it('should wrap around values over 1439', () => {
      expect(minutesToDisplayTime(1440)).toBe('12:00 AM'); // Next day midnight
    });
  });

  describe('backendTimeToMinutes', () => {
    it('should convert backend format to minutes', () => {
      expect(backendTimeToMinutes(0)).toBe(0); // 00:00
      expect(backendTimeToMinutes(600)).toBe(360); // 06:00
      expect(backendTimeToMinutes(800)).toBe(480); // 08:00
      expect(backendTimeToMinutes(930)).toBe(570); // 09:30
      expect(backendTimeToMinutes(1200)).toBe(720); // 12:00
      expect(backendTimeToMinutes(1400)).toBe(840); // 14:00
      expect(backendTimeToMinutes(2300)).toBe(1380); // 23:00
      expect(backendTimeToMinutes(2359)).toBe(1439); // 23:59
    });

    it('should handle invalid inputs gracefully', () => {
      expect(backendTimeToMinutes(-1)).toBe(0);
      expect(backendTimeToMinutes(2400)).toBe(0); // Out of range
      expect(backendTimeToMinutes(1399)).toBe(0); // Invalid time (99 minutes)
      expect(backendTimeToMinutes(2499)).toBe(0); // Invalid time
      expect(backendTimeToMinutes(NaN)).toBe(0);
    });
  });

  describe('minutesToBackendTime', () => {
    it('should convert minutes to backend format', () => {
      expect(minutesToBackendTime(0)).toBe(0); // 00:00
      expect(minutesToBackendTime(360)).toBe(600); // 06:00
      expect(minutesToBackendTime(480)).toBe(800); // 08:00
      expect(minutesToBackendTime(570)).toBe(930); // 09:30
      expect(minutesToBackendTime(720)).toBe(1200); // 12:00
      expect(minutesToBackendTime(840)).toBe(1400); // 14:00
      expect(minutesToBackendTime(1380)).toBe(2300); // 23:00
      expect(minutesToBackendTime(1439)).toBe(2359); // 23:59
    });

    it('should handle invalid inputs gracefully', () => {
      expect(minutesToBackendTime(-1)).toBe(0);
      expect(minutesToBackendTime(NaN)).toBe(0);
    });

    it('should wrap around values over 1439', () => {
      expect(minutesToBackendTime(1440)).toBe(0); // Next day midnight
    });
  });

  describe('isValidTimeString', () => {
    it('should validate correct time strings', () => {
      expect(isValidTimeString('00:00')).toBe(true);
      expect(isValidTimeString('08:30')).toBe(true);
      expect(isValidTimeString('12:00')).toBe(true);
      expect(isValidTimeString('23:59')).toBe(true);
      expect(isValidTimeString('9:00')).toBe(true); // Single digit hour
      expect(isValidTimeString('09:00')).toBe(true); // Double digit hour
    });

    it('should reject invalid time strings', () => {
      expect(isValidTimeString('24:00')).toBe(false); // Hour > 23
      expect(isValidTimeString('12:60')).toBe(false); // Minute > 59
      expect(isValidTimeString('25:00')).toBe(false); // Hour > 23
      expect(isValidTimeString('12:99')).toBe(false); // Minute > 59
      expect(isValidTimeString('invalid')).toBe(false);
      expect(isValidTimeString('')).toBe(false);
      expect(isValidTimeString('12')).toBe(false); // Missing colon
      expect(isValidTimeString('12:')).toBe(false); // Missing minutes
      expect(isValidTimeString(':30')).toBe(false); // Missing hours
    });
  });

  describe('isValidMinutes', () => {
    it('should validate correct minute values', () => {
      expect(isValidMinutes(0)).toBe(true);
      expect(isValidMinutes(360)).toBe(true);
      expect(isValidMinutes(720)).toBe(true);
      expect(isValidMinutes(1439)).toBe(true);
    });

    it('should reject invalid minute values', () => {
      expect(isValidMinutes(-1)).toBe(false);
      expect(isValidMinutes(1440)).toBe(false);
      expect(isValidMinutes(2000)).toBe(false);
      expect(isValidMinutes(NaN)).toBe(false);
      expect(isValidMinutes(360.5)).toBe(false); // Not an integer
    });
  });

  describe('Round-trip conversions', () => {
    it('should convert time string to minutes and back correctly', () => {
      const testTimes = [
        '00:00',
        '06:00',
        '08:30',
        '12:00',
        '14:15',
        '17:45',
        '23:59',
      ];

      testTimes.forEach((time) => {
        const minutes = timeStringToMinutes(time);
        const converted = minutesToTimeString(minutes);
        expect(converted).toBe(time.padStart(5, '0')); // Ensure leading zeros
      });
    });

    it('should convert minutes to time string and back correctly', () => {
      const testMinutes = [0, 360, 480, 570, 720, 1050, 1380, 1439];

      testMinutes.forEach((minutes) => {
        const timeString = minutesToTimeString(minutes);
        const converted = timeStringToMinutes(timeString);
        expect(converted).toBe(minutes);
      });
    });
  });

  describe('Business Hours Presets', () => {
    it('should have correct preset values', () => {
      expect(BUSINESS_HOURS_PRESETS.MIDNIGHT).toBe(0);
      expect(BUSINESS_HOURS_PRESETS.EARLY_MORNING).toBe(360); // 6 AM
      expect(BUSINESS_HOURS_PRESETS.MORNING).toBe(480); // 8 AM
      expect(BUSINESS_HOURS_PRESETS.LATE_MORNING).toBe(540); // 9 AM
      expect(BUSINESS_HOURS_PRESETS.NOON).toBe(720); // 12 PM
      expect(BUSINESS_HOURS_PRESETS.AFTERNOON).toBe(840); // 2 PM
      expect(BUSINESS_HOURS_PRESETS.EVENING).toBe(1020); // 5 PM
      expect(BUSINESS_HOURS_PRESETS.LATE_EVENING).toBe(1200); // 8 PM
      expect(BUSINESS_HOURS_PRESETS.NIGHT).toBe(1320); // 10 PM
      expect(BUSINESS_HOURS_PRESETS.LATE_NIGHT).toBe(1380); // 11 PM
      expect(BUSINESS_HOURS_PRESETS.END_OF_DAY).toBe(1439); // 11:59 PM
    });

    it('should convert presets to correct time strings', () => {
      expect(minutesToTimeString(BUSINESS_HOURS_PRESETS.MIDNIGHT)).toBe(
        '00:00',
      );
      expect(minutesToTimeString(BUSINESS_HOURS_PRESETS.EARLY_MORNING)).toBe(
        '06:00',
      );
      expect(minutesToTimeString(BUSINESS_HOURS_PRESETS.MORNING)).toBe('08:00');
      expect(minutesToTimeString(BUSINESS_HOURS_PRESETS.NOON)).toBe('12:00');
      expect(minutesToTimeString(BUSINESS_HOURS_PRESETS.EVENING)).toBe('17:00');
      expect(minutesToTimeString(BUSINESS_HOURS_PRESETS.LATE_NIGHT)).toBe(
        '23:00',
      );
    });
  });

  describe('Default Times', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_TIMES.START_TIME).toBe('10:00');
      expect(DEFAULT_TIMES.END_TIME).toBe('23:00');
    });

    it('should convert default times to minutes correctly', () => {
      expect(timeStringToMinutes(DEFAULT_TIMES.START_TIME)).toBe(600); // 10 AM
      expect(timeStringToMinutes(DEFAULT_TIMES.END_TIME)).toBe(1380); // 11 PM
    });
  });

  describe('Edge cases', () => {
    it('should handle boundary values correctly', () => {
      // Minimum value
      expect(minutesToTimeString(0)).toBe('00:00');
      expect(timeStringToMinutes('00:00')).toBe(0);

      // Maximum value
      expect(minutesToTimeString(1439)).toBe('23:59');
      expect(timeStringToMinutes('23:59')).toBe(1439);
    });

    it('should handle values just before and after midnight', () => {
      expect(minutesToTimeString(1439)).toBe('23:59'); // Last minute of day
      expect(minutesToTimeString(1440)).toBe('00:00'); // First minute of next day (wrapped)
      expect(minutesToTimeString(1441)).toBe('00:01'); // Second minute of next day (wrapped)
    });
  });
});
