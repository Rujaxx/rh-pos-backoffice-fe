import {
  cleanPhoneNumber,
  cleanCountryCode,
  validatePhoneForCountry,
  PHONE_VALIDATION,
  COUNTRY_CODE_VALIDATION,
  countryCodeSchema,
  phoneNumberSchema,
  countryCodeSchemaOptional,
  phoneNumberSchemaOptional,
} from '../phone.validation';

describe('Phone Number Validation Utilities', () => {
  describe('cleanPhoneNumber', () => {
    it('should remove spaces, dashes, and parentheses', () => {
      expect(cleanPhoneNumber('(202) 555-1234')).toBe('2025551234');
      expect(cleanPhoneNumber('202-555-1234')).toBe('2025551234');
      expect(cleanPhoneNumber('202 555 1234')).toBe('2025551234');
      expect(cleanPhoneNumber('(202)555-1234')).toBe('2025551234');
    });

    it('should handle already clean numbers', () => {
      expect(cleanPhoneNumber('2025551234')).toBe('2025551234');
      expect(cleanPhoneNumber('9876543210')).toBe('9876543210');
    });

    it('should handle empty or null values', () => {
      expect(cleanPhoneNumber('')).toBe('');
      expect(cleanPhoneNumber(null)).toBe('');
      expect(cleanPhoneNumber(undefined)).toBe('');
    });

    it('should preserve digits only', () => {
      expect(cleanPhoneNumber('123-456-7890')).toBe('1234567890');
      expect(cleanPhoneNumber('(123) 456-7890')).toBe('1234567890');
    });
  });

  describe('cleanCountryCode', () => {
    it('should convert to uppercase', () => {
      expect(cleanCountryCode('us')).toBe('US');
      expect(cleanCountryCode('uk')).toBe('UK');
      expect(cleanCountryCode('in')).toBe('IN');
      expect(cleanCountryCode('ae')).toBe('AE');
    });

    it('should trim whitespace', () => {
      expect(cleanCountryCode(' US ')).toBe('US');
      expect(cleanCountryCode('  UK  ')).toBe('UK');
    });

    it('should handle already clean codes', () => {
      expect(cleanCountryCode('US')).toBe('US');
      expect(cleanCountryCode('UK')).toBe('UK');
    });

    it('should handle empty or null values', () => {
      expect(cleanCountryCode('')).toBe('');
      expect(cleanCountryCode(null)).toBe('');
      expect(cleanCountryCode(undefined)).toBe('');
    });
  });

  describe('validatePhoneForCountry', () => {
    describe('US phone numbers', () => {
      it('should validate correct US phone numbers', () => {
        expect(validatePhoneForCountry('2025551234', 'US')).toBe(true);
        expect(validatePhoneForCountry('4155551234', 'US')).toBe(true);
        expect(validatePhoneForCountry('3105551234', 'US')).toBe(true);
      });

      it('should validate US numbers with formatting', () => {
        expect(validatePhoneForCountry('(202) 555-1234', 'US')).toBe(true);
        expect(validatePhoneForCountry('202-555-1234', 'US')).toBe(true);
        expect(validatePhoneForCountry('202 555 1234', 'US')).toBe(true);
      });

      it('should reject invalid US phone numbers', () => {
        expect(validatePhoneForCountry('123', 'US')).toBe(false); // Too short
        expect(validatePhoneForCountry('12345', 'US')).toBe(false); // Too short
        expect(validatePhoneForCountry('123456789012345', 'US')).toBe(false); // Too long
      });
    });

    describe('Indian phone numbers', () => {
      it('should validate correct Indian phone numbers', () => {
        expect(validatePhoneForCountry('9876543210', 'IN')).toBe(true);
        expect(validatePhoneForCountry('8765432109', 'IN')).toBe(true);
        expect(validatePhoneForCountry('7654321098', 'IN')).toBe(true);
      });

      it('should reject clearly invalid Indian phone numbers', () => {
        expect(validatePhoneForCountry('123456', 'IN')).toBe(false); // Too short
        expect(validatePhoneForCountry('12345', 'IN')).toBe(false); // Too short
      });
    });

    describe('UAE phone numbers', () => {
      it('should validate correct UAE phone numbers', () => {
        expect(validatePhoneForCountry('501234567', 'AE')).toBe(true);
        expect(validatePhoneForCountry('521234567', 'AE')).toBe(true);
      });

      it('should reject invalid UAE phone numbers', () => {
        expect(validatePhoneForCountry('12345', 'AE')).toBe(false);
      });
    });

    describe('UK phone numbers', () => {
      it('should validate correct UK phone numbers', () => {
        expect(validatePhoneForCountry('7911123456', 'GB')).toBe(true);
        expect(validatePhoneForCountry('2079460123', 'GB')).toBe(true);
      });
    });

    describe('Edge cases', () => {
      it('should return true for missing phone or country code', () => {
        expect(validatePhoneForCountry('', 'US')).toBe(true);
        expect(validatePhoneForCountry('2025551234', '')).toBe(true);
        expect(validatePhoneForCountry(null, 'US')).toBe(true);
        expect(validatePhoneForCountry('2025551234', null)).toBe(true);
      });

      it('should handle lowercase country codes', () => {
        expect(validatePhoneForCountry('2025551234', 'us')).toBe(true);
        expect(validatePhoneForCountry('9876543210', 'in')).toBe(true);
      });

      it('should reject invalid country code format', () => {
        expect(validatePhoneForCountry('2025551234', 'USA')).toBe(false); // 3 chars
        expect(validatePhoneForCountry('2025551234', 'U')).toBe(false); // 1 char
        expect(validatePhoneForCountry('2025551234', '123')).toBe(false); // Numbers
      });
    });
  });

  describe('Zod Schemas', () => {
    describe('countryCodeSchema', () => {
      it('should accept valid country codes', () => {
        expect(countryCodeSchema.safeParse('US').success).toBe(true);
        expect(countryCodeSchema.safeParse('UK').success).toBe(true);
        expect(countryCodeSchema.safeParse('IN').success).toBe(true);
        expect(countryCodeSchema.safeParse('AE').success).toBe(true);
      });

      it('should transform to uppercase', () => {
        const result = countryCodeSchema.safeParse('us');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe('US');
        }
      });

      it('should reject invalid country codes', () => {
        expect(countryCodeSchema.safeParse('USA').success).toBe(false); // 3 chars
        expect(countryCodeSchema.safeParse('U').success).toBe(false); // 1 char
        expect(countryCodeSchema.safeParse('12').success).toBe(false); // Numbers
        expect(countryCodeSchema.safeParse('').success).toBe(false); // Empty
      });
    });

    describe('phoneNumberSchema', () => {
      it('should accept valid phone numbers', () => {
        expect(phoneNumberSchema.safeParse('2025551234').success).toBe(true);
        expect(phoneNumberSchema.safeParse('9876543210').success).toBe(true);
      });

      it('should accept phone numbers with formatting', () => {
        expect(phoneNumberSchema.safeParse('(202) 555-1234').success).toBe(
          true,
        );
        expect(phoneNumberSchema.safeParse('202-555-1234').success).toBe(true);
        expect(phoneNumberSchema.safeParse('202 555 1234').success).toBe(true);
      });

      it('should clean formatting from phone numbers', () => {
        const result = phoneNumberSchema.safeParse('(202) 555-1234');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe('2025551234');
        }
      });

      it('should reject invalid formats', () => {
        expect(phoneNumberSchema.safeParse('202-ABC-1234').success).toBe(false); // Letters
        expect(phoneNumberSchema.safeParse('phone123').success).toBe(false); // Letters
        expect(phoneNumberSchema.safeParse('').success).toBe(false); // Empty (required)
      });
    });

    describe('countryCodeSchemaOptional', () => {
      it('should accept valid country codes', () => {
        expect(countryCodeSchemaOptional.safeParse('US').success).toBe(true);
        expect(countryCodeSchemaOptional.safeParse('UK').success).toBe(true);
      });

      it('should accept null and undefined', () => {
        expect(countryCodeSchemaOptional.safeParse(null).success).toBe(true);
        expect(countryCodeSchemaOptional.safeParse(undefined).success).toBe(
          true,
        );
      });

      it('should transform to uppercase', () => {
        const result = countryCodeSchemaOptional.safeParse('us');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe('US');
        }
      });
    });

    describe('phoneNumberSchemaOptional', () => {
      it('should accept valid phone numbers', () => {
        expect(phoneNumberSchemaOptional.safeParse('2025551234').success).toBe(
          true,
        );
      });

      it('should accept null and undefined', () => {
        expect(phoneNumberSchemaOptional.safeParse(null).success).toBe(true);
        expect(phoneNumberSchemaOptional.safeParse(undefined).success).toBe(
          true,
        );
      });

      it('should clean formatting', () => {
        const result = phoneNumberSchemaOptional.safeParse('(202) 555-1234');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe('2025551234');
        }
      });
    });
  });

  describe('Constants', () => {
    it('should have correct phone validation constants', () => {
      expect(PHONE_VALIDATION.FORMAT_REGEX).toEqual(/^[\d\s\-()]+$/);
      expect(PHONE_VALIDATION.FORMAT_MESSAGE).toBe(
        'Phone number can only contain digits, spaces, dashes, and parentheses',
      );
      expect(PHONE_VALIDATION.COUNTRY_MESSAGE).toBe(
        'Please provide a valid phone number for the selected country',
      );
    });

    it('should have correct country code validation constants', () => {
      expect(COUNTRY_CODE_VALIDATION.REGEX).toEqual(/^[A-Z]{2}$/);
      expect(COUNTRY_CODE_VALIDATION.LENGTH).toBe(2);
      expect(COUNTRY_CODE_VALIDATION.MESSAGE).toBe(
        'Country code must be in ISO format (e.g., US, UK, CA, IN, AE)',
      );
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete phone validation flow', () => {
      // User enters formatted phone
      const userInput = '(202) 555-1234';
      const countryInput = 'us';

      // Clean the inputs
      const cleanedPhone = cleanPhoneNumber(userInput);
      const cleanedCountry = cleanCountryCode(countryInput);

      expect(cleanedPhone).toBe('2025551234');
      expect(cleanedCountry).toBe('US');

      // Validate
      expect(validatePhoneForCountry(cleanedPhone, cleanedCountry)).toBe(true);
    });

    it('should handle schema validation with transformation', () => {
      const formData = {
        countryCode: 'us',
        phoneNumber: '(202) 555-1234',
      };

      const countryResult = countryCodeSchema.safeParse(formData.countryCode);
      const phoneResult = phoneNumberSchema.safeParse(formData.phoneNumber);

      expect(countryResult.success).toBe(true);
      expect(phoneResult.success).toBe(true);

      if (countryResult.success && phoneResult.success) {
        expect(countryResult.data).toBe('US');
        expect(phoneResult.data).toBe('2025551234');

        // Final validation
        expect(
          validatePhoneForCountry(phoneResult.data, countryResult.data),
        ).toBe(true);
      }
    });

    it('should reject invalid phone for country combination', () => {
      // Indian phone number with US country code
      const phone = '9876543210';
      const country = 'US';

      expect(validatePhoneForCountry(phone, country)).toBe(false);
    });
  });

  describe('Real-world Examples', () => {
    const testCases = [
      {
        phone: '2025551234',
        country: 'US',
        expected: true,
        label: 'US number',
      },
      {
        phone: '(202) 555-1234',
        country: 'US',
        expected: true,
        label: 'US formatted',
      },
      {
        phone: '9876543210',
        country: 'IN',
        expected: true,
        label: 'Indian number',
      },
      {
        phone: '501234567',
        country: 'AE',
        expected: true,
        label: 'UAE number',
      },
      {
        phone: '7911123456',
        country: 'GB',
        expected: true,
        label: 'UK number',
      },
      { phone: '123', country: 'US', expected: false, label: 'Too short' },
      {
        phone: '2025551234',
        country: 'USA',
        expected: false,
        label: 'Invalid country code',
      },
    ];

    testCases.forEach(({ phone, country, expected, label }) => {
      it(`should ${expected ? 'accept' : 'reject'} ${label}`, () => {
        expect(validatePhoneForCountry(phone, country)).toBe(expected);
      });
    });
  });
});
